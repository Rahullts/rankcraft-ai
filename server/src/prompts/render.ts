import { INTENT_GUIDANCE } from './templates.js';

export function renderPrompt(
  template: string,
  variables: Record<string, string | number | undefined>
): string {
  // Populate computed helpers if intent or wordCount exist
  const enriched: Record<string, string> = {};

  for (const [key, val] of Object.entries(variables)) {
    if (val !== undefined && val !== null) {
      enriched[key] = String(val).trim();
    }
  }

  if (variables.intent && typeof variables.intent === 'string' && !enriched.intentGuidance) {
    enriched.intentGuidance = INTENT_GUIDANCE[variables.intent.toLowerCase()] || '';
  }

  if (variables.wordCount && typeof variables.wordCount === 'number') {
    const total = variables.wordCount;
    const intro = Math.round(total * 0.1);
    const body = total - intro;
    if (!enriched.introWords) enriched.introWords = String(intro);
    if (!enriched.bodyWords) enriched.bodyWords = String(body);
  }

  let result = template;
  for (const [key, val] of Object.entries(enriched)) {
    const regex = new RegExp(`\\{\\{\\s*${key}\\s*\\}\\}`, 'g');
    result = result.replace(regex, val);
  }

  // Section E3 rule: The renderer must throw if any {{ remains after substitution
  const remaining = result.match(/\{\{([a-zA-Z0-9_]+)\}\}/);
  if (remaining) {
    throw new Error(`Unresolved prompt variable: {{${remaining[1]}}}`);
  }

  return result.trim();
}
