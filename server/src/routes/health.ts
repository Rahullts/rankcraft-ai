import { Router, Request, Response } from 'express';
import { config, isProviderConfigured } from '../config.js';
import { ApiMeta, ApiResponse } from '../lib/errors.js';

export const healthRouter = Router();

healthRouter.get('/health', (req: Request, res: Response) => {
  const configured = isProviderConfigured();
  const isMock = config.LLM_PROVIDER === 'mock';

  const meta: ApiMeta = {
    provider: config.LLM_PROVIDER,
    model: config.LLM_MODEL,
    latencyMs: 1,
    attempts: 1,
    mock: isMock,
    isMock: isMock
  };

  const response: ApiResponse<{
    configured: boolean;
    provider: string;
    model: string;
    mock: boolean;
  }> = {
    ok: true,
    data: {
      configured,
      provider: config.LLM_PROVIDER,
      model: config.LLM_MODEL,
      mock: isMock
    },
    meta
  };

  res.json(response);
});
