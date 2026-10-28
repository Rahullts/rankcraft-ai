import { LlmProvider, LlmRequest, LlmResult } from './types.js';
import { config } from '../config.js';
import { AppError } from '../lib/errors.js';

export class AnthropicProvider implements LlmProvider {
  public name = 'anthropic';

  async generate(req: LlmRequest, signal: AbortSignal): Promise<LlmResult> {
    const baseUrl = config.LLM_BASE_URL || 'https://api.anthropic.com';
    const url = `${baseUrl.replace(/\/+$/, '')}/v1/messages`;

    const body: Record<string, any> = {
      model: config.LLM_MODEL,
      max_tokens: req.maxTokens,
      messages: [{ role: 'user', content: req.user }]
    };

    if (req.system && req.system.trim()) {
      body.system = req.system.trim();
    }

    if (typeof req.temperature === 'number') {
      body.temperature = req.temperature;
    }

    let response: Response;
    try {
      response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': config.LLM_API_KEY,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify(body),
        signal
      });
    } catch (err: any) {
      if (err.name === 'AbortError') {
        throw new AppError('PROVIDER_TIMEOUT', 'The model request timed out or was aborted.', 504, true);
      }
      throw new AppError('PROVIDER_ERROR', 'Network error connecting to Anthropic API.', 502, true);
    }

    if (!response.ok) {
      if (response.status === 401 || response.status === 403) {
        throw new AppError('PROVIDER_AUTH_ERROR', 'Invalid Anthropic API credentials.', 502, false);
      }
      if (response.status === 429) {
        throw new AppError('PROVIDER_RATE_LIMITED', 'Anthropic rate limit reached. Please wait and retry.', 429, true);
      }
      throw new AppError('PROVIDER_ERROR', `Anthropic API returned error HTTP ${response.status}`, 502, true);
    }

    const json: any = await response.json();
    const text = json?.content?.[0]?.text;
    if (!text || typeof text !== 'string') {
      throw new AppError('INVALID_MODEL_OUTPUT', 'Anthropic returned empty or malformed message content.', 502, true);
    }

    return {
      text,
      usage: {
        inputTokens: json?.usage?.input_tokens,
        outputTokens: json?.usage?.output_tokens
      }
    };
  }
}
