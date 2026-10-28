/**
 * Academic Documentation & Viva Defense Modal for RankCraft AI.
 * Provides quick access to project report summaries, viva questions,
 * architecture, and evaluation rubric references.
 */

import React, { useState } from 'react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({ isOpen, onClose }) => {
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
