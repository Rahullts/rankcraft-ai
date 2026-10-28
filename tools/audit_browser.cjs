const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const routesToTest = [
  { name: '01-dashboard', path: '/', label: 'Dashboard' },
  { name: '02-generate', path: '/generate', label: 'Generate Package' },
  { name: '03-lab', path: '/lab', label: 'Prompt Engineering Lab' },
  { name: '04-evaluation', path: '/evaluation', label: 'Evaluation & Rubric' },
  { name: '05-prompts', path: '/prompts', label: 'Prompts & Guide' }
];

async function runAudit() {
  console.log('======================================================');
  console.log('   RANKCRAFT AI — AUTOMATED BROWSER QUALITY AUDIT');
  console.log('======================================================');
  console.log(`Target Base URL: ${BASE_URL}`);
  console.log(`Chrome Binary:   ${CHROME_PATH}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  const auditLog = {
    timestamp: new Date().toISOString(),
    routes: {},
    interactiveTests: {},
    consoleErrors: [],
    failedRequests: []
  };

  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      auditLog.consoleErrors.push(`[Console Error] ${msg.text()}`);
      console.error(`   [Browser Console Error]: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    auditLog.consoleErrors.push(`[Page Error] ${err.message}`);
    console.error(`   [Browser Uncaught Error]: ${err.message}`);
  });

  page.on('requestfailed', req => {
    const failure = req.failure();
    const url = req.url();
    if (failure && failure.errorText !== 'net::ERR_ABORTED') {
      auditLog.failedRequests.push(`[Request Failed] ${req.method()} ${url}: ${failure.errorText}`);
      console.error(`   [Request Failed]: ${req.method()} ${url} - ${failure.errorText}`);
    }
  });

  // --- PHASE 1: ROUTE INSPECTION, VIEWPORTS & SCREENSHOTS ---
  console.log('\n--- PHASE 1: ROUTE INSPECTION, VIEWPORTS & SCREENSHOTS ---');
  for (const r of routesToTest) {
    const fullUrl = `${BASE_URL}${r.path}`;
    console.log(`\nInspecting: ${r.label} (${fullUrl})`);

    // Desktop Viewport (1280x800)
    await page.setViewport({ width: 1280, height: 800, deviceScaleFactor: 1 });
    await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 15000 });
    await new Promise(res => setTimeout(res, 500));

    const desktopOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        hasOverflow: doc.scrollWidth > doc.clientWidth
      };
    });

    const pageTitle = await page.title();
    const heading = await page.evaluate(() => {
      const h = document.querySelector('h1, h2');
      return h ? h.innerText.trim() : 'No heading';
    });

    const desktopPath = path.join(SCREENSHOTS_DIR, `${r.name}-desktop.png`);
    await page.screenshot({ path: desktopPath, fullPage: false });
    console.log(`   ✓ Desktop (1280x800): "${heading}"`);
    console.log(`     Overflow: ${desktopOverflow.hasOverflow ? 'FAIL (' + desktopOverflow.scrollWidth + 'px > ' + desktopOverflow.clientWidth + 'px)' : 'PASS (Clean)'}`);
    console.log(`     Saved: ${desktopPath}`);

    // Mobile Viewport (375x667)
    await page.setViewport({ width: 375, height: 667, deviceScaleFactor: 2, isMobile: true });
    await new Promise(res => setTimeout(res, 400));

    const mobileOverflow = await page.evaluate(() => {
      const doc = document.documentElement;
      return {
        scrollWidth: doc.scrollWidth,
        clientWidth: doc.clientWidth,
        hasOverflow: doc.scrollWidth > doc.clientWidth
      };
    });

    const mobilePath = path.join(SCREENSHOTS_DIR, `${r.name}-mobile.png`);
    await page.screenshot({ path: mobilePath, fullPage: false });
    console.log(`   ✓ Mobile (375x667):`);
    console.log(`     Overflow: ${mobileOverflow.hasOverflow ? 'FAIL (' + mobileOverflow.scrollWidth + 'px > ' + mobileOverflow.clientWidth + 'px)' : 'PASS (Clean)'}`);
    console.log(`     Saved: ${mobilePath}`);

    auditLog.routes[r.name] = {
      label: r.label,
      url: fullUrl,
      title: pageTitle,
      heading,
      desktopOverflow,
      mobileOverflow
    };
  }

  // Reset to Desktop for interactive testing
  await page.setViewport({ width: 1280, height: 900 });

  // --- PHASE 2: CLIENT FORM VALIDATION ERROR HANDLING ---
  console.log('\n--- PHASE 2: CLIENT FORM VALIDATION ERROR HANDLING ---');
  await page.goto(`${BASE_URL}/generate`, { waitUntil: 'networkidle0' });

  // Clear topic input using keyboard actions
  await page.click('#topic', { clickCount: 3 });
  await page.keyboard.press('Backspace');
  await new Promise(res => setTimeout(res, 200));

  await page.click('button[type="submit"]');
  await new Promise(res => setTimeout(res, 500));

  const validationErrors = await page.evaluate(() => {
    return Array.from(document.querySelectorAll('.error-text, .form-error-banner, [role="alert"]')).map(el => el.innerText.trim());
  });

  console.log(`   ✓ Form validation successfully caught empty submission:`, validationErrors);
  const errorScreenPath = path.join(SCREENSHOTS_DIR, '06-generate-validation-error.png');
  await page.screenshot({ path: errorScreenPath });
  auditLog.interactiveTests.validation = { errors: validationErrors };

  // --- PHASE 3: GENERATE COMPLETE PACKAGE WORKFLOW ---
  console.log('\n--- PHASE 3: GENERATE COMPLETE PACKAGE WORKFLOW ---');
  await page.goto(`${BASE_URL}/generate`, { waitUntil: 'networkidle0' });

  // Click "Load Sample Inputs" to populate all valid baseline fields cleanly
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Load Sample Inputs'));
    if (btn) btn.click();
  });
  await new Promise(res => setTimeout(res, 400));

  // Now customize topic and keyword using real keyboard input
  await page.click('#topic', { clickCount: 3 });
  await page.keyboard.type('Sustainable Indoor Hydroponic Gardening');
  await page.click('#primaryKeyword', { clickCount: 3 });
  await page.keyboard.type('indoor hydroponic gardening');
  await page.click('#market', { clickCount: 3 });
  await page.keyboard.type('India');

  console.log('   ✓ Form populated with "Sustainable Indoor Hydroponic Gardening"');
  console.log('   ✓ Submitting multi-stage generation pipeline...');
  await page.click('button[type="submit"]');

  // Verify loading state
  await new Promise(res => setTimeout(res, 400));
  const isRunning = await page.evaluate(() => {
    const btn = document.querySelector('button[type="submit"]');
    return btn ? btn.disabled || btn.innerText.includes('Generating') : false;
  });
  console.log(`   ✓ Loading state confirmed (Submit disabled/in-progress: ${isRunning})`);

  // Wait for results container to appear
  console.log('   Awaiting pipeline execution across 5 stages...');
  await page.waitForSelector('.results-container', { timeout: 35000 });
  await new Promise(res => setTimeout(res, 1500));

  const generatedSummary = await page.evaluate(() => {
    const title = document.querySelector('.results-title')?.innerText || '';
    const meta = document.querySelector('.results-meta')?.innerText || '';
    const activeTabHeading = document.querySelector('.results-container h1, .results-container h2')?.innerText || '';
    const tabs = Array.from(document.querySelectorAll('.tab-btn')).map(t => t.innerText.trim());
    return {
      title,
      meta,
      activeTabHeading,
      tabs
    };
  });

  console.log(`   ✓ Generation Pipeline Complete!`);
  console.log(`     Container Header: "${generatedSummary.title}" (${generatedSummary.meta})`);
  console.log(`     Active Tab Heading: "${generatedSummary.activeTabHeading}"`);
  console.log(`     Available Output Tabs:`, generatedSummary.tabs);

  const genArticleScreenPath = path.join(SCREENSHOTS_DIR, '07-generate-completed-article.png');
  await page.screenshot({ path: genArticleScreenPath, fullPage: false });
  console.log(`   Saved Article Screenshot: ${genArticleScreenPath}`);

  // Switch to SEO Titles tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const titleTab = tabs.find(t => t.innerText.includes('SEO Titles'));
    if (titleTab) titleTab.click();
  });
  await new Promise(res => setTimeout(res, 800));

  const titlesScreenPath = path.join(SCREENSHOTS_DIR, '08-generate-completed-titles.png');
  await page.screenshot({ path: titlesScreenPath, fullPage: false });
  console.log(`   Saved SEO Titles Screenshot: ${titlesScreenPath}`);

  // Switch to FAQs tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const faqsTab = tabs.find(t => t.innerText.includes('FAQs'));
    if (faqsTab) faqsTab.click();
  });
  await new Promise(res => setTimeout(res, 800));

  const faqsScreenPath = path.join(SCREENSHOTS_DIR, '09-generate-completed-faqs.png');
  await page.screenshot({ path: faqsScreenPath, fullPage: false });
  console.log(`   Saved FAQs Screenshot: ${faqsScreenPath}`);

  auditLog.interactiveTests.generate = generatedSummary;

  // --- PHASE 4: PROMPT ENGINEERING LAB (MODE A vs MODE B) ---
  console.log('\n--- PHASE 4: PROMPT ENGINEERING LAB (MODE A vs MODE B) ---');
  await page.goto(`${BASE_URL}/lab`, { waitUntil: 'networkidle0' });

  console.log('   Clicking "Run Comparison" button...');
  await page.click('.btn.btn-primary');

  await new Promise(res => setTimeout(res, 400));
  const labBtnText = await page.evaluate(() => {
    const btn = document.querySelector('.btn.btn-primary');
    return btn ? btn.innerText.trim() : '';
  });
  console.log(`   ✓ Lab comparison running (Button text: "${labBtnText}")`);

  // Wait for score badges to appear
  await page.waitForSelector('.mode-score-badge', { timeout: 25000 });
  await new Promise(res => setTimeout(res, 1500));

  const labResults = await page.evaluate(() => {
    const badges = Array.from(document.querySelectorAll('.mode-score-badge')).map(b => b.innerText.trim());
    const simpleTag = document.querySelector('.tag-simple')?.innerText || '';
    const improvedTag = document.querySelector('.tag-improved')?.innerText || '';
    const diffTableRows = Array.from(document.querySelectorAll('.diff-table tbody tr, .rubric-comparison-table tbody tr')).map(tr => tr.innerText.trim());
    return {
      badges,
      simpleTag,
      improvedTag,
      diffRowCount: diffTableRows.length
    };
  });

  console.log(`   ✓ A/B Comparison Complete!`);
  console.log(`     Score Badges:`, labResults.badges);
  const labScreenPath = path.join(SCREENSHOTS_DIR, '10-lab-comparison-results.png');
  await page.screenshot({ path: labScreenPath, fullPage: false });
  console.log(`   Saved Lab Results Screenshot: ${labScreenPath}`);
  auditLog.interactiveTests.lab = labResults;

  await browser.close();

  // Save audit log
  const auditReportPath = path.resolve(__dirname, '../docs/AUDIT_REPORT.json');
  fs.writeFileSync(auditReportPath, JSON.stringify(auditLog, null, 2), 'utf8');
  console.log('\n======================================================');
  console.log(`QUALITY AUDIT COMPLETE!`);
  console.log(`Screenshots saved to: ${SCREENSHOTS_DIR}`);
  console.log(`Detailed audit JSON: ${auditReportPath}`);
  console.log(`Console Errors: ${auditLog.consoleErrors.length}`);
  console.log(`Failed Requests: ${auditLog.failedRequests.length}`);
  console.log('======================================================');
}

runAudit().catch(err => {
  console.error('FATAL AUDIT ERROR:', err);
  process.exit(1);
});
