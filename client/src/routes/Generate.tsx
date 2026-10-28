import React, { useState } from 'react';
import {
  Sparkles,
  RotateCcw,
  Download,
  Copy,
  Check,
  CheckCircle2,
  Clock,
  Layers,
  FileText,
  HelpCircle,
  ListOrdered,
  Tag,
  AlertCircle
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../state/store';
import { SeoInput, StageId } from '../state/types';
import {
  exportPackageMarkdown,
  exportPackageJson,
  exportArticleMarkdown,
  copyToClipboard,
  formatPackageMarkdown
} from '../lib/export';
import { countWords } from '../lib/text';

export const Generate: React.FC = () => {
  const { state, setInput, loadExampleInput, runPipeline, cancelPipeline } = useStore();
  const [activeTab, setActiveTab] = useState<'titles' | 'meta' | 'keywords' | 'outline' | 'article' | 'faqs' | 'checklist'>('article');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [exportMenuOpen, setExportMenuOpen] = useState(false);
  const [clientErrors, setClientErrors] = useState<Record<string, string>>({});

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const validateForm = (input: SeoInput): boolean => {
    const errors: Record<string, string> = {};

    if (!input.topic.trim()) errors.topic = 'Topic is required (3-150 chars)';
    else if (input.topic.length < 3 || input.topic.length > 150) errors.topic = 'Topic must be 3-150 characters';

    if (!input.audience.trim()) errors.audience = 'Target audience is required';
    else if (input.audience.length < 3 || input.audience.length > 100) errors.audience = 'Audience must be 3-100 characters';

    if (!input.industry.trim()) errors.industry = 'Industry is required';
    else if (input.industry.length < 2 || input.industry.length > 80) errors.industry = 'Industry must be 2-80 characters';

    if (!input.market.trim()) errors.market = 'Target market is required';
    else if (input.market.length < 2 || input.market.length > 80) errors.market = 'Market must be 2-80 characters';

    if (!input.primaryKeyword.trim()) errors.primaryKeyword = 'Primary keyword is required';
    else if (input.primaryKeyword.length < 2 || input.primaryKeyword.length > 60) errors.primaryKeyword = 'Keyword must be 2-60 characters';
    else if (input.primaryKeyword.trim().split(/\s+/).length > 6) errors.primaryKeyword = 'Keyword must be at most 6 words';

    if (!input.wordCount || input.wordCount < 300 || input.wordCount > 2000) {
      errors.wordCount = 'Target word count must be an integer between 300 and 2000';
    }

    setClientErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm(state.input)) {
      runPipeline();
    }
  };

  const stages: Array<{ id: StageId; label: string; desc: string }> = [
    { id: 'strategy', label: '1. Strategy', desc: 'Titles, meta description & keywords' },
    { id: 'outline', label: '2. Outline', desc: 'H1, H2 and H3 hierarchy' },
    { id: 'article', label: '3. Article', desc: 'Constraint-guided SEO article draft' },
    { id: 'faqs', label: '4. FAQs', desc: '5 schema-ready questions and answers' },
    { id: 'checklist', label: '5. Audit', desc: 'Deterministic 10-rule rubric evaluation' }
  ];

  const getStageStatus = (stageId: StageId) => {
    if (!state.pipelineRunning && !state.currentPackage) return 'idle';
    if (state.currentStage === stageId) return 'running';
    const stageOrder: StageId[] = ['strategy', 'outline', 'article', 'faqs', 'checklist'];
    const activeIdx = stageOrder.indexOf(state.currentStage as StageId);
    const thisIdx = stageOrder.indexOf(stageId);
    if (thisIdx < activeIdx || state.currentStage === 'done' || (!state.pipelineRunning && state.currentPackage)) {
      return 'completed';
    }
    return 'pending';
  };

  const currentPkg = state.currentPackage;
  const metaLength = currentPkg?.strategy?.metaDescription ? currentPkg.strategy.metaDescription.length : 0;
  const isMetaLengthValid = metaLength >= 155 && metaLength <= 160;

  return (
    <div className="generate-page">
      {/* Page Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">SEO Content Generation Workspace</h2>
          <p className="page-subtitle">
            Four-stage staged prompting pipeline transforming your topic into a fully audited SEO content package.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            type="button"
            className="btn btn-secondary btn-sm"
            onClick={loadExampleInput}
            disabled={state.pipelineRunning}
          >
            <RotateCcw size={16} />
            <span>Load Sample Inputs</span>
          </button>
        </div>
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="card input-card">
        <div className="card-header">
          <div className="card-title-group">
            <Sparkles className="card-header-icon text-primary" size={20} />
            <h3 className="card-title">Content Parameters & Target Scope</h3>
          </div>
          <span className="text-muted text-sm">* All fields validated on client and server</span>
        </div>

        <div className="card-body">
          {/* Group 1: Core Topic & Keyword */}
          <div className="form-section">
            <h4 className="form-section-title">1. Core Topic & Primary Keyword</h4>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="topic">
                  Topic <span className="req">*</span>
                </label>
                <input
                  id="topic"
                  type="text"
                  className={`form-input ${clientErrors.topic ? 'input-error' : ''}`}
                  placeholder="e.g. Growing herbs at home"
                  value={state.input.topic}
                  onChange={(e) => setInput({ topic: e.target.value })}
                  disabled={state.pipelineRunning}
                />
                {clientErrors.topic && <span className="error-text">{clientErrors.topic}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="primaryKeyword">
                  Primary Keyword <span className="req">*</span>
                </label>
                <input
                  id="primaryKeyword"
                  type="text"
                  className={`form-input ${clientErrors.primaryKeyword ? 'input-error' : ''}`}
                  placeholder="e.g. indoor herb garden"
                  value={state.input.primaryKeyword}
                  onChange={(e) => setInput({ primaryKeyword: e.target.value })}
                  disabled={state.pipelineRunning}
                />
                {clientErrors.primaryKeyword && <span className="error-text">{clientErrors.primaryKeyword}</span>}
              </div>
            </div>

            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="industry">
                  Industry / Niche <span className="req">*</span>
                </label>
                <input
                  id="industry"
                  type="text"
                  className={`form-input ${clientErrors.industry ? 'input-error' : ''}`}
                  placeholder="e.g. Home and garden"
                  value={state.input.industry}
                  onChange={(e) => setInput({ industry: e.target.value })}
                  disabled={state.pipelineRunning}
                />
                {clientErrors.industry && <span className="error-text">{clientErrors.industry}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="market">
                  Target Market / Region <span className="req">*</span>
                </label>
                <input
                  id="market"
                  type="text"
                  className={`form-input ${clientErrors.market ? 'input-error' : ''}`}
                  placeholder="e.g. United Kingdom"
                  value={state.input.market}
                  onChange={(e) => setInput({ market: e.target.value })}
                  disabled={state.pipelineRunning}
                />
                {clientErrors.market && <span className="error-text">{clientErrors.market}</span>}
              </div>
            </div>
          </div>

          {/* Group 2: Audience & Search Intent */}
          <div className="form-section">
            <h4 className="form-section-title">2. Audience & Search Intent</h4>
            <div className="form-row form-row-2">
              <div className="form-group">
                <label className="form-label" htmlFor="audience">
                  Target Audience <span className="req">*</span>
                </label>
                <input
                  id="audience"
                  type="text"
                  className={`form-input ${clientErrors.audience ? 'input-error' : ''}`}
                  placeholder="e.g. Beginner home cooks"
                  value={state.input.audience}
                  onChange={(e) => setInput({ audience: e.target.value })}
                  disabled={state.pipelineRunning}
                />
                {clientErrors.audience && <span className="error-text">{clientErrors.audience}</span>}
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="intent">
                  Search Intent <span className="req">*</span>
                </label>
                <select
                  id="intent"
                  className="form-select"
                  value={state.input.intent}
                  onChange={(e) => setInput({ intent: e.target.value as any })}
                  disabled={state.pipelineRunning}
                >
                  <option value="informational">Informational (Want to learn / how-to)</option>
                  <option value="commercial">Commercial (Comparing options / best tools)</option>
                  <option value="transactional">Transactional (Ready to purchase / download)</option>
                  <option value="navigational">Navigational (Looking for specific brand)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Group 3: Tone, Language & Word Count */}
          <div className="form-section">
            <h4 className="form-section-title">3. Tone, Language & Target Word Count</h4>
            <div className="form-row form-row-3">
              <div className="form-group">
                <label className="form-label" htmlFor="tone">
                  Writing Tone <span className="req">*</span>
                </label>
                <select
                  id="tone"
                  className="form-select"
                  value={state.input.tone}
                  onChange={(e) => setInput({ tone: e.target.value as any })}
                  disabled={state.pipelineRunning}
                >
                  <option value="professional">Professional</option>
                  <option value="friendly">Friendly</option>
                  <option value="conversational">Conversational</option>
                  <option value="authoritative">Authoritative</option>
                  <option value="persuasive">Persuasive</option>
                  <option value="educational">Educational</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="language">
                  Output Language <span className="req">*</span> <span className="text-muted text-xs font-normal">(Default: English)</span>
                </label>
                <select
                  id="language"
                  className="form-select"
                  value={state.input.language}
                  onChange={(e) => setInput({ language: e.target.value as any })}
                  disabled={state.pipelineRunning}
                >
                  <option value="English">English (Required Default)</option>
                  <option value="Tamil">Tamil</option>
                  <option value="Hindi">Hindi</option>
                  <option value="Spanish">Spanish</option>
                  <option value="French">French</option>
                  <option value="German">German</option>
                </select>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="wordCount">
                  Target Word Count <span className="req">*</span>
                </label>
                <div className="word-count-input-group">
                  <input
                    id="wordCount"
                    type="number"
                    min="300"
                    max="2000"
                    step="50"
                    className={`form-input ${clientErrors.wordCount ? 'input-error' : ''}`}
                    value={state.input.wordCount}
                    onChange={(e) => setInput({ wordCount: parseInt(e.target.value) || 0 })}
                    disabled={state.pipelineRunning}
                  />
                  <div className="preset-buttons">
                    {[500, 800, 1200, 1500].map((preset) => (
                      <button
                        key={preset}
                        type="button"
                        className={`btn-preset ${state.input.wordCount === preset ? 'active' : ''}`}
                        onClick={() => setInput({ wordCount: preset })}
                        disabled={state.pipelineRunning}
                      >
                        {preset}
                      </button>
                    ))}
                  </div>
                </div>
                {clientErrors.wordCount && <span className="error-text">{clientErrors.wordCount}</span>}
              </div>
            </div>
          </div>

          {state.error && (
            <div className="form-error-banner" role="alert">
              <AlertCircle size={18} />
              <span>{state.error}</span>
            </div>
          )}

          <div className="form-submit-row">
            <button
              type="submit"
              className="btn btn-primary btn-lg"
              disabled={state.pipelineRunning}
            >
              <Sparkles size={18} />
              <span>{state.pipelineRunning ? 'Executing Pipeline...' : 'Generate SEO Package'}</span>
            </button>

            {state.pipelineRunning && (
              <button
                type="button"
                className="btn btn-danger"
                onClick={cancelPipeline}
              >
                Cancel Generation
              </button>
            )}
          </div>
        </div>
      </form>

      {/* Pipeline Stepper */}
      {(state.pipelineRunning || currentPkg) && (
        <section className="stepper-card card">
          <div className="stepper-container">
            {stages.map((stage) => {
              const status = getStageStatus(stage.id);
              return (
                <div key={stage.id} className={`stepper-step ${status}`}>
                  <div className="step-circle">
                    {status === 'completed' ? (
                      <Check size={16} />
                    ) : status === 'running' ? (
                      <span className="step-spinner" />
                    ) : (
                      <span>{stage.label.split('.')[0]}</span>
                    )}
                  </div>
                  <div className="step-info">
                    <span className="step-name">{stage.label}</span>
                    <span className="step-desc">{stage.desc}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Generated Content Showcase */}
      {currentPkg && (
        <section className="results-container">
          <div className="results-header">
            <div className="results-title-group">
              <h3 className="results-title">Generated SEO Content Package</h3>
              <span className="results-meta">
                Generated in {((currentPkg.meta.totalDurationMs || 0) / 1000).toFixed(1)}s · {currentPkg.meta.isMock ? 'Mock Provider' : 'Live LLM Provider'}
              </span>
            </div>

            {/* Export Menu Dropdown */}
            <div className="export-menu-container">
              <button
                type="button"
                className="btn btn-secondary"
                onClick={() => setExportMenuOpen(!exportMenuOpen)}
                aria-expanded={exportMenuOpen}
              >
                <Download size={16} />
                <span>Export Package</span>
              </button>

              {exportMenuOpen && (
                <div className="export-dropdown" onMouseLeave={() => setExportMenuOpen(false)}>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      exportPackageMarkdown(currentPkg);
                      setExportMenuOpen(false);
                    }}
                  >
                    <Download size={14} />
                    <span>Download Package (.md)</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      exportPackageJson(currentPkg);
                      setExportMenuOpen(false);
                    }}
                  >
                    <Download size={14} />
                    <span>Download Package (.json)</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      exportArticleMarkdown(currentPkg);
                      setExportMenuOpen(false);
                    }}
                  >
                    <Download size={14} />
                    <span>Download Article Only (.md)</span>
                  </button>
                  <button
                    type="button"
                    className="dropdown-item"
                    onClick={() => {
                      handleCopy('export-all', formatPackageMarkdown(currentPkg));
                      setExportMenuOpen(false);
                    }}
                  >
                    <Copy size={14} />
                    <span>{copiedId === 'export-all' ? 'Copied Full Markdown!' : 'Copy Full Markdown'}</span>
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* ARIA Tabs Navigation */}
          <div className="tabs-nav" role="tablist">
            <button
              role="tab"
              aria-selected={activeTab === 'article'}
              className={`tab-btn ${activeTab === 'article' ? 'active' : ''}`}
              onClick={() => setActiveTab('article')}
            >
              <FileText size={16} />
              <span>Article Draft</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'titles'}
              className={`tab-btn ${activeTab === 'titles' ? 'active' : ''}`}
              onClick={() => setActiveTab('titles')}
            >
              <ListOrdered size={16} />
              <span>SEO Titles (5)</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'meta'}
              className={`tab-btn ${activeTab === 'meta' ? 'active' : ''}`}
              onClick={() => setActiveTab('meta')}
            >
              <Tag size={16} />
              <span>Meta Description</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'keywords'}
              className={`tab-btn ${activeTab === 'keywords' ? 'active' : ''}`}
              onClick={() => setActiveTab('keywords')}
            >
              <Sparkles size={16} />
              <span>Keywords</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'outline'}
              className={`tab-btn ${activeTab === 'outline' ? 'active' : ''}`}
              onClick={() => setActiveTab('outline')}
            >
              <Layers size={16} />
              <span>Outline</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'faqs'}
              className={`tab-btn ${activeTab === 'faqs' ? 'active' : ''}`}
              onClick={() => setActiveTab('faqs')}
            >
              <HelpCircle size={16} />
              <span>FAQs (5)</span>
            </button>
            <button
              role="tab"
              aria-selected={activeTab === 'checklist'}
              className={`tab-btn ${activeTab === 'checklist' ? 'active' : ''}`}
              onClick={() => setActiveTab('checklist')}
            >
              <CheckCircle2 size={16} />
              <span>Quality Checklist</span>
              {currentPkg.evaluation && (
                <span className="tab-score-chip">
                  {currentPkg.evaluation.totalPoints} pts
                </span>
              )}
            </button>
          </div>

          {/* Tab 1: Titles */}
          {activeTab === 'titles' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">SEO Title Suggestions with Angle Classifications</h4>
                  <span className="text-muted text-sm">Target: 30-60 characters each</span>
                </div>
                <div className="card-body">
                  <div className="titles-list">
                    {currentPkg.strategy?.titles.map((title, i) => (
                      <div key={i} className="title-item-card">
                        <div className="title-item-header">
                          <span className="title-num">0{i + 1}</span>
                          <span className="title-angle-badge">{title.angle}</span>
                          <span className={`title-len-badge ${title.text.length >= 30 && title.text.length <= 60 ? 'good' : 'warning'}`}>
                            {title.text.length} chars
                          </span>
                        </div>
                        <h4 className="title-text">{title.text}</h4>
                        <div className="title-item-actions">
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleCopy(`title-${i}`, title.text)}
                          >
                            {copiedId === `title-${i}` ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedId === `title-${i}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Meta Description */}
          {activeTab === 'meta' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Meta Description (Snippet Target: 155-160 Chars)</h4>
                  <div className={`char-counter-pill ${isMetaLengthValid ? 'pill-good' : 'pill-warn'}`}>
                    <span>{metaLength} / 160 chars</span>
                    {isMetaLengthValid ? ' · Optimal' : ' · Needs adjustment'}
                  </div>
                </div>
                <div className="card-body">
                  <div className="meta-preview-box">
                    <div className="serp-preview">
                      <span className="serp-url">https://example.com/blog/{currentPkg.input.primaryKeyword.replace(/\s+/g, '-')}</span>
                      <h4 className="serp-title">{currentPkg.strategy?.titles[0]?.text || 'Title Preview'}</h4>
                      <p className="serp-meta">{currentPkg.strategy?.metaDescription}</p>
                    </div>
                  </div>
                  <div className="card-action-row">
                    <button
                      className="btn btn-secondary btn-sm"
                      onClick={() => handleCopy('meta-desc', currentPkg.strategy?.metaDescription || '')}
                    >
                      {copiedId === 'meta-desc' ? <Check size={14} /> : <Copy size={14} />}
                      <span>{copiedId === 'meta-desc' ? 'Copied' : 'Copy Description'}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Keywords */}
          {activeTab === 'keywords' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Target Keyword Clusters</h4>
                  <span className="text-muted text-sm">Academic policy: Zero unverified search volume metrics</span>
                </div>
                <div className="card-body">
                  <div className="keyword-section">
                    <h5 className="kw-heading">Primary Keyword</h5>
                    <div className="kw-tag-group">
                      <span className="kw-tag kw-primary">{currentPkg.strategy?.keywords.primary}</span>
                    </div>
                  </div>

                  <div className="keyword-section">
                    <h5 className="kw-heading">Secondary Keyword Cluster ({currentPkg.strategy?.keywords.secondary.length || 0})</h5>
                    <div className="kw-tag-group">
                      {currentPkg.strategy?.keywords.secondary.map((kw, i) => (
                        <span key={i} className="kw-tag kw-secondary">{kw}</span>
                      ))}
                    </div>
                  </div>

                  <div className="keyword-section">
                    <h5 className="kw-heading">Long-Tail Search Queries ({currentPkg.strategy?.keywords.longTail.length || 0})</h5>
                    <div className="kw-tag-group">
                      {currentPkg.strategy?.keywords.longTail.map((kw, i) => (
                        <span key={i} className="kw-tag kw-longtail">{kw}</span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 4: Outline */}
          {activeTab === 'outline' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Hierarchical Content Outline (Stage 2 Output)</h4>
                  <button
                    className="btn btn-ghost btn-sm"
                    onClick={() => {
                      const outlineText = currentPkg.outline?.sections
                        .map((s) => `## ${s.h2}\n${s.h3.map((sub) => `- ${sub}`).join('\n')}`)
                        .join('\n\n');
                      handleCopy('outline-copy', outlineText || '');
                    }}
                  >
                    {copiedId === 'outline-copy' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === 'outline-copy' ? 'Copied' : 'Copy Outline'}</span>
                  </button>
                </div>
                <div className="card-body">
                  <div className="outline-tree">
                    {currentPkg.outline?.sections.map((sec, i) => (
                      <div key={i} className="outline-h2-box">
                        <div className="outline-h2-header">
                          <span className="h2-badge">H2</span>
                          <h4 className="h2-title">{sec.h2}</h4>
                        </div>
                        <ul className="outline-h3-list">
                          {sec.h3.map((sub, j) => (
                            <li key={j} className="outline-h3-item">
                              <span className="h3-badge">H3</span>
                              <span>{sub}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 5: Article */}
          {activeTab === 'article' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <div className="article-meta-header">
                    <h4 className="card-title">Full SEO-Friendly Article Draft</h4>
                    <div className="article-stats">
                      <span className="stat-pill">
                        <FileText size={14} />
                        <span>{countWords(currentPkg.articleMarkdown || '')} words</span>
                      </span>
                      <span className="stat-pill">
                        <Clock size={14} />
                        <span>~{Math.ceil(countWords(currentPkg.articleMarkdown || '') / 200)} min read</span>
                      </span>
                    </div>
                  </div>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => handleCopy('article-markdown', currentPkg.articleMarkdown || '')}
                  >
                    {copiedId === 'article-markdown' ? <Check size={14} /> : <Copy size={14} />}
                    <span>{copiedId === 'article-markdown' ? 'Copied Markdown' : 'Copy Markdown'}</span>
                  </button>
                </div>
                <div className="card-body">
                  <article className="markdown-prose">
                    <ReactMarkdown>{currentPkg.articleMarkdown || ''}</ReactMarkdown>
                  </article>
                </div>
              </div>
            </div>
          )}

          {/* Tab 6: FAQs */}
          {activeTab === 'faqs' && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <h4 className="card-title">Frequently Asked Questions (Schema Ready)</h4>
                  <span className="text-muted text-sm">5 questions with 30-80 word answers</span>
                </div>
                <div className="card-body">
                  <div className="faqs-list">
                    {currentPkg.faqs?.map((faq, i) => (
                      <div key={i} className="faq-card">
                        <div className="faq-header">
                          <span className="faq-num">Q{i + 1}</span>
                          <h4 className="faq-question">{faq.question}</h4>
                        </div>
                        <p className="faq-answer">{faq.answer}</p>
                        <div className="faq-footer">
                          <span className="text-muted text-xs">{countWords(faq.answer)} words</span>
                          <button
                            className="btn btn-ghost btn-sm"
                            onClick={() => handleCopy(`faq-${i}`, `Q: ${faq.question}\nA: ${faq.answer}`)}
                          >
                            {copiedId === `faq-${i}` ? <Check size={14} /> : <Copy size={14} />}
                            <span>{copiedId === `faq-${i}` ? 'Copied' : 'Copy'}</span>
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Tab 7: Checklist & Quality */}
          {activeTab === 'checklist' && currentPkg.evaluation && (
            <div className="tab-content">
              <div className="card">
                <div className="card-header">
                  <div>
                    <h4 className="card-title">SEO Content Quality Audit (10-Rule Rubric)</h4>
                    <span className="text-muted text-sm">
                      Automated: {currentPkg.evaluation.automatedPoints}/{currentPkg.evaluation.applicableAutomatedMax} pts · Manual: {currentPkg.evaluation.manualPoints}/10 pts
                    </span>
                  </div>
                  <div className="score-badge-box">
                    <span className="score-large">{currentPkg.evaluation.totalPoints}</span>
                    <span className="score-denom">/{currentPkg.evaluation.applicableAutomatedMax + 10}</span>
                  </div>
                </div>
                <div className="card-body">
                  <div className="table-responsive">
                    <table className="rubric-table">
                      <thead>
                        <tr>
                          <th>Rule ID</th>
                          <th>Evaluation Criterion</th>
                          <th>Status</th>
                          <th>Score</th>
                          <th>Measured Evidence</th>
                        </tr>
                      </thead>
                      <tbody>
                        {currentPkg.evaluation.rules.map((rule) => (
                          <tr key={rule.id}>
                            <td className="font-mono font-bold">{rule.id}</td>
                            <td>
                              <div className="rule-name">{rule.criterion}</div>
                              <div className="rule-sub text-muted text-xs">{rule.explanation}</div>
                            </td>
                            <td>
                              <span className={`badge badge-${rule.status}`}>
                                {rule.status.toUpperCase()}
                              </span>
                            </td>
                            <td className="font-mono font-bold">
                              {rule.points} / {rule.maxPoints}
                            </td>
                            <td className="text-sm">{rule.evidence}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {currentPkg.evaluation.outlineFidelity && (
                    <div className="fidelity-banner">
                      <strong>Outline Fidelity: </strong>
                      {currentPkg.evaluation.outlineFidelity.matched}/{currentPkg.evaluation.outlineFidelity.total} sections ({currentPkg.evaluation.outlineFidelity.percentage}%) preserved from Stage 2 outline in final draft.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
};
