/**
 * Content Generation Form & Workspace Component for RankCraft AI.
 * Handles input collection, real-time validation, preset templates,
 * prompt mode selection, and submission.
 */

import React, { useState } from 'react';
import { GenerationInput, SearchIntent, ContentType, WritingTone, PromptMode } from '../types';

interface ContentGeneratorProps {
  onGenerate: (inputs: GenerationInput) => Promise<void>;
  loading: boolean;
  currentInputs: GenerationInput;
  setCurrentInputs: (inputs: GenerationInput) => void;
  hasApiKey: boolean;
  openApiKeyModal: () => void;
}

export const ContentGenerator: React.FC<ContentGeneratorProps> = ({
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
