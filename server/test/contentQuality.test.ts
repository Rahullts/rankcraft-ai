import { describe, it, expect } from 'vitest';
import app from '../src/index.js';
import {
  generateNaturalMetaDescription,
  isValidMetaDescription,
  validateAndRepairMetaDescription
} from '../src/lib/metaGenerator.js';

// In-memory test request helper (matching routes.test.ts)
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

describe('SEO Content Quality & Meta Description Integrity', () => {
  describe('Meta Description Sentence Completeness & Range (155-160 Chars)', () => {
    it('detects and rejects truncated meta descriptions ending mid-word', () => {
      const truncated = 'Discover how to master indoor hydroponic gardening with proven strategies, essential tools, and practical execution advice. Achieve reliable, high-impact res.';
      expect(isValidMetaDescription(truncated)).toBe(false);
    });

    it('detects and rejects meta descriptions ending with ellipses', () => {
      const withEllipsis = 'Discover how to master indoor hydroponic gardening with proven strategies, essential tools, and practical execution advice. Achieve reliable, high-impact...';
      expect(isValidMetaDescription(withEllipsis)).toBe(false);
    });

    it('detects and rejects meta descriptions without terminal punctuation', () => {
      const noPunctuation = 'Discover how to master indoor hydroponic gardening with proven strategies, essential tools, and practical execution advice. Achieve reliable results today';
      expect(isValidMetaDescription(noPunctuation)).toBe(false);
    });

    it('detects and rejects meta descriptions outside 155-160 characters', () => {
      const tooShort = 'Short meta description that is under the limit.';
      const tooLong = 'A'.repeat(161) + '.';
      expect(isValidMetaDescription(tooShort)).toBe(false);
      expect(isValidMetaDescription(tooLong)).toBe(false);
    });

    it('validates a complete, natural sentence within 155-160 characters', () => {
      const valid = 'Learn how to master indoor hydroponic gardening with proven strategies, essential tools, and practical advice. Apply these practical tips to succeed today!';
      expect(valid.length).toBeGreaterThanOrEqual(155);
      expect(valid.length).toBeLessThanOrEqual(160);
      expect(isValidMetaDescription(valid, 'indoor hydroponic gardening')).toBe(true);
    });

    it('repairs truncated meta descriptions into complete natural sentences within 155-160 chars', () => {
      const truncated = 'Discover how to master indoor hydroponic gardening with proven strategies, essential tools, and practical execution advice. Achieve reliable, high-impact res.';
      const repaired = validateAndRepairMetaDescription(truncated, 'indoor hydroponic gardening');
      expect(repaired.length).toBeGreaterThanOrEqual(155);
      expect(repaired.length).toBeLessThanOrEqual(160);
      expect(repaired.endsWith('.') || repaired.endsWith('!')).toBe(true);
      expect(repaired.includes('indoor hydroponic gardening')).toBe(true);
      expect(isValidMetaDescription(repaired, 'indoor hydroponic gardening')).toBe(true);
      // Must not contain truncated words like "res."
      expect(repaired).not.toMatch(/\bres\./);
    });

    it('generates complete meta descriptions across diverse keyword lengths', () => {
      const testKeywords = [
        'SEO',
        'indoor herb garden',
        'database performance',
        'solid state battery',
        'indoor hydroponic gardening',
        'cloud cost optimization',
        'autonomous drone navigation',
        'cybersecurity threat intelligence'
      ];

      for (const kw of testKeywords) {
        const meta = generateNaturalMetaDescription(kw);
        expect(meta.length).toBeGreaterThanOrEqual(155);
        expect(meta.length).toBeLessThanOrEqual(160);
        expect(meta.endsWith('.') || meta.endsWith('!')).toBe(true);
        expect(meta.toLowerCase()).toContain(kw.toLowerCase());
        expect(isValidMetaDescription(meta, kw)).toBe(true);
      }
    });
  });

  describe('End-to-End Section Completeness & Quality via API', () => {
    const testPayload = {
      input: {
        topic: 'Sustainable Indoor Hydroponic Gardening',
        primaryKeyword: 'indoor hydroponic gardening',
        audience: 'Urban Apartment Dwellers',
        industry: 'Home and Garden',
        market: 'United States',
        intent: 'informational',
        tone: 'professional',
        language: 'English',
        wordCount: 800
      }
    };

    it('Stage 1 (Strategy): returns complete titles, 155-160 char meta, and valid keywords', async () => {
      const res = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });

      expect(res.status).toBe(200);
      const strategy = res.body.data.strategy;

      // 1. Titles completeness
      expect(strategy.titles).toHaveLength(5);
      for (const title of strategy.titles) {
        expect(title.text.length).toBeGreaterThanOrEqual(25);
        expect(title.text.length).toBeLessThanOrEqual(70);
        expect(title.angle).toBeDefined();
      }

      // 2. Meta description completeness & natural sentence check
      const meta = strategy.metaDescription;
      expect(meta.length).toBeGreaterThanOrEqual(155);
      expect(meta.length).toBeLessThanOrEqual(160);
      expect(meta.endsWith('.') || meta.endsWith('!')).toBe(true);
      expect(meta).not.toMatch(/\.\.\.$/);
      expect(meta).not.toMatch(/\bres\./i);
      expect(meta.toLowerCase()).toContain('indoor hydroponic gardening');

      // 3. Keywords completeness & topic relevance (avoiding mechanical repetitions)
      expect(strategy.keywords.primary).toBe('indoor hydroponic gardening');
      expect(strategy.keywords.secondary.length).toBeGreaterThanOrEqual(5);
      expect(strategy.keywords.longTail.length).toBeGreaterThanOrEqual(5);

      // Verify no mechanical suffix repetition in secondary keywords
      const repetitiveSec = strategy.keywords.secondary.filter((k: string) =>
        k.toLowerCase().startsWith('indoor hydroponic gardening ')
      );
      expect(repetitiveSec.length).toBeLessThan(2);

      // Verify genuine hydroponic gardening terminology
      const secJoined = strategy.keywords.secondary.join(' ').toLowerCase();
      expect(secJoined).toMatch(/(nutrient|lights|deep water|ph|greens|systems)/);

      // Verify natural titles (no awkward repetition or formulaic "master" phrasing)
      for (const t of strategy.titles) {
        expect(t.text.toLowerCase()).not.toContain('master indoor hydroponic gardening');
      }
    });

    it('Stage 2 (Outline): returns topic-specific H2 headings with no generic software filler', async () => {
      const stratRes = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const strategy = stratRes.body.data.strategy;

      const outlineRes = await makeRequest('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: testPayload.input, strategy })
      });

      expect(outlineRes.status).toBe(200);
      const outline = outlineRes.body.data.outline;
      expect(outline.intro).toBeDefined();
      expect(outline.intro.length).toBeGreaterThan(10);
      expect(outline.sections.length).toBeGreaterThanOrEqual(4);

      const h2Joined = outline.sections.map((s: any) => s.h2).join(' ');
      // Verify topic-specific headings
      expect(h2Joined).toMatch(/(Hydroponic System|Lighting|Nutrient|Care|Gardening)/);
      // Verify absence of generic IT/software headings
      expect(h2Joined).not.toContain('Recommended Hardware and Software');
      expect(h2Joined).not.toContain('Workflow for');

      for (const section of outline.sections) {
        expect(section.h2.length).toBeGreaterThan(5);
        expect(section.purpose.length).toBeGreaterThan(5);
        expect(section.targetWords).toBeGreaterThan(0);
      }

      // Last H2 should be a conclusion
      const lastH2 = outline.sections[outline.sections.length - 1].h2;
      expect(lastH2.toLowerCase()).toContain('conclusion');
    });

    it('Stage 3 (Article): returns topic-relevant Markdown article without corporate/IT filler', async () => {
      const stratRes = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const strategy = stratRes.body.data.strategy;

      const outlineRes = await makeRequest('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: testPayload.input, strategy })
      });
      const outline = outlineRes.body.data.outline;

      const articleRes = await makeRequest('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: testPayload.input, strategy, outline })
      });

      expect(articleRes.status).toBe(200);
      const markdown = articleRes.body.data.articleMarkdown;
      expect(markdown).toBeDefined();
      expect(markdown.length).toBeGreaterThan(500);

      // Verify H1
      expect(markdown).toMatch(/^#\s+/m);
      // Verify all H2s from outline appear in article
      for (const section of outline.sections) {
        expect(markdown).toContain(section.h2);
      }

      // Verify topic-specific content for indoor hydroponics
      expect(markdown.toLowerCase()).toMatch(/(nutrient|reservoir|led|ph|greens|deep water)/);

      // Verify absence of corporate/IT filler
      expect(markdown.toLowerCase()).not.toContain('team member');
      expect(markdown.toLowerCase()).not.toContain('enterprise solutions');
      expect(markdown.toLowerCase()).not.toContain('standard operating procedures');
      expect(markdown.toLowerCase()).not.toContain('anomalies before they become major roadblocks');
    });

    it('Stage 4 (FAQs): returns exactly five topic-specific FAQs with valid punctuation', async () => {
      const stratRes = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(testPayload)
      });
      const strategy = stratRes.body.data.strategy;

      const outlineRes = await makeRequest('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: testPayload.input, strategy })
      });
      const outline = outlineRes.body.data.outline;

      const faqsRes = await makeRequest('/api/faqs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: testPayload.input, strategy, outline })
      });

      expect(faqsRes.status).toBe(200);
      const faqs = faqsRes.body.data.faqs;
      expect(faqs).toHaveLength(5);
      for (const faq of faqs) {
        expect(faq.question.trim().endsWith('?')).toBe(true);
        expect(faq.answer.length).toBeGreaterThan(20);
        // Ensure no truncated answers
        expect(faq.answer.endsWith('.') || faq.answer.endsWith('!')).toBe(true);
      }

      // Verify hydroponic specific questions
      const faqsText = faqs.map((f: any) => f.question + ' ' + f.answer).join(' ').toLowerCase();
      expect(faqsText).toMatch(/(nutrient|grow lights|ph|vegetables|space)/);
    });

    it('Cross-Topic Divergence: Cloud Database topic produces technical DB content, not gardening', async () => {
      const dbPayload = {
        input: {
          topic: 'Cloud Database Performance Optimization',
          primaryKeyword: 'database performance',
          audience: 'Backend Developers',
          industry: 'Software',
          market: 'Global',
          intent: 'informational',
          tone: 'professional',
          language: 'English',
          wordCount: 800
        }
      };

      const stratRes = await makeRequest('/api/strategy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dbPayload)
      });
      expect(stratRes.status).toBe(200);
      const dbStrategy = stratRes.body.data.strategy;

      // Meta description check
      expect(dbStrategy.metaDescription.length).toBeGreaterThanOrEqual(155);
      expect(dbStrategy.metaDescription.length).toBeLessThanOrEqual(160);
      expect(dbStrategy.metaDescription.toLowerCase()).toContain('database performance');

      // Outline check
      const outlineRes = await makeRequest('/api/outline', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: dbPayload.input, strategy: dbStrategy })
      });
      expect(outlineRes.status).toBe(200);
      const dbOutline = outlineRes.body.data.outline;
      const dbHeadings = dbOutline.sections.map((s: any) => s.h2).join(' ').toLowerCase();
      expect(dbHeadings).toMatch(/(query|index|caching|database)/);
      expect(dbHeadings).not.toMatch(/(plant|garden|herb|soil)/);

      // Article check
      const articleRes = await makeRequest('/api/article', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input: dbPayload.input, strategy: dbStrategy, outline: dbOutline })
      });
      expect(articleRes.status).toBe(200);
      const dbArticle = articleRes.body.data.articleMarkdown;
      expect(dbArticle.toLowerCase()).toMatch(/(explain analyze|b-tree|caching|redis|latency)/);
      expect(dbArticle.toLowerCase()).not.toMatch(/(plant|vegetable|greens|soil|hydroponic)/);
    });
  });
});
