/**
 * Safe logger strictly adhering to Section A9 Rule 5:
 * "Logs contain only: timestamp, route, stage, status, latency, attempts, token counts.
 * Never log prompts, outputs or keys."
 */

export interface LogEntry {
  route: string;
  stage?: string;
  status: 'SUCCESS' | 'ERROR' | 'RETRY';
  statusCode?: number;
  latencyMs?: number;
  attempts?: number;
  inputTokens?: number;
  outputTokens?: number;
  errorCode?: string;
}

export function logEvent(entry: LogEntry): void {
  const payload = {
    timestamp: new Date().toISOString(),
    route: entry.route,
    stage: entry.stage || 'N/A',
    status: entry.status,
    statusCode: entry.statusCode,
    latencyMs: entry.latencyMs ? Math.round(entry.latencyMs) : undefined,
    attempts: entry.attempts || 1,
    tokens: entry.inputTokens || entry.outputTokens ? { in: entry.inputTokens, out: entry.outputTokens } : undefined,
    errorCode: entry.errorCode
  };

  console.log(JSON.stringify(payload));
}
