const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const INSPECT_DIR = path.resolve(__dirname, '../docs/visual_inspection');
if (!fs.existsSync(INSPECT_DIR)) {
  fs.mkdirSync(INSPECT_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function captureAllForVisualInspection() {
  console.log('Starting visual capture on 1366x768...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu']
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768, deviceScaleFactor: 1 });

  // 1. Dashboard (Expanded & Collapsed)
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '01-dashboard-expanded.png'), fullPage: false });
  
  // Collapse sidebar
  await page.click('.desktop-collapse-btn');
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '01-dashboard-collapsed.png'), fullPage: false });
  
  // Expand back
  await page.click('.sidebar-toggle-btn');
  await new Promise(r => setTimeout(r, 400));

  // 2. Generate Package - Form View
  await page.goto(`${BASE_URL}/generate`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '02-generate-form.png'), fullPage: false });

  // Generate package with sample inputs
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Load Sample Inputs'));
    if (btn) btn.click();
  });
  await new Promise(r => setTimeout(r, 300));
  await page.click('button[type="submit"]');
  await page.waitForSelector('.results-container', { timeout: 30000 });
  await new Promise(r => setTimeout(r, 1000));

  // Scroll to results and capture Article Draft
  await page.evaluate(() => {
    document.querySelector('.results-container')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(INSPECT_DIR, '02-generate-article-draft.png'), fullPage: false });

  // Switch to Titles tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const t = tabs.find(b => b.innerText.includes('SEO Titles'));
    if (t) t.click();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(INSPECT_DIR, '02-generate-titles-tab.png'), fullPage: false });

  // 3. Prompt Lab (Before & After Comparison)
  await page.goto(`${BASE_URL}/lab`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '03-lab-initial.png'), fullPage: false });

  // Run comparison
  await page.click('.btn.btn-primary');
  await page.waitForSelector('.mode-score-badge', { timeout: 25000 });
  await new Promise(r => setTimeout(r, 1000));
  
  // Screenshot top comparison cards
  await page.screenshot({ path: path.join(INSPECT_DIR, '03-lab-compared-top.png'), fullPage: false });
  // Scroll down to rubric comparison table and academic conclusion
  await page.evaluate(() => {
    document.querySelector('.rubric-comparison-card')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(INSPECT_DIR, '03-lab-compared-rubric.png'), fullPage: false });

  // 4. Evaluation & Rubric
  await page.goto(`${BASE_URL}/evaluation`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '04-evaluation-top.png'), fullPage: false });
  
  // Expand rule R1 and scroll to table
  await page.evaluate(() => {
    const header = document.querySelector('.rubric-item-header');
    if (header) header.click();
    document.querySelector('.rubric-accordion-list')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(INSPECT_DIR, '04-evaluation-accordion.png'), fullPage: false });

  // 5. Prompts & Guide
  await page.goto(`${BASE_URL}/prompts`, { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 400));
  await page.screenshot({ path: path.join(INSPECT_DIR, '05-prompts-top.png'), fullPage: false });
  
  // Click Stage 3 (Article Writer) tab to inspect long template code block
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tpl-tab-btn'));
    const t = tabs.find(b => b.innerText.includes('STAGE 3') || b.innerText.includes('Article'));
    if (t) t.click();
    document.querySelector('.template-code-container')?.scrollIntoView();
  });
  await new Promise(r => setTimeout(r, 500));
  await page.screenshot({ path: path.join(INSPECT_DIR, '05-prompts-stage3-template.png'), fullPage: false });

  await browser.close();
  console.log('All visual screenshots captured in docs/visual_inspection/');
}

captureAllForVisualInspection().catch(e => {
  console.error('Error:', e);
  process.exit(1);
});
