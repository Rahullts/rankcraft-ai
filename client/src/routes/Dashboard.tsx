import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sparkles,
  FlaskConical,
  Award,
  BookOpen,
  ArrowRight,
  CheckCircle2,
  Cpu,
  Layers,
  FileCheck,
  Target,
  Code2
} from 'lucide-react';
import { useStore } from '../state/store';
import { countWords } from '../lib/text';

export const Dashboard: React.FC = () => {
  const { state, loadExampleInput } = useStore();
  const navigate = useNavigate();

  const handleStartWithExample = () => {
    loadExampleInput();
    navigate('/generate');
  };

  const techniques = [
    {
      title: '1. Role Prompting',
      desc: 'Assigns specialized personas (SEO strategist, technical writer) to frame model behavior.',
      icon: Target
    },
    {
      title: '2. Context & Audience Framing',
      desc: 'Passes explicit user intent, industry domain, and target market to eliminate generic filler.',
      icon: Layers
    },
    {
      title: '3. Explicit Constraints',
      desc: 'Enforces exact 155-160 char meta descriptions, 4+ H2 headings, and density bounds.',
      icon: FileCheck
    },
    {
      title: '4. Few-shot Exemplars',
      desc: 'Provides concrete input-output examples to steer JSON schema conformity and tone.',
      icon: Code2
    },
    {
      title: '5. Structured JSON Output',
      desc: 'Guarantees machine-parseable data with strict schemas, regex cleanup, and retry repair.',
      icon: Sparkles
    },
    {
      title: '6. Staged Pipeline Chaining',
      desc: 'Divides large task into Strategy -> Outline -> Article -> FAQs to eliminate context overload.',
      icon: FlaskConical
    }
  ];

  return (
    <div className="dashboard-page">
      {/* Hero Card */}
      <section className="hero-card">
        <div className="hero-content">
          <div className="hero-badge">AI-Powered SEO Content Generation</div>
          <h2 className="hero-title">AI SEO Content Assistant Using Prompt Engineering</h2>
          <p className="hero-desc">
            An end-to-end full-stack platform demonstrating how systematic prompt engineering techniques (role definition, audience constraints, few-shot schemas, and staged generation) produce verifiable, high-scoring SEO content compared to basic prompts.
          </p>
          <div className="hero-actions">
            <button
              className="btn btn-primary"
              onClick={() => navigate('/generate')}
            >
              <Sparkles size={18} />
              <span>Launch Content Generator</span>
            </button>
            <button
              className="btn btn-secondary"
              onClick={() => navigate('/lab')}
            >
              <FlaskConical size={18} />
              <span>Open Prompt Lab (A/B Test)</span>
            </button>
            <button
              className="btn btn-ghost"
              onClick={handleStartWithExample}
            >
              <span>Load Herb Garden Example</span>
              <ArrowRight size={16} />
            </button>
          </div>
        </div>
      </section>

      {/* Grid: Latest Run & Provider Status */}
      <div className="dashboard-grid">
        {/* Latest Run Card */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <Award className="card-header-icon text-primary" size={20} />
              <h3 className="card-title">Latest Content Generation</h3>
            </div>
            {state.currentPackage && (
              <span className="badge badge-success">Completed</span>
            )}
          </div>
          <div className="card-body">
            {state.currentPackage ? (
              <div className="latest-run-info">
                <div className="run-metric-row">
                  <span className="metric-label">Primary Keyword:</span>
                  <span className="metric-value font-mono">
                    {state.currentPackage.input.primaryKeyword}
                  </span>
                </div>
                <div className="run-metric-row">
                  <span className="metric-label">Target Market / Language:</span>
                  <span className="metric-value">
                    {state.currentPackage.input.market} ({state.currentPackage.input.language})
                  </span>
                </div>
                <div className="run-metric-row">
                  <span className="metric-label">Article Word Count:</span>
                  <span className="metric-value font-mono">
                    {countWords(state.currentPackage.articleMarkdown || '')} / {state.currentPackage.input.wordCount} words
                  </span>
                </div>
                {state.currentPackage.evaluation && (
                  <div className="run-score-box">
                    <div className="score-summary">
                      <span className="score-num">
                        {state.currentPackage.evaluation.totalPoints}
                      </span>
                      <span className="score-max">
                        /{state.currentPackage.evaluation.applicableAutomatedMax + 10} pts
                      </span>
                    </div>
                    <span className="score-label">Evaluated Rubric Score (R1-R10)</span>
                  </div>
                )}
                <div className="card-action-row">
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() => navigate('/generate')}
                  >
                    View Generated Package
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => navigate('/evaluation')}
                  >
                    Inspect Rubric
                  </button>
                </div>
              </div>
            ) : (
              <div className="empty-state-sm">
                <p>No content generated yet in this session.</p>
                <button
                  className="btn btn-secondary btn-sm"
                  onClick={handleStartWithExample}
                >
                  Generate sample package
                </button>
              </div>
            )}
          </div>
        </section>

        {/* System & Architecture Status Card */}
        <section className="card">
          <div className="card-header">
            <div className="card-title-group">
              <Cpu className="card-header-icon text-muted" size={20} />
              <h3 className="card-title">Architecture & System Status</h3>
            </div>
            <span className="badge badge-neutral">V1.0 Ready</span>
          </div>
          <div className="card-body">
            <div className="system-status-list">
              <div className="status-item">
                <CheckCircle2 size={16} className="text-success" />
                <div>
                  <strong>Backend:</strong> Express + TypeScript on port 8787
                </div>
              </div>
              <div className="status-item">
                <CheckCircle2 size={16} className="text-success" />
                <div>
                  <strong>LLM Provider:</strong> {state.provider?.isMock !== false ? 'Mock Mode (Offline Fixtures)' : `${state.provider.provider} (${state.provider.model})`}
                </div>
              </div>
              <div className="status-item">
                <CheckCircle2 size={16} className="text-success" />
                <div>
                  <strong>Rule-Based Evaluator:</strong> 10-rule deterministic engine (R1-R10)
                </div>
              </div>
              <div className="status-item">
                <CheckCircle2 size={16} className="text-success" />
                <div>
                  <strong>Security:</strong> Zero browser API keys, server-only envelope
                </div>
              </div>
            </div>
            <div className="card-action-row">
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => navigate('/prompts')}
              >
                <BookOpen size={16} />
                <span>Prompt Engineering Reference</span>
              </button>
            </div>
          </div>
        </section>
      </div>

      {/* Techniques Strip */}
      <section className="techniques-section">
        <div className="section-header">
          <h3 className="section-title">The 6 Core Prompt Engineering Techniques Implemented</h3>
          <p className="section-subtitle">
            Every generation stage implements specific techniques designed to eliminate common LLM failure modes.
          </p>
        </div>

        <div className="techniques-grid">
          {techniques.map((t, idx) => {
            const Icon = t.icon;
            return (
              <div key={idx} className="technique-card">
                <div className="technique-header">
                  <div className="technique-icon-box">
                    <Icon size={18} />
                  </div>
                  <h4 className="technique-title">{t.title}</h4>
                </div>
                <p className="technique-desc">{t.desc}</p>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
};
