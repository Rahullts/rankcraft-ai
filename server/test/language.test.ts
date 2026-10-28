import { describe, it, expect } from 'vitest';
import app from '../src/index.js';
import {
  SIMPLE_PROMPT,
  STAGE_1_STRATEGY,
  STAGE_2_OUTLINE,
  STAGE_3_ARTICLE,
  STAGE_4_FAQS
} from '../src/prompts/templates.js';

// Helper for calling Express app in-memory
async function request(path: string, options: RequestInit = {}) {
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

// English script and character verification
function isEnglishText(text: string): boolean {
  if (!text || !text.trim()) return false;
  // Verify no non-Latin scripts (Devanagari, Tamil, Arabic, Chinese, Japanese, Korean, Cyrillic)
  const nonLatinScript = /[\u0900-\u097F\u0B80-\u0BFF\u0600-\u06FF\u4E00-\u9FFF\u3040-\u30FF\uAC00-\uD7AF\u0400-\u04FF]/;
  if (nonLatinScript.test(text)) return false;
  // Must contain English/Latin alphabetical characters
  return /[a-zA-Z]/.test(text);
}

describe('Language Consistency & Output Verification (Requirement 1-10)', () => {
  it('every system and user prompt template mandates strict output language consistency', () => {
    expect(SIMPLE_PROMPT.user).toContain('CRITICAL LANGUAGE DIRECTIVE');
    expect(SIMPLE_PROMPT.user).toContain('{{language}}');

    expect(STAGE_1_STRATEGY.system).toContain('requested output language');
    expect(STAGE_1_STRATEGY.user).toContain('strictly and consistently in {{language}}');

    expect(STAGE_2_OUTLINE.system).toContain('strictly in {{language}}');
    expect(STAGE_2_OUTLINE.user).toContain('strictly in {{language}}');

    expect(STAGE_3_ARTICLE.system).toContain('strictly in {{language}}');
    expect(STAGE_3_ARTICLE.user).toContain('strictly in {{language}}');

    expect(STAGE_4_FAQS.system).toContain('strictly in {{language}}');
    expect(STAGE_4_FAQS.user).toContain('strictly in {{language}}');
  });

  const testTopics = [
    {
      topic: 'Growing herbs at home',
      primaryKeyword: 'indoor herb garden',
      audience: 'Beginner home cooks',
      industry: 'Home and garden',
      market: 'United Kingdom'
    },
    {
      topic: 'Cloud Database Performance Optimization',
      primaryKeyword: 'database performance',
      audience: 'Backend Developers & DevOps',
      industry: 'Cloud Infrastructure & SaaS',
      market: 'Global'
    },
    {
      topic: 'Electric Vehicle Battery Technology',
      primaryKeyword: 'solid state battery',
      audience: 'Automotive Engineers & Investors',
      industry: 'Clean Transportation',
      market: 'United States'
    }
  ];

  testTopics.forEach((t, index) => {
    describe(`Topic ${index + 1}: ${t.topic}`, () => {
      const inputPayload = {
        ...t,
        intent: 'informational',
        tone: 'professional',
        language: 'English',
        wordCount: 800
      };

      it(`Stage 1 (Strategy) outputs 100% English titles, meta, and keywords`, async () => {
        const res = await request('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });

        expect(res.status).toBe(200);
        expect(res.body.ok).toBe(true);

        const { titles, metaDescription, keywords } = res.body.data.strategy;
        expect(titles.length).toBe(5);
        titles.forEach((titleObj: any) => {
          expect(isEnglishText(titleObj.text)).toBe(true);
        });

        expect(isEnglishText(metaDescription)).toBe(true);
        expect(isEnglishText(keywords.primary)).toBe(true);
        keywords.secondary.forEach((kw: string) => {
          expect(isEnglishText(kw)).toBe(true);
        });
        keywords.longTail.forEach((kw: string) => {
          expect(isEnglishText(kw)).toBe(true);
        });
      });

      it(`Stage 2 (Outline) outputs 100% English H2 and H3 headings`, async () => {
        // First get strategy
        const stratRes = await request('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });

        const outlineRes = await request('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy: stratRes.body.data.strategy })
        });

        expect(outlineRes.status).toBe(200);
        expect(outlineRes.body.ok).toBe(true);
        const { sections } = outlineRes.body.data.outline;
        expect(sections.length).toBeGreaterThanOrEqual(3);

        sections.forEach((sec: any) => {
          expect(isEnglishText(sec.h2)).toBe(true);
          sec.h3.forEach((sub: string) => {
            expect(isEnglishText(sub)).toBe(true);
          });
        });
      });

      it(`Stage 3 (Article) outputs 100% English Markdown draft`, async () => {
        const stratRes = await request('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });

        const outlineRes = await request('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy: stratRes.body.data.strategy })
        });

        const articleRes = await request('/api/article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: inputPayload,
            strategy: stratRes.body.data.strategy,
            outline: outlineRes.body.data.outline
          })
        });

        expect(articleRes.status).toBe(200);
        expect(articleRes.body.ok).toBe(true);
        const markdown = articleRes.body.data.articleMarkdown;
        expect(markdown.length).toBeGreaterThan(300);
        expect(isEnglishText(markdown)).toBe(true);
      });

      it(`Stage 4 (FAQs) outputs 100% English questions and answers`, async () => {
        const stratRes = await request('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });

        const outlineRes = await request('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy: stratRes.body.data.strategy })
        });

        const faqsRes = await request('/api/faqs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            input: inputPayload,
            strategy: stratRes.body.data.strategy,
            outline: outlineRes.body.data.outline
          })
        });

        expect(faqsRes.status).toBe(200);
        expect(faqsRes.body.ok).toBe(true);
        const { faqs } = faqsRes.body.data;
        expect(faqs.length).toBe(5);
        faqs.forEach((faq: any) => {
          expect(isEnglishText(faq.question)).toBe(true);
          expect(isEnglishText(faq.answer)).toBe(true);
        });
      });

      it(`Simple Prompt (Mode A Baseline) outputs 100% English article`, async () => {
        const simpleRes = await request('/api/simple', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });

        expect(simpleRes.status).toBe(200);
        expect(simpleRes.body.ok).toBe(true);
        expect(isEnglishText(simpleRes.body.data.text)).toBe(true);
      });
    });
  });
});
