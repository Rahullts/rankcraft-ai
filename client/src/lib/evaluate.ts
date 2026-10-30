import {
  countWords,
  countCharacters,
  matchKeywordExact,
  calculateKeywordDensity,
  splitSentences,
  findUnsupportedClaims,
  parseMarkdownHeadings,
  extractCleanProse,
  normalizeHeadingText,
  HeadingHierarchyAudit,
  ClaimFlag
} from './text.js';

export type RuleStatus = 'pass' | 'partial' | 'fail' | 'na' | 'pending';

export interface RuleResult {
  id: string;
  criterion: string;
  points: number;
  maxPoints: number;
  status: RuleStatus;
  evidence: string;
  explanation: string;
  appliesTo: 'package' | 'article';
}

export interface EvaluationData {
  input: {
    primaryKeyword: string;
    wordCount: number;
    language: string;
    intent?: string;
  };
  strategy?: {
    titles: Array<{ text: string; angle: string }>;
    metaDescription: string;
    keywords: { primary: string; secondary: string[]; longTail: string[] };
  };
  outline?: {
    sections: Array<{ h2: string; h3: string[] }>;
  };
  articleMarkdown: string;
  faqs?: Array<{ question: string; answer: string }>;
  manualReview?: {
    intentMatch?: number; // 0-5
    toneAudienceFit?: number; // 0-5
  };
}

export interface OutlineFidelityResult {
  matched: number;
  total: number;
  percentage: number;
  matchedHeadings?: string[];
  missingHeadings?: string[];
}

export function evaluate(
  scope: 'package' | 'article',
  data: EvaluationData
): {
  rules: RuleResult[];
  automatedPoints: number;
  applicableAutomatedMax: number;
  manualPoints: number;
  totalPoints: number;
  isHumanReviewPending: boolean;
  outlineFidelity?: OutlineFidelityResult;
} {
  const rules: RuleResult[] = [];
  const { input, strategy, outline, articleMarkdown, faqs, manualReview } = data;
  const kw = input.primaryKeyword || '';

  // ------------------------------------------------------------------------
  // R1: Title Quality (10 pts, Package scope)
  // ------------------------------------------------------------------------
  if (scope === 'package') {
    if (strategy && strategy.titles && strategy.titles.length > 0) {
      let r1Pts = 0;
      const titles = strategy.titles;
      const countCheck = titles.length === 5;
      if (countCheck) r1Pts += 2;

      const lengthOkCount = titles.filter((t) => {
        const len = countCharacters(t.text);
        return len >= 30 && len <= 60;
      }).length;

      if (lengthOkCount === 5) r1Pts += 4;
      else if (lengthOkCount >= 3) r1Pts += 2;

      const kwTitlesCount = titles.filter((t) => matchKeywordExact(t.text, kw) > 0).length;
      if (kwTitlesCount >= 3) r1Pts += 4;
      else if (kwTitlesCount >= 1) r1Pts += 2;

      // Quality enhancement: detect duplicates and repetitive keyword prefixes
      const uniqueTitles = new Set(titles.map((t) => t.text.trim().toLowerCase()));
      const hasDuplicates = uniqueTitles.size < titles.length;
      const repetitivePrefixCount = titles.filter((t) =>
        t.text.toLowerCase().startsWith(kw.toLowerCase() + ':')
      ).length;

      if (hasDuplicates) r1Pts = Math.max(0, r1Pts - 4);
      if (repetitivePrefixCount >= 4) r1Pts = Math.max(0, r1Pts - 2);

      const r1Status: RuleStatus = r1Pts === 10 ? 'pass' : r1Pts >= 5 ? 'partial' : 'fail';
      rules.push({
        id: 'R1',
        criterion: 'Title Quality',
        points: r1Pts,
        maxPoints: 10,
        status: r1Status,
        evidence: `${titles.length} titles provided (${uniqueTitles.size} unique). ${lengthOkCount}/5 titles are 30-60 characters. ${kwTitlesCount}/5 contain "${kw}". Repetitive prefixes: ${repetitivePrefixCount}.`,
        explanation: 'Evaluates character bounds (30-60 chars), keyword inclusion, distinct angles, and variety across 5 title options.',
        appliesTo: 'package'
      });
    } else {
      // Missing required package component must FAIL, not silently become N/A
      rules.push({
        id: 'R1',
        criterion: 'Title Quality',
        points: 0,
        maxPoints: 10,
        status: 'fail',
        evidence: 'Required strategy titles missing from package generation output.',
        explanation: 'Evaluates character bounds (30-60 chars), keyword inclusion, distinct angles, and variety across 5 title options.',
        appliesTo: 'package'
      });
    }
  } else {
    // Article-only scope: package rules are N/A with 0 maxPoints
    rules.push({
      id: 'R1',
      criterion: 'Title Quality',
      points: 0,
      maxPoints: 0,
      status: 'na',
      evidence: 'Title quality rule applies only to full package scope.',
      explanation: 'Applies to full SEO content package containing generated titles.',
      appliesTo: 'package'
    });
  }

  // ------------------------------------------------------------------------
  // R2: Meta Description (10 pts, Package scope)
  // ------------------------------------------------------------------------
  if (scope === 'package') {
    if (strategy && typeof strategy.metaDescription === 'string' && strategy.metaDescription.trim().length > 0) {
      let r2Pts = 0;
      const metaText = strategy.metaDescription.trim();
      const metaLen = countCharacters(metaText);
      const hasKw = matchKeywordExact(metaText, kw) > 0;

      if (metaLen >= 155 && metaLen <= 160) r2Pts += 6;
      else if ((metaLen >= 150 && metaLen <= 154) || (metaLen >= 161 && metaLen <= 165)) r2Pts += 3;

      if (hasKw) r2Pts += 4;

      // Quality enhancement: verify sentence completeness and penalize truncation fragments or ellipses
      const endsProperly = metaText.endsWith('.') || metaText.endsWith('!');
      const hasEllipsis = metaText.endsWith('...') || metaText.endsWith('…');
      const lastWord = metaText.replace(/[.!?]+$/, '').trim().split(/\s+/).pop()?.toLowerCase() || '';
      const isTruncatedFragment = ['res', 'imp', 'strat', 'proc', 'sol', 'guid'].includes(lastWord);

      if (!endsProperly || hasEllipsis || isTruncatedFragment) {
        r2Pts = Math.max(0, r2Pts - 4);
      }

      // Do not display a passing score if the description is outside the specified range (155-160)
      const isWithinTargetRange = metaLen >= 155 && metaLen <= 160;
      const r2Status: RuleStatus = (r2Pts === 10 && isWithinTargetRange) ? 'pass' : r2Pts > 0 ? 'partial' : 'fail';

      rules.push({
        id: 'R2',
        criterion: 'Meta Description',
        points: r2Pts,
        maxPoints: 10,
        status: r2Status,
        evidence: `Meta description is ${metaLen} characters (target: 155-160). Primary keyword ${hasKw ? 'is present' : 'is missing'}. Complete sentence: ${endsProperly && !hasEllipsis && !isTruncatedFragment}.`,
        explanation: 'Enforces snippet visibility target (155-160 characters), primary keyword inclusion, and clean sentence completion.',
        appliesTo: 'package'
      });
    } else {
      rules.push({
        id: 'R2',
        criterion: 'Meta Description',
        points: 0,
        maxPoints: 10,
        status: 'fail',
        evidence: 'Required meta description missing from package generation output.',
        explanation: 'Enforces snippet visibility target (155-160 characters), primary keyword inclusion, and clean sentence completion.',
        appliesTo: 'package'
      });
    }
  } else {
    rules.push({
      id: 'R2',
      criterion: 'Meta Description',
      points: 0,
      maxPoints: 0,
      status: 'na',
      evidence: 'Meta description rule applies only to full package scope.',
      explanation: 'Applies to full SEO content package containing meta description.',
      appliesTo: 'package'
    });
  }

  // ------------------------------------------------------------------------
  // R3: Keyword Set (10 pts, Package scope)
  // ------------------------------------------------------------------------
  if (scope === 'package') {
    if (strategy && strategy.keywords) {
      let r3Pts = 0;
      const pkMatch = (strategy.keywords.primary || '').trim().toLowerCase() === kw.trim().toLowerCase();
      if (pkMatch) r3Pts += 2;

      const secondaryList = strategy.keywords.secondary || [];
      const secUnique = new Set(secondaryList.map((k) => k.trim().toLowerCase()));
      if (secUnique.size >= 5 && secUnique.size <= 8) r3Pts += 4;
      else if (secUnique.size >= 3) r3Pts += 2;

      const longTailList = strategy.keywords.longTail || [];
      const ltUnique = new Set(longTailList.map((k) => k.trim().toLowerCase()));
      const validLtCount = Array.from(ltUnique).filter((k) => countWords(k) >= 3).length;
      if (ltUnique.size >= 5 && ltUnique.size <= 8 && validLtCount === ltUnique.size) r3Pts += 4;
      else if (validLtCount >= 3) r3Pts += 2;

      // Penalties for internal duplicates or mechanical keyword stuffing
      const internalDuplicates = (secondaryList.length - secUnique.size) + (longTailList.length - ltUnique.size);
      const mechanicalCount = secondaryList.filter((k) =>
        k.trim().toLowerCase().startsWith(kw.toLowerCase() + ' ')
      ).length;

      if (internalDuplicates > 0) r3Pts = Math.max(0, r3Pts - 3);
      if (mechanicalCount >= 4) r3Pts = Math.max(0, r3Pts - 2);

      const r3Status: RuleStatus = r3Pts === 10 ? 'pass' : r3Pts >= 4 ? 'partial' : 'fail';
      rules.push({
        id: 'R3',
        criterion: 'Keyword Set',
        points: r3Pts,
        maxPoints: 10,
        status: r3Status,
        evidence: `Primary keyword ${pkMatch ? 'matches input' : 'mismatch'}. ${secUnique.size} unique secondary (${mechanicalCount} repetitive prefixes). ${validLtCount}/${ltUnique.size} long-tail queries have 3+ words. Duplicates: ${internalDuplicates}.`,
        explanation: 'Audits structured keyword clusters: primary alignment, 5-8 secondary keywords, and 5-8 three-plus word long-tail queries.',
        appliesTo: 'package'
      });
    } else {
      rules.push({
        id: 'R3',
        criterion: 'Keyword Set',
        points: 0,
        maxPoints: 10,
        status: 'fail',
        evidence: 'Required keyword clusters missing from package generation output.',
        explanation: 'Audits structured keyword clusters: primary alignment, 5-8 secondary keywords, and 5-8 three-plus word long-tail queries.',
        appliesTo: 'package'
      });
    }
  } else {
    rules.push({
      id: 'R3',
      criterion: 'Keyword Set',
      points: 0,
      maxPoints: 0,
      status: 'na',
      evidence: 'Keyword set rule applies only to full package scope.',
      explanation: 'Applies to full SEO content package containing keyword suggestions.',
      appliesTo: 'package'
    });
  }

  // ------------------------------------------------------------------------
  // R4: Heading Structure (10 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    const headingAudit: HeadingHierarchyAudit = parseMarkdownHeadings(articleMarkdown || '');
    let r4Pts = 0;

    // 1. Exactly one H1 (3 pts)
    if (headingAudit.h1Count === 1) r4Pts += 3;

    // 2. At least four H2 headings (3 pts)
    if (headingAudit.h2Count >= 4) r4Pts += 3;
    else if (headingAudit.h2Count >= 2) r4Pts += 1;

    // 3. Clean hierarchy progression without skipped levels (2 pts)
    if (headingAudit.invalidJumps.length === 0 && headingAudit.h1Count > 0) {
      r4Pts += 2;
    }

    // 4. Nested H3 headings: at least two H2 sections contain H3 subheadings (2 pts)
    if (headingAudit.h2WithH3Count >= 2) r4Pts += 2;
    else if (headingAudit.h2WithH3Count === 1) r4Pts += 1;

    // Penalties for empty/placeholder headings
    if (headingAudit.emptyOrPlaceholder.length > 0) {
      r4Pts = Math.max(0, r4Pts - 4);
    }
    // Penalties for excessive invalid jumps
    if (headingAudit.invalidJumps.length > 0) {
      r4Pts = Math.max(0, r4Pts - 2);
    }

    const r4Status: RuleStatus = r4Pts === 10 ? 'pass' : r4Pts >= 5 ? 'partial' : 'fail';
    rules.push({
      id: 'R4',
      criterion: 'Heading Structure',
      points: r4Pts,
      maxPoints: 10,
      status: r4Status,
      evidence: `${headingAudit.h1Count} H1, ${headingAudit.h2Count} H2, ${headingAudit.h3Count} H3. Level hierarchy clean: ${headingAudit.invalidJumps.length === 0}. ${headingAudit.h2WithH3Count} H2 sections have H3 subheadings. Empty/placeholder headings: ${headingAudit.emptyOrPlaceholder.length}.`,
      explanation: 'Parses Markdown headings line by line: enforces exactly one H1, 4+ H2s, correctly nested H3s, and zero invalid level jumps.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R5: Primary Keyword Placement (15 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let r5Pts = 0;
    const cleanArticle = articleMarkdown || '';
    const headingAudit = parseMarkdownHeadings(cleanArticle);

    // 1. Primary keyword in H1 (4 pts)
    const h1Text = headingAudit.h1Headings[0]?.text || '';
    const inH1 = matchKeywordExact(h1Text, kw) > 0;
    if (inH1) r5Pts += 4;

    // 2. Primary keyword in first 100 words of article prose (4 pts)
    // Strip headings, code blocks, and lists to check first 100 prose words
    const proseWithoutHeadings = cleanArticle
      .replace(/```[\s\S]*?```/g, '')
      .replace(/^#+\s+.*$/gm, '')
      .replace(/^[-*+]\s+/gm, '')
      .replace(/^\d+\.\s+/gm, '')
      .trim();
    const first100Words = proseWithoutHeadings.split(/\s+/).slice(0, 100).join(' ');
    const inFirst100 = matchKeywordExact(first100Words, kw) > 0;
    if (inFirst100) r5Pts += 4;

    // 3. Primary keyword in at least one H2 (3 pts)
    const inH2 = headingAudit.h2Headings.some((h) => matchKeywordExact(h.text, kw) > 0);
    if (inH2) r5Pts += 3;

    // 4. Primary keyword in final/concluding section (2 pts)
    const sections = cleanArticle.split(/^##\s+/m);
    const finalSection = sections[sections.length - 1] || '';
    const inFinal = matchKeywordExact(finalSection, kw) > 0;
    if (inFinal) r5Pts += 2;

    // 5. Keyword density between 0.3% and 2.5% (2 pts)
    const density = calculateKeywordDensity(cleanArticle, kw);
    const densityPct = density * 100;
    const densityOk = densityPct >= 0.3 && densityPct <= 2.5;
    if (densityOk) r5Pts += 2;

    const r5Status: RuleStatus = r5Pts === 15 ? 'pass' : r5Pts >= 8 ? 'partial' : 'fail';
    rules.push({
      id: 'R5',
      criterion: 'Primary Keyword Placement',
      points: r5Pts,
      maxPoints: 15,
      status: r5Status,
      evidence: `Keyword in H1: ${inH1}; first 100 words: ${inFirst100}; in H2: ${inH2}; final section: ${inFinal}; density: ${densityPct.toFixed(2)}% (target: 0.3% - 2.5%).`,
      explanation: 'Verifies strategic keyword placement across H1, opening paragraph, subheadings, and concluding section with natural keyword density.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R6: Word-Count Accuracy (10 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let r6Pts = 0;
    const actualWords = countWords(articleMarkdown || '');
    const target = input.wordCount || 800;
    const diffPct = Math.abs(actualWords - target) / target;

    if (diffPct <= 0.10) r6Pts = 10;
    else if (diffPct <= 0.20) r6Pts = 5;

    const r6Status: RuleStatus = r6Pts === 10 ? 'pass' : r6Pts === 5 ? 'partial' : 'fail';
    rules.push({
      id: 'R6',
      criterion: 'Word-Count Accuracy',
      points: r6Pts,
      maxPoints: 10,
      status: r6Status,
      evidence: `Generated ${actualWords} words vs target of ${target} words (${Math.round(diffPct * 100)}% difference).`,
      explanation: 'Measures adherence to user-specified target length: 10 pts within ±10% tolerance; 5 pts within ±20% tolerance; 0 pts beyond ±20%.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R7: FAQs (10 pts, Package scope - Canonical 40-70 words per answer)
  // ------------------------------------------------------------------------
  if (scope === 'package') {
    if (faqs && Array.isArray(faqs) && faqs.length > 0) {
      let r7Pts = 0;
      const countOk = faqs.length === 5;
      if (countOk) r7Pts += 4;

      const qMarkOk = faqs.every((f) => f.question.trim().endsWith('?'));
      if (qMarkOk) r7Pts += 2;

      // Canonical project specification: 40-70 words per answer
      const lenCheckCount = faqs.filter((f) => {
        const words = countWords(f.answer);
        return words >= 40 && words <= 70;
      }).length;

      if (lenCheckCount === 5) r7Pts += 4;
      else if (lenCheckCount >= 3) r7Pts += 2;

      // Quality enhancement: check well-formedness and detect duplicates
      const uniqueQuestions = new Set(faqs.map((f) => f.question.trim().toLowerCase()));
      const hasDuplicates = uniqueQuestions.size < faqs.length;
      const wellFormedQuestions = faqs.filter((f) => f.question.trim().length >= 15).length;
      const wellFormedAnswers = faqs.filter((f) => {
        const a = f.answer.trim();
        return a.endsWith('.') || a.endsWith('!');
      }).length;

      if (hasDuplicates || wellFormedQuestions < 5 || wellFormedAnswers < 5) {
        r7Pts = Math.max(0, r7Pts - 2);
      }

      const r7Status: RuleStatus = r7Pts === 10 ? 'pass' : r7Pts >= 5 ? 'partial' : 'fail';
      rules.push({
        id: 'R7',
        criterion: 'FAQs',
        points: r7Pts,
        maxPoints: 10,
        status: r7Status,
        evidence: `${faqs.length} FAQs provided (${uniqueQuestions.size} unique). ${qMarkOk ? 'All' : 'Not all'} end in "?". ${lenCheckCount}/5 answers are 40-70 words. Complete questions/answers: ${wellFormedQuestions}/5 and ${wellFormedAnswers}/5.`,
        explanation: 'Audits schema-ready FAQ components: exactly 5 questions ending with "?", answers strictly 40-70 words each, with complete syntax.',
        appliesTo: 'package'
      });
    } else {
      rules.push({
        id: 'R7',
        criterion: 'FAQs',
        points: 0,
        maxPoints: 10,
        status: 'fail',
        evidence: 'Required FAQs missing from package generation output.',
        explanation: 'Audits schema-ready FAQ components: exactly 5 questions ending with "?", answers strictly 40-70 words each, with complete syntax.',
        appliesTo: 'package'
      });
    }
  } else {
    rules.push({
      id: 'R7',
      criterion: 'FAQs',
      points: 0,
      maxPoints: 0,
      status: 'na',
      evidence: 'FAQ rule applies only to full package scope.',
      explanation: 'Applies to full SEO content package containing generated FAQs.',
      appliesTo: 'package'
    });
  }

  // ------------------------------------------------------------------------
  // R8: Readability Heuristic (5 pts, English only, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    if (input.language === 'English') {
      let r8Pts = 0;
      const cleanProse = extractCleanProse(articleMarkdown || '');
      const sentences = splitSentences(cleanProse);
      const proseWords = countWords(cleanProse);
      const avgSentenceLen = sentences.length > 0 ? proseWords / sentences.length : 0;

      if (avgSentenceLen <= 20.0) r8Pts = 5;
      else if (avgSentenceLen <= 25.0) r8Pts = 3;

      const r8Status: RuleStatus = r8Pts === 5 ? 'pass' : r8Pts === 3 ? 'partial' : 'fail';
      rules.push({
        id: 'R8',
        criterion: 'Readability Heuristic',
        points: r8Pts,
        maxPoints: 5,
        status: r8Status,
        evidence: `Average sentence length: ${avgSentenceLen.toFixed(1)} words across ${sentences.length} sentences in clean prose (target: <= 20 words for full score).`,
        explanation: 'Evaluates average sentence length in cleaned prose (excluding headings, code blocks, and list items): <= 20 words awards 5 pts; 20.1-25 words awards 3 pts; > 25 words awards 0 pts.',
        appliesTo: 'article'
      });
    } else {
      rules.push({
        id: 'R8',
        criterion: 'Readability Heuristic',
        points: 0,
        maxPoints: 0,
        status: 'na',
        evidence: `Language is ${input.language}. Readability sentence-length heuristic applies exclusively to English text.`,
        explanation: 'For non-English text, this rule is marked Not Applicable and excluded from the maximum score denominator.',
        appliesTo: 'article'
      });
    }
  }

  // ------------------------------------------------------------------------
  // R9: Unsupported-Claim Scan (10 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let fullTextToScan = articleMarkdown || '';
    if (faqs && Array.isArray(faqs)) {
      fullTextToScan += '\n' + faqs.map((f) => f.question + ' ' + f.answer).join('\n');
    }

    const flags: ClaimFlag[] = findUnsupportedClaims(fullTextToScan, input.language);
    let r9Pts = 0;
    if (flags.length === 0) r9Pts = 10;
    else if (flags.length <= 2) r9Pts = 5;

    const r9Status: RuleStatus = r9Pts === 10 ? 'pass' : r9Pts === 5 ? 'partial' : 'fail';
    const evidenceText = flags.length === 0
      ? '0 potential unverified statement(s) detected. Content complies with academic constraint guidelines.'
      : `Found ${flags.length} warning flag(s) requiring verification: ${flags.map((f) => `"${f.sentence.slice(0, 50)}..." [${f.category}]`).join('; ')}. Note: Flags indicate patterns requiring manual verification, not proof of factual falsity.`;

    rules.push({
      id: 'R9',
      criterion: 'Unsupported-Claim Scan',
      points: r9Pts,
      maxPoints: 10,
      status: r9Status,
      evidence: evidenceText,
      explanation: 'Scans for restricted patterns: unverified percentages, unattributed research, unbacked statistics, fabricated search volume, and guaranteed outcomes.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R10: Human Reviewer Evaluation (10 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    const hasIntent = typeof manualReview?.intentMatch === 'number';
    const hasTone = typeof manualReview?.toneAudienceFit === 'number';
    const isReviewed = hasIntent && hasTone;

    const intentScore = hasIntent ? Math.max(0, Math.min(5, Math.round(manualReview!.intentMatch!))) : 0;
    const toneScore = hasTone ? Math.max(0, Math.min(5, Math.round(manualReview!.toneAudienceFit!))) : 0;
    const r10Pts = isReviewed ? intentScore + toneScore : 0;

    rules.push({
      id: 'R10',
      criterion: 'Manual Review',
      points: r10Pts,
      maxPoints: 10,
      status: isReviewed ? (r10Pts >= 8 ? 'pass' : r10Pts >= 5 ? 'partial' : 'fail') : 'pending',
      evidence: isReviewed
        ? `Search intent match: ${intentScore}/5 pts; Tone & audience fit: ${toneScore}/5 pts (Submitted by evaluator).`
        : 'Pending human evaluator review (Search intent match: 0-5 pts; Tone & audience fit: 0-5 pts).',
      explanation: 'Qualitative assessment completed by a human reviewer. Evaluates search intent alignment (0-5) and tone/audience fit (0-5).',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // Scoring Mathematics & Totals
  // ------------------------------------------------------------------------
  const automatedRules = rules.filter((r) => r.id !== 'R10' && r.status !== 'na');
  const automatedPoints = automatedRules.reduce((sum, r) => sum + r.points, 0);
  const applicableAutomatedMax = automatedRules.reduce((sum, r) => sum + r.maxPoints, 0);

  const manualRule = rules.find((r) => r.id === 'R10');
  const manualPoints = manualRule ? manualRule.points : 0;
  const isHumanReviewPending = manualRule?.status === 'pending';
  const totalPoints = automatedPoints + manualPoints;

  // ------------------------------------------------------------------------
  // Outline Fidelity Check (Heading-Aware 1-to-1 Comparison, Informational Metric)
  // ------------------------------------------------------------------------
  let outlineFidelity: OutlineFidelityResult | undefined;
  if (outline && outline.sections && articleMarkdown) {
    const headingAudit = parseMarkdownHeadings(articleMarkdown);
    const availableArticleH2 = headingAudit.h2Headings.map((h, idx) => ({
      idx,
      norm: normalizeHeadingText(h.text),
      raw: h.text,
      used: false
    }));

    const availableArticleH3 = headingAudit.h3Headings.map((h, idx) => ({
      idx,
      norm: normalizeHeadingText(h.text),
      raw: h.text,
      used: false
    }));

    const matchedHeadings: string[] = [];
    const missingHeadings: string[] = [];

    for (const sec of outline.sections) {
      const normOutlineH2 = normalizeHeadingText(sec.h2);
      const matchedH2 = availableArticleH2.find(
        (art) => !art.used && art.norm === normOutlineH2
      );
      if (matchedH2) {
        matchedH2.used = true;
        matchedHeadings.push(`H2: ${sec.h2}`);
      } else {
        missingHeadings.push(`H2: ${sec.h2}`);
      }

      for (const sub of sec.h3) {
        const normOutlineH3 = normalizeHeadingText(sub);
        const matchedH3 = availableArticleH3.find(
          (art) => !art.used && art.norm === normOutlineH3
        );
        if (matchedH3) {
          matchedH3.used = true;
          matchedHeadings.push(`H3: ${sub}`);
        } else {
          missingHeadings.push(`H3: ${sub}`);
        }
      }
    }

    const totalHeadings = matchedHeadings.length + missingHeadings.length;
    outlineFidelity = {
      matched: matchedHeadings.length,
      total: totalHeadings,
      percentage: totalHeadings > 0 ? Math.round((matchedHeadings.length / totalHeadings) * 100) : 0,
      matchedHeadings,
      missingHeadings
    };
  }

  return {
    rules,
    automatedPoints,
    applicableAutomatedMax,
    manualPoints,
    totalPoints,
    isHumanReviewPending,
    outlineFidelity
  };
}
