export interface LlmRequest {
  system: string;
  user: string;
  maxTokens: number;
  temperature?: number;
}

export interface LlmResult {
  text: string;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface LlmProvider {
  name: string;
  generate(req: LlmRequest, signal: AbortSignal): Promise<LlmResult>;
}
