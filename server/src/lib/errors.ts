export type ErrorCode =
  | 'VALIDATION_ERROR'
  | 'PROVIDER_NOT_CONFIGURED'
  | 'PROVIDER_AUTH_ERROR'
  | 'PROVIDER_RATE_LIMITED'
  | 'RATE_LIMITED'
  | 'PROVIDER_TIMEOUT'
  | 'PROVIDER_ERROR'
  | 'INVALID_MODEL_OUTPUT'
  | 'INTERNAL';

export interface AppErrorPayload {
  code: ErrorCode;
  message: string;
  retryable: boolean;
  stage?: string;
}

export class AppError extends Error {
  public code: ErrorCode;
  public statusCode: number;
  public retryable: boolean;
  public stage?: string;

  constructor(code: ErrorCode, message: string, statusCode: number, retryable = false, stage?: string) {
    super(message);
    this.name = 'AppError';
    this.code = code;
    this.statusCode = statusCode;
    this.retryable = retryable;
    this.stage = stage;
  }
}

export interface ApiMeta {
  provider: string;
  model: string;
  latencyMs: number;
  attempts: number;
  mock: boolean;
  usage?: {
    inputTokens?: number;
    outputTokens?: number;
  };
}

export interface ApiResponse<T> {
  ok: true;
  data: T;
  meta: ApiMeta;
}

export interface ApiErrorResponse {
  ok: false;
  error: AppErrorPayload;
}
