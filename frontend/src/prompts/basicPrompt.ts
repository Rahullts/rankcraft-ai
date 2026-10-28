/**
 * Mode A: Basic Prompt Template & Academic Metadata.
 * Demonstrates the baseline instruction without prompt engineering.
 */

import { GenerationInput } from '../types';

export const BASIC_PROMPT_INFO = {
  modeName: 'Mode A: Basic Baseline Prompt',
  tagline: 'Standard Unstructured Instruction (Novice Baseline)',
  description: 'Represents a conventional, un-engineered prompt that directly passes user inputs without persona framing, search intent grounding, negative constraints, or explicit boundary controls.',
  characteristics: [
    'No system persona or domain expertise assigned.',
    'No explicit search-intent differentiation.',
    'Lacks character count constraints on meta description.',
    'Lacks keyword density boundaries (vulnerable to under-utilization or keyword stuffing).',
    'Unenforced document schema leading to missing structural sections.',
    'No few-shot demonstrations or E-E-A-T quality guardrails.'
  ]
};

export function formatBasicPrompt(inputs: GenerationInput): string {
  const topic = inputs.topic || 'Digital Marketing';
  const primaryKw = inputs.primary_keyword || '';
  const tone = inputs.tone || 'Professional';
  const wordCount = inputs.target_word_count || 1000;
  const language = inputs.language || 'English';

  return `Write an SEO blog post about ${topic}.
Primary keyword: ${primaryKw}
Tone: ${tone}
Length: around ${wordCount} words.

CRITICAL LANGUAGE INSTRUCTION: Write the entire output strictly in ${language} (Default: English). All titles, meta description, outline, article, and FAQs must be in ${language}.

Give me titles, meta description, outline, article, keywords, and FAQs in JSON format.`;
}
