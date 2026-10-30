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

  it('retains complete original user context, strategy, outline, failure reason, and previous draft on under-target retry', async () => {
    let capturedRetryReq: LlmRequest | null = null;
    const initialUnderTargetDraft = buildMockArticleWithWords('Complete Hydroponic Herb Guide', 320); // 320 vs 800 target
    const correctedDraft = buildMockArticleWithWords('Complete Hydroponic Herb Guide', 810);

    const originalUserPrompt = `Topic: Hydroponic Culinary Herb Growing
Target Audience: Urban apartment dwellers with limited balcony space
Industry: Urban Agriculture & Indoor Gardening
Market: United States & Canada
Primary Keyword: hydroponic herb garden
Search Intent: informational
Tone: authoritative
Language: English
Target Word Count: 800 words
Strategy JSON: {"titles":[{"text":"Complete Hydroponic Herb Guide","angle":"Comprehensive"}],"keywords":{"primary":"hydroponic herb garden","secondary":["indoor herbs"]}}
Outline JSON: {"sections":[{"h2":"Essential Lighting Requirements","h3":[]},{"h2":"Container Selection and Drainage","h3":[]},{"h2":"Watering and Care Guidelines","h3":[]},{"h2":"Concluding Thoughts on Growing Herbs","h3":[]}]}`;

    const mockProvider: LlmProvider = {
      name: 'openai-compatible',
      async generate(req: LlmRequest): Promise<LlmResult> {
        if (!capturedRetryReq) {
          // Attempt 1 returns under-target draft
          return { text: initialUnderTargetDraft, usage: { inputTokens: 500, outputTokens: 320 } };
        }
        // Attempt 2: capturedRetryReq is set
        return { text: correctedDraft, usage: { inputTokens: 900, outputTokens: 810 } };
      }
    };

    // Spy on generate calls
    const originalGenerate = mockProvider.generate.bind(mockProvider);
    let callIndex = 0;
    mockProvider.generate = async (req: LlmRequest, signal?: AbortSignal) => {
      callIndex++;
      if (callIndex === 2) {
        capturedRetryReq = req;
      }
      return originalGenerate(req, signal);
    };

    const controller = new AbortController();
    const result = await callProviderWithMarkdownValidation(
      mockProvider,
      {
        system: 'You are an expert SEO content strategist and technical writer.',
        user: originalUserPrompt,
        maxTokens: 1800,
        temperature: 0.7
      },
      'Complete Hydroponic Herb Guide',
      'Article',
      controller.signal,
      800
    );

    expect(result.attempts).toBe(2);
    expect(capturedRetryReq).not.toBeNull();

    // 1. Verify original system prompt is preserved
    expect(capturedRetryReq!.system).toBe('You are an expert SEO content strategist and technical writer.');

    // 2. Verify complete original user instructions & context are retained
    expect(capturedRetryReq!.user).toContain('Topic: Hydroponic Culinary Herb Growing');
    expect(capturedRetryReq!.user).toContain('Target Audience: Urban apartment dwellers with limited balcony space');
    expect(capturedRetryReq!.user).toContain('Industry: Urban Agriculture & Indoor Gardening');
    expect(capturedRetryReq!.user).toContain('Market: United States & Canada');
    expect(capturedRetryReq!.user).toContain('Primary Keyword: hydroponic herb garden');
    expect(capturedRetryReq!.user).toContain('Search Intent: informational');
    expect(capturedRetryReq!.user).toContain('Tone: authoritative');
    expect(capturedRetryReq!.user).toContain('Language: English');
    expect(capturedRetryReq!.user).toContain('Strategy JSON:');
    expect(capturedRetryReq!.user).toContain('Outline JSON:');

    // 3. Verify failure reason and word count ranges are included
    expect(capturedRetryReq!.user).toContain('REVISION INSTRUCTIONS (PREVIOUS ATTEMPT FAILED VALIDATION)');
    expect(capturedRetryReq!.user).toContain('is under target 800 words');
    expect(capturedRetryReq!.user).toContain('strictly between 720 and 880 words');

    // 4. Verify expansion guidance is provided
    expect(capturedRetryReq!.user).toContain('ACTION REQUIRED: EXPAND CONTENT');
    expect(capturedRetryReq!.user).toContain('Expand each section with actionable, in-depth explanations');

    // 5. Verify previous draft is included for revision
    expect(capturedRetryReq!.user).toContain('PREVIOUS DRAFT FOR REFERENCE & REVISION:');
    expect(capturedRetryReq!.user).toContain('--- BEGIN PREVIOUS DRAFT ---');
    expect(capturedRetryReq!.user).toContain('# Complete Hydroponic Herb Guide');
    expect(capturedRetryReq!.user).toContain('--- END PREVIOUS DRAFT ---');

    // 6. Verify constraints preservation instructions
    expect(capturedRetryReq!.user).toContain('Must preserve the exact top-level H1: # Complete Hydroponic Herb Guide');
    expect(capturedRetryReq!.user).toContain('Must preserve primary keyword placement');
    expect(capturedRetryReq!.user).toContain('Must preserve all generated outline sections');
    expect(capturedRetryReq!.user).toContain('Must strictly preserve the requested language, tone, search intent, target audience, and market');
  });

  it('retains complete original user context, failure reason, condensation guidance, and previous draft on over-target retry', async () => {
    let capturedRetryReq: LlmRequest | null = null;
    // Build an excessively long article (1800 words vs 800 target) that calibration cannot trim safely
    const massiveArticle = buildMockArticleWithWords('Complete Hydroponic Herb Guide', 1800);
    const correctedDraft = buildMockArticleWithWords('Complete Hydroponic Herb Guide', 800);

    const originalUserPrompt = `Topic: Hydroponic Culinary Herb Growing
Target Audience: Urban apartment dwellers
Primary Keyword: hydroponic herb garden
Tone: professional
Language: English
Strategy JSON: {"titles":[{"text":"Complete Hydroponic Herb Guide","angle":"Comprehensive"}]}`;

    let callIndex = 0;
    const mockProvider: LlmProvider = {
      name: 'openai-compatible',
      async generate(req: LlmRequest): Promise<LlmResult> {
        callIndex++;
        if (callIndex === 1) {
          return { text: massiveArticle, usage: { inputTokens: 500, outputTokens: 1800 } };
        }
        capturedRetryReq = req;
        return { text: correctedDraft, usage: { inputTokens: 1200, outputTokens: 800 } };
      }
    };

    const controller = new AbortController();
    const result = await callProviderWithMarkdownValidation(
      mockProvider,
      {
        system: 'Expert content writer system prompt.',
        user: originalUserPrompt,
        maxTokens: 2500,
        temperature: 0.7
      },
      'Complete Hydroponic Herb Guide',
      'Article',
      controller.signal,
      800
    );

    expect(result.attempts).toBe(2);
    expect(capturedRetryReq).not.toBeNull();

    // 1. Verify original system prompt is preserved
    expect(capturedRetryReq!.system).toBe('Expert content writer system prompt.');

    // 2. Verify complete original user context is retained
    expect(capturedRetryReq!.user).toContain('Topic: Hydroponic Culinary Herb Growing');
    expect(capturedRetryReq!.user).toContain('Target Audience: Urban apartment dwellers');
    expect(capturedRetryReq!.user).toContain('Primary Keyword: hydroponic herb garden');
    expect(capturedRetryReq!.user).toContain('Strategy JSON:');

    // 3. Verify failure reason and word count ranges
    expect(capturedRetryReq!.user).toContain('REVISION INSTRUCTIONS (PREVIOUS ATTEMPT FAILED VALIDATION)');
    expect(capturedRetryReq!.user).toContain('strictly between 720 and 880 words');

    // 4. Verify condensation guidance is provided
    expect(capturedRetryReq!.user).toContain('ACTION REQUIRED: CONDENSE CONTENT');
    expect(capturedRetryReq!.user).toContain('Tighten sentences and eliminate redundant phrasing');

    // 5. Verify previous draft is embedded
    expect(capturedRetryReq!.user).toContain('PREVIOUS DRAFT FOR REFERENCE & REVISION:');
    expect(capturedRetryReq!.user).toContain('--- BEGIN PREVIOUS DRAFT ---');
    expect(capturedRetryReq!.user).toContain('--- END PREVIOUS DRAFT ---');

    // 6. Verify constraints
    expect(capturedRetryReq!.user).toContain('Must preserve the exact top-level H1: # Complete Hydroponic Herb Guide');
  });
});
