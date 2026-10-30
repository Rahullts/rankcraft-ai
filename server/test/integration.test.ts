import { describe, it, expect } from 'vitest';
import app from '../src/index.js';
import { countWords } from '../src/lib/text.js';

async function apiRequest(path: string, options: RequestInit = {}) {
  return new Promise<{ status: number; body: any }>((resolve, reject) => {
    const server = app.listen(0, async () => {
      const addr = server.address() as any;
      const port = addr.port;
      const url = `http://localhost:${port}${path}`;

      try {
        const res = await fetch(url, options);
        const body = await res.json();
        server.close();
        resolve({ status: res.status, body });
      } catch (err) {
        server.close();
        reject(err);
      }
    });
  });
}

describe('End-to-End Generation & Reliability Pipeline (Phase 9)', () => {
  const baseInput = {
    topic: 'Growing herbs at home',
    audience: 'Beginner home cooks',
    industry: 'Home and garden',
    market: 'United Kingdom',
    primaryKeyword: 'indoor herb garden',
    intent: 'informational',
    tone: 'professional',
    language: 'English',
    wordCount: 800
  };

  it('executes the full 4-stage pipeline sequentially and verifies data integrity', async () => {
    // Stage 1: Strategy
    const stratRes = await apiRequest('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: baseInput })
    });

    expect(stratRes.status).toBe(200);
    expect(stratRes.body.ok).toBe(true);
    expect(stratRes.body.data.strategy.titles.length).toBe(5);
    expect(stratRes.body.data.strategy.metaDescription).toBeDefined();
    expect(stratRes.body.data.strategy.keywords.primary).toBe(baseInput.primaryKeyword);

    // Stage 2: Outline
    const outlineRes = await apiRequest('/api/outline', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: baseInput, strategy: stratRes.body.data.strategy })
    });

    expect(outlineRes.status).toBe(200);
    expect(outlineRes.body.ok).toBe(true);
    expect(outlineRes.body.data.outline.sections.length).toBeGreaterThanOrEqual(4);

    // Stage 3: Article
    const articleRes = await apiRequest('/api/article', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: baseInput,
        strategy: stratRes.body.data.strategy,
        outline: outlineRes.body.data.outline
      })
    });

    expect(articleRes.status).toBe(200);
    expect(articleRes.body.ok).toBe(true);
    const words = countWords(articleRes.body.data.articleMarkdown);
    expect(words).toBeGreaterThanOrEqual(720); // within 10% of 800
    expect(words).toBeLessThanOrEqual(880);

    // Stage 4: FAQs
    const faqsRes = await apiRequest('/api/faqs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        input: baseInput,
        strategy: stratRes.body.data.strategy,
        outline: outlineRes.body.data.outline
      })
    });

    expect(faqsRes.status).toBe(200);
    expect(faqsRes.body.ok).toBe(true);
    expect(faqsRes.body.data.faqs.length).toBe(5);
    faqsRes.body.data.faqs.forEach((faq: { question: string; answer: string }) => {
      expect(faq.question.endsWith('?')).toBe(true);
      const answerWords = countWords(faq.answer);
      expect(answerWords).toBeGreaterThanOrEqual(40);
      expect(answerWords).toBeLessThanOrEqual(70);
    });
  });

  it('rejects invalid inputs with a clear 400 VALIDATION_ERROR response', async () => {
    const invalidInput = {
      ...baseInput,
      topic: 'x', // too short (<3 chars)
      wordCount: 150 // below 300
    };

    const res = await apiRequest('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: invalidInput })
    });

    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
    expect(res.body.error.message).toContain('topic');
  });

  it('handles health check endpoint reliably', async () => {
    const healthRes = await apiRequest('/api/health');

    expect(healthRes.status).toBe(200);
    expect(healthRes.body.ok).toBe(true);
    expect(healthRes.body.data.configured).toBe(true);
    expect(healthRes.body.data.mock).toBe(true);
    expect(healthRes.body.data.provider).toBeDefined();
  });
});
