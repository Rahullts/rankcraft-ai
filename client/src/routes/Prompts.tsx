import React, { useState, useEffect } from 'react';
import {
  Code2,
  Copy,
  Check
} from 'lucide-react';
import { api } from '../api/client';
import { copyToClipboard } from '../lib/export';

interface PromptTemplate {
  id: string;
  title: string;
  stage: string;
  techniques: string[];
  description: string;
  template: string;
}

export const Prompts: React.FC = () => {
  const [templates, setTemplates] = useState<PromptTemplate[]>([]);
  const [activeTemplateId, setActiveTemplateId] = useState<string>('stage1_strategy');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    let unmounted = false;
    api
      .getPrompts()
      .then((data) => {
        if (!unmounted && data && data.length > 0) {
          setTemplates(data);
          setActiveTemplateId(data[0].id);
        }
      })
      .catch((err) => {
        console.warn('Could not fetch server prompts, using local reference', err);
      });
    return () => {
      unmounted = true;
    };
  }, []);

  const handleCopy = async (id: string, text: string) => {
    const success = await copyToClipboard(text);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  const selectedTemplate = templates.find((t) => t.id === activeTemplateId) || templates[0];

  const techniques = [
    {
      name: '1. Role Prompting',
      summary: 'Establishes a domain-specific persona and professional perspective.',
      rationale: 'Without a role, general-purpose LLMs default to generic conversational prose. Assigning "You are a senior SEO content strategist and technical copywriter" activates specialized terminology, structured thinking, and analytical rigor.',
      failurePrevented: 'Eliminates vague superficial introductions and colloquial fluff.'
    },
    {
      name: '2. Context & Audience Framing',
      summary: 'Embeds target audience, niche industry, target market, and search intent directly into the prompt.',
      rationale: 'Content designed for "Beginner home cooks in the UK" requires different vocabulary, measurements, and tone than content for commercial agronomists. Explicit context grounds the response in the user\'s real-world environment.',
      failurePrevented: 'Avoids one-size-fits-all content that fails reader intent.'
    },
    {
      name: '3. Explicit Constraints & Bounding',
      summary: 'Provides non-negotiable negative and positive boundaries (lengths, counts, forbidden terms).',
      rationale: 'LLMs are prone to excessive verbosity or hallucinated authority claims. We explicitly mandate: "Meta description must be exactly 155-160 characters", "Do not invent statistics", and "Do not claim search volume".',
      failurePrevented: 'Prevents SERP snippet truncation, fake statistics, and keyword stuffing.'
    },
    {
      name: '4. Few-Shot Exemplars',
      summary: 'Includes high-quality input-output demonstration pairs within the prompt instruction.',
      rationale: 'Demonstrating an exact 158-character meta description with primary keyword placement anchors the model\'s generation probability far more effectively than abstract rules alone.',
      failurePrevented: 'Eliminates format ambiguity and ensures exact character compliance.'
    },
    {
      name: '5. Structured JSON Output & Zod Validation',
      summary: 'Demands raw JSON conforming to strict schemas, backed by automated retry repair.',
      rationale: 'Free-form text is notoriously difficult to process programmatically. Forcing valid JSON for Strategy, Outline, and FAQs enables automated parsing, UI card rendering, and deterministic scoring.',
      failurePrevented: 'Guarantees parseable machine output and enables programmatic verification.'
    },
    {
      name: '6. Staged Pipeline Chaining',
      summary: 'Deconstructs generation into four discrete, sequential steps: Strategy -> Outline -> Article -> FAQs.',
      rationale: 'Monolithic single-shot generation suffers from attention degradation and context drift over long token sequences. Chaining allows each stage to focus 100% of its attention on one component while passing clean state forward.',
      failurePrevented: 'Overcomes lost headings, truncated sections, and structural collapse.'
    }
  ];

  return (
    <div className="prompts-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h2 className="page-title">Prompt Engineering Reference & Guide</h2>
          <p className="page-subtitle">
            Complete documentation of the production prompt templates and scientific methodologies implemented in AI SEO Content Assistant.
          </p>
        </div>
      </div>

      {/* Template Viewer Section */}
      <section className="card template-viewer-card mb-6">
        <div className="card-header">
          <div className="card-title-group">
            <Code2 size={20} className="card-header-icon text-primary" />
            <h3 className="card-title">Production Prompt Template Inspector</h3>
          </div>
          {selectedTemplate && (
            <button
              className="btn btn-secondary btn-sm"
              onClick={() => handleCopy('template-copy', selectedTemplate.template)}
            >
              {copiedId === 'template-copy' ? <Check size={14} /> : <Copy size={14} />}
              <span>{copiedId === 'template-copy' ? 'Copied Template!' : 'Copy Template'}</span>
            </button>
          )}
        </div>

        <div className="card-body">
          {/* Template Selector Tabs */}
          <div className="template-tabs-row">
            {templates.map((tpl) => (
              <button
                key={tpl.id}
                className={`tpl-tab-btn ${activeTemplateId === tpl.id ? 'active' : ''}`}
                onClick={() => setActiveTemplateId(tpl.id)}
              >
                <span className="tpl-tab-stage">{tpl.stage}</span>
                <span className="tpl-tab-title">{tpl.title}</span>
              </button>
            ))}
          </div>

          {selectedTemplate && (
            <div className="template-detail-box">
              <div className="template-meta-strip">
                <div>
                  <strong>Techniques Applied: </strong>
                  {selectedTemplate.techniques.map((tech, i) => (
                    <span key={i} className="technique-tag">
                      {tech}
                    </span>
                  ))}
                </div>
                <p className="text-muted text-sm mt-1">{selectedTemplate.description}</p>
              </div>

              <div className="template-code-container">
                <pre className="template-pre font-mono">
                  <code>{selectedTemplate.template}</code>
                </pre>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Academic Guide to Techniques */}
      <section className="techniques-guide-section">
        <div className="section-header">
          <h3 className="section-title">Academic Analysis: The 6 Techniques Explained</h3>
          <p className="section-subtitle">
            Theoretical foundation and practical implementation rationale for faculty review and project viva.
          </p>
        </div>

        <div className="guide-cards-grid">
          {techniques.map((item, idx) => (
            <div key={idx} className="card guide-card">
              <div className="card-header">
                <h4 className="card-title text-base">{item.name}</h4>
              </div>
              <div className="card-body">
                <div className="guide-summary-box">
                  <strong>Definition:</strong> {item.summary}
                </div>
                <div className="guide-section-text">
                  <strong>Why it Works:</strong>
                  <p>{item.rationale}</p>
                </div>
                <div className="guide-section-text">
                  <strong className="text-danger">LLM Failure Mode Prevented:</strong>
                  <p>{item.failurePrevented}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
