import { z } from 'zod';

const envSchema = z.object({
  PORT: z.coerce.number().default(8787),
  CLIENT_ORIGIN: z.string().default('http://localhost:5173'),
  LLM_PROVIDER: z.enum(['anthropic', 'openai-compatible', 'mock']).default('mock'),
  LLM_API_KEY: z.string().optional().default(''),
  LLM_MODEL: z.string().optional().default('mock-model'),
  LLM_BASE_URL: z.string().optional().default('https://api.openai.com/v1'),
  LLM_TEMPERATURE: z.coerce.number().optional().default(0.5),
  LLM_MAX_TOKENS_PARAM: z.enum(['max_tokens', 'max_completion_tokens']).default('max_tokens'),
  LLM_TIMEOUT_MS: z.coerce.number().default(90000),
  RATE_LIMIT_PER_MIN: z.coerce.number().default(120)
});

const parsed = envSchema.safeParse(process.env);

export const config = parsed.success
  ? parsed.data
  : {
      PORT: 8787,
      CLIENT_ORIGIN: 'http://localhost:5173',
      LLM_PROVIDER: 'mock' as const,
      LLM_API_KEY: '',
      LLM_MODEL: 'mock-model',
      LLM_BASE_URL: 'https://api.openai.com/v1',
      LLM_TEMPERATURE: 0.5,
      LLM_MAX_TOKENS_PARAM: 'max_tokens' as const,
      LLM_TIMEOUT_MS: 90000,
      RATE_LIMIT_PER_MIN: 120
    };

// Checks whether the chosen provider has the required configuration
export function isProviderConfigured(): boolean {
  if (config.LLM_PROVIDER === 'mock') {
    return true;
  }
  if (!config.LLM_API_KEY || config.LLM_API_KEY === 'replace-me') {
    return false;
  }
  if (!config.LLM_MODEL || config.LLM_MODEL === 'your-model-name') {
    return false;
  }
  if (config.LLM_PROVIDER === 'openai-compatible' && !config.LLM_BASE_URL) {
    return false;
  }
  return true;
}
