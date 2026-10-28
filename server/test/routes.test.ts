import { describe, it, expect } from 'vitest';
import app from '../src/index.js';

// Minimal in-memory HTTP caller for Express testing without external supertest
async function request(path: string, options: RequestInit = {}) {
  // Use node:http or simple server harness
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

const sampleInput = {
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

describe('Server API Routes', () => {
  it('GET /api/health returns configured and mock status', async () => {
    const res = await request('/api/health');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.configured).toBe(true);
    expect(res.body.data.mock).toBe(true);
  });

  it('GET /api/prompts returns all prompt stages and techniques', async () => {
    const res = await request('/api/prompts');
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.stages.strategy).toBeDefined();
    expect(res.body.data.techniques.length).toBeGreaterThanOrEqual(6);
  });

  it('POST /api/strategy returns 400 on invalid input', async () => {
    const res = await request('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: { topic: '' } })
    });
    expect(res.status).toBe(400);
    expect(res.body.ok).toBe(false);
    expect(res.body.error.code).toBe('VALIDATION_ERROR');
  });

  it('POST /api/strategy returns 5 titles and keywords with mock provider', async () => {
    const res = await request('/api/strategy', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: sampleInput })
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.strategy.titles.length).toBe(5);
    expect(res.body.data.strategy.keywords.primary).toBe('indoor herb garden');
  });

  it('POST /api/simple returns baseline text and promptUsed', async () => {
    const res = await request('/api/simple', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ input: sampleInput })
    });
    expect(res.status).toBe(200);
    expect(res.body.ok).toBe(true);
    expect(res.body.data.text).toBeDefined();
    expect(res.body.data.promptUsed).toContain('Growing herbs at home');
  });
});
