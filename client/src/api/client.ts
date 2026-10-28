import {
  SeoInput,
  StrategyData,
  OutlineData,
  FaqItem,
  ApiMeta,
  ProviderHealth
} from '../state/types';

export interface ApiResponse<T> {
  ok: boolean;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorResponse {
  ok: false;
  error: {
    code: string;
    message: string;
    details?: unknown;
  };
}

async function request<T>(
  url: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    }
  });

  const body = await response.json();

  if (!response.ok || !body.ok) {
    const errorBody = body as ApiErrorResponse;
    const msg = errorBody.error?.message || `Request failed with status ${response.status}`;
    const err = new Error(msg);
    (err as unknown as { code: string }).code = errorBody.error?.code || 'SERVER_ERROR';
    throw err;
  }

  return body as ApiResponse<T>;
}

export const api = {
  async getHealth(signal?: AbortSignal): Promise<ProviderHealth> {
    const res = await fetch('/api/health', { signal });
    const json = await res.json();
    const data = json.data || {};
    return {
      status: data.configured ? 'ready' : 'unconfigured',
      provider: data.provider || 'mock',
      model: data.model || 'mock-model',
      configured: !!data.configured,
      isMock: data.provider === 'mock' || !!data.mock,
      mock: data.provider === 'mock' || !!data.mock
    };
  },

  async getPrompts(signal?: AbortSignal): Promise<Array<{
    id: string;
    title: string;
    stage: string;
    techniques: string[];
    description: string;
    template: string;
  }>> {
    const res = await fetch('/api/prompts', { signal });
    const json = await res.json();
    return json.data?.templates || json.templates || [];
  },

  async generateStrategy(
    input: SeoInput,
    signal?: AbortSignal
  ): Promise<ApiResponse<StrategyData>> {
    const res = await request<{ strategy: StrategyData }>('/api/strategy', {
      method: 'POST',
      body: JSON.stringify({ input }),
      signal
    });
    return {
      ok: res.ok,
      data: res.data.strategy,
      meta: res.meta
    };
  },

  async generateOutline(
    input: SeoInput,
    strategy: StrategyData,
    signal?: AbortSignal
  ): Promise<ApiResponse<OutlineData>> {
    const res = await request<{ outline: OutlineData }>('/api/outline', {
      method: 'POST',
      body: JSON.stringify({ input, strategy }),
      signal
    });
    return {
      ok: res.ok,
      data: res.data.outline,
      meta: res.meta
    };
  },

  async generateArticle(
    input: SeoInput,
    strategy: StrategyData,
    outline: OutlineData,
    signal?: AbortSignal
  ): Promise<ApiResponse<{ markdown: string }>> {
    const res = await request<{ articleMarkdown: string }>('/api/article', {
      method: 'POST',
      body: JSON.stringify({ input, strategy, outline }),
      signal
    });
    return {
      ok: res.ok,
      data: { markdown: res.data.articleMarkdown },
      meta: res.meta
    };
  },

  async generateFaqs(
    input: SeoInput,
    strategy: StrategyData,
    outline: OutlineData,
    signal?: AbortSignal
  ): Promise<ApiResponse<{ faqs: FaqItem[] }>> {
    const res = await request<{ faqs: FaqItem[] }>('/api/faqs', {
      method: 'POST',
      body: JSON.stringify({ input, strategy, outline }),
      signal
    });
    return {
      ok: res.ok,
      data: { faqs: res.data.faqs },
      meta: res.meta
    };
  },

  async generateSimple(
    input: SeoInput,
    signal?: AbortSignal
  ): Promise<ApiResponse<{ markdown: string; promptUsed: string }>> {
    const res = await request<{ text: string; promptUsed: string }>('/api/simple', {
      method: 'POST',
      body: JSON.stringify({ input }),
      signal
    });
    return {
      ok: res.ok,
      data: { markdown: res.data.text, promptUsed: res.data.promptUsed },
      meta: res.meta
    };
  }
};
