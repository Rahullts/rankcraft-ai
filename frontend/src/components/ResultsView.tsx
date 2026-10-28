/**
 * Results Display Component for RankCraft AI.
 * Renders all 12 SEO modules with dedicated cards, copy buttons, character counters,
 * and download actions (Markdown, JSON, HTML).
 */

import React, { useState } from 'react';
import { SeoContentResult, GenerationInput, ContentEvaluation } from '../types';
import { copyToClipboard, downloadMarkdown, downloadJson, downloadHtml } from '../utils/exporter';

interface ResultsViewProps {
  content: SeoContentResult;
  inputs: GenerationInput;
  evaluation?: ContentEvaluation;
  promptMode: string;
  isDemoMode: boolean;
  onOpenEvaluation: () => void;
}

export const ResultsView: React.FC<ResultsViewProps> = ({
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
