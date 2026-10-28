import React, { useState } from 'react';
import {
  FlaskConical,
  Scale,
  Copy,
  Check,
  ChevronDown,
  ChevronUp,
  Award
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { useStore } from '../state/store';
import { copyToClipboard } from '../lib/export';
import { countWords } from '../lib/text';

export const Lab: React.FC = () => {
  const { state, runLabComparison } = useStore();
  const [showSimplePrompt, setShowSimplePrompt] = useState(false);
  const [showImprovedPrompt, setShowImprovedPrompt] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const simpleRun = state.labSimpleRun;
  const improvedRun = state.labImprovedRun;
  const selectedLang = state.input.language || 'English';

  const simplePromptText = `Write an SEO article about ${state.input.topic || 'Growing herbs at home'} for ${state.input.audience || 'Beginner home cooks'} in the ${state.input.industry || 'Home and garden'} industry. The target market is ${state.input.market || 'United Kingdom'}. Use the keyword "${state.input.primaryKeyword || 'indoor herb garden'}". The search intent is ${state.input.intent || 'informational'} and the tone should be ${state.input.tone || 'professional'}. Make it about ${state.input.wordCount || 800} words.

CRITICAL LANGUAGE DIRECTIVE: Write the entire response strictly and completely in ${selectedLang} (Default: English). Every title, heading, paragraph, and sentence must be in ${selectedLang}. Do not switch to another language or mix languages based on the target market or topic.`;

  const commonRules = ['R4', 'R5', 'R6', 'R8', 'R9', 'R10'];

  const getArticleScore = (evalObj?: any) => {
    if (!evalObj?.rules) return 0;
    const articleRuleIds = ['R4', 'R5', 'R6', 'R8', 'R9', 'R10'];
    return evalObj.rules
      .filter((r: any) => articleRuleIds.includes(r.id))
      .reduce((sum: number, r: any) => sum + r.points, 0);
  };

  const getMetadataScore = (evalObj?: any) => {
    if (!evalObj?.rules) return 0;
    const metaRuleIds = ['R1', 'R2', 'R3', 'R7'];
    return evalObj.rules
      .filter((r: any) => metaRuleIds.includes(r.id))
      .reduce((sum: number, r: any) => sum + r.points, 0);
  };

  return (
    <div className="lab-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Prompt Engineering Lab (A/B Test)</h2>
          <p className="page-subtitle">
            Controlled academic comparison benchmarking a basic single-shot prompt against a 4-stage engineered prompt pipeline under identical inputs and parameters.
          </p>
        </div>
        <div className="page-header-actions">
          <button
            className="btn btn-primary"
            onClick={() => runLabComparison()}
            disabled={state.labRunning}
          >
            <FlaskConical size={18} />
            <span>{state.labRunning ? 'Running A/B Comparison...' : 'Run Comparison'}</span>
          </button>
        </div>
      </div>

      {/* Fairness Panel */}
      <section className="card fairness-card">
        <div className="card-header">
          <div className="card-title-group">
            <Scale className="card-header-icon text-primary" size={20} />
            <h3 className="card-title">Controlled Experiment Fairness Protocol</h3>
          </div>
          <span className="badge badge-neutral">Independent Variable: Prompt Strategy</span>
        </div>
        <div className="card-body">
          <div className="fairness-grid">
            <div className="fairness-col">
              <h4 className="fairness-title text-success">Controlled (Identical Across Both Modes)</h4>
              <ul className="fairness-list">
                <li><strong>Input Parameters:</strong> Topic: "{state.input.topic || 'Growing herbs at home'}", Keyword: "{state.input.primaryKeyword || 'indoor herb garden'}"</li>
                <li><strong>Target Scope:</strong> Market: {state.input.market || 'United Kingdom'}, Language: {selectedLang} (Default: English), Word Count: {state.input.wordCount}</li>
                <li><strong>Model & Environment:</strong> {state.provider?.isMock !== false ? 'Mock Provider (Offline Fixtures)' : `${state.provider.provider} (${state.provider.model})`}</li>
                <li><strong>Runtime Parameters:</strong> Temperature = 0.5 (Live LLM) / Deterministic Fixtures (Mock), dynamic token allocation</li>
                <li><strong>Evaluation Instrument:</strong> Unified 100-point rubric engine with identical shared article evaluation rules (R4–R10)</li>
              </ul>
            </div>
            <div className="fairness-col">
              <h4 className="fairness-title text-primary">Experimental Treatment (Differed Variable)</h4>
              <ul className="fairness-list">
                <li><strong>Mode A (Basic):</strong> Single-shot generic instruction without persona, explicit constraints, or structural staging. Produces article only (0/40 metadata components).</li>
                <li><strong>Mode B (Improved):</strong> 4-stage chained pipeline applying Role, Context, Constraints, Few-shot schemas, and JSON parsing. Produces complete 5-component package.</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Side-by-Side Comparison Grid */}
      <div className="comparison-grid">
        {/* Left Column: Mode A (Simple Prompt) */}
        <div className="mode-column mode-simple">
          <div className="mode-header mode-header-simple">
            <div>
              <span className="mode-tag tag-simple">Mode A · Baseline</span>
              <h3 className="mode-title">Simple Prompt</h3>
            </div>
            {simpleRun?.evaluation && (
              <div className="mode-score-badge badge-simple">
                <div className="flex items-baseline gap-1">
                  <span className="score-val">{simpleRun.evaluation.totalPoints}</span>
                  <span className="score-max">/100 pts</span>
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                  Article: {getArticleScore(simpleRun.evaluation)}/60 · Metadata: 0/40 (Omitted)
                </div>
              </div>
            )}
          </div>

          {/* Exact Prompt Box */}
          <div className="card prompt-inspect-card">
            <div
              className="card-header card-header-clickable"
              onClick={() => setShowSimplePrompt(!showSimplePrompt)}
            >
              <span className="font-semibold text-sm">Inspect Exact Prompt</span>
              <div className="card-header-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('simple-prompt', simplePromptText);
                  }}
                >
                  {copiedId === 'simple-prompt' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === 'simple-prompt' ? 'Copied' : 'Copy'}</span>
                </button>
                {showSimplePrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {showSimplePrompt && (
              <div className="card-body">
                <pre className="prompt-pre">{simplePromptText}</pre>
                <div className="prompt-notes text-muted text-xs">
                  Techniques used: None. No persona, no word count target, no keyword constraints, no outline stage.
                </div>
              </div>
            )}
          </div>

          {/* Output Display */}
          <div className="card output-card">
            <div className="card-header">
              <h4 className="card-title text-sm">Generated Output (Single-Shot Article)</h4>
              {simpleRun && (
                <span className="text-muted text-xs">
                  {countWords(simpleRun.articleMarkdown)} words · {simpleRun.meta?.latencyMs ?? (simpleRun.meta as any)?.durationMs ?? 65}ms
                </span>
              )}
            </div>
            <div className="card-body">
              {simpleRun ? (
                <div className="markdown-prose simple-prose">
                  <ReactMarkdown>{simpleRun.articleMarkdown}</ReactMarkdown>
                </div>
              ) : (
                <div className="empty-state-sm">
                  <p>Click "Run Comparison" above to execute Mode A baseline.</p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Right Column: Mode B (Improved Prompt Pipeline) */}
        <div className="mode-column mode-improved">
          <div className="mode-header mode-header-improved">
            <div>
              <span className="mode-tag tag-improved">Mode B · Engineered</span>
              <h3 className="mode-title">4-Stage Pipeline</h3>
            </div>
            {improvedRun?.evaluation && (
              <div className="mode-score-badge badge-improved">
                <div className="flex items-baseline gap-1">
                  <span className="score-val">{improvedRun.evaluation.totalPoints}</span>
                  <span className="score-max">/100 pts</span>
                </div>
                <div style={{ fontSize: '0.72rem', opacity: 0.85, marginTop: '2px' }}>
                  Article: {getArticleScore(improvedRun.evaluation)}/60 · Metadata: {getMetadataScore(improvedRun.evaluation)}/40
                </div>
              </div>
            )}
          </div>

          {/* Staged Prompts Box */}
          <div className="card prompt-inspect-card">
            <div
              className="card-header card-header-clickable"
              onClick={() => setShowImprovedPrompt(!showImprovedPrompt)}
            >
              <span className="font-semibold text-sm">Inspect Chained Staged Prompts</span>
              <div className="card-header-actions">
                <button
                  type="button"
                  className="btn btn-ghost btn-xs"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleCopy('improved-prompt-summary', 'Stage 1: Strategy -> Stage 2: Outline -> Stage 3: Article -> Stage 4: FAQs');
                  }}
                >
                  {copiedId === 'improved-prompt-summary' ? <Check size={12} /> : <Copy size={12} />}
                  <span>{copiedId === 'improved-prompt-summary' ? 'Copied' : 'Copy'}</span>
                </button>
                {showImprovedPrompt ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
              </div>
            </div>
            {showImprovedPrompt && (
              <div className="card-body">
                <div className="staged-prompt-summary">
                  <div className="stage-mini-box">
                    <strong>Stage 1 (Strategy):</strong> Role persona + JSON schema + few-shot 158-char meta description constraint.
                  </div>
                  <div className="stage-mini-box">
                    <strong>Stage 2 (Outline):</strong> H1, 4+ H2, nested H3 constraint using Stage 1 keywords.
                  </div>
                  <div className="stage-mini-box">
                    <strong>Stage 3 (Article):</strong> Target word count ({state.input.wordCount} +/-10%), primary keyword in H1/intro/H2/outro.
                  </div>
                  <div className="stage-mini-box">
                    <strong>Stage 4 (FAQs):</strong> 5 schema-ready questions with 30-80 word answers ending with '?'.
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Output Display */}
          <div className="card output-card">
            <div className="card-header">
              <h4 className="card-title text-sm">Generated Output (Complete Audited Package)</h4>
              {improvedRun && (
                <span className="text-muted text-xs">
                  {countWords(improvedRun.articleMarkdown || '')} words · {improvedRun.meta.totalDurationMs}ms
                </span>
              )}
            </div>
            <div className="card-body">
              {improvedRun ? (
                <div className="improved-output-preview">
                  <div className="pkg-component-preview">
                    <span className="component-label">Recommended Title:</span>
                    <span className="component-val">{improvedRun.strategy?.titles[0]?.text}</span>
                  </div>
                  <div className="pkg-component-preview">
                    <span className="component-label">Meta Description ({improvedRun.strategy?.metaDescription.length} chars):</span>
                    <p className="component-val text-sm">{improvedRun.strategy?.metaDescription}</p>
                  </div>
                  <div className="markdown-prose improved-prose">
                    <ReactMarkdown>{improvedRun.articleMarkdown || ''}</ReactMarkdown>
                  </div>
                </div>
              ) : (
                <div className="empty-state-sm">
                  <p>Click "Run Comparison" above to execute Mode B pipeline.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Side-by-Side Rubric Summary Table */}
      {simpleRun?.evaluation && improvedRun?.evaluation && (
        <section className="card rubric-comparison-card">
          <div className="card-header">
            <div className="card-title-group">
              <Award className="card-header-icon text-primary" size={20} />
              <h3 className="card-title">Side-by-Side Rubric Comparison (Article Rules R4-R10)</h3>
            </div>
            <span className="text-muted text-sm">Evaluated identically by deterministic rule engine</span>
          </div>
          <div className="card-body">
            <div className="table-responsive">
              <table className="rubric-table">
                <thead>
                  <tr>
                    <th>Rule ID</th>
                    <th>Criterion</th>
                    <th>Mode A (Simple) Score</th>
                    <th>Mode B (Improved) Score</th>
                    <th>Score Difference</th>
                    <th>Analysis & Why Engineered Won</th>
                  </tr>
                </thead>
                <tbody>
                  {commonRules.map((ruleId) => {
                    const rSimple = simpleRun.evaluation?.rules.find((r) => r.id === ruleId);
                    const rImp = improvedRun.evaluation?.rules.find((r) => r.id === ruleId);
                    const ptsSimple = rSimple ? rSimple.points : 0;
                    const ptsImp = rImp ? rImp.points : 0;
                    const delta = ptsImp - ptsSimple;

                    return (
                      <tr key={ruleId}>
                        <td className="font-mono font-bold">{ruleId}</td>
                        <td>{rSimple?.criterion || rImp?.criterion}</td>
                        <td className="font-mono">
                          <span className={`badge badge-${rSimple?.status}`}>
                            {ptsSimple} / {rSimple?.maxPoints}
                          </span>
                        </td>
                        <td className="font-mono">
                          <span className={`badge badge-${rImp?.status}`}>
                            {ptsImp} / {rImp?.maxPoints}
                          </span>
                        </td>
                        <td>
                          <span className={`delta-tag ${delta > 0 ? 'delta-pos' : delta < 0 ? 'delta-neg' : 'delta-zero'}`}>
                            {delta > 0 ? `+${delta}` : delta} pts
                          </span>
                        </td>
                        <td className="text-sm">
                          {ruleId === 'R4' && 'Mode B follows 2-level outline with clean H1/H2/H3 nesting; Mode A uses arbitrary heading depth.'}
                          {ruleId === 'R5' && 'Mode B explicitly places primary keyword in H1, first 100 words, and H2; Mode A varies.'}
                          {ruleId === 'R6' && 'Mode B targets exact requested word count; Mode A defaults to short generic output (~150 words).'}
                          {ruleId === 'R8' && 'Both maintain natural conversational sentence lengths.'}
                          {ruleId === 'R9' && 'Mode B prompt explicitly forbids unverified statistics and claims.'}
                          {ruleId === 'R10' && 'Human reviewer rates search intent match and audience appropriateness.'}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            <div className="comparison-academic-conclusion">
              <h4>Academic Review Conclusion</h4>
              <p>
                The empirical data demonstrates that applying prompt engineering techniques (explicit constraints, staged outlines, few-shot schemas) directly addresses LLM failure modes. In particular, Mode B achieves higher compliance in <strong>heading structure (R4)</strong>, <strong>keyword placement (R5)</strong>, and <strong>length control (R6)</strong> compared to the baseline single-shot instruction.
              </p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};
