import { LlmProvider, LlmRequest, LlmResult } from './types.js';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';

export class OpenAiCompatibleProvider implements LlmProvider {
  public name = 'openai-compatible';

  async generate(req: LlmRequest, signal: AbortSignal): Promise<LlmResult> {
    const baseUrl = config.LLM_BASE_URL || 'https://api.openai.com/v1';
    const url = `${baseUrl.replace(/\/+$/, '')}/chat/completions`;

    const messages: Array<{ role: string; content: string }> = [];
    if (req.system && req.system.trim()) {
      messages.push({ role: 'system', content: req.system.trim() });
    }
    messages.push({ role: 'user', content: req.user });

    const tokenParam = config.LLM_MAX_TOKENS_PARAM || 'max_tokens';
    const body: Record<string, any> = {
      model: config.LLM_MODEL,
      messages,
      [tokenParam]: req.maxTokens
    };

    if (typeof req.temperature === 'number') {
      body.temperature = req.temperature;
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    if (config.LLM_API_KEY && config.LLM_API_KEY !== 'replace-me') {
      headers['Authorization'] = `Bearer ${config.LLM_API_KEY}`;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify(body),
        signal
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new AppError('PROVIDER_TIMEOUT', 'The model request timed out or was aborted.', 504, true);
      }
      throw new AppError('PROVIDER_ERROR', 'Network error connecting to OpenAI-compatible provider.', 502, true);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AppError('PROVIDER_AUTH_ERROR', 'Invalid API key or unauthorized access to model.', 502, false);
      }
      if (response.status === 429) {
        throw new AppError('PROVIDER_RATE_LIMITED', 'Rate limit or quota exceeded. Please wait and retry.', 429, true);
      }
      throw new AppError('PROVIDER_ERROR', `Provider returned HTTP ${response.status}`, 502, true);
    }

    const json: any = await response.json();
    const text = json?.choices?.[0]?.message?.content;
    if (!text || typeof text !== 'string') {
      throw new AppError('INVALID_MODEL_OUTPUT', 'Provider returned empty or malformed choice content.', 502, true);
    }

    return {
      text,
      usage: {
        inputTokens: json?.usage?.prompt_tokens,
        outputTokens: json?.usage?.completion_tokens
      }
    };
  }
}
