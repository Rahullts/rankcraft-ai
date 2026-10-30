import { describe, it, expect } from 'vitest';
import app from '../src/index.js';
import { countWords } from '../src/lib/text.js';

// In-memory test request helper
async function makeRequest(path: string, options: RequestInit = {}) {
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

describe('Word Count Targets & Dynamic Adaptation (500, 800, 1200, 1500 words)', () => {
  const baseInput = {
    topic: 'Growing herbs at home',
    primaryKeyword: 'indoor herb garden',
    audience: 'Beginner home cooks',
    industry: 'Home and garden',
    market: 'United Kingdom',
    intent: 'informational',
    tone: 'professional',
    language: 'English'
  };

  const targets = [500, 800, 1200, 1500];

  for (const target of targets) {
    describe(`Target Word Count: ${target} words`, () => {
      it(`Stage 2 (Outline) adapts targetWords for ${target} words`, async () => {
        const inputPayload = { ...baseInput, wordCount: target };

        const stratRes = await makeRequest('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });
        expect(stratRes.status).toBe(200);
        const strategy = stratRes.body.data.strategy;

        const outlineRes = await makeRequest('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy })
        });
        expect(outlineRes.status).toBe(200);
        const outline = outlineRes.body.data.outline;

        expect(outline.sections.length).toBeGreaterThanOrEqual(4);

        // Sections targetWords must scale with target
        const sumTargetWords = outline.sections.reduce((acc: number, s: any) => acc + s.targetWords, 0);
        const expectedBodyWords = target - Math.round(target * 0.1);
        expect(Math.abs(sumTargetWords - expectedBodyWords)).toBeLessThanOrEqual(5);
      });

      it(`Stage 3 (Article) produces article within 10% tolerance of ${target} words`, async () => {
        const inputPayload = { ...baseInput, wordCount: target };

        const stratRes = await makeRequest('/api/strategy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload })
        });
        const strategy = stratRes.body.data.strategy;

        const outlineRes = await makeRequest('/api/outline', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy })
        });
        const outline = outlineRes.body.data.outline;

        const articleRes = await makeRequest('/api/article', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ input: inputPayload, strategy, outline })
        });

        expect(articleRes.status).toBe(200);
        const markdown = articleRes.body.data.articleMarkdown;
        expect(markdown).toBeDefined();

        const actualWordCount = countWords(markdown);
        const diff = Math.abs(actualWordCount - target);
        const diffPct = diff / target;

        // Must be within 10% tolerance for full 10-point rubric score
        expect(diffPct).toBeLessThanOrEqual(0.10);
        // Also verify within 7%
        expect(diffPct).toBeLessThanOrEqual(0.07);

        // Verify H1 and H2s
        expect(markdown).toMatch(/^#\s+/m);
        const h2Matches = markdown.match(/^##\s+/gm) || [];
        expect(h2Matches.length).toBeGreaterThanOrEqual(4);

        // Verify primary keyword placement
        expect(markdown.toLowerCase()).toContain('indoor herb garden');
        const first100 = markdown.split(/\s+/).slice(0, 100).join(' ').toLowerCase();
        expect(first100).toContain('indoor herb garden');
      });
    });
  }

  it('Sequential Generation: 500 -> 800 -> 1200 -> 1500 generates distinct, scaled articles without stale reuse', async () => {
    const results: Array<{ target: number; words: number; markdown: string }> = [];

    for (const target of targets) {
      const inputPayload = { ...baseInput, wordCount: target };

      const stratRes = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputPayload })
      });
      const strategy = stratRes.body.data.strategy;

      const outlineRes = await makeRequest('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputPayload, strategy })
      });
      const outline = outlineRes.body.data.outline;

      const articleRes = await makeRequest('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: inputPayload, strategy, outline })
      });

      const md = articleRes.body.data.articleMarkdown;
      const words = countWords(md);
      results.push({ target, words, markdown: md });
    }

    // Verify strictly ascending word counts matching targets
    expect(results[0].words).toBeLessThan(results[1].words);
    expect(results[1].words).toBeLessThan(results[2].words);
    expect(results[2].words).toBeLessThan(results[3].words);

    // Verify each result is within 6% of its respective target
    for (const r of results) {
      const diffPct = Math.abs(r.words - r.target) / r.target;
      expect(diffPct).toBeLessThanOrEqual(0.06);
    }

    // Verify that articles are not identical strings
    expect(results[0].markdown).not.toBe(results[1].markdown);
    expect(results[1].markdown).not.toBe(results[2].markdown);
    expect(results[2].markdown).not.toBe(results[3].markdown);
  });
});
