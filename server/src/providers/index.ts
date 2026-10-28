import { LlmProvider } from './types.js';
import { config, isProviderConfigured } from '../config.js';
import { MockProvider } from './mock.js';
import { AnthropicProvider } from './anthropic.js';
import { OpenAiCompatibleProvider } from './openaiCompatible.js';
import { AppError } from '../lib/errors.js';

let activeProvider: LlmProvider | null = null;

export function getProvider(): LlmProvider {
  if (activeProvider) {
    return activeProvider;
  }

  if (config.LLM_PROVIDER === 'mock') {
    activeProvider = new MockProvider();
    return activeProvider;
  }

  if (!isProviderConfigured()) {
    throw new AppError(
      'PROVIDER_NOT_CONFIGURED',
      'The AI provider is not configured on the server. Check server/.env.',
      503,
      false
    );
  }

  if (config.LLM_PROVIDER === 'anthropic') {
    activeProvider = new AnthropicProvider();
  } else if (config.LLM_PROVIDER === 'openai-compatible') {
    activeProvider = new OpenAiCompatibleProvider();
  } else {
    activeProvider = new MockProvider();
  }

  return activeProvider;
}
