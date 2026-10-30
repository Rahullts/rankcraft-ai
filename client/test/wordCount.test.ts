import { describe, it, expect } from 'vitest';
import { countWords, countCharacters } from '../src/lib/text';
import { evaluate } from '../src/lib/evaluate';

describe('Client Word Count & Rubric R6 Compliance', () => {
  it('accurately counts words by stripping markdown symbols and formatting', () => {
    const markdown = `# Main Title
    
## Section 1
This is a **bold** statement and *italicized* phrase with [a markdown link](https://example.com).

- List item one
- List item two
1. Numbered item one
2. Numbered item two

\`\`\`
const code = 'should be stripped';
\`\`\`
Final closing paragraph.`;

    const count = countWords(markdown);
    // Heading: "Main Title" (2)
    // Section: "Section 1" (2)
    // Paragraph: "This is a bold statement and italicized phrase with a markdown link." (12)
    // Lists: "List item one", "List item two", "Numbered item one", "Numbered item two" (12)
    // Code block: stripped (0)
    // Final: "Final closing paragraph." (3)
    // Total expected words: 31
    expect(count).toBe(31);
  });

  it('demonstrates that the previous bug (623 words against target 500) failed R6 with 0 points', () => {
    // Generate sample 623-word text
    const words = Array.from({ length: 623 }, (_, i) => `word${i}`).join(' ');
    const result = evaluate('package', {
      input: { primaryKeyword: 'indoor herb garden', wordCount: 500, language: 'English' },
      articleMarkdown: words
    });

    const r6 = result.rules.find((r) => r.id === 'R6');
    expect(r6).toBeDefined();
    // 623 vs 500 is |623-500|/500 = 24.6% (> 20%), so 0 points (fail)
    expect(r6?.points).toBe(0);
    expect(r6?.status).toBe('fail');
  });

  it.each([
    { target: 500, actual: 493 },
    { target: 800, actual: 798 },
    { target: 1200, actual: 1195 },
    { target: 1500, actual: 1492 }
  ])('awards full 10/10 points for target $target with actual $actual words (within 10% tolerance)', ({ target, actual }) => {
    const words = Array.from({ length: actual }, (_, i) => `term${i}`).join(' ');
    const result = evaluate('package', {
      input: { primaryKeyword: 'indoor herb garden', wordCount: target, language: 'English' },
      articleMarkdown: words
    });

    const r6 = result.rules.find((r) => r.id === 'R6');
    expect(r6?.points).toBe(10);
    expect(r6?.status).toBe('pass');
    expect(r6?.evidence).toContain(`${actual} words vs target of ${target} words`);
  });

  it('awards partial 5/10 points when article is within 10-20% tolerance', () => {
    // 560 vs 500 = 12% diff (between 10% and 20%)
    const words = Array.from({ length: 560 }, (_, i) => `term${i}`).join(' ');
    const result = evaluate('package', {
      input: { primaryKeyword: 'indoor herb garden', wordCount: 500, language: 'English' },
      articleMarkdown: words
    });

    const r6 = result.rules.find((r) => r.id === 'R6');
    expect(r6?.points).toBe(5);
    expect(r6?.status).toBe('partial');
  });

  it('matches character count logic between trimmed unicode strings', () => {
    expect(countCharacters('  158 characters meta  ')).toBe(19);
    expect(countCharacters('')).toBe(0);
  });
});
