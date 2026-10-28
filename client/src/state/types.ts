import { RuleResult } from '../lib/evaluate';

export interface SeoInput {
  topic: string;
  audience: string;
  industry: string;
  market: string;
  primaryKeyword: string;
  intent: 'informational' | 'commercial' | 'transactional' | 'navigational';
  tone: 'professional' | 'friendly' | 'conversational' | 'authoritative' | 'persuasive' | 'educational';
  language: 'English' | 'Tamil' | 'Hindi' | 'Spanish' | 'French' | 'German';
  wordCount: number;
}

export interface TitleItem {
  text: string;
  angle: string;
}

export interface KeywordGroup {
  primary: string;
  secondary: string[];
  longTail: string[];
}

export interface StrategyData {
  titles: TitleItem[];
  metaDescription: string;
  keywords: KeywordGroup;
}

export interface OutlineSection {
  h2: string;
  h3: string[];
}

export interface OutlineData {
  sections: OutlineSection[];
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ApiMeta {
  durationMs?: number;
  latencyMs?: number;
  model: string;
  retries?: number;
  isMock: boolean;
  mock?: boolean;
  repaired?: boolean;
  provider?: string;
}

export type StageId = 'strategy' | 'outline' | 'article' | 'faqs' | 'checklist' | 'done';
export type StageStatus = 'pending' | 'running' | 'completed' | 'error';

export interface PackageRun {
  id: string;
  timestamp: string;
  input: SeoInput;
  strategy?: StrategyData;
  outline?: OutlineData;
  articleMarkdown?: string;
  faqs?: FaqItem[];
  evaluation?: {
    rules: RuleResult[];
    automatedPoints: number;
    applicableAutomatedMax: number;
    manualPoints: number;
    totalPoints: number;
    outlineFidelity?: { matched: number; total: number; percentage: number };
  };
  manualReview: {
    intentMatch?: number;
    toneAudienceFit?: number;
  };
  meta: {
    totalDurationMs: number;
    isMock: boolean;
    stages: Record<string, ApiMeta>;
  };
}

export interface SimpleRun {
  id: string;
  timestamp: string;
  input: SeoInput;
  articleMarkdown: string;
  evaluation?: {
    rules: RuleResult[];
    automatedPoints: number;
    applicableAutomatedMax: number;
    manualPoints: number;
    totalPoints: number;
  };
  manualReview: {
    intentMatch?: number;
    toneAudienceFit?: number;
  };
  meta: ApiMeta;
}

export interface ProviderHealth {
  status: string;
  provider: 'mock' | 'anthropic' | 'openai-compatible';
  model: string;
  configured: boolean;
  isMock?: boolean;
  mock?: boolean;
  message?: string;
}
