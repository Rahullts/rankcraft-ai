/**
 * Dashboard Landing Page for RankCraft AI.
 * Highlights project architecture, key metrics, viva presentation points,
 * and quick shortcuts to generation and prompt lab.
 */

import React from 'react';

interface DashboardHomeProps {
  setActiveTab: (tab: string) => void;
  openApiKeyModal: () => void;
  hasApiKey: boolean;
  historyCount: number;
}

export const DashboardHome: React.FC<DashboardHomeProps> = ({
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
