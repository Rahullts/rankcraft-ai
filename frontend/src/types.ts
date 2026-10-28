/**
 * Type definitions for RankCraft AI application.
 * Defines models for generation inputs, SEO content schemas, evaluation metrics,
 * and Prompt Lab comparison structures.
 */

export type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
export type ContentType = 'Comprehensive Guide' | 'How-To Tutorial' | 'Listicle / Best-Of' | 'Comparison & Review' | 'Thought Leadership';
export type WritingTone = 'Authoritative & Actionable' | 'Educational & Clear' | 'Conversational & Engaging' | 'Direct & Concise';
export type PromptMode = 'basic' | 'improved';

export interface GenerationInput {
  topic: string;
  target_audience: string;
  industry: string;
  target_country: string;
  primary_keyword: string;
  secondary_keywords: string;
  search_intent: SearchIntent;
  content_type: ContentType;
  tone: WritingTone;
  language: string;
  target_word_count: number;
  reference_material?: string;
  prompt_mode?: PromptMode;
}

export interface TitleRecommendation {
  title: string;
  explanation: string;
}

export interface KeywordAnalysis {
  keyword: string;
  placement_strategy: string;
  density_target: string;
}

export interface SearchIntentAnalysis {
  detected_intent: string;
  user_journey_stage: string;
  content_angle: string;
}

export interface OutlineItem {
  heading: string;
  level: 'H1' | 'H2' | 'H3';
  key_points: string[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface InternalLinkItem {
  anchor_text: string;
  target_concept: string;
  context_sentence: string;
}

export interface ChecklistItem {
  item: string;
  status: 'passed' | 'warning' | 'optimized';
  note: string;
}

export interface SeoContentResult {
  title_suggestions: string[];
  recommended_title: TitleRecommendation;
  meta_description: string;
  primary_keyword_analysis: KeywordAnalysis;
  secondary_keywords: string[];
  long_tail_keywords: string[];
  search_intent_analysis: SearchIntentAnalysis;
  article_outline: OutlineItem[];
  article_draft: string;
  faqs: FaqItem[];
  internal_linking: InternalLinkItem[];
  quality_checklist: ChecklistItem[];
  improvement_suggestions: string[];
}

export interface EvaluationCategoryScores {
  topic_relevance: number;
  search_intent_alignment: number;
  keyword_integration: number;
  readability: number;
  heading_structure: number;
  word_count_adherence: number;
  meta_description_optimization: number;
  content_completeness: number;
}

export interface EvaluationMetrics {
  draft_word_count: number;
  target_word_count: number;
  word_count_difference: number;
  meta_description_length: number;
  primary_keyword_count: number;
  keyword_density_percent: number;
  flesch_reading_ease: number;
  h1_count: number;
  h2_count: number;
  h3_count: number;
  faq_count: number;
  internal_links_count: number;
}

export interface ContentEvaluation {
  overall_score: number;
  letter_grade: string;
  category_scores: EvaluationCategoryScores;
  explanations: Record<string, string>;
  recommendations: Record<string, string>;
  metrics: EvaluationMetrics;
  evaluation_disclaimer: string;
}

export interface GenerationResponse {
  success: boolean;
  prompt_mode: PromptMode;
  prompt_used: string;
  is_demo_mode: boolean;
  content: SeoContentResult;
  evaluation: ContentEvaluation;
  error?: string;
}

export interface CategoryComparison {
  mode_a: number;
  mode_b: number;
  delta: number;
  pct_gain: number;
}

export interface PromptComparisonResult {
  overall_score_a: number;
  overall_score_b: number;
  overall_delta: number;
  percentage_improvement: number;
  grade_a: string;
  grade_b: string;
  category_comparison: Record<string, CategoryComparison>;
  academic_conclusion: string;
}

export interface PromptLabResponse {
  success: boolean;
  is_demo_mode: boolean;
  mode_a: {
    prompt: string;
    content: SeoContentResult;
    evaluation: ContentEvaluation;
  };
  mode_b: {
    prompt: string;
    content: SeoContentResult;
    evaluation: ContentEvaluation;
  };
  comparison: PromptComparisonResult;
  error?: string;
}

export interface PromptTechnique {
  name: string;
  description: string;
  academic_reference: string;
}

export interface HistoryItem {
  id: string;
  timestamp: string;
  inputs: GenerationInput;
  prompt_mode: PromptMode;
  result: SeoContentResult;
  evaluation: ContentEvaluation;
}
