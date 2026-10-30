import { describe, it, expect } from 'vitest';
import {
  countWords,
  countCharacters,
  matchKeywordExact,
  calculateKeywordDensity,
  splitSentences,
  findUnsupportedClaims,
  extractCleanProse,
  normalizeHeadingText
} from '../src/lib/text';

describe('Text Utilities (Section E7 & Rule R1-R9)', () => {
  it('counts words in markdown stripped of formatting', () => {
    const md = '# Main Heading\n\nThis is a **bold** paragraph with [a link](https://example.com) and `code`.\n\n- Item one\n- Item two';
    // Heading: "Main Heading" (2)
    // Paragraph: "This is a bold paragraph with a link and code." (10)
    // List: "Item one", "Item two" (4)
    // Total = 16 words
    const count = countWords(md);
    expect(count).toBe(16);
  });

  it('handles empty or blank text gracefully', () => {
    expect(countWords('')).toBe(0);
    expect(countWords('   \n  \t  ')).toBe(0);
    expect(countCharacters('')).toBe(0);
  });

  it('measures exact character count including unicode', () => {
    expect(countCharacters('Hello World')).toBe(11);
    expect(countCharacters('  155 characters test  ')).toBe(19);
  });

  it('matches keyword occurrences case-insensitively with word boundaries', () => {
    const text = 'Indoor herb gardens are great. An indoor herb garden needs light, but indoor herb gardening is a hobby.';
    // "indoor herb garden" exact matches
    expect(matchKeywordExact(text, 'indoor herb garden')).toBe(1);
    // "indoor herb gardens" exact matches
    expect(matchKeywordExact(text, 'indoor herb gardens')).toBe(1);
  });

  it('calculates keyword density accurately', () => {
    // 100 words text with 2 occurrences of 2-word keyword -> density = 4/100 = 4% = 0.04
    const kw = 'herb garden';
    const filler = Array(48).fill('word').join(' ');
    const text = `${kw} ${filler} ${kw} ${filler}`;
    const density = calculateKeywordDensity(text, kw);
    // Total words: 2 + 48 + 2 + 48 = 100 words. Kw occurrences = 2. kwWords = 2.
    // density = 4 / 100 = 0.04
    expect(density).toBeCloseTo(0.04, 3);
  });

  it('splits sentences excluding headings and code blocks', () => {
    const md = '# Title\n\nFirst sentence is here. Second sentence follows! Is this the third? Yes, it is.\n\n```\nconst x = 1;\n```';
    const sentences = splitSentences(md);
    expect(sentences.length).toBe(4);
    expect(sentences[0]).toBe('First sentence is here');
    expect(sentences[1]).toBe('Second sentence follows');
    expect(sentences[2]).toBe('Is this the third');
    expect(sentences[3]).toBe('Yes, it is');
  });

  it('detects unsupported claims for Rule R9', () => {
    const text = 'Studies show that 95% of users prefer this. There are 2 million people using it. It is ranked #1 in the market.';
    const flags = findUnsupportedClaims(text, 'English');
    expect(flags.length).toBeGreaterThanOrEqual(3);
  });

  it('only checks percentages for non-English languages in R9', () => {
    const text = 'Studies show that 95% of users prefer this.';
    const flags = findUnsupportedClaims(text, 'Spanish');
    // Only 95% should match in non-English
    expect(flags.length).toBe(1);
    expect(flags[0].sentence).toContain('95%');
  });

  it('extractCleanProse strips headings, code blocks, bullet lists, and numbered lists', () => {
    const raw = `# Heading 1
## Heading 2
This is genuine prose paragraph one. It has multiple words.

\`\`\`javascript
const foo = 'bar';
console.log(foo);
\`\`\`

- Bullet item one
- Bullet item two
* Bullet item three
+ Bullet item four

1. Numbered step one
2. Numbered step two

This is genuine prose paragraph two. It continues the discussion.`;

    const clean = extractCleanProse(raw);
    expect(clean).not.toContain('Heading 1');
    expect(clean).not.toContain('Heading 2');
    expect(clean).not.toContain('const foo');
    expect(clean).not.toContain('Bullet item');
    expect(clean).not.toContain('Numbered step');
    expect(clean).toContain('This is genuine prose paragraph one. It has multiple words.');
    expect(clean).toContain('This is genuine prose paragraph two. It continues the discussion.');
  });

  it('normalizeHeadingText normalizes casing, hashes, whitespace, and punctuation', () => {
    expect(normalizeHeadingText('### 1. Essential Light Requirements: ')).toBe('1 essential light requirements');
    expect(normalizeHeadingText('Essential Light Requirements?')).toBe('essential light requirements');
    expect(normalizeHeadingText('  Essential    Light   Requirements  ')).toBe('essential light requirements');
    expect(normalizeHeadingText('Pots & Drainage (Small Spaces)')).toBe('pots drainage small spaces');
  });
});
