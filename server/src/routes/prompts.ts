import { Router, Request, Response } from 'express';
import {
  PROMPT_VERSION,
  SIMPLE_PROMPT,
  STAGE_1_STRATEGY,
  STAGE_2_OUTLINE,
  STAGE_3_ARTICLE,
  STAGE_4_FAQS,
  RETRY_PROMPT
} from '../prompts/templates.js';
import { ApiResponse, ApiMeta } from '../lib/errors.js';
import { config } from '../config.js';

export const promptsRouter = Router();

promptsRouter.get('/prompts', (req: Request, res: Response) => {
  const meta: ApiMeta = {
    provider: config.LLM_PROVIDER,
    model: config.LLM_MODEL,
    latencyMs: 1,
    attempts: 1,
    mock: config.LLM_PROVIDER === 'mock',
    isMock: config.LLM_PROVIDER === 'mock'
  };

  const response: ApiResponse<{
    version: string;
    simple: typeof SIMPLE_PROMPT;
    stages: {
      strategy: typeof STAGE_1_STRATEGY;
      outline: typeof STAGE_2_OUTLINE;
      article: typeof STAGE_3_ARTICLE;
      faqs: typeof STAGE_4_FAQS;
    };
    retry: typeof RETRY_PROMPT;
    techniques: Array<{ id: string; name: string; definition: string; where: string; whatToLookFor: string }>;
    templates?: Array<{
      id: string;
      title: string;
      stage: string;
      techniques: string[];
      description: string;
      template: string;
    }>;
  }> = {
    ok: true,
    data: {
      version: PROMPT_VERSION,
      simple: SIMPLE_PROMPT,
      stages: {
        strategy: STAGE_1_STRATEGY,
        outline: STAGE_2_OUTLINE,
        article: STAGE_3_ARTICLE,
        faqs: STAGE_4_FAQS
      },
      retry: RETRY_PROMPT,
      techniques: [
        {
          id: 'role',
          name: 'Role Prompting',
          definition: 'Assigning a specific domain expert persona to activate domain knowledge.',
          where: 'System prompts of Stages 1, 2, 3, and 4.',
          whatToLookFor: 'Professional tone, strategic vocabulary, and avoidance of casual filler.'
        },
        {
          id: 'context',
          name: 'Context Prompting',
          definition: 'Providing delimited structured input parameters and search intent guidance.',
          where: '<context> and <intent_guidance> blocks in Stages 1 to 4.',
          whatToLookFor: 'High relevance to specific audience, industry nuances, and intent.'
        },
        {
          id: 'constraints',
          name: 'Explicit Constraints',
          definition: 'Numbered, measurable rules (length ranges, counts, forbidden topics).',
          where: 'Constraints sections in Stages 1 to 4.',
          whatToLookFor: 'Strict character limits, keyword density boundaries, no invented statistics.'
        },
        {
          id: 'few_shot',
          name: 'Few-Shot Examples',
          definition: 'One worked demonstration showing target formatting and style.',
          where: 'Example sections in Stages 1, 2, 4 and style sample in Stage 3.',
          whatToLookFor: 'Format compliance, fewer JSON errors, and sentence length discipline.'
        },
        {
          id: 'structured_output',
          name: 'Structured Output',
          definition: 'Enforcing JSON schemas or markdown heading contracts.',
          where: 'Output format definitions in Stages 1, 2, 4 and Stage 3 H1/H2/H3 contracts.',
          whatToLookFor: 'Clean parsing into discrete UI tabs without markdown code fence wrappers.'
        },
        {
          id: 'staged',
          name: 'Staged Prompting',
          definition: 'Decomposing complex generation into 4 sequential, dependent stages.',
          where: 'The 4-step generation pipeline (Strategy -> Outline -> Article -> FAQs).',
          whatToLookFor: 'Outline reflects strategy keywords; article follows outline headings verbatim.'
        }
      ],
      templates: [
        {
          id: STAGE_1_STRATEGY.id,
          title: STAGE_1_STRATEGY.name,
          stage: 'Stage 1',
          techniques: STAGE_1_STRATEGY.techniques,
          description: 'Produces 5 distinct titles (30-60 chars), 155-160 char meta description, and primary/secondary/long-tail keyword sets.',
          template: `SYSTEM:\n${STAGE_1_STRATEGY.system}\n\nUSER:\n${STAGE_1_STRATEGY.user}`
        },
        {
          id: STAGE_2_OUTLINE.id,
          title: STAGE_2_OUTLINE.name,
          stage: 'Stage 2',
          techniques: STAGE_2_OUTLINE.techniques,
          description: 'Constructs 4-7 topic-specific H2 sections with nested H3 subheadings, section purposes, and target word distributions.',
          template: `SYSTEM:\n${STAGE_2_OUTLINE.system}\n\nUSER:\n${STAGE_2_OUTLINE.user}`
        },
        {
          id: STAGE_3_ARTICLE.id,
          title: STAGE_3_ARTICLE.name,
          stage: 'Stage 3',
          techniques: STAGE_3_ARTICLE.techniques,
          description: 'Drafts comprehensive Markdown article conforming to the outline headings contract, primary keyword placement, and length bounds.',
          template: `SYSTEM:\n${STAGE_3_ARTICLE.system}\n\nUSER:\n${STAGE_3_ARTICLE.user}`
        },
        {
          id: STAGE_4_FAQS.id,
          title: STAGE_4_FAQS.name,
          stage: 'Stage 4',
          techniques: STAGE_4_FAQS.techniques,
          description: 'Generates exactly 5 concise, snippet-optimized FAQs (30-80 words each) answering core user search questions.',
          template: `SYSTEM:\n${STAGE_4_FAQS.system}\n\nUSER:\n${STAGE_4_FAQS.user}`
        },
        {
          id: SIMPLE_PROMPT.id,
          title: SIMPLE_PROMPT.name,
          stage: 'Baseline',
          techniques: [],
          description: 'Single-shot baseline prompt without role, constraints, or few-shot examples, used for empirical Prompt Lab comparison.',
          template: `USER:\n${SIMPLE_PROMPT.user}`
        }
      ]
    },
    meta
  };

  res.json(response);
});
