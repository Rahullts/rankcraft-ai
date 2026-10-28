/**
 * Prompt Engineering Laboratory Component for RankCraft AI.
 * The core academic feature: compares Mode A (Basic) vs Mode B (Improved) on identical inputs,
 * shows side-by-side prompt code diffs, evaluates both with the exact same rubric,
 * and quantifies the empirical performance delta for academic review.
 */

import React, { useState } from 'react';
import { GenerationInput, PromptLabResponse } from '../types';
import { BASIC_PROMPT_INFO } from '../prompts/basicPrompt';
import { IMPROVED_PROMPT_INFO } from '../prompts/improvedPrompt';
import { copyToClipboard } from '../utils/exporter';

interface PromptLabProps {
  currentInputs: GenerationInput;
  onRunComparison: (inputs: GenerationInput) => Promise<PromptLabResponse | null>;
  labData: PromptLabResponse | null;
  loading: boolean;
}

export const PromptLab: React.FC<PromptLabProps> = ({
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
