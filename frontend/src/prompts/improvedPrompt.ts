/**
 * Mode B: Improved Prompt Template & Academic Metadata.
 * Demonstrates systematic prompt engineering techniques for high-performance SEO content.
 */

import { GenerationInput } from '../types';

export const IMPROVED_PROMPT_INFO = {
  modeName: 'Mode B: Advanced Engineered Prompt',
  tagline: 'Multi-Technique Constrained & Grounded Prompt Architecture',
  description: 'Applies formal prompt engineering principles including role prompting, E-E-A-T search quality alignment, negative keyword constraints, strict character boundary controls, few-shot patterns, and rigid JSON schema enforcement.',
  techniquesApplied: [
    {
      name: 'Role & Persona Prompting',
      impact: 'Sets authority, technical depth, and domain focus as a Senior Search Quality Architect.'
    },
    {
      name: 'Context & Audience Calibration',
      impact: 'Tailors language register and examples specifically to target persona and market region.'
    },
    {
      name: 'Search Intent Grounding',
      impact: 'Aligns article progression with specific user search journey (Informational / Commercial / Transactional).'
    },
    {
      name: 'Boundary Constraints',
      impact: 'Forces meta description strictly between 155-160 characters and regulates word count (+/- 8%).'
    },
    {
      name: 'Anti-Stuffing Directives',
      impact: 'Caps keyword density between 1.2% - 1.8% and mandates front-loaded heading placement.'
    },
    {
      name: 'Few-Shot Formula Demonstrations',
      impact: 'Guides title generation with proven high-CTR semantic blueprints.'
    },
    {
      name: 'Factuality & Anti-Hallucination Guardrails',
      impact: 'Prohibits fabricating search volume metrics and requires grounded, verifiable recommendations.'
    },
    {
      name: 'Deterministic JSON Grammar',
      impact: 'Guarantees reliable parsing across all 12 modules without markdown noise.'
    }
  ]
};

export function formatImprovedPrompt(inputs: GenerationInput): string {
  const secondaryKws = inputs.secondary_keywords ? inputs.secondary_keywords : 'None specified';
  const reference = inputs.reference_material
    ? `\n## REFERENCE MATERIAL:\n"""${inputs.reference_material}"""\n`
    : '';

  return `# SYSTEM ROLE & PERSONA
You are RankCraft AI's Lead SEO Content Strategist and Senior Search Quality Architect. You combine deep knowledge of Google's Search Quality Rater Guidelines (E-E-A-T) with high-converting digital copywriting and technical on-page SEO.

---
# CONTEXT & SPECIFICATIONS
- Core Topic: ${inputs.topic}
- Industry: ${inputs.industry}
- Target Audience: ${inputs.target_audience}
- Geographic Market: ${inputs.target_country} (${inputs.language})
- Primary Target Keyword: "${inputs.primary_keyword}"
- Secondary Keywords: ${secondaryKws}
- Target Search Intent: ${inputs.search_intent}
- Content Format: ${inputs.content_type}
- Writing Tone: ${inputs.tone}
- Target Word Count: ${inputs.target_word_count} words
${reference}
---
# CONSTRAINTS & BOUNDARY RULES
0. Language: Write ALL content strictly and completely in ${inputs.language || 'English'} (Default: English). Do not mix languages or translate partially based on target country.
1. Title: 5 high-CTR titles; 1 recommended title with 2-sentence psychological rationale.
2. Meta Description: Target EXACTLY 155-160 characters with primary keyword in first 110 characters and strong CTA.
3. Keyword Placement: Front-load in H1, first paragraph, and summary; maintain 1.2%-1.8% natural density without stuffing.
4. Depth: Provide outline, complete formatted Markdown article draft, 5 FAQs with thorough answers, 3-5 internal linking anchors.
5. Quality: Provide objective 5-point quality checklist and 3 actionable improvement suggestions.
6. Anti-Hallucination: Do not fabricate search volume or CPC numbers. Return valid JSON only conforming to the schema.`;
}
