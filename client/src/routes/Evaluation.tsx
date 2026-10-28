import React, { useState } from 'react';
import {
  Award,
  ChevronDown,
  ChevronUp,
  Check,
  ShieldCheck,
  Info
} from 'lucide-react';
import { useStore } from '../state/store';

export const Evaluation: React.FC = () => {
  const { state, setManualReview } = useStore();
  const [source, setSource] = useState<'package' | 'simple' | 'improved'>('package');
  const [expandedRule, setExpandedRule] = useState<string | null>(null);

  // Source selection data
  let activeEval = state.currentPackage?.evaluation;
  let activeManual = state.currentPackage?.manualReview;
  let activeInput = state.currentPackage?.input;

  if (source === 'simple') {
    activeEval = state.labSimpleRun?.evaluation;
    activeManual = state.labSimpleRun?.manualReview;
    activeInput = state.labSimpleRun?.input;
  } else if (source === 'improved') {
    activeEval = state.labImprovedRun?.evaluation;
    activeManual = state.labImprovedRun?.manualReview;
    activeInput = state.labImprovedRun?.input;
  }

  // Local state for R10 interactive inputs
  const [intentRating, setIntentRating] = useState<number>(activeManual?.intentMatch ?? 3);
  const [toneRating, setToneRating] = useState<number>(activeManual?.toneAudienceFit ?? 4);
  const [reviewSaved, setReviewSaved] = useState(false);

  const handleSaveReview = () => {
    setManualReview(source, intentRating, toneRating);
    setReviewSaved(true);
    setTimeout(() => setReviewSaved(false), 2000);
  };

  const toggleExpand = (id: string) => {
    setExpandedRule(expandedRule === id ? null : id);
  };

  return (
    <div className="evaluation-page">
      {/* Header & Source Selector */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Content Quality & Rubric Evaluation</h2>
          <p className="page-subtitle">
            100-point deterministic rubric (R1-R10) measuring structural adherence, keyword distribution, and constraint compliance.
          </p>
        </div>
        <div className="source-selector-group">
          <label className="text-sm font-semibold text-muted">Evaluation Target:</label>
          <div className="source-toggle">
            <button
              className={`toggle-btn ${source === 'package' ? 'active' : ''}`}
              onClick={() => {
                setSource('package');
                setIntentRating(state.currentPackage?.manualReview?.intentMatch ?? 3);
                setToneRating(state.currentPackage?.manualReview?.toneAudienceFit ?? 4);
              }}
            >
              Current Package
            </button>
            <button
              className={`toggle-btn ${source === 'simple' ? 'active' : ''}`}
              onClick={() => {
                setSource('simple');
                setIntentRating(state.labSimpleRun?.manualReview?.intentMatch ?? 2);
                setToneRating(state.labSimpleRun?.manualReview?.toneAudienceFit ?? 2);
              }}
            >
              Lab Mode A (Simple)
            </button>
            <button
              className={`toggle-btn ${source === 'improved' ? 'active' : ''}`}
              onClick={() => {
                setSource('improved');
                setIntentRating(state.labImprovedRun?.manualReview?.intentMatch ?? 4);
                setToneRating(state.labImprovedRun?.manualReview?.toneAudienceFit ?? 5);
              }}
            >
              Lab Mode B (Improved)
            </button>
          </div>
        </div>
      </div>

      {activeEval ? (
        <>
          {/* Top Score Cards */}
          <div className="eval-summary-grid">
            <div className="card score-card-primary">
              <div className="score-card-body">
                <div className="score-big-circle">
                  <span className="score-total">{activeEval.totalPoints}</span>
                  <span className="score-max-sub">/{activeEval.applicableAutomatedMax + 10}</span>
                </div>
                <div className="score-details">
                  <h3 className="score-heading">Total Rubric Score</h3>
                  <div className="score-breakdown">
                    <div className="breakdown-item">
                      <span className="b-label">Automated Rules (R1-R9):</span>
                      <span className="b-val">{activeEval.automatedPoints} / {activeEval.applicableAutomatedMax} pts</span>
                    </div>
                    <div className="breakdown-item">
                      <span className="b-label">Human Review (R10):</span>
                      <span className="b-val">{activeEval.manualPoints} / 10 pts</span>
                    </div>
                    {activeEval.outlineFidelity && (
                      <div className="breakdown-item">
                        <span className="b-label">Outline Fidelity:</span>
                        <span className="b-val">{activeEval.outlineFidelity.percentage}% ({activeEval.outlineFidelity.matched}/{activeEval.outlineFidelity.total})</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div className="card disclaimer-card">
              <div className="card-header">
                <Info size={18} className="text-primary" />
                <h4 className="card-title text-sm">Academic Methodology Note</h4>
              </div>
              <div className="card-body">
                <p className="disclaimer-text">
                  Scores are calculated <strong>deterministically</strong> using character counting, regular expressions, heading depth analysis, and exact keyword matches without LLM hallucinations.
                </p>
                <p className="disclaimer-text mt-2">
                  Scores measure <em>prompt engineering constraint adherence</em>. They do not simulate live search engine indexing or guarantee Google rankings.
                </p>
              </div>
            </div>
          </div>

          {/* Interactive Manual Review Form (Rule R10) */}
          <section className="card manual-review-card">
            <div className="card-header">
              <div className="card-title-group">
                <ShieldCheck size={20} className="card-header-icon text-primary" />
                <h3 className="card-title">Rule R10: Human Reviewer Scoring (0-10 Points)</h3>
              </div>
              <span className="badge badge-neutral">Interactive Evaluation</span>
            </div>
            <div className="card-body">
              <p className="text-muted text-sm mb-4">
                Some qualities cannot be judged by code alone. Use these 0-5 rating scales to evaluate search intent alignment and audience/tone fit.
              </p>

              <div className="rating-form-grid">
                {/* Intent Rating */}
                <div className="rating-group">
                  <label className="rating-label">
                    Search Intent Match ({intentRating}/5 pts)
                    <span className="rating-sub">Target: {activeInput?.intent || 'informational'}</span>
                  </label>
                  <div className="radio-scale">
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <label key={val} className={`radio-pill ${intentRating === val ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="intentRating"
                          value={val}
                          checked={intentRating === val}
                          onChange={() => setIntentRating(val)}
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                  <div className="rating-hints">
                    <span>0: Off-intent</span>
                    <span>3: Acceptable</span>
                    <span>5: Perfect match</span>
                  </div>
                </div>

                {/* Tone Rating */}
                <div className="rating-group">
                  <label className="rating-label">
                    Tone & Audience Fit ({toneRating}/5 pts)
                    <span className="rating-sub">Target: {activeInput?.tone || 'professional'} · {activeInput?.audience || 'Target reader'}</span>
                  </label>
                  <div className="radio-scale">
                    {[0, 1, 2, 3, 4, 5].map((val) => (
                      <label key={val} className={`radio-pill ${toneRating === val ? 'selected' : ''}`}>
                        <input
                          type="radio"
                          name="toneRating"
                          value={val}
                          checked={toneRating === val}
                          onChange={() => setToneRating(val)}
                        />
                        <span>{val}</span>
                      </label>
                    ))}
                  </div>
                  <div className="rating-hints">
                    <span>0: Unsuitable</span>
                    <span>3: Solid fit</span>
                    <span>5: Exemplary</span>
                  </div>
                </div>
              </div>

              <div className="save-review-row">
                <button
                  type="button"
                  className="btn btn-primary btn-sm"
                  onClick={handleSaveReview}
                >
                  {reviewSaved ? <Check size={16} /> : <Award size={16} />}
                  <span>{reviewSaved ? 'Rubric Updated!' : 'Apply Manual Scores to Rubric'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Detailed 10-Rule Rubric Table */}
          <section className="card">
            <div className="card-header">
              <h3 className="card-title">Complete 10-Rule Rubric Breakdown (R1 - R10)</h3>
              <span className="text-muted text-sm">Click any rule to inspect technical measurement criteria</span>
            </div>
            <div className="card-body">
              <div className="rubric-accordion-list">
                {activeEval.rules.map((rule) => {
                  const isExpanded = expandedRule === rule.id;
                  return (
                    <div key={rule.id} className={`rubric-item ${isExpanded ? 'expanded' : ''}`}>
                      <div
                        className="rubric-item-header"
                        onClick={() => toggleExpand(rule.id)}
                      >
                        <div className="rubric-id-badge">{rule.id}</div>
                        <div className="rubric-title-col">
                          <span className="rubric-name">{rule.criterion}</span>
                          <span className="rubric-applies text-muted text-xs">
                            Scope: {rule.appliesTo === 'package' ? 'Full Package' : 'Article & Draft'}
                          </span>
                        </div>
                        <div className="rubric-status-col">
                          <span className={`badge badge-${rule.status}`}>
                            {rule.status.toUpperCase()}
                          </span>
                        </div>
                        <div className="rubric-score-col">
                          <span className="font-mono font-bold">
                            {rule.points} / {rule.maxPoints} pts
                          </span>
                        </div>
                        <div className="rubric-arrow-col">
                          {isExpanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                        </div>
                      </div>

                      {isExpanded && (
                        <div className="rubric-item-body">
                          <div className="rubric-detail-row">
                            <strong>Measured Evidence:</strong>
                            <p>{rule.evidence}</p>
                          </div>
                          <div className="rubric-detail-row">
                            <strong>Technical Rationale:</strong>
                            <p className="text-muted text-sm">{rule.explanation}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className="card empty-eval-card">
          <div className="card-body text-center">
            <Award size={48} className="text-muted mb-2" />
            <h3>No Evaluation Data for this Source</h3>
            <p className="text-muted mb-4">
              Please generate a content package or run a Prompt Lab comparison to view rubric scores.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
