import { z } from 'zod';
import { LlmProvider, LlmRequest, LlmResult } from '../providers/types.js';
import { AppError } from './errors.js';
import { RETRY_PROMPT } from '../prompts/templates.js';
import { renderPrompt } from '../prompts/render.js';

export function extractJsonString(rawText: string): string {
  let text = rawText.trim();

  // Strip leading ``` or ```json lines and trailing ``` lines
  text = text.replace(/^```(?:json)?\s*\n?/i, '');
  text = text.replace(/\n?```\s*$/i, '');
  text = text.trim();

  // If text does not start with '{', slice from first '{' to last '}'
  if (!text.startsWith('{')) {
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');
    if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
      text = text.substring(firstBrace, lastBrace + 1);
    }
  }

  return text;
}

export interface JsonCallResult<T> {
  data: T;
  attempts: number;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export async function callProviderWithJsonValidation<T>(
  provider: LlmProvider,
  req: LlmRequest,
  schema: z.ZodType<T, any, any>,
  stageName: string,
  signal: AbortSignal
): Promise<JsonCallResult<T>> {
  let attempts = 1;
  const initialResult = await provider.generate(req, signal);

  let totalInputTokens = initialResult.usage?.inputTokens || 0;
  let totalOutputTokens = initialResult.usage?.outputTokens || 0;

  const tryParse = (text: string) => {
    try {
      const cleaned = extractJsonString(text);
      const parsed = JSON.parse(cleaned);
      return schema.safeParse(parsed);
    } catch (err: any) {
      return { success: false as const, error: err };
    }
  };

  const firstAttempt = tryParse(initialResult.text);
  if (firstAttempt.success) {
    return {
      data: firstAttempt.data,
      attempts: 1,
      usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
    };
  }

  // First attempt failed. Attempt one retry using E6 Retry template.
  attempts = 2;
  const issues =
    'error' in firstAttempt && firstAttempt.error?.issues
      ? firstAttempt.error.issues.map((i: any) => `${i.path.join('.')}: ${i.message}`).join('; ')
      : 'Invalid JSON format or missing required keys';

  const retryUserPrompt = renderPrompt(RETRY_PROMPT.user, {
    issues,
    previousOutput: initialResult.text.slice(0, 1000)
  });

  const retryReq: LlmRequest = {
    system: req.system,
    user: retryUserPrompt,
    maxTokens: req.maxTokens,
    temperature: req.temperature
  };

  const retryResult = await provider.generate(retryReq, signal);
  totalInputTokens += retryResult.usage?.inputTokens || 0;
  totalOutputTokens += retryResult.usage?.outputTokens || 0;

  const secondAttempt = tryParse(retryResult.text);
  if (secondAttempt.success) {
    return {
      data: secondAttempt.data,
      attempts: 2,
      usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
    };
  }

  // Failed twice. Return INVALID_MODEL_OUTPUT with stage set.
  throw new AppError(
    'INVALID_MODEL_OUTPUT',
    `The model returned output that failed validation twice in ${stageName}.`,
    502,
    true,
    stageName
  );
}

import { countWords } from './text.js';
import { calibrateArticleWordCount } from './articleGenerator.js';

export interface MarkdownCallResult {
  text: string;
  attempts: number;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export async function callProviderWithMarkdownValidation(
  provider: LlmProvider,
  req: LlmRequest,
  expectedH1: string,
  stageName: string,
  signal: AbortSignal,
  targetWords?: number
): Promise<MarkdownCallResult> {
  let attempts = 1;
  const initialResult = await provider.generate(req, signal);

  let totalInputTokens = initialResult.usage?.inputTokens || 0;
  let totalOutputTokens = initialResult.usage?.outputTokens || 0;

  const validateMarkdown = (text: string): { valid: boolean; reason?: string } => {
    if (!text || !text.trim()) {
      return { valid: false, reason: 'Article output is empty.' };
    }
    const lines = text.trim().split('\n').map((l) => l.trim());
    const h1Line = lines.find((l) => l.startsWith('# '));
    if (!h1Line) {
      return { valid: false, reason: 'Missing top-level H1 heading (# ...).' };
    }
    const h2Count = lines.filter((l) => l.startsWith('## ')).length;
    if (h2Count < 4) {
      return { valid: false, reason: `Article must contain at least 4 H2 headings (found ${h2Count}).` };
    }
    if (targetWords) {
      const words = countWords(text);
      const diffPct = Math.abs(words - targetWords) / targetWords;
      if (diffPct > 0.25) {
        return {
          valid: false,
          reason: `Article word count is ${words} words, which differs significantly from target of ${targetWords} words (must be within 10% tolerance).`
        };
      }
    }
    return { valid: true };
  };

  const firstCheck = validateMarkdown(initialResult.text);
  if (firstCheck.valid) {
    let finalOutput = initialResult.text.trim();
    if (targetWords) {
      finalOutput = calibrateArticleWordCount(finalOutput, targetWords);
    }
    return {
      text: finalOutput,
      attempts: 1,
      usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
    };
  }

  // Retry once with specific problem stated
  attempts = 2;
  const retryUserPrompt = `Your previous article output failed validation.
Problem: ${firstCheck.reason}
H1 must start with: # ${expectedH1}
${targetWords ? `Target word count: exactly around ${targetWords} words (within 10% tolerance, between ${Math.round(targetWords * 0.9)} and ${Math.round(targetWords * 1.1)} words).\n` : ''}Provide the complete, corrected article in Markdown matching all original constraints.`;

  const retryReq: LlmRequest = {
    system: req.system,
    user: retryUserPrompt,
    maxTokens: req.maxTokens,
    temperature: req.temperature
  };

  const retryResult = await provider.generate(retryReq, signal);
  totalInputTokens += retryResult.usage?.inputTokens || 0;
  totalOutputTokens += retryResult.usage?.outputTokens || 0;

  const secondCheck = validateMarkdown(retryResult.text);
  if (secondCheck.valid) {
    let finalOutput = retryResult.text.trim();
    if (targetWords) {
      finalOutput = calibrateArticleWordCount(finalOutput, targetWords);
    }
    return {
      text: finalOutput,
      attempts: 2,
      usage: { inputTokens: totalInputTokens, outputTokens: totalOutputTokens }
    };
  }

  throw new AppError(
    'INVALID_MODEL_OUTPUT',
    `The model returned Markdown that failed validation twice in ${stageName}: ${secondCheck.reason}`,
    502,
    true,
    stageName
  );
}
