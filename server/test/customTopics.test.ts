import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import app from '../src/index.js';
import { countWords } from '../src/lib/text.js';
import { MockProvider } from '../src/providers/mock.js';

let server: any;
let baseUrl = '';

beforeAll(async () => {
  await new Promise<void>((resolve) => {
    server = app.listen(0, () => {
      const port = (server.address() as any).port;
      baseUrl = `http://localhost:${port}`;
      resolve();
    });
  });
});

afterAll(async () => {
  await new Promise<void>((resolve) => {
    if (server) server.close(() => resolve());
    else resolve();
  });
});

async function postJson(path: string, body: any) {
  const res = await fetch(`${baseUrl}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  });
  const json = await res.json();
  return { status: res.status, body: json };
}

interface TestCase {
  topic: string;
  primaryKeyword: string;
  audience: string;
  industry: string;
}

const TEST_CASES: TestCase[] = [
  {
    topic: 'How Artificial Intelligence Is Changing the Movie Industry',
    primaryKeyword: 'AI in movie industry',
    audience: 'Filmmakers, cinematographers, and cinema enthusiasts',
    industry: 'Entertainment and Film Production'
  },
  {
    topic: 'LGBTQ+ Representation in Modern Cinema',
    primaryKeyword: 'LGBTQ+ representation in cinema',
    audience: 'Film students, cultural critics, and moviegoers',
    industry: 'Media, Culture, and Arts'
  },
  {
    topic: 'AI in Education',
    primaryKeyword: 'AI in education',
    audience: 'Educators, academic leaders, and instructional designers',
    industry: 'Educational Technology'
  },
  {
    topic: 'Cybersecurity in Everyday Life',
    primaryKeyword: 'cybersecurity in everyday life',
    audience: 'Everyday computer users and homeowners',
    industry: 'Consumer Technology and Information Security'
  },
  {
    topic: 'Climate Change and Sustainable Living',
    primaryKeyword: 'sustainable living',
    audience: 'Eco-conscious households and urban residents',
    industry: 'Environmental Sustainability and Clean Living'
  },
  {
    topic: 'Indoor Hydroponic Gardening',
    primaryKeyword: 'indoor hydroponic gardening',
    audience: 'Urban homeowners and apartment gardeners',
    industry: 'Home Gardening and Urban Agriculture'
  }
];

const TARGET_WORD_COUNTS = [500, 800, 1200, 1500];

describe('Custom Topic Article Generation & Word-Count Adaptation', () => {
  for (const tc of TEST_CASES) {
    describe(`Topic: "${tc.topic}"`, () => {
      for (const target of TARGET_WORD_COUNTS) {
        it(`generates article for target ${target} words within strictly ±10% tolerance [${Math.round(target * 0.9)} - ${Math.round(target * 1.1)}]`, async () => {
          // Stage 1: Strategy
          const stratRes = await postJson('/api/strategy', {
            topic: tc.topic,
            primaryKeyword: tc.primaryKeyword,
            audience: tc.audience,
            industry: tc.industry,
            market: 'US',
            intent: 'informational',
            tone: 'professional',
            language: 'English',
            wordCount: target
          });

          expect(stratRes.status).toBe(200);
          expect(stratRes.body.ok).toBe(true);
          const strategy = stratRes.body.data.strategy;
          expect(strategy.titles.length).toBeGreaterThanOrEqual(5);
          expect(strategy.metaDescription.length).toBeGreaterThanOrEqual(155);
          expect(strategy.metaDescription.length).toBeLessThanOrEqual(160);

          // Verify non-physical topics do NOT contain forced equipment secondary keywords
          if (!tc.topic.includes('Hydroponic')) {
            const joinedSecondary = strategy.keywords.secondary.join(' ').toLowerCase();
            expect(joinedSecondary).not.toContain('equipment');
            expect(joinedSecondary).not.toContain('routine maintenance');
          }

          // Stage 2: Outline
          const outlineRes = await postJson('/api/outline', {
            input: {
              topic: tc.topic,
              primaryKeyword: tc.primaryKeyword,
              audience: tc.audience,
              industry: tc.industry,
              market: 'US',
              intent: 'informational',
              tone: 'professional',
              language: 'English',
              wordCount: target
            },
            strategy
          });

          expect(outlineRes.status).toBe(200);
          expect(outlineRes.body.ok).toBe(true);
          const outline = outlineRes.body.data.outline;
          expect(outline.sections.length).toBe(4);

          // Last H2 must name primary keyword
          const lastH2 = outline.sections[3].h2;
          expect(lastH2.toLowerCase()).toContain(tc.primaryKeyword.toLowerCase());

          // Verify non-physical topics have domain-appropriate headings, not forced equipment/gardening
          if (!tc.topic.includes('Hydroponic')) {
            const allHeadings = outline.sections.map((s: any) => `${s.h2} ${s.h3.join(' ')}`).join(' ').toLowerCase();
            expect(allHeadings).not.toContain('essential equipment');
            expect(allHeadings).not.toContain('routine maintenance');
          }

          // Stage 3: Article
          const articleRes = await postJson('/api/article', {
            input: {
              topic: tc.topic,
              primaryKeyword: tc.primaryKeyword,
              audience: tc.audience,
              industry: tc.industry,
              market: 'US',
              intent: 'informational',
              tone: 'professional',
              language: 'English',
              wordCount: target
            },
            strategy,
            outline
          });

          expect(articleRes.status).toBe(200);
          expect(articleRes.body.ok).toBe(true);
          const articleText = articleRes.body.data.article;
          const words = countWords(articleText);

          const minExpected = Math.round(target * 0.9);
          const maxExpected = Math.round(target * 1.1);

          expect(words).toBeGreaterThanOrEqual(minExpected);
          expect(words).toBeLessThanOrEqual(maxExpected);

          // Heading structure checks
          const lines = articleText.split('\n').map((l: string) => l.trim());
          const h1Line = lines.find((l: string) => l.startsWith('# '));
          expect(h1Line).toBeDefined();

          const h2Lines = lines.filter((l: string) => l.startsWith('## '));
          expect(h2Lines.length).toBeGreaterThanOrEqual(4);

          // Outline fidelity: H2 headings from outline must appear in the article
          for (const sec of outline.sections) {
            expect(articleText).toContain(sec.h2);
          }

          // Must have at least one bulleted list
          const listLines = lines.filter((l: string) => l.startsWith('- '));
          expect(listLines.length).toBeGreaterThanOrEqual(3);

          // Stage 4: FAQs
          const faqsRes = await postJson('/api/faqs', {
            input: {
              topic: tc.topic,
              primaryKeyword: tc.primaryKeyword,
              audience: tc.audience,
              industry: tc.industry,
              market: 'US',
              intent: 'informational',
              tone: 'professional',
              language: 'English',
              wordCount: target
            },
            strategy,
            outline
          });

          expect(faqsRes.status).toBe(200);
          expect(faqsRes.body.ok).toBe(true);
          const faqs = faqsRes.body.data.faqs;
          expect(faqs.length).toBe(5);

          for (const faq of faqs) {
            expect(faq.question.endsWith('?')).toBe(true);
            const ansWords = countWords(faq.answer);
            expect(ansWords).toBeGreaterThanOrEqual(40);
            expect(ansWords).toBeLessThanOrEqual(70);
          }
        });
      }
    });
  }

  describe('Mock Provider Word-Count Retry & Expansion', () => {
    it('gently expands and calibrates an article when requested on retry', async () => {
      const mockProvider = new MockProvider();
      const target = 800;
      const minWords = Math.round(target * 0.9);
      const maxWords = Math.round(target * 1.1);

      // Simulate a retry prompt with explicit EXPAND request
      const retryPrompt = `<context>
Topic: How Artificial Intelligence Is Changing the Movie Industry
Target audience: Filmmakers and cinema enthusiasts
Industry: Entertainment
Target market: US
Primary keyword: AI in movie industry
Search intent: Informational
Tone: Professional
Output language: English
Target length: 800 words
</context>
<strategy>{"titles":[{"text":"AI in the Movie Industry: Transforming Modern Cinema","angle":"guide"}]}</strategy>
<outline>{"sections":[{"h2":"The Transformative Rise of AI in the Movie Industry","h3":[],"purpose":"","targetWords":200},{"h2":"Production Efficiency and Creative Augmentation Across Studios","h3":[],"purpose":"","targetWords":180},{"h2":"Ethical Considerations, Creative Rights, and the Labor Landscape","h3":[],"purpose":"","targetWords":180},{"h2":"Conclusion: The Collaborative Future of AI in the Movie Industry","h3":[],"purpose":"","targetWords":160}]}</outline>

Task: write the full article in Markdown.

================================================================================
REVISION INSTRUCTIONS (PREVIOUS ATTEMPT FAILED VALIDATION)
================================================================================
Your previous article output failed validation for the following reason:
Article word count is 655 words, which is under target 800 words (must be between 720 and 880 words, strictly within ±10% tolerance). Please expand the body sections with comprehensive explanations, depth, and practical guidance.

ACTION REQUIRED: EXPAND CONTENT.
The previous draft was only 655 words, which is under the minimum requirement of 720 words (target: 800 words ±10%, acceptable range: 720 to 880 words).
- Expand each section with actionable, in-depth explanations, real-world examples, and practical guidance.
- Do NOT use repetitive filler. Add genuine value and depth to meet the target word count.

TARGET WORD COUNT REQUIREMENT:
- Requested target: 800 words
- Exact acceptable range (±10%): strictly between 720 and 880 words

CRITICAL CONSTRAINTS TO PRESERVE:
- Must preserve the exact top-level H1: # AI in the Movie Industry: Transforming Modern Cinema
- Must preserve primary keyword placement and natural distribution as requested.
- Must preserve all generated outline sections (H2 and H3 headings) in exact order.
- Must strictly preserve the requested language, tone, search intent, target audience, and market from the original instructions above.
- Do NOT output placeholder text, conversational filler, or meta-commentary. Provide ONLY the complete revised article in Markdown.`;

      const result = await mockProvider.generate({
        system: 'You are an experienced SEO copywriter.',
        user: retryPrompt
      });

      const words = countWords(result.text);
      expect(words).toBeGreaterThanOrEqual(minWords);
      expect(words).toBeLessThanOrEqual(maxWords);
      expect(result.text).toContain('# AI in the Movie Industry: Transforming Modern Cinema');
      expect(result.text).toContain('## The Transformative Rise of AI in the Movie Industry');
      expect(result.text).toContain('## Conclusion: The Collaborative Future of AI in the Movie Industry');
    });
  });

  describe('Primary Keyword Single Input Validation', () => {
    it('rejects comma-separated list of keywords with a descriptive 400 error', async () => {
      const res = await postJson('/api/strategy', {
        topic: 'How Artificial Intelligence Is Changing the Movie Industry',
        primaryKeyword: 'AI in cinema, filmmaking, movie visual effects',
        audience: 'Filmmakers',
        industry: 'Entertainment',
        market: 'US',
        intent: 'informational',
        tone: 'professional',
        language: 'English',
        wordCount: 800
      });

      expect(res.status).toBe(400);
      expect(res.body.ok).toBe(false);
      expect(res.body.error.message).toContain('Primary keyword must be a single keyword or keyphrase');
    });
  });
});
