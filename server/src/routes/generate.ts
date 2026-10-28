import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { seoInputSchema } from '../schemas/input.js';
import { strategySchema, outlineSchema, faqsSchema, Strategy, Outline } from '../schemas/stages.js';
import { STAGE_1_STRATEGY, STAGE_2_OUTLINE, STAGE_3_ARTICLE, STAGE_4_FAQS } from '../prompts/templates.js';
import { renderPrompt } from '../prompts/render.js';
import { getProvider } from '../providers/index.js';
import { callProviderWithJsonValidation, callProviderWithMarkdownValidation } from '../lib/llmJson.js';
import { config } from '../config.js';
import { ApiMeta, ApiResponse, AppError } from '../lib/errors.js';
import { logEvent } from '../lib/logger.js';
import { validateAndRepairMetaDescription, checkAndRepairMetaDescription } from '../lib/metaGenerator.js';

export const generateRouter = Router();

// --------------------------------------------------------------------------
// POST /api/strategy
// --------------------------------------------------------------------------
const strategyReqSchema = z.union([
  z.object({ input: seoInputSchema }),
  seoInputSchema.transform((val) => ({ input: val }))
]);

generateRouter.post('/strategy', async (req: Request, res: Response, next) => {
  const startTime = performance.now();
  try {
    const parseRes = strategyReqSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        parseRes.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
        400
      );
    }

    const { input } = parseRes.data;
    const provider = getProvider();

    const renderedUser = renderPrompt(STAGE_1_STRATEGY.user, {
      topic: input.topic,
      audience: input.audience,
      industry: input.industry,
      market: input.market,
      primaryKeyword: input.primaryKeyword,
      intent: input.intent,
      tone: input.tone,
      language: input.language
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.LLM_TIMEOUT_MS);

    const callRes = await callProviderWithJsonValidation(
      provider,
      {
        system: STAGE_1_STRATEGY.system,
        user: renderedUser,
        maxTokens: 1200,
        temperature: config.LLM_TEMPERATURE
      },
      strategySchema,
      'Strategy',
      controller.signal
    ).finally(() => clearTimeout(timeoutId));

    const latencyMs = performance.now() - startTime;
    logEvent({
      route: '/api/strategy',
      stage: 'Strategy',
      status: 'SUCCESS',
      statusCode: 200,
      latencyMs,
      attempts: callRes.attempts,
      inputTokens: callRes.usage?.inputTokens,
      outputTokens: callRes.usage?.outputTokens
    });

    const repairResult = checkAndRepairMetaDescription(
      callRes.data.metaDescription,
      input.primaryKeyword,
      input.topic
    );
    const strategy = callRes.data;
    strategy.metaDescription = repairResult.text;

    const meta: ApiMeta = {
      provider: provider.name,
      model: config.LLM_MODEL,
      latencyMs: Math.round(latencyMs),
      attempts: callRes.attempts,
      mock: provider.name === 'mock',
      isMock: provider.name === 'mock',
      repaired: repairResult.wasRepaired,
      usage: callRes.usage
    };

    const response: ApiResponse<{ strategy: Strategy }> = {
      ok: true,
      data: { strategy },
      meta
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/outline
// --------------------------------------------------------------------------
const outlineReqSchema = z.object({
  input: seoInputSchema,
  strategy: strategySchema
});

generateRouter.post('/outline', async (req: Request, res: Response, next) => {
  const startTime = performance.now();
  try {
    const parseRes = outlineReqSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        parseRes.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
        400
      );
    }

    const { input, strategy } = parseRes.data;
    const provider = getProvider();

    const renderedUser = renderPrompt(STAGE_2_OUTLINE.user, {
      topic: input.topic,
      audience: input.audience,
      industry: input.industry,
      market: input.market,
      intent: input.intent,
      tone: input.tone,
      language: input.language,
      wordCount: input.wordCount,
      strategyJson: JSON.stringify(strategy)
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.LLM_TIMEOUT_MS);

    const callRes = await callProviderWithJsonValidation(
      provider,
      {
        system: STAGE_2_OUTLINE.system,
        user: renderedUser,
        maxTokens: 1500,
        temperature: config.LLM_TEMPERATURE
      },
      outlineSchema,
      'Outline',
      controller.signal
    ).finally(() => clearTimeout(timeoutId));

    const latencyMs = performance.now() - startTime;
    logEvent({
      route: '/api/outline',
      stage: 'Outline',
      status: 'SUCCESS',
      statusCode: 200,
      latencyMs,
      attempts: callRes.attempts,
      inputTokens: callRes.usage?.inputTokens,
      outputTokens: callRes.usage?.outputTokens
    });

    const meta: ApiMeta = {
      provider: provider.name,
      model: config.LLM_MODEL,
      latencyMs: Math.round(latencyMs),
      attempts: callRes.attempts,
      mock: provider.name === 'mock',
      isMock: provider.name === 'mock',
      usage: callRes.usage
    };

    const response: ApiResponse<{ outline: Outline }> = {
      ok: true,
      data: { outline: callRes.data },
      meta
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/article
// --------------------------------------------------------------------------
const articleReqSchema = z.object({
  input: seoInputSchema,
  strategy: strategySchema,
  outline: outlineSchema
});

generateRouter.post('/article', async (req: Request, res: Response, next) => {
  const startTime = performance.now();
  try {
    const parseRes = articleReqSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        parseRes.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
        400
      );
    }

    const { input, strategy, outline } = parseRes.data;
    const provider = getProvider();

    const renderedUser = renderPrompt(STAGE_3_ARTICLE.user, {
      topic: input.topic,
      audience: input.audience,
      industry: input.industry,
      market: input.market,
      primaryKeyword: input.primaryKeyword,
      intent: input.intent,
      tone: input.tone,
      language: input.language,
      wordCount: input.wordCount,
      strategyJson: JSON.stringify(strategy),
      outlineJson: JSON.stringify(outline)
    });

    // Token cap rule from Section D7: maxTokens = ceil(wordCount * 1.8) + 300
    const maxTokens = Math.ceil(input.wordCount * 1.8) + 300;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.LLM_TIMEOUT_MS);

    const expectedH1 = strategy.titles[0].text;
    const callRes = await callProviderWithMarkdownValidation(
      provider,
      {
        system: STAGE_3_ARTICLE.system,
        user: renderedUser,
        maxTokens,
        temperature: config.LLM_TEMPERATURE
      },
      expectedH1,
      'Article',
      controller.signal
    ).finally(() => clearTimeout(timeoutId));

    const latencyMs = performance.now() - startTime;
    logEvent({
      route: '/api/article',
      stage: 'Article',
      status: 'SUCCESS',
      statusCode: 200,
      latencyMs,
      attempts: callRes.attempts,
      inputTokens: callRes.usage?.inputTokens,
      outputTokens: callRes.usage?.outputTokens
    });

    const meta: ApiMeta = {
      provider: provider.name,
      model: config.LLM_MODEL,
      latencyMs: Math.round(latencyMs),
      attempts: callRes.attempts,
      mock: provider.name === 'mock',
      isMock: provider.name === 'mock',
      usage: callRes.usage
    };

    const response: ApiResponse<{ articleMarkdown: string }> = {
      ok: true,
      data: { articleMarkdown: callRes.text },
      meta
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});

// --------------------------------------------------------------------------
// POST /api/faqs
// --------------------------------------------------------------------------
const faqsReqSchema = z.object({
  input: seoInputSchema,
  strategy: strategySchema,
  outline: outlineSchema
});

generateRouter.post('/faqs', async (req: Request, res: Response, next) => {
  const startTime = performance.now();
  try {
    const parseRes = faqsReqSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        parseRes.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
        400
      );
    }

    const { input, strategy, outline } = parseRes.data;
    const provider = getProvider();

    const outlineHeadings = outline.sections
      .map((s) => `- ${s.h2}\n${s.h3.map((h) => `  - ${h}`).join('\n')}`)
      .join('\n');

    const renderedUser = renderPrompt(STAGE_4_FAQS.user, {
      topic: input.topic,
      audience: input.audience,
      market: input.market,
      primaryKeyword: input.primaryKeyword,
      intent: input.intent,
      tone: input.tone,
      language: input.language,
      strategyJson: JSON.stringify(strategy),
      outlineHeadings
    });

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.LLM_TIMEOUT_MS);

    const callRes = await callProviderWithJsonValidation(
      provider,
      {
        system: STAGE_4_FAQS.system,
        user: renderedUser,
        maxTokens: 1200,
        temperature: config.LLM_TEMPERATURE
      },
      faqsSchema,
      'FAQs',
      controller.signal
    ).finally(() => clearTimeout(timeoutId));

    const latencyMs = performance.now() - startTime;
    logEvent({
      route: '/api/faqs',
      stage: 'FAQs',
      status: 'SUCCESS',
      statusCode: 200,
      latencyMs,
      attempts: callRes.attempts,
      inputTokens: callRes.usage?.inputTokens,
      outputTokens: callRes.usage?.outputTokens
    });

    const meta: ApiMeta = {
      provider: provider.name,
      model: config.LLM_MODEL,
      latencyMs: Math.round(latencyMs),
      attempts: callRes.attempts,
      mock: provider.name === 'mock',
      isMock: provider.name === 'mock',
      usage: callRes.usage
    };

    const response: ApiResponse<{ faqs: typeof callRes.data.faqs }> = {
      ok: true,
      data: { faqs: callRes.data.faqs },
      meta
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});
