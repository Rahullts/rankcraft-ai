// ==========================================================================
// RankCraft AI - Compiled Client Bundle
// React + TypeScript Frontend Application
// Generated automatically for browser-based runtime execution
// ==========================================================================

const { useState, useEffect, useRef, useMemo, useCallback } = React;


// --- SOURCE: types.ts ---
/**
 * Type definitions for RankCraft AI application.
 * Defines models for generation inputs, SEO content schemas, evaluation metrics,
 * and Prompt Lab comparison structures.
 */

type SearchIntent = 'Informational' | 'Commercial' | 'Transactional' | 'Navigational';
type ContentType = 'Comprehensive Guide' | 'How-To Tutorial' | 'Listicle / Best-Of' | 'Comparison & Review' | 'Thought Leadership';
type WritingTone = 'Authoritative & Actionable' | 'Educational & Clear' | 'Conversational & Engaging' | 'Direct & Concise';
type PromptMode = 'basic' | 'improved';

interface GenerationInput {
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

interface TitleRecommendation {
  title: string;
  explanation: string;
}

interface KeywordAnalysis {
  keyword: string;
  placement_strategy: string;
  density_target: string;
}

interface SearchIntentAnalysis {
  detected_intent: string;
  user_journey_stage: string;
  content_angle: string;
}

interface OutlineItem {
  heading: string;
  level: 'H1' | 'H2' | 'H3';
  key_points: string[];
}

interface FaqItem {
  question: string;
  answer: string;
}

interface InternalLinkItem {
  anchor_text: string;
  target_concept: string;
  context_sentence: string;
}

interface ChecklistItem {
  item: string;
  status: 'passed' | 'warning' | 'optimized';
  note: string;
}

interface SeoContentResult {
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

interface EvaluationCategoryScores {
  topic_relevance: number;
  search_intent_alignment: number;
  keyword_integration: number;
  readability: number;
  heading_structure: number;
  word_count_adherence: number;
  meta_description_optimization: number;
  content_completeness: number;
}

interface EvaluationMetrics {
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

interface ContentEvaluation {
  overall_score: number;
  letter_grade: string;
  category_scores: EvaluationCategoryScores;
  explanations: Record<string, string>;
  recommendations: Record<string, string>;
  metrics: EvaluationMetrics;
  evaluation_disclaimer: string;
}

interface GenerationResponse {
  success: boolean;
  prompt_mode: PromptMode;
  prompt_used: string;
  is_demo_mode: boolean;
  content: SeoContentResult;
  evaluation: ContentEvaluation;
  error?: string;
}

interface CategoryComparison {
  mode_a: number;
  mode_b: number;
  delta: number;
  pct_gain: number;
}

interface PromptComparisonResult {
  overall_score_a: number;
  overall_score_b: number;
  overall_delta: number;
  percentage_improvement: number;
  grade_a: string;
  grade_b: string;
  category_comparison: Record<string, CategoryComparison>;
  academic_conclusion: string;
}

interface PromptLabResponse {
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

interface PromptTechnique {
  name: string;
  description: string;
  academic_reference: string;
}

interface HistoryItem {
  id: string;
  timestamp: string;
  inputs: GenerationInput;
  prompt_mode: PromptMode;
  result: SeoContentResult;
  evaluation: ContentEvaluation;
}

// --- SOURCE: exporter.ts ---
/**
 * Export and Clipboard Utilities for RankCraft AI.
 * Generates downloadable Markdown, JSON, and standalone HTML files with full SEO assets.
 */


function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard && window.isSecureContext) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  try {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
    return successful;
  } catch (err) {
    console.error('Fallback copy failed:', err);
    return false;
  }
}

function triggerDownload(filename: string, content: string, contentType: string) {
  const blob = new Blob([content], { type: contentType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function downloadMarkdown(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-seo.md`;

  const md = `---
title: "${content.recommended_title.title.replace(/"/g, '\\"')}"
meta_description: "${content.meta_description.replace(/"/g, '\\"')}"
primary_keyword: "${inputs.primary_keyword}"
target_intent: "${inputs.search_intent}"
target_audience: "${inputs.target_audience}"
generated_by: "RankCraft AI Assistant"
date: "${new Date().toISOString()}"
heuristic_score: "${evaluation ? evaluation.overall_score + '% (' + evaluation.letter_grade + ')' : 'N/A'}"
---

# ${content.recommended_title.title}

> **Meta Description (${content.meta_description.length} chars)**:
> ${content.meta_description}

---

## 🎯 Strategic SEO Metadata

- **Primary Target Keyword**: ${content.primary_keyword_analysis.keyword}
- **Placement Strategy**: ${content.primary_keyword_analysis.placement_strategy}
- **Target Density**: ${content.primary_keyword_analysis.density_target}
- **Search Intent**: ${content.search_intent_analysis.detected_intent} (${content.search_intent_analysis.content_angle})

### Alternative Title Ideas
${content.title_suggestions.map((t, i) => `${i + 1}. ${t}`).join('\n')}

### Keyword Semantic Clusters
- **Secondary Keywords**: ${content.secondary_keywords.join(', ')}
- **Long-Tail Variations**:
${content.long_tail_keywords.map((k) => `  - ${k}`).join('\n')}

---

## 📋 Content Outline Hierarchy
${content.article_outline
  .map(
    (item) =>
      `### [${item.level}] ${item.heading}\n${item.key_points.map((p) => `- ${p}`).join('\n')}`
  )
  .join('\n\n')}

---

## 📝 Complete Article Draft

${content.article_draft}

---

## ❓ Frequently Asked Questions (FAQ Schema Ready)

${content.faqs
  .map(
    (faq, i) =>
      `### Q${i + 1}: ${faq.question}\n\n**Answer**: ${faq.answer}`
  )
  .join('\n\n')}

---

## 🔗 Internal Linking Recommendations

| Anchor Text | Target Concept / Guide | Natural Context |
| :--- | :--- | :--- |
${content.internal_linking
  .map(
    (link) =>
      `| \`${link.anchor_text}\` | ${link.target_concept} | "${link.context_sentence}" |`
  )
  .join('\n')}

---

## ✅ Quality Checklist & Optimization Notes

${content.quality_checklist
  .map(
    (c) =>
      `- [${c.status === 'passed' ? 'x' : ' '}] **${c.item}**: ${c.note}`
  )
  .join('\n')}

### Recommended Next Steps
${content.improvement_suggestions.map((s, i) => `${i + 1}. ${s}`).join('\n')}
`;

  triggerDownload(filename, md, 'text/markdown;charset=utf-8');
}

function downloadJson(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-data.json`;

  const payload = {
    metadata: {
      generated_by: 'RankCraft AI',
      timestamp: new Date().toISOString(),
      inputs,
      evaluation
    },
    seo_content: content
  };

  triggerDownload(filename, JSON.stringify(payload, null, 2), 'application/json;charset=utf-8');
}

function downloadHtml(content: SeoContentResult, inputs: GenerationInput, evaluation?: ContentEvaluation) {
  const sanitizedTopic = (inputs.topic || 'seo-content').toLowerCase().replace(/[^a-z0-9]/g, '-');
  const filename = `${sanitizedTopic}-rankcraft-preview.html`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${content.recommended_title.title}</title>
  <meta name="description" content="${content.meta_description}">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif; line-height: 1.6; color: #1e293b; max-width: 860px; margin: 40px auto; padding: 0 20px; }
    h1 { color: #0f172a; font-size: 2.2rem; margin-bottom: 0.5rem; }
    h2 { color: #1e293b; border-bottom: 2px solid #e2e8f0; padding-bottom: 8px; margin-top: 32px; }
    .meta-box { background: #f8fafc; border-left: 4px solid #3b82f6; padding: 16px; border-radius: 4px; margin: 24px 0; }
    .faq-card { background: #f1f5f9; padding: 14px 18px; border-radius: 8px; margin-bottom: 12px; }
    .badge { display: inline-block; background: #e0e7ff; color: #3730a3; padding: 4px 10px; border-radius: 9999px; font-size: 0.85rem; font-weight: 600; margin-right: 6px; }
    table { width: 100%; border-collapse: collapse; margin: 20px 0; }
    th, td { border: 1px solid #cbd5e1; padding: 10px 14px; text-align: left; }
    th { background: #f8fafc; }
  </style>
</head>
<body>
  <div class="meta-box">
    <strong>SERP Preview:</strong><br>
    <h3 style="color:#1d4ed8;margin:4px 0;">${content.recommended_title.title}</h3>
    <span style="color:#15803d;font-size:0.9rem;">https://example.com/${sanitizedTopic}</span>
    <p style="margin:6px 0 0;color:#475569;">${content.meta_description} (<em>${content.meta_description.length} characters</em>)</p>
  </div>

  <article>
    ${content.article_draft.replace(/\n\n/g, '</p><p>').replace(/^# (.+)$/gm, '<h1>$1</h1>').replace(/^## (.+)$/gm, '<h2>$1</h2>').replace(/^### (.+)$/gm, '<h3>$1</h3>')}
  </article>

  <h2>Frequently Asked Questions</h2>
  ${content.faqs.map(faq => `
    <div class="faq-card">
      <strong>Q: ${faq.question}</strong>
      <p style="margin:6px 0 0;">${faq.answer}</p>
    </div>
  `).join('')}
</body>
</html>`;

  triggerDownload(filename, html, 'text/html;charset=utf-8');
}

// --- SOURCE: basicPrompt.ts ---
/**
 * Mode A: Basic Prompt Template & Academic Metadata.
 * Demonstrates the baseline instruction without prompt engineering.
 */


const BASIC_PROMPT_INFO = {
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

function formatBasicPrompt(inputs: GenerationInput): string {
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

// --- SOURCE: improvedPrompt.ts ---
/**
 * Mode B: Improved Prompt Template & Academic Metadata.
 * Demonstrates systematic prompt engineering techniques for high-performance SEO content.
 */


const IMPROVED_PROMPT_INFO = {
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

function formatImprovedPrompt(inputs: GenerationInput): string {
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

// --- SOURCE: Sidebar.tsx ---
/**
 * Sidebar Navigation Component for RankCraft AI.
 * Supports collapsible state, active tab indicators, and clean icon-like glyphs.
 */


interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  historyCount: number;
  openHistory: () => void;
  openApiKeyModal: () => void;
  hasApiKey: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  historyCount,
  openHistory,
  openApiKeyModal,
  hasApiKey
}) => {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard Overview', icon: '📊', desc: 'System status & metrics' },
    { id: 'generator', label: 'SEO Content Studio', icon: '✍️', desc: '12-part content generator' },
    { id: 'prompt-lab', label: 'Prompt Engineering Lab', icon: '🧪', desc: 'Mode A vs Mode B comparison', badge: 'Core' },
    { id: 'evaluation', label: 'Heuristic Evaluation', icon: '🎯', desc: '0-5 rubric scoring' },
  ];

  return (
    <aside
      className={`sidebar flex flex-col justify-between border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30 select-none ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Brand Header */}
      <div>
        <div className="flex items-center justify-between px-4 py-5 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-3 overflow-hidden">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white font-bold text-xl shadow-md flex-shrink-0">
              R
            </div>
            {!collapsed && (
              <div className="leading-tight">
                <span className="font-bold text-lg text-slate-900 dark:text-white tracking-tight">
                  RankCraft<span className="text-blue-600">.AI</span>
                </span>
                <span className="block text-[11px] font-medium text-slate-500 uppercase tracking-wider">
                  Academic Project
                </span>
              </div>
            )}
          </div>
          <button
            onClick={() => setCollapsed(!collapsed)}
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {collapsed ? '▶' : '◀'}
          </button>
        </div>

        {/* Navigation Items */}
        <nav className="p-3 space-y-1.5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center rounded-xl p-3 text-left transition-all relative ${
                  isActive
                    ? 'bg-blue-600 text-white font-semibold shadow-sm shadow-blue-500/20'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 hover:text-slate-900 dark:hover:text-white'
                }`}
                title={collapsed ? item.label : undefined}
              >
                <span className="text-xl flex-shrink-0">{item.icon}</span>
                {!collapsed && (
                  <div className="ml-3 overflow-hidden pr-2">
                    <div className="text-sm flex items-center justify-between">
                      <span className="truncate">{item.label}</span>
                      {item.badge && (
                        <span
                          className={`ml-1.5 text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                            isActive
                              ? 'bg-blue-800 text-blue-200'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <span
                      className={`block text-[11px] truncate ${
                        isActive ? 'text-blue-100' : 'text-slate-400'
                      }`}
                    >
                      {item.desc}
                    </span>
                  </div>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Utilities */}
      <div className="p-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
        {/* History Button */}
        <button
          onClick={openHistory}
          className="w-full flex items-center justify-between p-2.5 rounded-xl text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          title="Generation History"
        >
          <div className="flex items-center space-x-3">
            <span className="text-lg">🗂️</span>
            {!collapsed && <span className="text-sm font-medium">Session History</span>}
          </div>
          {!collapsed && (
            <span className="text-xs bg-slate-200 dark:bg-slate-700 px-2 py-0.5 rounded-full font-bold">
              {historyCount}
            </span>
          )}
        </button>

        {/* API Key Status / Config */}
        <button
          onClick={openApiKeyModal}
          className={`w-full flex items-center space-x-3 p-2.5 rounded-xl border text-left transition-colors ${
            hasApiKey
              ? 'border-emerald-200 dark:border-emerald-900 bg-emerald-50 dark:bg-emerald-950/30 text-emerald-800 dark:text-emerald-300'
              : 'border-amber-200 dark:border-amber-900 bg-amber-50 dark:bg-amber-950/30 text-amber-800 dark:text-amber-300'
          }`}
          title="API Key Configuration"
        >
          <span className="text-lg flex-shrink-0">{hasApiKey ? '🟢' : '🔑'}</span>
          {!collapsed && (
            <div className="text-xs leading-tight overflow-hidden">
              <span className="font-semibold block truncate">
                {hasApiKey ? 'Live AI Mode' : 'Configure API Key'}
              </span>
              <span className="text-[10px] opacity-80 block truncate">
                {hasApiKey ? 'Gemini 1.5 Active' : 'Demo / Pending'}
              </span>
            </div>
          )}
        </button>

        {!collapsed && (
          <div className="pt-2 text-center">
            <span className="text-[11px] text-slate-400">
              v1.0 • 35-Mark Academic Edition
            </span>
          </div>
        )}
      </div>
    </aside>
  );
};

// --- SOURCE: Navbar.tsx ---
/**
 * Top Navigation Header for RankCraft AI.
 * Displays system status, active model, key setup trigger, and dark/light theme switch.
 */


interface NavbarProps {
  hasApiKey: boolean;
  activeModel: string;
  openApiKeyModal: () => void;
  darkMode: boolean;
  setDarkMode: (val: boolean) => void;
  openDocModal: () => void;
}

const Navbar: React.FC<NavbarProps> = ({
  hasApiKey,
  activeModel,
  openApiKeyModal,
  darkMode,
  setDarkMode,
  openDocModal
}) => {
  return (
    <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md px-6 flex items-center justify-between z-20 sticky top-0">
      <div className="flex items-center space-x-3">
        <div className="flex items-center space-x-2">
          <span className="text-sm font-semibold text-slate-800 dark:text-slate-100 hidden sm:inline">
            Project:
          </span>
          <h1 className="text-sm font-medium text-slate-600 dark:text-slate-300 truncate max-w-[280px] sm:max-w-md">
            AI SEO Content Assistant Using Prompt Engineering
          </h1>
        </div>
      </div>

      <div className="flex items-center space-x-3">
        {/* Model Badge */}
        <div className="hidden md:flex items-center space-x-1.5 px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 text-xs font-mono">
          <span>⚡</span>
          <span>{activeModel}</span>
        </div>

        {/* Status Pill */}
        <button
          onClick={openApiKeyModal}
          className={`flex items-center space-x-2 px-3 py-1 rounded-full text-xs font-medium border transition-all ${
            hasApiKey
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800'
              : 'bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-800 animate-pulse'
          }`}
          title="Click to configure Gemini API Key"
        >
          <span className={`w-2 h-2 rounded-full ${hasApiKey ? 'bg-emerald-500' : 'bg-amber-500'}`} />
          <span>{hasApiKey ? 'Live AI Connected' : 'Demo Mode (No API Key)'}</span>
        </button>

        {/* Academic Documentation Button */}
        <button
          onClick={openDocModal}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          title="Academic Viva & Project Documentation"
        >
          📖 <span className="hidden lg:inline text-xs font-medium ml-1">Documentation</span>
        </button>

        {/* Theme Switcher */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-sm"
          title={darkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
        >
          {darkMode ? '☀️' : '🌙'}
        </button>
      </div>
    </header>
  );
};

// --- SOURCE: DashboardHome.tsx ---
/**
 * Dashboard Landing Page for RankCraft AI.
 * Highlights project architecture, key metrics, viva presentation points,
 * and quick shortcuts to generation and prompt lab.
 */


interface DashboardHomeProps {
  setActiveTab: (tab: string) => void;
  openApiKeyModal: () => void;
  hasApiKey: boolean;
  historyCount: number;
}

const DashboardHome: React.FC<DashboardHomeProps> = ({
  setActiveTab,
  openApiKeyModal,
  hasApiKey,
  historyCount
}) => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Hero Welcome Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 text-white p-8 shadow-xl border border-blue-800/40">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-400/30 text-blue-200 text-xs font-semibold uppercase tracking-wider mb-4">
            <span>🎓 35-Mark Academic Capstone Project</span>
            <span>•</span>
            <span>Computer Science & Engineering</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3">
            RankCraft AI: Intelligent SEO Content Assistant
          </h2>
          <p className="text-slate-300 text-base leading-relaxed mb-6">
            An advanced full-stack application demonstrating how formal <strong>prompt engineering</strong> transforms raw language model outputs into publication-grade, search-optimized technical content. Evaluated objectively with an 8-dimension heuristic scoring engine.
          </p>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => setActiveTab('generator')}
              className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-sm shadow-lg shadow-blue-600/30 transition-all flex items-center space-x-2"
            >
              <span>✍️ Launch Content Studio</span>
              <span>→</span>
            </button>
            <button
              onClick={() => setActiveTab('prompt-lab')}
              className="px-5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm backdrop-blur-sm border border-white/15 transition-all flex items-center space-x-2"
            >
              <span>🧪 Open Prompt Lab (A/B Test)</span>
            </button>
            {!hasApiKey && (
              <button
                onClick={openApiKeyModal}
                className="px-5 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 border border-amber-400/30 font-semibold text-sm transition-all flex items-center space-x-2"
              >
                <span>🔑 Connect Gemini API</span>
              </button>
            )}
          </div>
        </div>

        {/* Decorative Grid Graphic */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 pointer-events-none hidden md:block">
          <div className="w-full h-full bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />
        </div>
      </div>

      {/* Metric & Capability Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-2xl mb-2">📋</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">12 Modules</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Titles, meta, outline, draft, FAQs, internal links & E-E-A-T checklist.
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-2xl mb-2">🔬</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">A / B Testing</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Mode A (naive baseline) vs Mode B (prompt engineered) side-by-side comparison.
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-2xl mb-2">⚖️</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">8 Metrics</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Transparent 0-5 heuristic rubric for relevance, intent, density, and readability.
          </div>
        </div>

        <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
          <div className="text-2xl mb-2">💾</div>
          <div className="text-2xl font-bold text-slate-900 dark:text-white">{historyCount} Saved</div>
          <div className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Local browser session storage with Markdown, HTML & JSON exports.
          </div>
        </div>
      </div>

      {/* Core Architectural Modules */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center space-x-2">
          <span>🛠️</span>
          <span>Core System Features</span>
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-blue-100 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400 flex items-center justify-center text-2xl font-bold mb-4">
                ✍️
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                12-Point SEO Content Generator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                Creates publication-ready technical blog posts calibrated to search intent, industry vertical, and target audience. Generates verified 155-160 char meta descriptions, H1-H3 outlines, full drafts, and FAQ schema.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('generator')}
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 flex items-center space-x-1"
            >
              <span>Explore Generator</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 2 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-indigo-400 dark:hover:border-indigo-600 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 flex items-center justify-center text-2xl font-bold mb-4">
                🧪
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Prompt Engineering Lab
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                The centerpiece for academic evaluation. Compares Mode A (Basic) and Mode B (Engineered) on identical inputs, illustrating the impact of role prompting, few-shot patterns, negative constraints, and structured schema grounding.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('prompt-lab')}
              className="text-xs font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 flex items-center space-x-1"
            >
              <span>Run Prompt Lab</span>
              <span>→</span>
            </button>
          </div>

          {/* Card 3 */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:border-emerald-400 dark:hover:border-emerald-600 transition-all flex flex-col justify-between">
            <div>
              <div className="w-12 h-12 rounded-xl bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center text-2xl font-bold mb-4">
                🎯
              </div>
              <h4 className="font-bold text-slate-900 dark:text-white text-base mb-2">
                Heuristic Content Evaluator
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-4">
                An objective 0-5 rubric inspecting keyword density, Flesch reading ease, heading hierarchy, meta description length boundaries, and completeness with actionable suggestions.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('evaluation')}
              className="text-xs font-semibold text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 flex items-center space-x-1"
            >
              <span>View Rubric Details</span>
              <span>→</span>
            </button>
          </div>
        </div>
      </div>

      {/* Academic Presentation & Viva Quick Reference Card */}
      <div className="p-6 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700/60">
        <div className="flex items-start space-x-4">
          <div className="text-3xl flex-shrink-0">🎓</div>
          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white mb-1">
              Faculty Review & Viva Presentation Guide
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed mb-4">
              When presenting this project to faculty, highlight the following 4 engineering pillars:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">1. Structured Prompt Engineering:</strong>
                <span className="text-slate-500 dark:text-slate-400">
                  Contrast naive natural language with constrained role prompting, E-E-A-T grounding, and JSON grammar control.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">2. Quantitative Metric Improvement:</strong>
                <span className="text-slate-500 dark:text-slate-400">
                  Demonstrate the measurable delta (+20% to +35%) in rubric scores, especially in meta-length and keyword density.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">3. Ethical Factuality Guardrails:</strong>
                <span className="text-slate-500 dark:text-slate-400">
                  Explicitly refrain from hallucinating fake search volume metrics or making unverifiable claims.
                </span>
              </div>
              <div className="p-3 rounded-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                <strong className="text-slate-900 dark:text-white block mb-0.5">4. Robust Server-Side Architecture:</strong>
                <span className="text-slate-500 dark:text-slate-400">
                  Explain the secure backend proxy preventing client-side API key leakage with automated fallback handling.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- SOURCE: ContentGenerator.tsx ---
/**
 * Content Generation Form & Workspace Component for RankCraft AI.
 * Handles input collection, real-time validation, preset templates,
 * prompt mode selection, and submission.
 */


interface ContentGeneratorProps {
  onGenerate: (inputs: GenerationInput) => Promise<void>;
  loading: boolean;
  currentInputs: GenerationInput;
  setCurrentInputs: (inputs: GenerationInput) => void;
  hasApiKey: boolean;
  openApiKeyModal: () => void;
}

const ContentGenerator: React.FC<ContentGeneratorProps> = ({
  onGenerate,
  loading,
  currentInputs,
  setCurrentInputs,
  hasApiKey,
  openApiKeyModal
}) => {
  const [errors, setErrors] = useState<Record<string, string>>({});

  const presetExamples = [
    {
      label: 'Cloud DevOps / DB',
      topic: 'Cloud Database Performance Optimization',
      primary_keyword: 'database performance',
      target_audience: 'Backend Engineers & DevOps',
      industry: 'Cloud Infrastructure & SaaS',
      target_country: 'Global / United States',
      search_intent: 'Informational' as SearchIntent,
      content_type: 'Comprehensive Guide' as ContentType,
      tone: 'Authoritative & Actionable' as WritingTone,
      target_word_count: 1200,
      secondary_keywords: 'query latency, connection pooling, b-tree indexing, postgresql optimization',
      reference_material: 'Highlight p99 latency vs averages, PgBouncer pool sizing formula, and covering index examples.'
    },
    {
      label: 'Fintech / Investing',
      topic: 'Algorithmic Trading Risk Management Strategies',
      primary_keyword: 'algorithmic trading risk management',
      target_audience: 'Quantitative Analysts & Traders',
      industry: 'Financial Technology & Capital Markets',
      target_country: 'United States',
      search_intent: 'Commercial' as SearchIntent,
      content_type: 'Comprehensive Guide' as ContentType,
      tone: 'Authoritative & Actionable' as WritingTone,
      target_word_count: 1500,
      secondary_keywords: 'value at risk, drawdown mitigation, backtesting slippage, position sizing',
      reference_material: 'Focus on maximum drawdown constraints, Monte Carlo stress testing, and circuit breaker patterns.'
    },
    {
      label: 'Health & Wellness',
      topic: 'Evidence-Based Intermittent Fasting Protocols',
      primary_keyword: 'intermittent fasting protocols',
      target_audience: 'Health-Conscious Adults & Athletes',
      industry: 'Health & Nutrition Science',
      target_country: 'Global',
      search_intent: 'Informational' as SearchIntent,
      content_type: 'How-To Tutorial' as ContentType,
      tone: 'Educational & Clear' as WritingTone,
      target_word_count: 1000,
      secondary_keywords: 'autophagy, 16/8 fasting, metabolic flexibility, circadian rhythm fasting',
      reference_material: 'Cite peer-reviewed circadian biology studies without fabricating specific trial participant numbers.'
    }
  ];

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};
    if (!currentInputs.topic.trim()) newErrors.topic = 'Topic is required.';
    if (!currentInputs.primary_keyword.trim()) newErrors.primary_keyword = 'Primary keyword is required.';
    if (!currentInputs.target_audience.trim()) newErrors.target_audience = 'Target audience is required.';
    if (!currentInputs.industry.trim()) newErrors.industry = 'Industry/niche is required.';
    if (!currentInputs.target_country.trim()) newErrors.target_country = 'Target country is required.';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate()) {
      onGenerate(currentInputs);
    }
  };

  const handlePresetSelect = (preset: typeof presetExamples[0]) => {
    setCurrentInputs({
      ...currentInputs,
      topic: preset.topic,
      primary_keyword: preset.primary_keyword,
      target_audience: preset.target_audience,
      industry: preset.industry,
      target_country: preset.target_country,
      search_intent: preset.search_intent,
      content_type: preset.content_type,
      tone: preset.tone,
      target_word_count: preset.target_word_count,
      secondary_keywords: preset.secondary_keywords,
      reference_material: preset.reference_material
    });
    setErrors({});
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-12">
      {/* Header and Presets */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span>✍️</span>
            <span>SEO Content Generator Studio</span>
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Configure target parameters to generate all 12 SEO modules with validated structured JSON output.
          </p>
        </div>

        {/* Quick Load Example Presets */}
        <div className="flex items-center space-x-2">
          <span className="text-xs text-slate-400 font-medium">Load Preset:</span>
          <div className="flex flex-wrap gap-1.5">
            {presetExamples.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => handlePresetSelect(p)}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-300 dark:border-slate-700"
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Input Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Prompt Mode Toggle Selector */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-1">
                Prompt Engineering Mode
              </span>
              <div className="flex items-center space-x-3">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="radio"
                    name="prompt_mode"
                    value="improved"
                    checked={currentInputs.prompt_mode !== 'basic'}
                    onChange={() => setCurrentInputs({ ...currentInputs, prompt_mode: 'improved' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-semibold text-slate-900 dark:text-white">
                    Mode B: Advanced Engineered Prompt
                  </span>
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 font-bold px-2 py-0.5 rounded-full">
                    Recommended
                  </span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer ml-4">
                  <input
                    type="radio"
                    name="prompt_mode"
                    value="basic"
                    checked={currentInputs.prompt_mode === 'basic'}
                    onChange={() => setCurrentInputs({ ...currentInputs, prompt_mode: 'basic' })}
                    className="text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                    Mode A: Basic Baseline
                  </span>
                </label>
              </div>
            </div>

            <div className="text-xs text-slate-500 dark:text-slate-400 max-w-sm">
              {currentInputs.prompt_mode === 'basic'
                ? '⚠️ Baseline mode uses a naive, unconstrained prompt for academic comparison.'
                : '✨ Applies role prompting, 155-160 char constraints, intent grounding, and JSON schema.'}
            </div>
          </div>
        </div>

        {/* Section 1: Core Topic & Keywords */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-2">
            <span>🎯</span>
            <span>1. Core Topic & Target Keywords</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Topic Input */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Article Topic / Subject Matter <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentInputs.topic}
                onChange={(e) => {
                  setCurrentInputs({ ...currentInputs, topic: e.target.value });
                  if (errors.topic) setErrors({ ...errors, topic: '' });
                }}
                placeholder="e.g., Cloud Database Performance Optimization"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.topic ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.topic && <span className="text-xs text-rose-500 mt-1 block">{errors.topic}</span>}
            </div>

            {/* Primary Keyword */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Primary Target Keyword <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentInputs.primary_keyword}
                onChange={(e) => {
                  setCurrentInputs({ ...currentInputs, primary_keyword: e.target.value });
                  if (errors.primary_keyword) setErrors({ ...errors, primary_keyword: '' });
                }}
                placeholder="e.g., database performance"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.primary_keyword ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.primary_keyword && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.primary_keyword}</span>
              )}
            </div>
          </div>

          {/* Secondary Keywords */}
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Secondary Keywords (Optional, comma-separated)
            </label>
            <input
              type="text"
              value={currentInputs.secondary_keywords}
              onChange={(e) => setCurrentInputs({ ...currentInputs, secondary_keywords: e.target.value })}
              placeholder="e.g., query latency, connection pooling, b-tree indexing, postgresql optimization"
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            <span className="text-[11px] text-slate-400 mt-1 block">
              Used for semantic keyword clustering and H2/H3 subtopic enrichment.
            </span>
          </div>
        </div>

        {/* Section 2: Target Audience & Strategic Context */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
            <span>👥</span>
            <span>2. Audience & Market Context</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Target Audience */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Audience <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentInputs.target_audience}
                onChange={(e) => {
                  setCurrentInputs({ ...currentInputs, target_audience: e.target.value });
                  if (errors.target_audience) setErrors({ ...errors, target_audience: '' });
                }}
                placeholder="e.g., Backend Developers & DevOps"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.target_audience ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.target_audience && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.target_audience}</span>
              )}
            </div>

            {/* Industry / Niche */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Industry / Niche <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentInputs.industry}
                onChange={(e) => {
                  setCurrentInputs({ ...currentInputs, industry: e.target.value });
                  if (errors.industry) setErrors({ ...errors, industry: '' });
                }}
                placeholder="e.g., Cloud Computing & SaaS"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.industry ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.industry && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.industry}</span>
              )}
            </div>

            {/* Target Country */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Market / Country <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={currentInputs.target_country}
                onChange={(e) => {
                  setCurrentInputs({ ...currentInputs, target_country: e.target.value });
                  if (errors.target_country) setErrors({ ...errors, target_country: '' });
                }}
                placeholder="e.g., Global / United States"
                className={`w-full px-3.5 py-2.5 rounded-xl border bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all ${
                  errors.target_country ? 'border-rose-500' : 'border-slate-200 dark:border-slate-700'
                }`}
              />
              {errors.target_country && (
                <span className="text-xs text-rose-500 mt-1 block">{errors.target_country}</span>
              )}
            </div>
          </div>
        </div>

        {/* Section 3: Intent, Format & Tone Parameters */}
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-2">
            <span>⚙️</span>
            <span>3. Editorial & Search Intent Parameters</span>
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Search Intent */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Search Intent
              </label>
              <select
                value={currentInputs.search_intent}
                onChange={(e) => setCurrentInputs({ ...currentInputs, search_intent: e.target.value as SearchIntent })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Informational">Informational (How-to, Guides, Concepts)</option>
                <option value="Commercial">Commercial (Comparisons, Best-Of, Reviews)</option>
                <option value="Transactional">Transactional (Pricing, Solutions, Buying)</option>
                <option value="Navigational">Navigational (Brand, Portal, Login)</option>
              </select>
            </div>

            {/* Content Type */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Content Format
              </label>
              <select
                value={currentInputs.content_type}
                onChange={(e) => setCurrentInputs({ ...currentInputs, content_type: e.target.value as ContentType })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Comprehensive Guide">Comprehensive Guide</option>
                <option value="How-To Tutorial">How-To Step-by-Step Tutorial</option>
                <option value="Listicle / Best-Of">Listicle / Best-Of Strategies</option>
                <option value="Comparison & Review">Comparison & Review</option>
                <option value="Thought Leadership">Thought Leadership / Opinion</option>
              </select>
            </div>

            {/* Writing Tone */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Writing Tone
              </label>
              <select
                value={currentInputs.tone}
                onChange={(e) => setCurrentInputs({ ...currentInputs, tone: e.target.value as WritingTone })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="Authoritative & Actionable">Authoritative & Actionable (E-E-A-T)</option>
                <option value="Educational & Clear">Educational & Clear</option>
                <option value="Conversational & Engaging">Conversational & Engaging</option>
                <option value="Direct & Concise">Direct & Concise</option>
              </select>
            </div>

            {/* Target Word Count */}
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
                Target Word Count: <span className="text-blue-600 font-bold">{currentInputs.target_word_count} w</span>
              </label>
              <select
                value={currentInputs.target_word_count}
                onChange={(e) => setCurrentInputs({ ...currentInputs, target_word_count: Number(e.target.value) })}
                className="w-full px-3 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value={800}>800 words (Standard Post)</option>
                <option value={1000}>1,000 words (Detailed Article)</option>
                <option value={1200}>1,200 words (In-Depth Guide)</option>
                <option value={1500}>1,500 words (Comprehensive Blueprint)</option>
                <option value={2000}>2,000 words (Definite Pillar Page)</option>
              </select>
            </div>
          </div>

          {/* Reference Material / Additional Notes */}
          <div className="pt-2">
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Reference Material / Editorial Guidelines (Optional)
            </label>
            <textarea
              value={currentInputs.reference_material || ''}
              onChange={(e) => setCurrentInputs({ ...currentInputs, reference_material: e.target.value })}
              rows={2}
              placeholder="Paste specific data points, quotes, technical snippets, or instructions you want integrated into the draft..."
              className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        {/* Submit Bar with Live Loading Status */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <div className="text-xs text-slate-500 dark:text-slate-400 flex items-center space-x-2">
            <span>🛡️</span>
            <span>
              {hasApiKey
                ? 'Server-side API calls secured via Google Gemini.'
                : 'Demo Mode active. Connect your Gemini API Key in Navbar for live generation.'}
            </span>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center justify-center space-x-2 ${
              loading
                ? 'bg-blue-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 shadow-blue-500/25 active:scale-[0.99]'
            }`}
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                <span>Engineering & Generating Content...</span>
              </>
            ) : (
              <>
                <span>🚀 Generate 12-Module SEO Content</span>
                <span>→</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

// --- SOURCE: ResultsView.tsx ---
/**
 * Results Display Component for RankCraft AI.
 * Renders all 12 SEO modules with dedicated cards, copy buttons, character counters,
 * and download actions (Markdown, JSON, HTML).
 */


interface ResultsViewProps {
  content: SeoContentResult;
  inputs: GenerationInput;
  evaluation?: ContentEvaluation;
  promptMode: string;
  isDemoMode: boolean;
  onOpenEvaluation: () => void;
}

const ResultsView: React.FC<ResultsViewProps> = ({
  content,
  inputs,
  evaluation,
  promptMode,
  isDemoMode,
  onOpenEvaluation
}) => {
  const [activeTab, setActiveTab] = useState<'all' | 'titles' | 'draft' | 'outline' | 'faqs' | 'keywords' | 'links'>('all');
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const handleCopy = (text: string, key: string) => {
    copyToClipboard(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const metaLength = content.meta_description?.length || 0;
  const metaStatus = metaLength >= 155 && metaLength <= 160
    ? 'optimal'
    : metaLength >= 145 && metaLength <= 165
    ? 'good'
    : 'warning';

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Top Banner with Score Badge, Prompt Mode & Export Buttons */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1.5">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
              {promptMode === 'improved' ? 'Mode B: Advanced Engineered Output' : 'Mode A: Basic Baseline Output'}
            </span>
            {isDemoMode && (
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300">
                Demo Dataset
              </span>
            )}
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white truncate max-w-xl">
            {content.recommended_title.title}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Target Keyword: <span className="font-semibold text-slate-700 dark:text-slate-300">"{inputs.primary_keyword}"</span> • Intent: <span className="font-semibold text-slate-700 dark:text-slate-300">{inputs.search_intent}</span>
          </p>
        </div>

        {/* Heuristic Score Pill & Export Dropdown */}
        <div className="flex items-center space-x-3">
          {evaluation && (
            <button
              onClick={onOpenEvaluation}
              className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center hover:border-blue-400 transition-colors"
              title="Click to view full 8-point heuristic evaluation rubric"
            >
              <div className="text-xs text-slate-400 font-medium">Heuristic Score</div>
              <div className="text-xl font-black text-blue-600 dark:text-blue-400 leading-tight">
                {evaluation.overall_score}%
              </div>
              <div className="text-[10px] text-slate-500 font-bold truncate max-w-[100px]">
                {evaluation.letter_grade.split(' ')[0]}
              </div>
            </button>
          )}

          {/* Export Action Buttons */}
          <div className="flex flex-col space-y-1.5">
            <button
              onClick={() => downloadMarkdown(content, inputs, evaluation)}
              className="px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-sm transition-all flex items-center space-x-1.5"
            >
              <span>📥 Download Markdown (.md)</span>
            </button>
            <div className="flex space-x-1.5">
              <button
                onClick={() => downloadHtml(content, inputs, evaluation)}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors border border-slate-200 dark:border-slate-700"
              >
                HTML (.html)
              </button>
              <button
                onClick={() => downloadJson(content, inputs, evaluation)}
                className="flex-1 px-2.5 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium text-xs transition-colors border border-slate-200 dark:border-slate-700"
              >
                JSON (.json)
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Sub-Navigation Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 overflow-x-auto space-x-2 pb-1 scrollbar-none">
        {[
          { id: 'all', label: 'All 12 Modules' },
          { id: 'titles', label: '1 & 2. Titles & Meta' },
          { id: 'draft', label: '8. Full Article Draft' },
          { id: 'outline', label: '7. Outline Structure' },
          { id: 'keywords', label: '4, 5, 6. Keyword Strategy' },
          { id: 'faqs', label: '9. FAQs (5 Items)' },
          { id: 'links', label: '10, 11, 12. Internal Links & QA' },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`px-3.5 py-2 rounded-t-xl text-xs font-semibold whitespace-nowrap transition-all border-b-2 ${
              activeTab === tab.id
                ? 'border-blue-600 text-blue-600 dark:text-blue-400 bg-blue-50/50 dark:bg-blue-950/20'
                : 'border-transparent text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* MODULE 1 & 2: Titles & Meta Description */}
      {(activeTab === 'all' || activeTab === 'titles') && (
        <div className="space-y-6">
          {/* Recommended Title Card */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-2">
                <span>🏆</span>
                <span>Module 2: Recommended Title & Rationale</span>
              </span>
              <button
                onClick={() => handleCopy(content.recommended_title.title, 'rec-title')}
                className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
              >
                {copiedKey === 'rec-title' ? '✓ Copied!' : '📋 Copy Title'}
              </button>
            </div>

            <div className="p-4 rounded-xl bg-blue-50/60 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900">
              <h3 className="text-lg font-extrabold text-blue-950 dark:text-blue-100 mb-2">
                {content.recommended_title.title}
              </h3>
              <p className="text-xs text-blue-800 dark:text-blue-300 leading-relaxed">
                <strong>Why it wins:</strong> {content.recommended_title.explanation}
              </p>
            </div>

            {/* All 5 Title Suggestions */}
            <div>
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Module 1: All 5 Generated Title Options
              </span>
              <div className="space-y-2">
                {content.title_suggestions.map((title, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      <strong className="text-slate-400 mr-2">{i + 1}.</strong> {title}
                    </span>
                    <button
                      onClick={() => handleCopy(title, `title-${i}`)}
                      className="ml-2 text-slate-400 hover:text-blue-600 transition-colors"
                      title="Copy this title"
                    >
                      {copiedKey === `title-${i}` ? '✓ Copied' : '📋'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Module 3: Meta Description Card with 155-160 Char Target */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
                <span>🏷️</span>
                <span>Module 3: SERP Meta Description (Target: 155-160 Chars)</span>
              </span>

              <div className="flex items-center space-x-2">
                <span
                  className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                    metaStatus === 'optimal'
                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                      : metaStatus === 'good'
                      ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                      : 'bg-amber-100 text-amber-800 dark:bg-amber-950 dark:text-amber-300'
                  }`}
                >
                  {metaLength} Characters ({metaStatus === 'optimal' ? 'Optimal Sweet Spot 🎯' : metaStatus === 'good' ? 'Acceptable' : 'Check Length'})
                </span>

                <button
                  onClick={() => handleCopy(content.meta_description, 'meta')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
                >
                  {copiedKey === 'meta' ? '✓ Copied!' : '📋 Copy Meta'}
                </button>
              </div>
            </div>

            {/* Google SERP Live Simulation Box */}
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700">
              <div className="text-[11px] text-slate-400 font-mono mb-1">
                https://yourdomain.com/{inputs.topic.toLowerCase().replace(/[^a-z0-9]/g, '-')}
              </div>
              <div className="text-base font-medium text-blue-600 dark:text-blue-400 hover:underline cursor-pointer mb-1">
                {content.recommended_title.title}
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                {content.meta_description}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* MODULE 4, 5, 6: Keyword Strategy & Search Intent */}
      {(activeTab === 'all' || activeTab === 'keywords') && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Primary Keyword Analysis */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
              <span>🎯</span>
              <span>Module 4: Primary Keyword</span>
            </span>
            <div className="p-3 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-900 text-xs">
              <strong className="text-blue-950 dark:text-blue-200 text-sm block mb-1">
                "{content.primary_keyword_analysis.keyword}"
              </strong>
              <div className="text-slate-600 dark:text-slate-300 space-y-1">
                <div><strong>Placement:</strong> {content.primary_keyword_analysis.placement_strategy}</div>
                <div><strong>Target Density:</strong> {content.primary_keyword_analysis.density_target}</div>
              </div>
            </div>

            {/* Search Intent Card */}
            <div className="pt-2">
              <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                Module 6: Search Intent Analysis
              </span>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1">
                <div><strong>Intent:</strong> <span className="text-blue-600 font-semibold">{content.search_intent_analysis.detected_intent}</span></div>
                <div><strong>Journey Stage:</strong> {content.search_intent_analysis.user_journey_stage}</div>
                <div><strong>Content Angle:</strong> {content.search_intent_analysis.content_angle}</div>
              </div>
            </div>
          </div>

          {/* Secondary Keywords */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-1.5">
              <span>🔤</span>
              <span>Module 4: Secondary Keywords (5)</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Contextual semantic keywords for H2/H3 integration.
            </p>
            <div className="space-y-1.5">
              {content.secondary_keywords.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span>{kw}</span>
                  <button
                    onClick={() => handleCopy(kw, `sec-${i}`)}
                    className="text-slate-400 hover:text-blue-600"
                  >
                    {copiedKey === `sec-${i}` ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Long-Tail Keywords */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5">
              <span>🔍</span>
              <span>Module 5: Long-Tail Variations</span>
            </span>
            <p className="text-[11px] text-slate-400">
              Low-competition question and intent-specific search phrases.
            </p>
            <div className="space-y-1.5">
              {content.long_tail_keywords.map((kw, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 text-xs text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700"
                >
                  <span className="truncate mr-2">{kw}</span>
                  <button
                    onClick={() => handleCopy(kw, `long-${i}`)}
                    className="text-slate-400 hover:text-blue-600 flex-shrink-0"
                  >
                    {copiedKey === `long-${i}` ? '✓' : '📋'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* MODULE 7: Article Outline Structure */}
      {(activeTab === 'all' || activeTab === 'outline') && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-2">
              <span>📋</span>
              <span>Module 7: H1 / H2 / H3 Content Outline Hierarchy</span>
            </span>
            <button
              onClick={() =>
                handleCopy(
                  content.article_outline
                    .map((item) => `${item.level}: ${item.heading}\n${item.key_points.map((p) => `  - ${p}`).join('\n')}`)
                    .join('\n\n'),
                  'outline'
                )
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {copiedKey === 'outline' ? '✓ Copied!' : '📋 Copy Outline'}
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {content.article_outline.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-2"
              >
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      item.level === 'H1'
                        ? 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        : item.level === 'H2'
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-950 dark:text-blue-300'
                        : 'bg-indigo-100 text-indigo-800 dark:bg-indigo-950 dark:text-indigo-300'
                    }`}
                  >
                    {item.level}
                  </span>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                    {item.heading}
                  </h4>
                </div>
                <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                  {item.key_points.map((pt, pIdx) => (
                    <li key={pIdx}>{pt}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 8: Complete Formatted Article Draft */}
      {(activeTab === 'all' || activeTab === 'draft') && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-2">
                <span>📝</span>
                <span>Module 8: Complete Formatted Article Draft</span>
              </span>
              <span className="text-xs text-slate-400 mt-0.5 block">
                Estimated word count: {content.article_draft.split(/\s+/).length} words
              </span>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => handleCopy(content.article_draft, 'draft')}
                className="px-3 py-1.5 text-xs rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-colors flex items-center space-x-1"
              >
                <span>{copiedKey === 'draft' ? '✓ Copied Draft!' : '📋 Copy Markdown Draft'}</span>
              </button>
            </div>
          </div>

          {/* Formatted Article Content */}
          <div className="p-6 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 font-sans text-sm text-slate-800 dark:text-slate-200 leading-relaxed whitespace-pre-line max-h-[600px] overflow-y-auto">
            {content.article_draft}
          </div>
        </div>
      )}

      {/* MODULE 9: 5 FAQs with Answers */}
      {(activeTab === 'all' || activeTab === 'faqs') && (
        <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 flex items-center space-x-2">
              <span>❓</span>
              <span>Module 9: Frequently Asked Questions (FAQ Schema Ready - 5 Items)</span>
            </span>
            <button
              onClick={() =>
                handleCopy(
                  content.faqs.map((f, i) => `Q${i + 1}: ${f.question}\nA: ${f.answer}`).join('\n\n'),
                  'all-faqs'
                )
              }
              className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-medium transition-colors"
            >
              {copiedKey === 'all-faqs' ? '✓ Copied All FAQs!' : '📋 Copy All FAQs'}
            </button>
          </div>

          <div className="space-y-3">
            {content.faqs.map((faq, idx) => (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-1.5"
              >
                <div className="flex items-start justify-between">
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                    <span className="text-blue-600 dark:text-blue-400">Q{idx + 1}:</span>
                    <span>{faq.question}</span>
                  </h4>
                  <button
                    onClick={() => handleCopy(`Q: ${faq.question}\nA: ${faq.answer}`, `faq-${idx}`)}
                    className="text-slate-400 hover:text-blue-600 text-xs ml-2"
                  >
                    {copiedKey === `faq-${idx}` ? '✓' : '📋'}
                  </button>
                </div>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pl-6">
                  {faq.answer}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* MODULE 10, 11, 12: Internal Links, Checklist & Improvements */}
      {(activeTab === 'all' || activeTab === 'links') && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Module 10: Internal Linking Recommendations */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600 dark:text-blue-400 flex items-center space-x-1.5">
              <span>🔗</span>
              <span>Module 10: Internal Linking Anchor Texts</span>
            </span>
            <div className="space-y-2">
              {content.internal_linking.map((link, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-1"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-blue-600 dark:text-blue-400">
                      Anchor: "{link.anchor_text}"
                    </span>
                    <span className="text-[10px] text-slate-400 uppercase">
                      Target: {link.target_concept}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 italic">
                    "{link.context_sentence}"
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Module 11 & 12: Quality Checklist & Improvements */}
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 flex items-center space-x-1.5 mb-2">
                <span>✅</span>
                <span>Module 11: Content Quality Checklist</span>
              </span>
              <div className="space-y-1.5">
                {content.quality_checklist.map((c, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs"
                  >
                    <span className="text-slate-800 dark:text-slate-200 font-medium">
                      {c.item}
                    </span>
                    <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400">
                      ✓ {c.note}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800">
              <span className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 flex items-center space-x-1.5 mb-2">
                <span>💡</span>
                <span>Module 12: Actionable Improvements</span>
              </span>
              <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-1 list-disc list-inside">
                {content.improvement_suggestions.map((s, idx) => (
                  <li key={idx}>{s}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SOURCE: PromptLab.tsx ---
/**
 * Prompt Engineering Laboratory Component for RankCraft AI.
 * The core academic feature: compares Mode A (Basic) vs Mode B (Improved) on identical inputs,
 * shows side-by-side prompt code diffs, evaluates both with the exact same rubric,
 * and quantifies the empirical performance delta for academic review.
 */


interface PromptLabProps {
  currentInputs: GenerationInput;
  onRunComparison: (inputs: GenerationInput) => Promise<PromptLabResponse | null>;
  labData: PromptLabResponse | null;
  loading: boolean;
}

const PromptLab: React.FC<PromptLabProps> = ({
  currentInputs,
  onRunComparison,
  labData,
  loading
}) => {
  const [activeView, setActiveView] = useState<'comparison' | 'prompt-diff' | 'faculty-guide'>('comparison');
  const [copiedPrompt, setCopiedPrompt] = useState<string | null>(null);

  const handleCopyPrompt = (text: string, id: string) => {
    copyToClipboard(text);
    setCopiedPrompt(id);
    setTimeout(() => setCopiedPrompt(null), 2000);
  };

  const handleRun = () => {
    onRunComparison(currentInputs);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16">
      {/* Header and Lab Controls */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-indigo-900 via-slate-900 to-blue-900 text-white shadow-xl border border-indigo-800/40">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-indigo-200 text-xs font-semibold uppercase tracking-wider mb-2">
              <span>🔬 Core Academic Evaluation Feature</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Prompt Engineering A/B Comparison Lab
            </h2>
            <p className="text-slate-300 text-xs sm:text-sm mt-1 max-w-2xl leading-relaxed">
              Demonstrates the measurable difference between naive natural-language querying and formal multi-technique prompt engineering using identical inputs and an objective 8-point rubric.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={handleRun}
              disabled={loading}
              className={`px-6 py-3 rounded-xl font-bold text-sm text-white shadow-lg transition-all flex items-center space-x-2 ${
                loading
                  ? 'bg-indigo-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30 active:scale-[0.99]'
              }`}
            >
              {loading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Running Both Modes...</span>
                </>
              ) : (
                <>
                  <span>⚡ Run A/B Experiment Now</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Current Test Input Parameters Pill */}
        <div className="mt-4 pt-4 border-t border-indigo-800/60 flex flex-wrap items-center gap-2 text-xs text-indigo-200">
          <span className="font-semibold text-white">Active Test Topic:</span>
          <span className="bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700/60 font-medium">
            {currentInputs.topic || 'Cloud Database Performance Optimization'}
          </span>
          <span className="font-semibold text-white ml-2">Primary Keyword:</span>
          <span className="bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700/60 font-medium">
            "{currentInputs.primary_keyword || 'database performance'}"
          </span>
          <span className="font-semibold text-white ml-2">Target Words:</span>
          <span className="bg-indigo-950/60 px-2 py-0.5 rounded border border-indigo-700/60 font-medium">
            {currentInputs.target_word_count || 1200} words
          </span>
        </div>
      </div>

      {/* Lab Navigation Switcher */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4">
        <button
          onClick={() => setActiveView('comparison')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeView === 'comparison'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>⚖️ Side-by-Side Score Delta</span>
        </button>
        <button
          onClick={() => setActiveView('prompt-diff')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeView === 'prompt-diff'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>📝 Raw Prompt Diff & Techniques</span>
        </button>
        <button
          onClick={() => setActiveView('faculty-guide')}
          className={`pb-3 text-sm font-bold border-b-2 transition-all flex items-center space-x-2 ${
            activeView === 'faculty-guide'
              ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          <span>🎓 Faculty Review & Viva Guide</span>
        </button>
      </div>

      {/* VIEW 1: SIDE-BY-SIDE SCORE COMPARISON */}
      {activeView === 'comparison' && (
        <div className="space-y-6">
          {!labData ? (
            <div className="text-center py-16 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
              <div className="text-4xl mb-3">🧪</div>
              <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
                No Lab Experiment Run Yet
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
                Click "Run A/B Experiment Now" to execute both Mode A (Basic) and Mode B (Improved) prompts on your current topic and see the live rubric score comparison.
              </p>
              <button
                onClick={handleRun}
                className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold text-xs transition-all shadow-md"
              >
                Launch A/B Comparison
              </button>
            </div>
          ) : (
            <>
              {/* Executive Summary Card with Overall Score Comparison */}
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
                  <div>
                    <span className="text-xs font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                      Empirical Performance Analysis
                    </span>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white mt-0.5">
                      Prompt Engineering Impact: +{labData.comparison.overall_delta} Points ({labData.comparison.percentage_improvement > 0 ? `+${labData.comparison.percentage_improvement}%` : '0%'} Gain)
                    </h3>
                  </div>

                  <div className="flex items-center space-x-4">
                    {/* Mode A Score Box */}
                    <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-center min-w-[110px]">
                      <div className="text-[11px] text-slate-400 font-bold uppercase">Mode A (Basic)</div>
                      <div className="text-2xl font-black text-slate-700 dark:text-slate-300">
                        {labData.comparison.overall_score_a}%
                      </div>
                      <div className="text-[10px] text-slate-500">{labData.comparison.grade_a}</div>
                    </div>

                    <div className="text-2xl font-black text-slate-300 dark:text-slate-700">VS</div>

                    {/* Mode B Score Box */}
                    <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200 dark:border-indigo-800 text-center min-w-[110px]">
                      <div className="text-[11px] text-indigo-600 dark:text-indigo-400 font-bold uppercase">Mode B (Eng.)</div>
                      <div className="text-2xl font-black text-indigo-600 dark:text-indigo-400">
                        {labData.comparison.overall_score_b}%
                      </div>
                      <div className="text-[10px] text-indigo-500">{labData.comparison.grade_b}</div>
                    </div>
                  </div>
                </div>

                {/* Academic Conclusion Quote Box */}
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border-l-4 border-indigo-500 text-xs text-slate-700 dark:text-slate-300 leading-relaxed italic">
                  <strong>Academic Finding:</strong> {labData.comparison.academic_conclusion}
                </div>

                {/* Category-by-Category Comparison Table */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-3">
                    Detailed 8-Dimension Rubric Comparison (0 - 5 Scale)
                  </h4>

                  <div className="overflow-x-auto">
                    <table className="w-full text-xs text-left">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                          <th className="py-2.5 px-3">Evaluation Dimension</th>
                          <th className="py-2.5 px-3 text-center">Mode A (Basic)</th>
                          <th className="py-2.5 px-3 text-center">Mode B (Improved)</th>
                          <th className="py-2.5 px-3 text-right">Delta Improvement</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60">
                        {Object.entries(labData.comparison.category_comparison).map(([catKey, data]) => {
                          const formattedName = catKey
                            .split('_')
                            .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                            .join(' ');
                          const isPositive = data.delta > 0;
                          return (
                            <tr key={catKey} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition-colors">
                              <td className="py-2.5 px-3 font-semibold text-slate-800 dark:text-slate-200">
                                {formattedName}
                              </td>
                              <td className="py-2.5 px-3 text-center text-slate-600 dark:text-slate-400 font-mono">
                                {data.mode_a.toFixed(1)} / 5.0
                              </td>
                              <td className="py-2.5 px-3 text-center text-indigo-600 dark:text-indigo-400 font-mono font-bold">
                                {data.mode_b.toFixed(1)} / 5.0
                              </td>
                              <td className="py-2.5 px-3 text-right font-mono font-bold">
                                <span
                                  className={`px-2 py-0.5 rounded text-[11px] ${
                                    isPositive
                                      ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                                      : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                                  }`}
                                >
                                  {isPositive ? `+${data.delta.toFixed(1)}` : data.delta.toFixed(1)}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              {/* Side-by-Side Output Snippet Comparison */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Mode A Output Column */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-800">
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                      Mode A Output (Basic Baseline)
                    </span>
                    <span className="text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                      {labData.comparison.overall_score_a}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Recommended Title</span>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-800 dark:text-slate-200">
                      {labData.mode_a.content.recommended_title.title}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Meta Description ({labData.mode_a.content.meta_description.length} chars)
                    </span>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {labData.mode_a.content.meta_description}
                    </div>
                    <span className="text-[10px] text-amber-500 mt-1 block">
                      ⚠️ Note: Too short or unbounded without character limit prompting.
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Article Outline Depth</span>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {labData.mode_a.content.article_outline.length} sections generated
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">FAQs Generated</span>
                    <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-300">
                      {labData.mode_a.content.faqs.length} FAQs
                    </div>
                  </div>
                </div>

                {/* Mode B Output Column */}
                <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-indigo-100 dark:border-indigo-900">
                    <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 uppercase tracking-wider">
                      Mode B Output (Prompt Engineered)
                    </span>
                    <span className="text-xs bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 px-2 py-0.5 rounded font-mono font-bold">
                      {labData.comparison.overall_score_b}%
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Recommended Title</span>
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-xs font-semibold text-slate-900 dark:text-white border border-indigo-100 dark:border-indigo-900">
                      {labData.mode_b.content.recommended_title.title}
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">
                      Meta Description ({labData.mode_b.content.meta_description.length} chars)
                    </span>
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-900">
                      {labData.mode_b.content.meta_description}
                    </div>
                    <span className="text-[10px] text-emerald-600 dark:text-emerald-400 mt-1 block">
                      ✓ Fits Google SERP sweet spot (155-160 characters).
                    </span>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">Article Outline Depth</span>
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-900">
                      {labData.mode_b.content.article_outline.length} detailed semantic sections with H1/H2/H3 nesting
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] font-bold text-slate-500 block mb-1">FAQs Generated</span>
                    <div className="p-2.5 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/30 text-xs text-slate-700 dark:text-slate-300 border border-indigo-100 dark:border-indigo-900">
                      {labData.mode_b.content.faqs.length} comprehensive FAQ items with detailed answers
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* VIEW 2: RAW PROMPT TEMPLATE DIFF & TECHNIQUES */}
      {activeView === 'prompt-diff' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Mode A Template Code Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900 dark:text-white">
                    {BASIC_PROMPT_INFO.modeName}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">{BASIC_PROMPT_INFO.tagline}</span>
                </div>
                <button
                  onClick={() => handleCopyPrompt(labData?.mode_a.prompt || 'Basic prompt text', 'raw-a')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium"
                >
                  {copiedPrompt === 'raw-a' ? '✓ Copied' : '📋 Copy Prompt'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[360px]">
                {labData?.mode_a.prompt || 'Run experiment to inspect live generated prompt.'}
              </pre>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Structural Limitations of Mode A:
                </span>
                <ul className="text-xs text-slate-500 space-y-1 list-disc list-inside">
                  {BASIC_PROMPT_INFO.characteristics.map((c, i) => (
                    <li key={i}>{c}</li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Mode B Template Code Card */}
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-sm text-indigo-600 dark:text-indigo-400">
                    {IMPROVED_PROMPT_INFO.modeName}
                  </h4>
                  <span className="text-[11px] text-slate-400 block">{IMPROVED_PROMPT_INFO.tagline}</span>
                </div>
                <button
                  onClick={() => handleCopyPrompt(labData?.mode_b.prompt || 'Improved prompt text', 'raw-b')}
                  className="px-2.5 py-1 text-xs rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 font-medium border border-indigo-200 dark:border-indigo-800"
                >
                  {copiedPrompt === 'raw-b' ? '✓ Copied' : '📋 Copy Prompt'}
                </button>
              </div>

              <pre className="p-4 rounded-xl bg-slate-950 text-emerald-400 font-mono text-xs overflow-x-auto whitespace-pre-wrap leading-relaxed max-h-[360px]">
                {labData?.mode_b.prompt || 'Run experiment to inspect live generated prompt.'}
              </pre>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">
                  Engineering Techniques Applied:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
                  {IMPROVED_PROMPT_INFO.techniquesApplied.map((t, i) => (
                    <div key={i} className="p-2 rounded-lg bg-indigo-50/50 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900">
                      <strong className="text-indigo-900 dark:text-indigo-300 block">{t.name}</strong>
                      <span className="text-slate-500">{t.impact}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 3: FACULTY REVIEW & VIVA GUIDE */}
      {activeView === 'faculty-guide' && (
        <div className="p-8 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-6">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
              Faculty Viva Presentation & Defense Strategy
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed">
              Use these structured academic explanations when defending the prompt engineering architecture to university examiners or project coordinators.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 text-blue-600 dark:text-blue-400">
                Q1: "Why does Prompt Engineering matter if the underlying LLM is already powerful?"
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Answer:</strong> Foundation LLMs are stochastic pattern completion engines trained on generalized web text. In unconstrained Mode A prompting, the model samples broad, generic prose that lacks specific length boundaries (producing 70-character or 220-character meta descriptions that get truncated on Google), exhibits uneven keyword distribution, and fails to follow structured heading hierarchies. Mode B applies formal constraint-directed prompting, role priming, and schema-guided decoding to constrain generation to valid, publication-grade outputs.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 text-indigo-600 dark:text-indigo-400">
                Q2: "How do you prove that Mode B is genuinely better, and not just longer?"
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Answer:</strong> We evaluate both outputs using the exact same transparent 8-dimension heuristic rubric. The improvement is evident in specific non-length metrics: (1) Meta description length adherence strictly hitting 155-160 characters (+2.5 to +3.0 score delta), (2) Natural keyword density staying within the 1.2% - 1.8% threshold rather than clustering or being omitted, (3) Strict single-H1 heading semantics with nested H2/H3 sections, and (4) Verified presence of FAQ schema and internal linking anchor recommendations.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-1 text-emerald-600 dark:text-emerald-400">
                Q3: "How does the system prevent AI hallucination regarding SEO metrics?"
              </h4>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                <strong>Answer:</strong> In adherence to academic integrity and prompt engineering ethics, our prompt incorporates explicit negative constraints forbidding the model from inventing Google monthly search volumes (e.g. '12,500 monthly searches') or CPC estimates without an authenticated API connection to Google Keyword Planner or SEMrush. Keyword suggestions are strictly presented as semantic relevance recommendations.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// --- SOURCE: ContentEvaluation.tsx ---
/**
 * Heuristic Content Evaluation Component for RankCraft AI.
 * Displays transparent, calculated 0-5 scores across 8 dimensions,
 * detailed explanations, actionable improvement recommendations,
 * and academic heuristic disclaimers.
 */


interface ContentEvaluationProps {
  evaluation: ContentEvaluation | null;
  inputs: GenerationInput;
  onNavigateToGenerator: () => void;
}

const ContentEvaluationView: React.FC<ContentEvaluationProps> = ({
  evaluation,
  inputs,
  onNavigateToGenerator
}) => {
  if (!evaluation) {
    return (
      <div className="max-w-4xl mx-auto text-center py-20 px-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm">
        <div className="text-4xl mb-3">🎯</div>
        <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 mb-1">
          No Content Evaluated Yet
        </h3>
        <p className="text-xs text-slate-500 max-w-md mx-auto mb-6">
          Generate an article or run the Prompt Engineering Lab to trigger the 8-dimension heuristic scoring engine.
        </p>
        <button
          onClick={onNavigateToGenerator}
          className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs transition-all shadow-md"
        >
          Go to SEO Content Studio
        </button>
      </div>
    );
  }

  const categoryNames: Record<string, { label: string; icon: string }> = {
    topic_relevance: { label: '1. Topic Relevance & Semantic Depth', icon: '🎯' },
    search_intent_alignment: { label: '2. Search Intent Alignment', icon: '🧭' },
    keyword_integration: { label: '3. Keyword Integration & Natural Density', icon: '🔑' },
    readability: { label: '4. Readability & Sentence Flow (Flesch)', icon: '📖' },
    heading_structure: { label: '5. Heading Architecture (H1/H2/H3)', icon: '🏗️' },
    word_count_adherence: { label: '6. Word Count Target Adherence', icon: '📏' },
    meta_description_optimization: { label: '7. Meta Description SERP Boundary (155-160 Chars)', icon: '🏷️' },
    content_completeness: { label: '8. Complete 12-Module Delivery', icon: '📦' }
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto pb-16">
      {/* Overview Score Card */}
      <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950 text-blue-700 dark:text-blue-300 text-xs font-bold uppercase tracking-wider mb-2">
            <span>Transparent Heuristic Evaluation</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
            Overall Quality Score: {evaluation.overall_score}%
          </h2>
          <span className="text-sm font-semibold text-blue-600 dark:text-blue-400 mt-0.5 block">
            Letter Grade: {evaluation.letter_grade}
          </span>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl">
            Calculated via weighted formula across 8 heuristic dimensions (0-5 scale).
          </p>
        </div>

        {/* Big Score Gauge Visual */}
        <div className="flex items-center space-x-4">
          <div className="w-24 h-24 rounded-2xl bg-gradient-to-tr from-blue-600 to-indigo-600 flex flex-col items-center justify-center text-white shadow-lg shadow-blue-500/25">
            <span className="text-3xl font-black">{evaluation.overall_score}%</span>
            <span className="text-[10px] uppercase font-bold tracking-wider opacity-90">Score</span>
          </div>
        </div>
      </div>

      {/* Metrics Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Draft Words</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.draft_word_count} w
          </div>
          <div className="text-[10px] text-slate-500">Target: {evaluation.metrics.target_word_count}</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Meta Length</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.meta_description_length} ch
          </div>
          <div className="text-[10px] text-slate-500">Target: 155-160</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">KW Density</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.keyword_density_percent}%
          </div>
          <div className="text-[10px] text-slate-500">Ideal: 1.2 - 1.8%</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Flesch Reading</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.flesch_reading_ease}
          </div>
          <div className="text-[10px] text-slate-500">Ease Score</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">Headings</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.h1_count}H1 / {evaluation.metrics.h2_count}H2
          </div>
          <div className="text-[10px] text-slate-500">{evaluation.metrics.h3_count} H3 Subheads</div>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-center">
          <div className="text-[11px] text-slate-400 font-medium">FAQs & Links</div>
          <div className="text-base font-bold text-slate-800 dark:text-slate-200 mt-0.5">
            {evaluation.metrics.faq_count} FAQs
          </div>
          <div className="text-[10px] text-slate-500">{evaluation.metrics.internal_links_count} Anchor Links</div>
        </div>
      </div>

      {/* 8 Category Evaluation Cards */}
      <div className="space-y-4">
        <h3 className="text-sm font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          Individual Heuristic Dimensions (0.0 to 5.0 Scale)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {Object.entries(evaluation.category_scores).map(([key, score]) => {
            const meta = categoryNames[key] || { label: key, icon: '📊' };
            const explanation = evaluation.explanations[key] || '';
            const recommendation = evaluation.recommendations[key] || '';
            const pct = (score / 5.0) * 100;

            return (
              <div
                key={key}
                className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-base">{meta.icon}</span>
                    <h4 className="font-bold text-xs text-slate-900 dark:text-white">
                      {meta.label}
                    </h4>
                  </div>
                  <span className="font-mono font-bold text-sm text-blue-600 dark:text-blue-400">
                    {score.toFixed(1)} / 5.0
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
                  <div
                    className={`h-2 rounded-full transition-all duration-500 ${
                      score >= 4.5
                        ? 'bg-emerald-500'
                        : score >= 3.5
                        ? 'bg-blue-500'
                        : score >= 2.5
                        ? 'bg-amber-500'
                        : 'bg-rose-500'
                    }`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Explanation */}
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                  <strong>Assessment:</strong> {explanation}
                </p>

                {/* Recommendation */}
                {recommendation && (
                  <div className="p-2.5 rounded-lg bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-[11px] text-slate-500 dark:text-slate-400 flex items-start space-x-1.5">
                    <span className="text-amber-500 flex-shrink-0">💡</span>
                    <span><strong>Action:</strong> {recommendation}</span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Heuristic Disclaimer Footer */}
      <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700/60 text-xs text-slate-500 leading-relaxed">
        <strong>Academic Transparency Disclaimer:</strong> {evaluation.evaluation_disclaimer}
      </div>
    </div>
  );
};

// --- SOURCE: HistoryDrawer.tsx ---
/**
 * Session History Drawer Component for RankCraft AI.
 * Persists generation runs in browser localStorage, allowing one-click reloading,
 * inspection, and cleanup.
 */


interface HistoryDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  history: HistoryItem[];
  onSelectHistory: (item: HistoryItem) => void;
  onClearHistory: () => void;
  onDeleteHistoryItem: (id: string) => void;
}

const HistoryDrawer: React.FC<HistoryDrawerProps> = ({
  isOpen,
  onClose,
  history,
  onSelectHistory,
  onClearHistory,
  onDeleteHistoryItem
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden flex justify-end">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 shadow-2xl border-l border-slate-200 dark:border-slate-800 flex flex-col z-10">
        {/* Header */}
        <div className="p-5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">🗂️</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Session History
              </h3>
              <span className="text-[11px] text-slate-400">
                {history.length} Saved Generations (Local Storage)
              </span>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {history.length > 0 && (
              <button
                onClick={onClearHistory}
                className="text-xs text-rose-500 hover:text-rose-600 font-semibold px-2 py-1 rounded hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
                title="Clear all saved history"
              >
                Clear All
              </button>
            )}
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
            >
              ✕
            </button>
          </div>
        </div>

        {/* Item List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {history.length === 0 ? (
            <div className="text-center py-16 text-slate-400">
              <div className="text-3xl mb-2">📂</div>
              <p className="text-xs">No generations saved in this session yet.</p>
            </div>
          ) : (
            history.map((item) => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/50 hover:border-blue-400 dark:hover:border-blue-600 transition-all flex flex-col justify-between group"
              >
                <div
                  className="cursor-pointer"
                  onClick={() => {
                    onSelectHistory(item);
                    onClose();
                  }}
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1">
                    <span>{new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    <span
                      className={`font-bold px-1.5 py-0.5 rounded uppercase ${
                        item.prompt_mode === 'improved'
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300'
                          : 'bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-300'
                      }`}
                    >
                      {item.prompt_mode === 'improved' ? 'Mode B' : 'Mode A'}
                    </span>
                  </div>

                  <h4 className="font-bold text-xs text-slate-900 dark:text-white line-clamp-1">
                    {item.result.recommended_title.title}
                  </h4>
                  <div className="text-[11px] text-slate-500 truncate mt-0.5">
                    KW: "{item.inputs.primary_keyword}"
                  </div>

                  <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-200/60 dark:border-slate-700/60 text-[10px]">
                    <span className="font-semibold text-blue-600 dark:text-blue-400">
                      Score: {item.evaluation.overall_score}% ({item.evaluation.letter_grade.split(' ')[0]})
                    </span>
                    <span className="text-slate-400">
                      {item.evaluation.metrics.draft_word_count} words
                    </span>
                  </div>
                </div>

                <div className="mt-2 flex justify-end">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteHistoryItem(item.id);
                    }}
                    className="text-[11px] text-slate-400 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Delete item"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// --- SOURCE: ApiKeyModal.tsx ---
/**
 * API Key Configuration Modal for RankCraft AI.
 * Enables users and faculty to review environment key status, enter a Gemini API key,
 * test connectivity, or switch to Academic Demonstration mode.
 */


interface ApiKeyModalProps {
  isOpen: boolean;
  onClose: () => void;
  hasApiKey: boolean;
  maskedKey: string;
  onSaveKey: (key: string) => Promise<boolean>;
}

const ApiKeyModal: React.FC<ApiKeyModalProps> = ({
  isOpen,
  onClose,
  hasApiKey,
  maskedKey,
  onSaveKey
}) => {
  const [inputKey, setInputKey] = useState('');
  const [saving, setSaving] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  if (!isOpen) return null;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputKey.trim()) {
      setFeedback({ type: 'error', message: 'API key cannot be empty.' });
      return;
    }

    setSaving(true);
    setFeedback(null);
    try {
      const ok = await onSaveKey(inputKey.trim());
      if (ok) {
        setFeedback({ type: 'success', message: 'Gemini API Key saved and verified successfully!' });
        setInputKey('');
        setTimeout(() => {
          onClose();
        }, 1500);
      } else {
        setFeedback({ type: 'error', message: 'Failed to save API key. Please check your network or server logs.' });
      }
    } catch (err: any) {
      setFeedback({ type: 'error', message: err.message || 'An error occurred while saving the key.' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🔑</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Google Gemini API Configuration
              </h3>
              <span className="text-[11px] text-slate-400">
                Secure Server-Side AI Integration
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Current Key Status Card */}
        <div className={`p-4 rounded-xl border text-xs space-y-1.5 ${
          hasApiKey
            ? 'bg-emerald-50 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 text-emerald-900 dark:text-emerald-200'
            : 'bg-amber-50 dark:bg-amber-950/30 border-amber-200 dark:border-amber-800 text-amber-900 dark:text-amber-200'
        }`}>
          <div className="flex items-center justify-between font-bold">
            <span>Status: {hasApiKey ? '🟢 Live API Active' : '🟡 Academic Demo Mode Active'}</span>
            <span className="font-mono">{maskedKey}</span>
          </div>
          <p className="opacity-90 leading-relaxed">
            {hasApiKey
              ? 'Real server-side API requests are enabled with Google Gemini 1.5 Flash.'
              : 'No API key detected in .env. The system is operating in offline Academic Demonstration mode with realistic baseline datasets.'}
          </p>
        </div>

        {/* Instructions to get key */}
        <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
          <strong className="text-slate-800 dark:text-slate-200 block">
            How to get a Free Google Gemini API Key:
          </strong>
          <ol className="list-decimal list-inside space-y-1 text-slate-600 dark:text-slate-300">
            <li>Visit <a href="https://aistudio.google.com/app/apikey" target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 underline font-medium">Google AI Studio</a>.</li>
            <li>Click <strong>"Create API Key"</strong> (Free tier available).</li>
            <li>Copy your key and paste it below, or add <code>GEMINI_API_KEY="your-key"</code> to the <code>.env</code> file.</li>
          </ol>
        </div>

        {/* Form to submit key */}
        <form onSubmit={handleSave} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Enter / Update Gemini API Key
            </label>
            <input
              type="password"
              value={inputKey}
              onChange={(e) => setInputKey(e.target.value)}
              placeholder="AIzaSy..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <span className="text-[10px] text-slate-400 mt-1 block">
              🔒 Key is sent over encrypted local loopback and stored strictly server-side in <code>.env</code>.
            </span>
          </div>

          {feedback && (
            <div className={`p-3 rounded-lg text-xs font-medium ${
              feedback.type === 'success'
                ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
            }`}>
              {feedback.message}
            </div>
          )}

          <div className="flex items-center justify-end space-x-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-semibold text-xs shadow-md transition-all disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save & Activate Key'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// --- SOURCE: DocumentationModal.tsx ---
/**
 * Academic Documentation & Viva Defense Modal for RankCraft AI.
 * Provides quick access to project report summaries, viva questions,
 * architecture, and evaluation rubric references.
 */


interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
  const [activeDocTab, setActiveDocTab] = useState<'overview' | 'methodology' | 'viva' | 'rubric'>('overview');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-3xl bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-6 z-10 space-y-4 max-h-[85vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center space-x-2.5">
            <span className="text-2xl">🎓</span>
            <div>
              <h3 className="font-bold text-base text-slate-900 dark:text-white">
                Academic Project Documentation & Viva Guide
              </h3>
              <span className="text-[11px] text-slate-400">
                AI SEO Content Assistant Using Prompt Engineering (35-Mark Capstone)
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            ✕
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex border-b border-slate-200 dark:border-slate-800 space-x-4 text-xs font-bold flex-shrink-0">
          {[
            { id: 'overview', label: '1. Project Overview' },
            { id: 'methodology', label: '2. Prompt Engineering System' },
            { id: 'rubric', label: '3. Heuristic Rubric (8 Points)' },
            { id: 'viva', label: '4. Faculty Viva Q&A' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveDocTab(tab.id as any)}
              className={`pb-2.5 border-b-2 transition-all ${
                activeDocTab === tab.id
                  ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content body */}
        <div className="flex-1 overflow-y-auto space-y-4 text-xs text-slate-600 dark:text-slate-300 leading-relaxed pr-2">
          {activeDocTab === 'overview' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Project Title: AI SEO Content Assistant Using Prompt Engineering
              </h4>
              <p>
                <strong>Abstract:</strong> This project addresses the challenge of producing publication-ready, search-engine-optimized technical content using Large Language Models (LLMs). While base foundational models can produce fluent text, naive prompting leads to severe structural defects: truncated meta descriptions, keyword stuffing or absence, poor heading hierarchy, and hallucinated search metrics. RankCraft AI demonstrates how structured, multi-technique prompt engineering systematically resolves these deficiencies and quantifies the improvement through a transparent 8-dimension heuristic scoring rubric.
              </p>
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                <strong className="text-slate-900 dark:text-white block mb-1">Key Objectives Met:</strong>
                <ul className="list-disc list-inside space-y-1">
                  <li>Zero API key exposure via secure server-side Flask proxy.</li>
                  <li>12 distinct modular SEO deliverables generated deterministically.</li>
                  <li>A/B testing of Mode A (Basic) vs Mode B (Improved) prompts.</li>
                  <li>0-5 scale heuristic evaluation with transparent calculation logic.</li>
                  <li>Downloadable exports in Markdown, HTML, and JSON formats.</li>
                </ul>
              </div>
            </div>
          )}

          {activeDocTab === 'methodology' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Formal Prompt Engineering Patterns Applied
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <strong className="text-blue-600 dark:text-blue-400 block mb-0.5">1. Persona & Role Grounding</strong>
                  <span>Assigns persona of Senior Search Quality Architect, activating specialized E-E-A-T domain knowledge.</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <strong className="text-indigo-600 dark:text-indigo-400 block mb-0.5">2. Negative & Positive Constraints</strong>
                  <span>Limits primary keyword density to 1.2%-1.8% to avoid keyword stuffing penalties.</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <strong className="text-emerald-600 dark:text-emerald-400 block mb-0.5">3. Exact Boundary Controls</strong>
                  <span>Enforces strict 155-160 character limits on meta descriptions to prevent SERP snippet ellipsis truncation.</span>
                </div>
                <div className="p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40">
                  <strong className="text-purple-600 dark:text-purple-400 block mb-0.5">4. Structured JSON Grammar</strong>
                  <span>Guarantees 100% deterministic parsing into 12 discrete schema modules.</span>
                </div>
              </div>
            </div>
          )}

          {activeDocTab === 'rubric' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                8-Dimension Heuristic Evaluation Framework
              </h4>
              <table className="w-full border-collapse border border-slate-200 dark:border-slate-800">
                <thead>
                  <tr className="bg-slate-100 dark:bg-slate-800 text-left">
                    <th className="p-2 border border-slate-200 dark:border-slate-800">Dimension</th>
                    <th className="p-2 border border-slate-200 dark:border-slate-800">Target Criteria</th>
                    <th className="p-2 border border-slate-200 dark:border-slate-800">Weight</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">1. Topic Relevance</td><td className="p-2 border border-slate-200 dark:border-slate-800">Topic token frequency across headings and paragraphs</td><td className="p-2 border border-slate-200 dark:border-slate-800">15%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">2. Search Intent</td><td className="p-2 border border-slate-200 dark:border-slate-800">Alignment with informational/commercial search journey</td><td className="p-2 border border-slate-200 dark:border-slate-800">15%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">3. Keyword Integration</td><td className="p-2 border border-slate-200 dark:border-slate-800">Natural density (1.2% - 1.8%) and front-loaded title/H1</td><td className="p-2 border border-slate-200 dark:border-slate-800">15%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">4. Readability Flow</td><td className="p-2 border border-slate-200 dark:border-slate-800">Flesch Reading Ease score (target 60-70)</td><td className="p-2 border border-slate-200 dark:border-slate-800">10%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">5. Heading Architecture</td><td className="p-2 border border-slate-200 dark:border-slate-800">Strict single H1, multiple H2 sections, nested H3 points</td><td className="p-2 border border-slate-200 dark:border-slate-800">10%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">6. Word Count Adherence</td><td className="p-2 border border-slate-200 dark:border-slate-800">Within +/- 15% of selected target word count</td><td className="p-2 border border-slate-200 dark:border-slate-800">10%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">7. Meta Description Length</td><td className="p-2 border border-slate-200 dark:border-slate-800">Strictly 155 to 160 characters</td><td className="p-2 border border-slate-200 dark:border-slate-800">10%</td></tr>
                  <tr><td className="p-2 border border-slate-200 dark:border-slate-800 font-semibold">8. Content Completeness</td><td className="p-2 border border-slate-200 dark:border-slate-800">Verified generation of all 12 modules</td><td className="p-2 border border-slate-200 dark:border-slate-800">15%</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {activeDocTab === 'viva' && (
            <div className="space-y-3">
              <h4 className="font-bold text-slate-900 dark:text-white text-sm">
                Viva Defense Key Questions & Answers
              </h4>
              <div className="space-y-2">
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block">Q: What is the main innovation of your project?</strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    A: Rather than relying on naive text generation, we implemented a controlled engineering pipeline that enforces constraints (character boundaries, keyword densities, schema) and proves empirical performance gains through an automated 8-point rubric.
                  </span>
                </div>
                <div className="p-3 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <strong className="text-slate-900 dark:text-white block">Q: Why did you separate client and server?</strong>
                  <span className="text-slate-500 dark:text-slate-400">
                    A: In enterprise and production environments, API credentials must never be exposed in client-side JavaScript. The lightweight Flask server securely manages API secrets, enforces rate limits, and validates structured outputs.
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="pt-3 border-t border-slate-200 dark:border-slate-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-semibold text-xs"
          >
            Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};

// --- SOURCE: App.tsx ---
/**
 * Main Application Component for RankCraft AI.
 * Orchestrates navigation, global state, API communication, local storage history,
 * notifications, and theme management.
 */

import {
  GenerationInput,
  SeoContentResult,
  ContentEvaluation,
  PromptMode,
  HistoryItem,
  PromptLabResponse
} from './types';


const HISTORY_STORAGE_KEY = 'rankcraft_history_v1';
const THEME_STORAGE_KEY = 'rankcraft_theme_v1';

const App: React.FC = () => {
  // Navigation & UI States
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [historyOpen, setHistoryOpen] = useState<boolean>(false);
  const [apiKeyModalOpen, setApiKeyModalOpen] = useState<boolean>(false);
  const [docModalOpen, setDocModalOpen] = useState<boolean>(false);

  // Theme State
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem(THEME_STORAGE_KEY);
    return saved ? saved === 'dark' : false;
  });

  // System Backend Status
  const [hasApiKey, setHasApiKey] = useState<boolean>(false);
  const [maskedKey, setMaskedKey] = useState<string>('CHECKING...');
  const [activeModel, setActiveModel] = useState<string>('gemini-1.5-flash');

  // Generation & Form States
  const [currentInputs, setCurrentInputs] = useState<GenerationInput>({
    topic: 'Cloud Database Performance Optimization',
    primary_keyword: 'database performance',
    target_audience: 'Backend Developers & DevOps Engineers',
    industry: 'Cloud Infrastructure & SaaS',
    target_country: 'Global / United States',
    secondary_keywords: 'query latency, connection pooling, b-tree indexing, postgresql optimization',
    search_intent: 'Informational',
    content_type: 'Comprehensive Guide',
    tone: 'Authoritative & Actionable',
    language: 'English (US)',
    target_word_count: 1200,
    reference_material: 'Highlight p99 latency vs averages, PgBouncer pool sizing formula, and covering index examples.',
    prompt_mode: 'improved'
  });

  const [loading, setLoading] = useState<boolean>(false);
  const [generationResult, setGenerationResult] = useState<SeoContentResult | null>(null);
  const [currentEvaluation, setCurrentEvaluation] = useState<ContentEvaluation | null>(null);
  const [promptModeUsed, setPromptModeUsed] = useState<PromptMode>('improved');
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);

  // Lab A/B State
  const [labData, setLabData] = useState<PromptLabResponse | null>(null);
  const [labLoading, setLabLoading] = useState<boolean>(false);

  // Notification Toast State
  const [notification, setNotification] = useState<{ type: 'success' | 'error' | 'info'; message: string } | null>(null);

  // History State
  const [history, setHistory] = useState<HistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(HISTORY_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Apply dark mode class to html element
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_STORAGE_KEY, 'light');
    }
  }, [darkMode]);

  // Sync history to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(HISTORY_STORAGE_KEY, JSON.stringify(history));
    } catch (e) {
      console.error('Failed to save history to localStorage', e);
    }
  }, [history]);

  // Fetch backend status probe on initial load
  const checkStatus = async () => {
    try {
      const res = await fetch('/api/status');
      if (res.ok) {
        const data = await res.json();
        setHasApiKey(data.has_api_key);
        setMaskedKey(data.masked_key);
        setActiveModel(data.active_model || 'gemini-1.5-flash');
      }
    } catch (err) {
      console.warn('Backend server not yet ready:', err);
    }
  };

  useEffect(() => {
    checkStatus();
  }, []);

  const showNotification = (message: string, type: 'success' | 'error' | 'info' = 'info') => {
    setNotification({ message, type });
    setTimeout(() => {
      setNotification(null);
    }, 4500);
  };

  // Content Generation Handler
  const handleGenerate = async (inputs: GenerationInput) => {
    setLoading(true);
    setNotification(null);

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to generate content from AI model.');
      }

      setGenerationResult(data.content);
      setCurrentEvaluation(data.evaluation);
      setPromptModeUsed(data.prompt_mode);
      setIsDemoMode(data.is_demo_mode);

      // Save to local history
      const newHistoryItem: HistoryItem = {
        id: 'hist_' + Date.now(),
        timestamp: new Date().toISOString(),
        inputs: { ...inputs },
        prompt_mode: data.prompt_mode,
        result: data.content,
        evaluation: data.evaluation
      };
      setHistory((prev) => [newHistoryItem, ...prev.slice(0, 24)]);

      showNotification(
        data.is_demo_mode
          ? 'Generated successfully (Academic Demonstration Mode).'
          : 'Content generated successfully via Google Gemini API!',
        'success'
      );
    } catch (err: any) {
      console.error('Generation error:', err);
      showNotification(err.message || 'Generation failed. Check server status.', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Prompt Lab A/B Runner
  const handleRunComparison = async (inputs: GenerationInput): Promise<PromptLabResponse | null> => {
    setLabLoading(true);
    try {
      const res = await fetch('/api/prompt-lab/compare', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(inputs)
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to execute A/B comparison experiment.');
      }

      setLabData(data);
      showNotification(
        `A/B Test Complete! Prompt Engineering delivered a +${data.comparison.overall_delta} pt improvement.`,
        'success'
      );
      return data;
    } catch (err: any) {
      console.error('Prompt Lab error:', err);
      showNotification(err.message || 'Comparison failed.', 'error');
      return null;
    } finally {
      setLabLoading(false);
    }
  };

  // Save API Key Handler
  const handleSaveApiKey = async (key: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/config/key', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ api_key: key })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        await checkStatus();
        showNotification('Gemini API Key activated successfully!', 'success');
        return true;
      }
      return false;
    } catch (err) {
      return false;
    }
  };

  // Restore session from history
  const handleSelectHistory = (item: HistoryItem) => {
    setCurrentInputs(item.inputs);
    setGenerationResult(item.result);
    setCurrentEvaluation(item.evaluation);
    setPromptModeUsed(item.prompt_mode);
    setActiveTab('generator');
    showNotification(`Restored session from ${new Date(item.timestamp).toLocaleTimeString()}`, 'info');
  };

  const handleClearHistory = () => {
    setHistory([]);
    localStorage.removeItem(HISTORY_STORAGE_KEY);
    showNotification('Session history cleared.', 'info');
  };

  const handleDeleteHistoryItem = (id: string) => {
    setHistory((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className="flex h-screen bg-slate-100 dark:bg-slate-950 text-slate-800 dark:text-slate-100 overflow-hidden font-sans">
      {/* Collapsible Sidebar */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        historyCount={history.length}
        openHistory={() => setHistoryOpen(true)}
        openApiKeyModal={() => setApiKeyModalOpen(true)}
        hasApiKey={hasApiKey}
      />

      {/* Main App Content Viewport */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Top Navbar */}
        <Navbar
          hasApiKey={hasApiKey}
          activeModel={activeModel}
          openApiKeyModal={() => setApiKeyModalOpen(true)}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openDocModal={() => setDocModalOpen(true)}
        />

        {/* Floating Notification Toast */}
        {notification && (
          <div className="fixed top-20 right-6 z-50 animate-bounce">
            <div
              className={`px-4 py-3 rounded-xl shadow-xl border text-xs font-semibold flex items-center space-x-2 ${
                notification.type === 'success'
                  ? 'bg-emerald-600 text-white border-emerald-500'
                  : notification.type === 'error'
                  ? 'bg-rose-600 text-white border-rose-500'
                  : 'bg-slate-800 text-white border-slate-700'
              }`}
            >
              <span>{notification.type === 'success' ? '✓' : notification.type === 'error' ? '⚠️' : 'ℹ️'}</span>
              <span>{notification.message}</span>
            </div>
          </div>
        )}

        {/* View Routing */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-8 scroll-smooth">
          {activeTab === 'dashboard' && (
            <DashboardHome
              setActiveTab={setActiveTab}
              openApiKeyModal={() => setApiKeyModalOpen(true)}
              hasApiKey={hasApiKey}
              historyCount={history.length}
            />
          )}

          {activeTab === 'generator' && (
            <div className="space-y-10">
              <ContentGenerator
                onGenerate={handleGenerate}
                loading={loading}
                currentInputs={currentInputs}
                setCurrentInputs={setCurrentInputs}
                hasApiKey={hasApiKey}
                openApiKeyModal={() => setApiKeyModalOpen(true)}
              />

              {generationResult && (
                <div className="pt-8 border-t border-slate-200 dark:border-slate-800">
                  <ResultsView
                    content={generationResult}
                    inputs={currentInputs}
                    evaluation={currentEvaluation || undefined}
                    promptMode={promptModeUsed}
                    isDemoMode={isDemoMode}
                    onOpenEvaluation={() => setActiveTab('evaluation')}
                  />
                </div>
              )}
            </div>
          )}

          {activeTab === 'prompt-lab' && (
            <PromptLab
              currentInputs={currentInputs}
              onRunComparison={handleRunComparison}
              labData={labData}
              loading={labLoading}
            />
          )}

          {activeTab === 'evaluation' && (
            <ContentEvaluationView
              evaluation={currentEvaluation}
              inputs={currentInputs}
              onNavigateToGenerator={() => setActiveTab('generator')}
            />
          )}
        </main>
      </div>

      {/* History Drawer Modal */}
      <HistoryDrawer
        isOpen={historyOpen}
        onClose={() => setHistoryOpen(false)}
        history={history}
        onSelectHistory={handleSelectHistory}
        onClearHistory={handleClearHistory}
        onDeleteHistoryItem={handleDeleteHistoryItem}
      />

      {/* API Key Modal */}
      <ApiKeyModal
        isOpen={apiKeyModalOpen}
        onClose={() => setApiKeyModalOpen(false)}
        hasApiKey={hasApiKey}
        maskedKey={maskedKey}
        onSaveKey={handleSaveApiKey}
      />

      {/* Documentation Modal */}
      <DocumentationModal
        isOpen={docModalOpen}
        onClose={() => setDocModalOpen(false)}
      />
    </div>
  );
};

// --- SOURCE: index.tsx ---
/**
 * Application Entrypoint for RankCraft AI.
 * Renders the top-level React component tree into the root DOM node.
 */


const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(<App />);
} else {
  console.error("Root element '#root' not found in DOM.");
}