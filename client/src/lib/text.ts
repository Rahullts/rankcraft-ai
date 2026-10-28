/**
 * Text processing and measurement utilities strictly implementing Section E7.
 */

export function countWords(markdownText: string): number {
  if (!markdownText || !markdownText.trim()) return 0;

  // 1. Strip markdown symbols
  let clean = markdownText
    .replace(/^#+\s+/gm, '') // headings
    .replace(/[*_`]/g, '') // bold, italics, inline code
    .replace(/```[\s\S]*?```/g, '') // code blocks
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

  // Exclude headings, code blocks and list markers
  let text = markdownText
    .replace(/```[\s\S]*?```/g, '')
    .replace(/^#+\s+.*$/gm, '')
    .replace(/^[-*+]\s+/gm, '')
    .replace(/^\d+\.\s+/gm, '');

  // Split on ., !, ?, and Devanagari danda (।) followed by whitespace or end of string
  const rawSentences = text.split(/(?:[.!?।])(?:\s+|$)/);
  return rawSentences.map((s) => s.trim()).filter((s) => s.length > 2);
}

// Patterns flagged by Rule R9
export const UNSUPPORTED_PATTERNS = [
  /\b\d+(\.\d+)?%/i, // percentages
  /\b(studies\s+show|research\s+shows|according\s+to)\b/i,
  /\b(statistics|statistically)\b/i,
  /\b\d+\s*(million|billion|thousand)\b/i,
  /\branked\s+(number\s*1|#1|first)\b/i,
  /\bguaranteed\b/i,
  /\bsearch\s+volume\b/i
];

export function findUnsupportedClaims(text: string, language: string = 'English'): Array<{ sentence: string; matchedPattern: string }> {
  const sentences = splitSentences(text);
  const flags: Array<{ sentence: string; matchedPattern: string }> = [];

  const patterns = language === 'English'
    ? UNSUPPORTED_PATTERNS
    : [/\b\d+(\.\d+)?%/]; // For non-English only the percentage pattern is applied per R9

  for (const sentence of sentences) {
    for (const pattern of patterns) {
      if (pattern.test(sentence)) {
        flags.push({
          sentence,
          matchedPattern: pattern.source
        });
        break; // Only flag each sentence once
      }
    }
  }

  return flags;
}
