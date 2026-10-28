const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const OUT_DIR = path.resolve(__dirname, '../docs/quick_inspect');
if (!fs.existsSync(OUT_DIR)) {
  fs.mkdirSync(OUT_DIR, { recursive: true });
}

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const BASE_URL = 'http://localhost:5173';

async function runQuickInspect() {
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

  const results = {};

  // 1. Dashboard
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT_DIR, 'page1-dashboard.png'), fullPage: false });
  results.dashboard = await page.evaluate(() => {
    const sb = document.querySelector('.sidebar')?.getBoundingClientRect();
    const mw = document.querySelector('.main-wrapper')?.getBoundingClientRect();
    return {
      sidebarWidth: Math.round(sb?.width || 0),
      sidebarHeight: Math.round(sb?.height || 0),
      mainLeft: Math.round(mw?.left || 0),
      mainWidth: Math.round(mw?.width || 0),
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  // 2. Generate Package
  await page.goto(`${BASE_URL}/generate`, { waitUntil: 'networkidle0' });
  // Load sample inputs and submit
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Load Sample Inputs'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.click('button[type="submit"]');
  await page.waitForSelector('.results-container', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 800));
  await page.evaluate(() => {
    document.querySelector('.results-container')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(OUT_DIR, 'page2-generate.png'), fullPage: false });
  results.generate = await page.evaluate(() => {
    const reader = document.querySelector('.article-reader-card')?.getBoundingClientRect();
    const meta = document.querySelector('.article-meta-sidebar')?.getBoundingClientRect();
    return {
      readerWidth: Math.round(reader?.width || 0),
      metaSidebarWidth: Math.round(meta?.width || 0),
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  // 3. Prompt Lab
  await page.goto(`${BASE_URL}/lab`, { waitUntil: 'networkidle0' });
  await page.click('.btn.btn-primary');
  await page.waitForSelector('.mode-score-badge', { timeout: 25000 });
  await new Promise(r => setTimeout(r, 800));
  // Inspect output card scrollability
  results.lab = await page.evaluate(() => {
    const outputCardBodies = Array.from(document.querySelectorAll('.output-card .card-body'));
    const cols = Array.from(document.querySelectorAll('.mode-column'));
    const modeBBody = outputCardBodies[1];
    const isScrollable = modeBBody ? modeBBody.scrollHeight > modeBBody.clientHeight : false;
    return {
      colWidths: cols.map(c => Math.round(c.getBoundingClientRect().width)),
      cardBodyHeights: outputCardBodies.map(b => ({
        clientHeight: b.clientHeight,
        scrollHeight: b.scrollHeight
      })),
      modeBScrollable: isScrollable,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });
  await page.screenshot({ path: path.join(OUT_DIR, 'page3-lab.png'), fullPage: false });

  // 4. Evaluation & Rubric
  await page.goto(`${BASE_URL}/evaluation`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'page4-evaluation.png'), fullPage: false });
  results.evaluation = await page.evaluate(() => {
    const accordion = document.querySelector('.rubric-accordion-list')?.getBoundingClientRect();
    const rules = document.querySelectorAll('.rubric-item');
    const badges = Array.from(document.querySelectorAll('.badge')).map(b => ({
      text: b.innerText,
      class: b.className
    }));
    return {
      ruleCount: rules.length,
      accordionWidth: Math.round(accordion?.width || 0),
      badgesSample: badges.slice(0, 3),
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  // 5. Prompts & Guide
  await page.goto(`${BASE_URL}/prompts`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(OUT_DIR, 'page5-prompts.png'), fullPage: false });
  results.prompts = await page.evaluate(() => {
    const codeBox = document.querySelector('.template-code-container');
    return {
      codeBoxHeight: codeBox?.clientHeight || 0,
      codeBoxScrollHeight: codeBox?.scrollHeight || 0,
      hasOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
    };
  });

  await browser.close();
  console.log(JSON.stringify(results, null, 2));
}

runQuickInspect().catch(err => {
  console.error('Inspect error:', err);
  process.exit(1);
});
