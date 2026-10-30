import { describe, it, expect } from 'vitest';
import { callProviderWithMarkdownValidation } from '../src/lib/llmJson.js';
import { calibrateArticleWordCount } from '../src/lib/articleGenerator.js';
import { countWords } from '../src/lib/text.js';
import { LlmProvider, LlmRequest, LlmResult } from '../src/providers/types.js';
import { AppError } from '../src/lib/errors.js';

function buildMockArticleWithWords(h1: string, targetWords: number): string {
  const h1Line = `# ${h1}`;
  const intro = 'Indoor gardening allows anyone to grow fresh herbs at home easily. Having fresh herbs transforms cooking.';
  const h2_1 = '## Essential Lighting Requirements';
  const h2_2 = '## Container Selection and Drainage';
  const h2_3 = '## Watering and Care Guidelines';
  const h2_4 = '## Concluding Thoughts on Growing Herbs';
  const conclusion = 'In conclusion, growing herbs at home provides constant culinary flavor and personal satisfaction.';

  // Build body paragraphs to reach approximate target words
  const baseWords = countWords(`${h1Line}\n\n${intro}\n\n${h2_1}\n\n${h2_2}\n\n${h2_3}\n\n${h2_4}\n\n${conclusion}`);
  const remaining = Math.max(0, targetWords - baseWords);
  const wordsPerSection = Math.ceil(remaining / 3);

  const makeSentences = (count: number) => {
    const sentences: string[] = [];
    let current = 0;
    while (current < count) {
      const sentence = 'Quality soil and proper routine care ensure that plants absorb nutrients efficiently and produce aromatic leaves.';
      sentences.push(sentence);
      current += countWords(sentence);
    }
    return sentences.join(' ');
  };

  const body1 = makeSentences(wordsPerSection);
  const body2 = makeSentences(wordsPerSection);
  const body3 = makeSentences(wordsPerSection);

  return `${h1Line}\n\n${intro}\n\n${h2_1}\n\n${body1}\n\n${h2_2}\n\n${body2}\n\n${h2_3}\n\n${body3}\n\n${h2_4}\n\n${conclusion}`;
}

describe('Live LLM Word-Count Calibration & Reliability (Section D & E)', () => {
  it('accepts an article that is already within ±10% tolerance on attempt 1', async () => {
    const article800 = buildMockArticleWithWords('Indoor Herb Garden Guide', 805);
    const mockProvider: LlmProvider = {
      name: 'openai-compatible',
      async generate(req: LlmRequest): Promise<LlmResult> {
        return {
          text: article800,
          usage: { inputTokens: 500, outputTokens: 805 }
        };
      }
    };

    const controller = new AbortController();
    const result = await callProviderWithMarkdownValidation(
      mockProvider,
      { system: 'system prompt', user: 'write article', maxTokens: 1500, temperature: 0.7 },
      'Indoor Herb Garden Guide',
      'Article',
      controller.signal,
      800
    );

    expect(result.attempts).toBe(1);
    const actualWords = countWords(result.text);
    expect(actualWords).toBeGreaterThanOrEqual(720); // 800 - 10%
    expect(actualWords).toBeLessThanOrEqual(880); // 800 + 10%
  });

  it('retries when live provider returns an under-target article, expanding it on attempt 2', async () => {
    let callCount = 0;
    const shortArticle = buildMockArticleWithWords('Indoor Herb Garden Guide', 400); // 400 vs 800 target
    const expandedArticle = buildMockArticleWithWords('Indoor Herb Garden Guide', 810);

    const mockProvider: LlmProvider = {
      name: 'openai-compatible',
      async generate(req: LlmRequest): Promise<LlmResult> {
        callCount++;
        if (callCount === 1) {
          return { text: shortArticle, usage: { inputTokens: 500, outputTokens: 400 } };
        }
        // Attempt 2 expands the content in response to retry prompt
        expect(req.user).toContain('under target');
        expect(req.user).toContain('expand');
        return { text: expandedArticle, usage: { inputTokens: 600, outputTokens: 810 } };
      }
    };

    const controller = new AbortController();
    const result = await callProviderWithMarkdownValidation(
      mockProvider,
      { system: 'system prompt', user: 'write article', maxTokens: 1500, temperature: 0.7 },
      'Indoor Herb Garden Guide',
      'Article',
      controller.signal,
      800
    );

    expect(callCount).toBe(2);
    expect(result.attempts).toBe(2);
    const actualWords = countWords(result.text);
    expect(actualWords).toBeGreaterThanOrEqual(720);
    expect(actualWords).toBeLessThanOrEqual(880);
  });

  it('throws AppError 502 INVALID_MODEL_OUTPUT if model remains under-target after bounded retry', async () => {
    let callCount = 0;
    const shortArticle = buildMockArticleWithWords('Indoor Herb Garden Guide', 350); // persistent under target

    const mockProvider: LlmProvider = {
      name: 'openai-compatible',
      async generate(req: LlmRequest): Promise<LlmResult> {
        callCount++;
        return { text: shortArticle, usage: { inputTokens: 500, outputTokens: 350 } };
      }
    };

    const controller = new AbortController();
    await expect(
      callProviderWithMarkdownValidation(
        mockProvider,
        { system: 'system prompt', user: 'write article', maxTokens: 1500, temperature: 0.7 },
        'Indoor Herb Garden Guide',
        'Article',
        controller.signal,
        800
      )
    ).rejects.toThrowError(AppError);

    expect(callCount).toBe(2);
  });

  it('trims over-target articles cleanly across middle sections without damaging headings or conclusion', async () => {
    // Generate an article that is ~1160 words (target 1000 words, max tolerance 1100 words)
    const longArticle = buildMockArticleWithWords('Indoor Herb Garden Guide', 1160);
    expect(countWords(longArticle)).toBeGreaterThan(1100);

    const calibrated = calibrateArticleWordCount(longArticle, 1000);
    const finalWords = countWords(calibrated);

    // Calibrated article must be brought within tolerance
    expect(finalWords).toBeLessThanOrEqual(1050);
    expect(finalWords).toBeGreaterThanOrEqual(950);

    // Verify structural integrity
    expect(calibrated).toContain('# Indoor Herb Garden Guide');
    expect(calibrated).toContain('## Essential Lighting Requirements');
    expect(calibrated).toContain('## Container Selection and Drainage');
    expect(calibrated).toContain('## Watering and Care Guidelines');
    expect(calibrated).toContain('## Concluding Thoughts on Growing Herbs');
    expect(calibrated).toContain('In conclusion, growing herbs at home provides constant culinary flavor and personal satisfaction.');
  });

  it('handles over-target live provider output via calibration on attempt 1', async () => {
    const longArticle = buildMockArticleWithWords('Indoor Herb Garden Guide', 1150);
    const mockProvider: LlmProvider = {
      name: 'anthropic',
      async generate(req: LlmRequest): Promise<LlmResult> {
        return { text: longArticle, usage: { inputTokens: 600, outputTokens: 1150 } };
      }
    };

    const controller = new AbortController();
    const result = await callProviderWithMarkdownValidation(
      mockProvider,
      { system: 'system', user: 'write', maxTokens: 2000, temperature: 0.7 },
      'Indoor Herb Garden Guide',
      'Article',
      controller.signal,
      1000
    );

    expect(result.attempts).toBe(1);
    const actualWords = countWords(result.text);
    expect(actualWords).toBeLessThanOrEqual(1100);
    expect(actualWords).toBeGreaterThanOrEqual(900);
  });
});
