import { describe, it, expect } from 'vitest';
import { STAGE_1_STRATEGY, PROMPT_VERSION } from '../src/prompts/templates.js';
import { renderPrompt } from '../src/prompts/render.js';

describe('Prompt Templates & Unit Tests', () => {
  it('has valid PROMPT_VERSION string', () => {
    expect(PROMPT_VERSION).toBe('1.0');
  });

  // Test U-07 from Section E5:
  // "The meta description in this example must be counted by a unit test (test U-07) rather than trusted.
  // If its length is outside 155-160, edit the example until it passes."
  it('U-07: Example meta description length is strictly between 155 and 160 characters', () => {
    const rawExample = STAGE_1_STRATEGY.user;
    const match = rawExample.match(/"metaDescription":"([^"]+)"/);
    expect(match).not.toBeNull();
    const metaText = match![1];
    const len = metaText.length;
    expect(len).toBeGreaterThanOrEqual(155);
    expect(len).toBeLessThanOrEqual(160);
  });

  it('renders prompt variables correctly', () => {
    const template = 'Hello {{topic}} in {{market}} with {{intentGuidance}}';
    const rendered = renderPrompt(template, {
      topic: 'Indoor Herb Garden',
      market: 'UK',
      intent: 'informational'
    });
    expect(rendered).toContain('Indoor Herb Garden');
    expect(rendered).toContain('UK');
    expect(rendered).toContain('The reader wants to learn or understand');
  });

  it('throws an error if an unresolved variable remains', () => {
    const template = 'Hello {{topic}} and {{missingVar}}';
    expect(() =>
      renderPrompt(template, {
        topic: 'Test'
      })
    ).toThrow(/Unresolved prompt variable/);
  });
});
