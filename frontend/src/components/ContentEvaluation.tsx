/**
 * Heuristic Content Evaluation Component for RankCraft AI.
 * Displays transparent, calculated 0-5 scores across 8 dimensions,
 * detailed explanations, actionable improvement recommendations,
 * and academic heuristic disclaimers.
 */

import React from 'react';
import { ContentEvaluation, GenerationInput } from '../types';

interface ContentEvaluationProps {
  evaluation: ContentEvaluation | null;
  inputs: GenerationInput;
  onNavigateToGenerator: () => void;
}

export const ContentEvaluationView: React.FC<ContentEvaluationProps> = ({
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
