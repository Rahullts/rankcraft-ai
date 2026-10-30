/**
 * Text processing and measurement utilities strictly implementing Section E7 and Rubric R1-R10.
 */

export function countWords(markdownText: string): number {
  if (!markdownText || !markdownText.trim()) return 0;

  // 1. Strip code blocks first before backtick stripping
  let clean = markdownText
    .replace(/```[\s\S]*?```/g, '') // code blocks first
    .replace(/^#+\s+/gm, '') // headings
    .replace(/[*_`]/g, '') // bold, italics, inline code
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // link syntax keeping link text
    .replace(/^[-*+]\s+/gm, '') // unordered lists
    .replace(/^\d+\.\s+/gm, ''); // ordered lists

  // 2. Split on whitespace and filter empty tokens
  const tokens = clean.trim().split(/\s+/).filter(Boolean);
  return tokens.length;
}

export function countCharacters(str: string): number {
  if (!str) return 0;
  // Count unicode code points of trimmed string
  return Array.from(str.trim()).length;
}

export function normalizeWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim().toLowerCase();
}

/**
 * Normalizes heading text for exact 1-to-1 outline fidelity comparison.
 * Strips markdown hashes, normalizes casing/whitespace, and strips harmless punctuation.
 */
export function normalizeHeadingText(heading: string): string {
  if (!heading) return '';
  return heading
    .replace(/^#+\s*/, '')
    .replace(/#+$/, '')
    .toLowerCase()
    .replace(/[.,:;!?'"’“”()[\]{}_/\\&|~`\-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Extracts clean narrative prose from markdown for accurate readability (R8) scoring.
 * Excludes headings, fenced code blocks, bullet lists, numbered lists, URLs, and markdown formatting.
 */
export function extractCleanProse(markdownText: string): string {
  if (!markdownText || !markdownText.trim()) return '';

  return markdownText
    .replace(/```[\s\S]*?```/g, '') // strip fenced code blocks
    .replace(/^#+\s+.*$/gm, '') // strip all headings
    .replace(/^[-*+]\s+.*$/gm, '') // strip unordered list items
    .replace(/^\d+\.\s+.*$/gm, '') // strip ordered list items
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // link text only
    .replace(/https?:\/\/[^\s]+/g, '') // strip standalone URLs
    .replace(/[*_`~]/g, '') // strip bold, italics, inline code markers
    .trim();
}

export function matchKeywordExact(text: string, keyword: string): number {
  if (!text || !keyword) return 0;
  const normText = normalizeWhitespace(text);
  const normKw = normalizeWhitespace(keyword);

  // Escaping regex special characters in keyword
  const escaped = normKw.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`\\b${escaped}\\b`, 'gi');
  const matches = normText.match(regex);
  return matches ? matches.length : 0;
}

export function calculateKeywordDensity(text: string, keyword: string): number {
  const totalWords = countWords(text);
  if (totalWords === 0) return 0;

  const kwOccurrences = matchKeywordExact(text, keyword);
  const kwWords = countWords(keyword);

  return (kwOccurrences * kwWords) / totalWords;
}

export function splitSentences(markdownText: string): string[] {
  if (!markdownText || !markdownText.trim()) return [];

  // Exclude headings, code blocks and list items
  let text = markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/^[-*+]\s+.*$/gm, '')
    .replace(/^\d+\.\s+.*$/gm, '');

  // Split on ., !, ?, and Devanagari danda (।) followed by whitespace or end of string
  const rawSentences = text.split(/(?:[.!?।])(?:\s+|$)/);
  return rawSentences.map((s) => s.trim()).filter((s) => s.length > 2);
}

// -----------------------------------------------------------------------------
// Markdown Heading Parser & Hierarchy Audit (Rule R4 & Outline Fidelity)
// -----------------------------------------------------------------------------
export interface ParsedHeading {
  level: number;
  text: string;
  raw: string;
  lineIndex: number;
}

export interface HeadingHierarchyAudit {
  headings: ParsedHeading[];
  h1Headings: ParsedHeading[];
  h2Headings: ParsedHeading[];
  h3Headings: ParsedHeading[];
  h4PlusHeadings: ParsedHeading[];
  h1Count: number;
  h2Count: number;
  h3Count: number;
  h4PlusCount: number;
  h2WithH3Count: number;
  invalidJumps: Array<{ from: number; to: number; heading: string }>;
  emptyOrPlaceholder: Array<{ text: string; level: number; reason: string }>;
  isHierarchyClean: boolean;
}

export function parseMarkdownHeadings(markdownText: string): HeadingHierarchyAudit {
  if (!markdownText || !markdownText.trim()) {
    return {
      headings: [],
      h1Headings: [],
      h2Headings: [],
      h3Headings: [],
      h4PlusHeadings: [],
      h1Count: 0,
      h2Count: 0,
      h3Count: 0,
      h4PlusCount: 0,
      h2WithH3Count: 0,
      invalidJumps: [],
      emptyOrPlaceholder: [],
      isHierarchyClean: false
    };
  }

  // Split lines while tracking code fences to ignore headings inside code blocks
  const lines = markdownText.split('\n');
  const headings: ParsedHeading[] = [];
  let inCodeBlock = false;

  for (let i = 0; i < lines.length; i++) {
    const trimmed = lines[i].trim();
    if (trimmed.startsWith('```')) {
      inCodeBlock = !inCodeBlock;
      continue;
    }
    if (inCodeBlock) continue;

    const headingMatch = trimmed.match(/^(#{1,6})\s*(.*)$/);
    if (headingMatch) {
      const level = headingMatch[1].length;
      const text = headingMatch[2].trim();
      headings.push({
        level,
        text,
        raw: trimmed,
        lineIndex: i
      });
    }
  }

  const h1Headings = headings.filter((h) => h.level === 1);
  const h2Headings = headings.filter((h) => h.level === 2);
  const h3Headings = headings.filter((h) => h.level === 3);
  const h4PlusHeadings = headings.filter((h) => h.level >= 4);

  // Hierarchy validation: check for level skips (e.g. H1 -> H3 without H2, H2 -> H4 without H3)
  const invalidJumps: Array<{ from: number; to: number; heading: string }> = [];
  let lastLevel = 0;

  for (const h of headings) {
    if (lastLevel > 0 && h.level > lastLevel + 1) {
      invalidJumps.push({
        from: lastLevel,
        to: h.level,
        heading: h.text
      });
    }
    lastLevel = h.level;
  }

  // Detect empty or placeholder headings
  const emptyOrPlaceholder: Array<{ text: string; level: number; reason: string }> = [];
  for (const h of headings) {
    if (h.text.length < 3) {
      emptyOrPlaceholder.push({ text: h.text, level: h.level, reason: 'Heading text is too short (< 3 chars)' });
    } else if (/^(placeholder|tbd|undefined|null|\[.*\]|heading\s*\d*)$/i.test(h.text)) {
      emptyOrPlaceholder.push({ text: h.text, level: h.level, reason: 'Contains placeholder marker' });
    }
  }

  // Count how many H2 sections contain at least one nested H3 heading
  let h2WithH3Count = 0;
  let currentH2HasH3 = false;
  for (const h of headings) {
    if (h.level === 2) {
      if (currentH2HasH3) h2WithH3Count++;
      currentH2HasH3 = false;
    } else if (h.level === 3) {
      currentH2HasH3 = true;
    }
  }
  if (currentH2HasH3) h2WithH3Count++;

  const isHierarchyClean =
    h1Headings.length === 1 &&
    h2Headings.length >= 4 &&
    invalidJumps.length === 0 &&
    emptyOrPlaceholder.length === 0;

  return {
    headings,
    h1Headings,
    h2Headings,
    h3Headings,
    h4PlusHeadings,
    h1Count: h1Headings.length,
    h2Count: h2Headings.length,
    h3Count: h3Headings.length,
    h4PlusCount: h4PlusHeadings.length,
    h2WithH3Count,
    invalidJumps,
    emptyOrPlaceholder,
    isHierarchyClean
  };
}

// -----------------------------------------------------------------------------
// Unsupported-Claim Scan Patterns & Scanner (Rule R9)
// -----------------------------------------------------------------------------
export interface ClaimPatternDef {
  regex: RegExp;
  category: string;
  reason: string;
}

export const CLAIM_PATTERNS: ClaimPatternDef[] = [
  {
    regex: /\b\d+(\.\d+)?%/i,
    category: 'Percentage Metric',
    reason: 'Contains an unverified percentage statistic that requires empirical source attribution.'
  },
  {
    regex: /\b(studies\s+show|research\s+shows|according\s+to\s+studies|scientists\s+found|proven\s+by\s+research)\b/i,
    category: 'Unattributed Research',
    reason: 'Cites scientific studies or research without providing a verifiable publication or author citation.'
  },
  {
    regex: /\b\d+\s*(million|billion|thousand)\s+(users|people|customers|queries|dollars|pounds|euros)\b/i,
    category: 'Unverified Statistic',
    reason: 'Cites a large numerical volume claim without primary data verification.'
  },
  {
    regex: /\b(ranked\s+(#1|number\s*1|first)|#1\s+rated|best\s+in\s+the\s+world|industry-leading)\b/i,
    category: 'Unverified Ranking',
    reason: 'Makes an absolute ranking or supremacy assertion without an audited benchmarking source.'
  },
  {
    regex: /\b(guaranteed\s+(results|success|traffic|rankings)|100%\s+guaranteed|risk-free|fail-safe)\b/i,
    category: 'Guaranteed Outcome',
    reason: 'Promises guaranteed outcomes or zero risk, which violates objective SEO editorial guidelines.'
  },
  {
    regex: /\b\d{3,}\s*(searches|monthly\s+searches|search\s+volume)\b/i,
    category: 'Fabricated Volume Metric',
    reason: 'States specific numerical search volumes without integration to an authenticated keyword API.'
  }
];

export interface ClaimFlag {
  sentence: string;
  category: string;
  reason: string;
  matchedPattern: string;
}

export function findUnsupportedClaims(text: string, language: string = 'English'): ClaimFlag[] {
  const sentences = splitSentences(text);
  const flags: ClaimFlag[] = [];

  const patterns = language === 'English'
    ? CLAIM_PATTERNS
    : [CLAIM_PATTERNS[0]]; // For non-English languages, only percentage pattern applies per Section E7

  for (const sentence of sentences) {
    for (const def of patterns) {
      if (def.regex.test(sentence)) {
        flags.push({
          sentence,
          category: def.category,
          reason: def.reason,
          matchedPattern: def.regex.source
        });
        break; // Only flag each sentence once
      }
    }
  }

  return flags;
}
