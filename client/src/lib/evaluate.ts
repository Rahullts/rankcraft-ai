import {
  countWords,
  countCharacters,
  matchKeywordExact,
  calculateKeywordDensity,
  splitSentences,
  findUnsupportedClaims
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

export function evaluate(
  scope: 'package' | 'article',
  data: EvaluationData
): {
  rules: RuleResult[];
  automatedPoints: number;
  applicableAutomatedMax: number;
  manualPoints: number;
  totalPoints: number;
  outlineFidelity?: { matched: number; total: number; percentage: number };
} {
  const rules: RuleResult[] = [];
  const { input, strategy, outline, articleMarkdown, faqs, manualReview } = data;
  const kw = input.primaryKeyword;

  // ------------------------------------------------------------------------
  // R1: Title Quality (10 pts, Package scope)
  // ------------------------------------------------------------------------
  if (scope === 'package' && strategy) {
    let r1Pts = 0;
    const titles = strategy.titles || [];
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

    // Quality enhancement: check distinctness and penalize mechanical keyword prefix repetition
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
      explanation: 'Short titles are less likely to be cut off in result lists, and the keyword tells readers and search engines what the page covers.',
      appliesTo: 'package'
    });
  } else {
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
  if (scope === 'package' && strategy) {
    let r2Pts = 0;
    const metaText = strategy.metaDescription ? strategy.metaDescription.trim() : '';
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

    const r2Status: RuleStatus = r2Pts === 10 ? 'pass' : r2Pts > 0 ? 'partial' : 'fail';
    rules.push({
      id: 'R2',
      criterion: 'Meta Description',
      points: r2Pts,
      maxPoints: 10,
      status: r2Status,
      evidence: `Meta description is ${metaLen} characters (target: 155-160). Primary keyword ${hasKw ? 'is present' : 'is missing'}. Complete sentence: ${endsProperly && !hasEllipsis && !isTruncatedFragment}.`,
      explanation: 'This is the length the project targets so the snippet is complete but not truncated. The app counts the characters itself.',
      appliesTo: 'package'
    });
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
  if (scope === 'package' && strategy) {
    let r3Pts = 0;
    const pkMatch = strategy.keywords.primary.trim().toLowerCase() === kw.trim().toLowerCase();
    if (pkMatch) r3Pts += 2;

    const secUnique = new Set(strategy.keywords.secondary.map((k) => k.trim().toLowerCase()));
    if (secUnique.size >= 5 && secUnique.size <= 8) r3Pts += 4;

    const ltUnique = new Set(strategy.keywords.longTail.map((k) => k.trim().toLowerCase()));
    const validLtCount = Array.from(ltUnique).filter((k) => countWords(k) >= 3).length;
    if (ltUnique.size >= 5 && ltUnique.size <= 8 && validLtCount === ltUnique.size) r3Pts += 4;

    // Quality enhancement: penalize mechanical suffix repetition in secondary keywords
    const mechanicalCount = strategy.keywords.secondary.filter((k) =>
      k.trim().toLowerCase().startsWith(kw.toLowerCase() + ' ')
    ).length;
    if (mechanicalCount >= 4) {
      r3Pts = Math.max(0, r3Pts - 2);
    }

    const r3Status: RuleStatus = r3Pts === 10 ? 'pass' : r3Pts >= 4 ? 'partial' : 'fail';
    rules.push({
      id: 'R3',
      criterion: 'Keyword Set',
      points: r3Pts,
      maxPoints: 10,
      status: r3Status,
      evidence: `Primary keyword ${pkMatch ? 'matches input' : 'mismatch'}. ${secUnique.size} secondary keywords (${mechanicalCount} repetitive prefixes). ${validLtCount}/${ltUnique.size} long-tail keywords have 3+ words.`,
      explanation: 'Checks that suggestions follow the requested counts and shapes. It does not judge search value; the app has no volume or difficulty data.',
      appliesTo: 'package'
    });
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
    let r4Pts = 0;
    const lines = articleMarkdown ? articleMarkdown.split('\n').map((l) => l.trim()) : [];
    const h1Count = lines.filter((l) => l.startsWith('# ')).length;
    const h2Count = lines.filter((l) => l.startsWith('## ')).length;
    const h3Count = lines.filter((l) => l.startsWith('### ')).length;

    if (h1Count === 1) r4Pts += 3;
    if (h2Count >= 4) r4Pts += 3;
    else if (h2Count >= 2) r4Pts += 1;

    // Check no skipped levels: ensure no #### without ### or ### without ##
    const hasH4 = lines.some((l) => l.startsWith('#### '));
    const noSkipped = !hasH4 && (h3Count === 0 || h2Count > 0);
    if (noSkipped) r4Pts += 2;

    // Check at least 2 H2 sections contain H3
    let h2WithH3Count = 0;
    let currentH2HasH3 = false;
    for (const line of lines) {
      if (line.startsWith('## ')) {
        if (currentH2HasH3) h2WithH3Count++;
        currentH2HasH3 = false;
      } else if (line.startsWith('### ')) {
        currentH2HasH3 = true;
      }
    }
    if (currentH2HasH3) h2WithH3Count++;

    if (h2WithH3Count >= 2) r4Pts += 2;
    else if (h2WithH3Count === 1) r4Pts += 1;

    // Quality enhancement: detect empty or placeholder headings
    const emptyHeadings = lines.filter((l) => {
      if (!l.startsWith('#')) return false;
      const headingText = l.replace(/^#+\s*/, '').trim();
      return headingText.length < 3 || /^(placeholder|tbd|undefined|null|\[.*\])$/i.test(headingText);
    });
    if (emptyHeadings.length > 0) {
      r4Pts = Math.max(0, r4Pts - 4);
    }

    const r4Status: RuleStatus = r4Pts === 10 ? 'pass' : r4Pts >= 5 ? 'partial' : 'fail';
    rules.push({
      id: 'R4',
      criterion: 'Heading Structure',
      points: r4Pts,
      maxPoints: 10,
      status: r4Status,
      evidence: `${h1Count} H1, ${h2Count} H2, ${h3Count} H3. Level hierarchy clean: ${noSkipped}. ${h2WithH3Count} H2 sections have H3 subheadings. Empty/placeholder headings: ${emptyHeadings.length}.`,
      explanation: 'A clean hierarchy helps readers scan and helps assistive technology and search engines understand the page.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R5: Primary Keyword Placement (15 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let r5Pts = 0;
    const lines = articleMarkdown ? articleMarkdown.split('\n').map((l) => l.trim()) : [];
    const h1Line = lines.find((l) => l.startsWith('# ')) || '';
    const inH1 = matchKeywordExact(h1Line, kw) > 0;
    if (inH1) r5Pts += 4;

    // First 100 words after H1
    const textAfterH1 = lines.filter((l) => !l.startsWith('#')).join(' ');
    const first100Words = textAfterH1.split(/\s+/).slice(0, 100).join(' ');
    const inFirst100 = matchKeywordExact(first100Words, kw) > 0;
    if (inFirst100) r5Pts += 4;

    // In at least one H2
    const h2Lines = lines.filter((l) => l.startsWith('## ')).join(' ');
    const inH2 = matchKeywordExact(h2Lines, kw) > 0;
    if (inH2) r5Pts += 3;

    // In final section
    const sections = articleMarkdown ? articleMarkdown.split(/^##\s+/m) : [];
    const finalSection = sections[sections.length - 1] || '';
    const inFinal = matchKeywordExact(finalSection, kw) > 0;
    if (inFinal) r5Pts += 2;

    // Density between 0.3% and 2.5%
    const density = calculateKeywordDensity(articleMarkdown, kw);
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
      evidence: `Keyword in H1: ${inH1}; first 100 words: ${inFirst100}; in H2: ${inH2}; final section: ${inFinal}; density: ${densityPct.toFixed(2)}%.`,
      explanation: 'Shows the topic early and consistently without stuffing. Density bounds are a sanity check, not a ranking target.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R6: Word-Count Accuracy (10 pts, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let r6Pts = 0;
    const actualWords = countWords(articleMarkdown);
    const target = input.wordCount;
    const diffPct = Math.abs(actualWords - target) / target;

    if (diffPct <= 0.1) r6Pts = 10;
    else if (diffPct <= 0.2) r6Pts = 5;

    const r6Status: RuleStatus = r6Pts === 10 ? 'pass' : r6Pts === 5 ? 'partial' : 'fail';
    rules.push({
      id: 'R6',
      criterion: 'Word-Count Accuracy',
      points: r6Pts,
      maxPoints: 10,
      status: r6Status,
      evidence: `Generated ${actualWords} words vs target of ${target} words (${Math.round(diffPct * 100)}% difference).`,
      explanation: 'Measures whether the model followed the length instruction.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R7: FAQs (10 pts, Package scope)
  // ------------------------------------------------------------------------
  if (scope === 'package' && faqs) {
    let r7Pts = 0;
    const countOk = faqs.length === 5;
    if (countOk) r7Pts += 4;

    const qMarkOk = faqs.every((f) => f.question.trim().endsWith('?'));
    if (qMarkOk) r7Pts += 2;

    const lenCheckCount = faqs.filter((f) => {
      const words = countWords(f.answer);
      return words >= 30 && words <= 80;
    }).length;

    if (lenCheckCount === 5) r7Pts += 4;
    else if (lenCheckCount >= 3) r7Pts += 2;

    // Quality enhancement: check for well-formed questions (>= 15 chars) and complete sentence answers
    const wellFormedQuestions = faqs.filter((f) => f.question.trim().length >= 15).length;
    const wellFormedAnswers = faqs.filter((f) => {
      const a = f.answer.trim();
      return a.endsWith('.') || a.endsWith('!');
    }).length;
    if (wellFormedQuestions < 5 || wellFormedAnswers < 5) {
      r7Pts = Math.max(0, r7Pts - 2);
    }

    const r7Status: RuleStatus = r7Pts === 10 ? 'pass' : r7Pts >= 4 ? 'partial' : 'fail';
    rules.push({
      id: 'R7',
      criterion: 'FAQs',
      points: r7Pts,
      maxPoints: 10,
      status: r7Status,
      evidence: `${faqs.length} FAQs provided. ${qMarkOk ? 'All' : 'Not all'} end in "?". ${lenCheckCount}/5 answers are 30-80 words. Complete questions/answers: ${wellFormedQuestions}/5 and ${wellFormedAnswers}/5.`,
      explanation: 'Checks format and answer length against the prompt constraints.',
      appliesTo: 'package'
    });
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
      const sentences = splitSentences(articleMarkdown);
      const totalWords = countWords(articleMarkdown);
      const avgSentenceLen = sentences.length > 0 ? totalWords / sentences.length : 0;

      if (avgSentenceLen <= 20) r8Pts = 5;
      else if (avgSentenceLen <= 25) r8Pts = 3;

      const r8Status: RuleStatus = r8Pts === 5 ? 'pass' : r8Pts === 3 ? 'partial' : 'fail';
      rules.push({
        id: 'R8',
        criterion: 'Readability Heuristic',
        points: r8Pts,
        maxPoints: 5,
        status: r8Status,
        evidence: `Average sentence length: ${avgSentenceLen.toFixed(1)} words across ${sentences.length} sentences.`,
        explanation: 'Shorter sentences are usually easier to read. This is a simple heuristic, not a full readability index.',
        appliesTo: 'article'
      });
    } else {
      rules.push({
        id: 'R8',
        criterion: 'Readability Heuristic',
        points: 0,
        maxPoints: 0,
        status: 'na',
        evidence: `Language is ${input.language}. Readability sentence length heuristic applies only to English.`,
        explanation: 'For non-English text, this rule is marked Not applicable and removed from the denominator.',
        appliesTo: 'article'
      });
    }
  }

  // ------------------------------------------------------------------------
  // R9: Unsupported-Claim Scan (10 pts, Article and FAQs, Article & Package scope)
  // ------------------------------------------------------------------------
  {
    let fullTextToScan = articleMarkdown || '';
    if (faqs) {
      fullTextToScan += '\n' + faqs.map((f) => f.question + ' ' + f.answer).join('\n');
    }

    const flags = findUnsupportedClaims(fullTextToScan, input.language);
    let r9Pts = 0;
    if (flags.length === 0) r9Pts = 10;
    else if (flags.length <= 2) r9Pts = 5;

    const r9Status: RuleStatus = r9Pts === 10 ? 'pass' : r9Pts === 5 ? 'partial' : 'fail';
    rules.push({
      id: 'R9',
      criterion: 'Unsupported-Claim Scan',
      points: r9Pts,
      maxPoints: 10,
      status: r9Status,
      evidence: `Found ${flags.length} potential unverifiable statement(s) matching restricted claim patterns.`,
      explanation: 'The prompts forbid invented statistics. A flag means unverifiable by the app, not necessarily false.',
      appliesTo: 'article'
    });
  }

  // ------------------------------------------------------------------------
  // R10: Manual Review (10 pts, Package and Article)
  // ------------------------------------------------------------------------
  {
    const hasIntent = typeof manualReview?.intentMatch === 'number';
    const hasTone = typeof manualReview?.toneAudienceFit === 'number';
    const isReviewed = hasIntent && hasTone;

    const intentScore = hasIntent ? Math.max(0, Math.min(5, manualReview!.intentMatch!)) : 0;
    const toneScore = hasTone ? Math.max(0, Math.min(5, manualReview!.toneAudienceFit!)) : 0;
    const r10Pts = isReviewed ? intentScore + toneScore : 0;

    rules.push({
      id: 'R10',
      criterion: 'Manual Review',
      points: r10Pts,
      maxPoints: 10,
      status: isReviewed ? (r10Pts >= 8 ? 'pass' : r10Pts >= 5 ? 'partial' : 'fail') : 'pending',
      evidence: isReviewed
        ? `Search intent: ${intentScore}/5; Tone and audience fit: ${toneScore}/5.`
        : 'Pending human evaluator review.',
      explanation: 'Some qualities need a human. The reviewer rates search intent match (0-5) and tone/audience fit (0-5).',
      appliesTo: 'article'
    });
  }

  // Compute Automated and Total Points
  const automatedRules = rules.filter((r) => r.id !== 'R10' && r.status !== 'na');
  const automatedPoints = automatedRules.reduce((sum, r) => sum + r.points, 0);
  const applicableAutomatedMax = automatedRules.reduce((sum, r) => sum + r.maxPoints, 0);

  const manualRule = rules.find((r) => r.id === 'R10');
  const manualPoints = manualRule ? manualRule.points : 0;
  const totalPoints = automatedPoints + manualPoints;

  // Outline Fidelity check (informational, not scored per Section E7)
  let outlineFidelity: { matched: number; total: number; percentage: number } | undefined;
  if (outline && outline.sections && articleMarkdown) {
    const headings: string[] = [];
    for (const sec of outline.sections) {
      headings.push(sec.h2);
      headings.push(...sec.h3);
    }
    const matched = headings.filter((h) => articleMarkdown.includes(h)).length;
    outlineFidelity = {
      matched,
      total: headings.length,
      percentage: headings.length > 0 ? Math.round((matched / headings.length) * 100) : 0
    };
  }

  return {
    rules,
    automatedPoints,
    applicableAutomatedMax,
    manualPoints,
    totalPoints,
    outlineFidelity
  };
}
