import { Router, Request, Response } from 'express';
import { z } from 'zod';
import { seoInputSchema } from '../schemas/input.js';
import { SIMPLE_PROMPT } from '../prompts/templates.js';
import { renderPrompt } from '../prompts/render.js';
import { getProvider } from '../providers/index.js';
import { config } from '../config.js';
import { ApiMeta, ApiResponse, AppError } from '../lib/errors.js';
import { logEvent } from '../lib/logger.js';

export const simpleRouter = Router();

const simpleReqSchema = z.union([
  z.object({ input: seoInputSchema }),
  seoInputSchema.transform((val) => ({ input: val }))
]);

simpleRouter.post('/simple', async (req: Request, res: Response, next) => {
  const startTime = performance.now();
  try {
    const parseRes = simpleReqSchema.safeParse(req.body);
    if (!parseRes.success) {
      throw new AppError(
        'VALIDATION_ERROR',
        parseRes.error.issues.map((i) => `${i.path.join('.')}: ${i.message}`).join(', '),
        400
      );
    }

    const { input } = parseRes.data;
    const provider = getProvider();

    const renderedPrompt = renderPrompt(SIMPLE_PROMPT.user, {
      topic: input.topic,
      audience: input.audience,
      industry: input.industry,
      market: input.market,
      primaryKeyword: input.primaryKeyword,
      intent: input.intent,
      tone: input.tone,
      language: input.language,
      wordCount: input.wordCount
    });

    const maxTokens = Math.ceil(input.wordCount * 1.8) + 300;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), config.LLM_TIMEOUT_MS);

    const callRes = await provider
      .generate(
        {
          system: '',
          user: renderedPrompt,
          maxTokens,
          temperature: config.LLM_TEMPERATURE
        },
        controller.signal
      )
      .finally(() => clearTimeout(timeoutId));

    const latencyMs = performance.now() - startTime;
    logEvent({
      route: '/api/simple',
      stage: 'SimpleBaseline',
      status: 'SUCCESS',
      statusCode: 200,
      latencyMs,
      attempts: 1,
      inputTokens: callRes.usage?.inputTokens,
      outputTokens: callRes.usage?.outputTokens
    });

    const meta: ApiMeta = {
      provider: provider.name,
      model: config.LLM_MODEL,
      latencyMs: Math.round(latencyMs),
      attempts: 1,
      mock: provider.name === 'mock',
      isMock: provider.name === 'mock',
      usage: callRes.usage
    };

    const response: ApiResponse<{ text: string; promptUsed: string }> = {
      ok: true,
      data: {
        text: callRes.text,
        promptUsed: renderedPrompt
      },
      meta
    };

    res.json(response);
  } catch (err) {
    next(err);
  }
});
