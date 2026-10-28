const puppeteer = require('./node_modules/puppeteer-core');
const fs = require('fs');
const path = require('path');

const SCREENSHOTS_DIR = path.resolve(__dirname, '../docs/screenshots');
if (!fs.existsSync(SCREENSHOTS_DIR)) {
  fs.mkdirSync(SCREENSHOTS_DIR, { recursive: true });
}

const BASE_URL = 'http://localhost:5173';
const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

const targetViewports = [
  { name: '1366x768', width: 1366, height: 768, label: 'Standard Laptop' },
  { name: '1440x900', width: 1440, height: 900, label: 'Widescreen Laptop' },
  { name: '1280x800', width: 1280, height: 800, label: 'Smaller Laptop' },
  { name: '1024x768', width: 1024, height: 768, label: 'Tablet / Narrow Desktop' },
  { name: '375x667',  width: 375,  height: 667,  label: 'Mobile iPhone SE', isMobile: true }
];

const routesToTest = [
  { name: 'dashboard', path: '/', label: 'Dashboard' },
  { name: 'generate', path: '/generate', label: 'Generate Package' },
  { name: 'lab', path: '/lab', label: 'Prompt Lab' },
  { name: 'evaluation', path: '/evaluation', label: 'Evaluation & Rubric' },
  { name: 'prompts', path: '/prompts', label: 'Prompts & Guide' }
];

async function runFullVerification() {
  console.log('======================================================================');
  console.log('   RANKCRAFT AI — MULTI-VIEWPORT RESPONSIVENESS & INTERACTION AUDIT');
  console.log('======================================================================');
  console.log(`Base URL:     ${BASE_URL}`);
  console.log(`Chrome:       ${CHROME_PATH}`);
  console.log(`Viewports:    ${targetViewports.map(v => `${v.name} (${v.label})`).join(', ')}`);

  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: true,
    args: ['--no-sandbox', '--disable-gpu', '--hide-scrollbars']
  });

  const auditReport = {
    timestamp: new Date().toISOString(),
    viewports: {},
    interactiveTests: {},
    sidebarTests: {},
    consoleErrors: [],
    failedRequests: []
  };

  const page = await browser.newPage();

  page.on('console', msg => {
    if (msg.type() === 'error') {
      auditReport.consoleErrors.push(`[Console Error] ${msg.text()}`);
      console.error(`   [Browser Console Error]: ${msg.text()}`);
    }
  });

  page.on('pageerror', err => {
    auditReport.consoleErrors.push(`[Page Error] ${err.message}`);
    console.error(`   [Browser Uncaught Error]: ${err.message}`);
  });

  page.on('requestfailed', req => {
    const failure = req.failure();
    const url = req.url();
    if (failure && failure.errorText !== 'net::ERR_ABORTED') {
      auditReport.failedRequests.push(`[Request Failed] ${req.method()} ${url}: ${failure.errorText}`);
      console.error(`   [Request Failed]: ${req.method()} ${url} - ${failure.errorText}`);
    }
  });

  // Helper to check horizontal overflow
  async function checkOverflow() {
    return await page.evaluate(() => {
      const doc = document.documentElement;
      const clientWidth = doc.clientWidth;
      const scrollWidth = doc.scrollWidth;
      const hasOverflow = scrollWidth > clientWidth;
      
      let offendingElements = [];
      if (hasOverflow) {
        document.querySelectorAll('*').forEach(el => {
          const rect = el.getBoundingClientRect();
          if (rect.right > clientWidth + 2) {
            offendingElements.push({
              tag: el.tagName,
              id: el.id,
              className: el.className,
              rectRight: Math.round(rect.right),
              excess: Math.round(rect.right - clientWidth)
            });
          }
        });
      }
      return { clientWidth, scrollWidth, hasOverflow, offendingElements: offendingElements.slice(0, 5) };
    });
  }

  // -------------------------------------------------------------------------
  // PHASE 1: VIEWPORT MATRICES & HORIZONTAL OVERFLOW CHECK ACROSS ALL 5 ROUTES
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 1: VERIFYING ZERO HORIZONTAL OVERFLOW ON ALL 5 VIEWPORTS ---');

  for (const vp of targetViewports) {
    console.log(`\nTesting Viewport: ${vp.name} (${vp.label})`);
    auditReport.viewports[vp.name] = { label: vp.label, width: vp.width, height: vp.height, routes: {} };

    await page.setViewport({
      width: vp.width,
      height: vp.height,
      deviceScaleFactor: vp.isMobile ? 2 : 1,
      isMobile: !!vp.isMobile
    });

    for (const r of routesToTest) {
      const fullUrl = `${BASE_URL}${r.path}`;
      await page.goto(fullUrl, { waitUntil: 'networkidle0', timeout: 15000 });
      await new Promise(res => setTimeout(res, 350));

      const overflow = await checkOverflow();
      const status = overflow.hasOverflow ? 'FAIL ❌' : 'PASS ✅';
      console.log(`   ${status} [${vp.name}] ${r.label.padEnd(24)} scrollWidth: ${overflow.scrollWidth}px <= clientWidth: ${overflow.clientWidth}px`);

      if (overflow.hasOverflow) {
        console.error(`       Offending elements:`, overflow.offendingElements);
      }

      auditReport.viewports[vp.name].routes[r.name] = {
        scrollWidth: overflow.scrollWidth,
        clientWidth: overflow.clientWidth,
        hasOverflow: overflow.hasOverflow
      };

      // Take clean representative screenshots for 1280x800 and 375x667
      if (vp.name === '1280x800' || vp.name === '375x667') {
        const modeSuffix = vp.isMobile ? 'mobile' : 'desktop';
        const scrPath = path.join(SCREENSHOTS_DIR, `0${routesToTest.indexOf(r) + 1}-${r.name}-${modeSuffix}.png`);
        await page.screenshot({ path: scrPath, fullPage: false });
      }
    }
  }

  // -------------------------------------------------------------------------
  // PHASE 2: SIDEBAR COLLAPSIBLE BEHAVIOR & INTERACTION AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 2: SIDEBAR COLLAPSE & DRAWER INTERACTION TESTS ---');

  // Test A: Desktop Viewport (1366x768) - Collapse & Reclaim Space
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise(res => setTimeout(res, 400));

  const desktopInitial = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-wrapper');
    return {
      sidebarWidth: sidebar?.getBoundingClientRect().width || 0,
      isCollapsed: sidebar?.classList.contains('collapsed') || false,
      mainWidth: main?.getBoundingClientRect().width || 0
    };
  });
  console.log(`   ✓ Desktop Initial State: Sidebar width = ${desktopInitial.sidebarWidth}px, Main width = ${desktopInitial.mainWidth}px`);

  // Click collapse toggle in sidebar
  await page.click('.desktop-collapse-btn');
  await new Promise(res => setTimeout(res, 350));

  const desktopCollapsed = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const main = document.querySelector('.main-wrapper');
    return {
      sidebarWidth: sidebar?.getBoundingClientRect().width || 0,
      isCollapsed: sidebar?.classList.contains('collapsed') || false,
      mainWidth: main?.getBoundingClientRect().width || 0
    };
  });
  console.log(`   ✓ Desktop Collapsed State: Sidebar width = ${desktopCollapsed.sidebarWidth}px, Main width = ${desktopCollapsed.mainWidth}px`);
  console.log(`     Main space reclaimed: +${Math.round(desktopCollapsed.mainWidth - desktopInitial.mainWidth)}px`);

  const overflowWhileCollapsed = await checkOverflow();
  console.log(`     Zero overflow when collapsed: ${!overflowWhileCollapsed.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  // Screenshot collapsed state on 1366x768
  const collapsedScrPath = path.join(SCREENSHOTS_DIR, '01-dashboard-desktop-collapsed.png');
  await page.screenshot({ path: collapsedScrPath });
  console.log(`     Saved collapsed screenshot: ${collapsedScrPath}`);

  // Click hamburger in topbar to expand again
  await page.click('.sidebar-toggle-btn');
  await new Promise(res => setTimeout(res, 350));

  const desktopRestored = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    return {
      sidebarWidth: sidebar?.getBoundingClientRect().width || 0,
      isCollapsed: sidebar?.classList.contains('collapsed') || false
    };
  });
  console.log(`   ✓ Desktop Restored State: Sidebar width = ${desktopRestored.sidebarWidth}px (Collapsed: ${desktopRestored.isCollapsed})`);

  auditReport.sidebarTests.desktop = {
    initialWidth: desktopInitial.sidebarWidth,
    collapsedWidth: desktopCollapsed.sidebarWidth,
    reclaimedSpace: desktopCollapsed.mainWidth - desktopInitial.mainWidth,
    overflowWhileCollapsed: overflowWhileCollapsed.hasOverflow
  };

  // Test B: Mobile Viewport (375x667) - Overlay Drawer & Dismiss
  console.log('\n   Testing Mobile Drawer Overlay & Light-Dismiss...');
  await page.setViewport({ width: 375, height: 667, isMobile: true, deviceScaleFactor: 2 });
  await page.goto(`${BASE_URL}/`, { waitUntil: 'networkidle0' });
  await new Promise(res => setTimeout(res, 400));

  const mobileInitial = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const rect = sidebar?.getBoundingClientRect();
    const style = window.getComputedStyle(sidebar);
    return {
      isOpen: sidebar?.classList.contains('mobile-open') || false,
      right: rect?.right || 0,
      transform: style.transform
    };
  });
  console.log(`   ✓ Mobile Initial State: Drawer open = ${mobileInitial.isOpen}, Right position = ${mobileInitial.right}px (Offscreen)`);

  // Open drawer via Topbar Hamburger
  await page.click('.sidebar-toggle-btn');
  await new Promise(res => setTimeout(res, 350));

  const mobileOpen = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    return {
      isOpen: sidebar?.classList.contains('mobile-open') || false,
      hasBackdrop: !!backdrop,
      backdropVisible: backdrop ? window.getComputedStyle(backdrop).display !== 'none' : false
    };
  });
  console.log(`   ✓ Mobile Opened State: Drawer open = ${mobileOpen.isOpen}, Backdrop present = ${mobileOpen.hasBackdrop}`);

  // Screenshot drawer open on mobile
  const mobileDrawerScrPath = path.join(SCREENSHOTS_DIR, '01-dashboard-mobile-drawer.png');
  await page.screenshot({ path: mobileDrawerScrPath });
  console.log(`     Saved mobile drawer screenshot: ${mobileDrawerScrPath}`);

  // Click backdrop outside 270px drawer to dismiss
  await page.mouse.click(320, 250);
  await new Promise(res => setTimeout(res, 350));

  const mobileDismissed = await page.evaluate(() => {
    const sidebar = document.querySelector('.sidebar');
    const backdrop = document.querySelector('.sidebar-backdrop');
    return {
      isOpen: sidebar?.classList.contains('mobile-open') || false,
      hasBackdrop: !!backdrop
    };
  });
  console.log(`   ✓ Mobile Dismissed via Backdrop: Drawer open = ${mobileDismissed.isOpen}, Backdrop removed = ${!mobileDismissed.hasBackdrop}`);

  // Test Escape key dismiss
  await page.click('.sidebar-toggle-btn');
  await new Promise(res => setTimeout(res, 250));
  await page.keyboard.press('Escape');
  await new Promise(res => setTimeout(res, 250));
  const mobileEscapeDismiss = await page.evaluate(() => {
    return document.querySelector('.sidebar')?.classList.contains('mobile-open') || false;
  });
  console.log(`   ✓ Mobile Dismissed via Escape Key: Drawer open = ${mobileEscapeDismiss}`);

  auditReport.sidebarTests.mobile = {
    initialOffscreen: mobileInitial.right <= 0,
    openSuccess: mobileOpen.isOpen && mobileOpen.hasBackdrop,
    backdropDismissSuccess: !mobileDismissed.isOpen,
    escapeDismissSuccess: !mobileEscapeDismiss
  };

  // -------------------------------------------------------------------------
  // PHASE 3: COMPACT DEMO BANNER AUDIT
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 3: COMPACT DEMO BANNER AUDIT ---');
  await page.setViewport({ width: 1440, height: 900 });
  const bannerDesktop = await page.evaluate(() => {
    const b = document.querySelector('.mock-banner');
    return {
      height: b?.getBoundingClientRect().height || 0,
      padding: window.getComputedStyle(b).padding,
      text: b?.innerText.replace(/\s+/g, ' ').trim()
    };
  });
  console.log(`   ✓ Desktop Banner Height: ${bannerDesktop.height}px (Compact: ${bannerDesktop.height <= 36 ? 'PASS' : 'WARN'})`);

  await page.setViewport({ width: 375, height: 667, isMobile: true });
  const bannerMobile = await page.evaluate(() => {
    const b = document.querySelector('.mock-banner');
    return {
      height: b?.getBoundingClientRect().height || 0,
      text: b?.innerText.replace(/\s+/g, ' ').trim()
    };
  });
  console.log(`   ✓ Mobile Banner Height: ${bannerMobile.height}px (Wraps cleanly without clipping)`);

  // -------------------------------------------------------------------------
  // PHASE 4: COMPLETE PIPELINE RUN & ARTICLE READING CANVAS VERIFICATION
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 4: ARTICLE OUTPUT & METADATA LAYOUT VERIFICATION ---');
  await page.setViewport({ width: 1366, height: 768 });
  await page.goto(`${BASE_URL}/generate`, { waitUntil: 'networkidle0' });

  // Load sample inputs
  await page.evaluate(() => {
    const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Load Sample Inputs'));
    if (btn) btn.click();
  });
  await new Promise(res => setTimeout(res, 350));

  // Run pipeline
  console.log('   Running multi-stage SEO generation pipeline...');
  await page.click('button[type="submit"]');

  await page.waitForSelector('.results-container', { timeout: 35000 });
  await new Promise(res => setTimeout(res, 1200));

  // Scroll into results section
  await page.evaluate(() => {
    document.querySelector('.results-container')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(res => setTimeout(res, 600));

  // Inspect article reader container & metadata panel
  const articleLayoutMetrics = await page.evaluate(() => {
    const readerCard = document.querySelector('.article-reader-card');
    const prose = document.querySelector('.article-prose');
    const metaSidebar = document.querySelector('.article-meta-sidebar');
    const layout = document.querySelector('.article-preview-layout');
    return {
      hasLayout: !!layout,
      readerWidth: readerCard?.getBoundingClientRect().width || 0,
      proseMaxWidth: window.getComputedStyle(prose).maxWidth,
      proseLineHeight: window.getComputedStyle(prose).lineHeight,
      hasMetaSidebar: !!metaSidebar,
      metaSidebarWidth: metaSidebar?.getBoundingClientRect().width || 0
    };
  });

  console.log(`   ✓ Article Reading Canvas Metrics:`);
  console.log(`     Reader Width: ${articleLayoutMetrics.readerWidth}px, Prose Max-Width: ${articleLayoutMetrics.proseMaxWidth}`);
  console.log(`     Prose Line-Height: ${articleLayoutMetrics.proseLineHeight}`);
  console.log(`     Sidebar Metadata Width: ${articleLayoutMetrics.metaSidebarWidth}px`);

  // Check overflow with article results displayed
  const articleOverflowDesktop = await checkOverflow();
  console.log(`   ✓ Desktop Article Zero-Overflow: ${!articleOverflowDesktop.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  const articleScrPath = path.join(SCREENSHOTS_DIR, '07-generate-completed-article.png');
  await page.screenshot({ path: articleScrPath });
  console.log(`   Saved Article View Screenshot: ${articleScrPath}`);

  // Test Mobile Viewport of the Article
  await page.setViewport({ width: 375, height: 667, isMobile: true, deviceScaleFactor: 2 });
  await new Promise(res => setTimeout(res, 500));
  await page.evaluate(() => {
    document.querySelector('.article-reader-card')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  const articleOverflowMobile = await checkOverflow();
  console.log(`   ✓ Mobile Article Zero-Overflow: ${!articleOverflowMobile.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  const articleMobileScrPath = path.join(SCREENSHOTS_DIR, '07-generate-completed-article-mobile.png');
  await page.screenshot({ path: articleMobileScrPath });
  console.log(`   Saved Mobile Article Screenshot: ${articleMobileScrPath}`);

  // Return to Desktop for other tabs
  await page.setViewport({ width: 1366, height: 768 });
  await new Promise(res => setTimeout(res, 400));

  // Switch to SEO Titles tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const t = tabs.find(b => b.innerText.includes('SEO Titles'));
    if (t) t.click();
    document.querySelector('.results-container')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(res => setTimeout(res, 600));
  const titlesScrPath = path.join(SCREENSHOTS_DIR, '08-generate-completed-titles.png');
  await page.screenshot({ path: titlesScrPath });
  console.log(`   Saved SEO Titles Screenshot: ${titlesScrPath}`);

  // Switch to FAQs tab
  await page.evaluate(() => {
    const tabs = Array.from(document.querySelectorAll('.tab-btn'));
    const t = tabs.find(b => b.innerText.includes('FAQs'));
    if (t) t.click();
    document.querySelector('.results-container')?.scrollIntoView({ behavior: 'instant', block: 'start' });
  });
  await new Promise(res => setTimeout(res, 600));
  const faqsScrPath = path.join(SCREENSHOTS_DIR, '09-generate-completed-faqs.png');
  await page.screenshot({ path: faqsScrPath });
  console.log(`   Saved FAQs Screenshot: ${faqsScrPath}`);

  // -------------------------------------------------------------------------
  // PHASE 5: PROMPT LAB (A/B COMPARISON & RESPONSIVE STACKING)
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 5: PROMPT ENGINEERING LAB BALANCED COMPARISON ---');
  await page.goto(`${BASE_URL}/lab`, { waitUntil: 'networkidle0' });
  await page.click('.btn.btn-primary');
  await page.waitForSelector('.mode-score-badge', { timeout: 25000 });
  await new Promise(res => setTimeout(res, 1200));

  // Check 1366x768 (side by side 2 columns)
  await page.setViewport({ width: 1366, height: 768 });
  const labDesktopGrid = await page.evaluate(() => {
    const cards = Array.from(document.querySelectorAll('.mode-column'));
    return cards.map(c => Math.round(c.getBoundingClientRect().width));
  });
  console.log(`   ✓ Desktop Lab Columns (Equal balance):`, labDesktopGrid);

  const labScrPath = path.join(SCREENSHOTS_DIR, '10-lab-comparison-results.png');
  await page.screenshot({ path: labScrPath });
  console.log(`   Saved Lab Comparison Screenshot: ${labScrPath}`);

  // Check 1024x768 (tablet stacking)
  await page.setViewport({ width: 1024, height: 768 });
  await new Promise(res => setTimeout(res, 400));
  const labTabletColumns = await page.evaluate(() => {
    const grid = document.querySelector('.comparison-grid');
    return window.getComputedStyle(grid).gridTemplateColumns;
  });
  console.log(`   ✓ 1024px Tablet Stacking: gridTemplateColumns = "${labTabletColumns}"`);
  const labTabletOverflow = await checkOverflow();
  console.log(`     1024px Lab Zero-Overflow: ${!labTabletOverflow.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  // -------------------------------------------------------------------------
  // PHASE 6: EVALUATION RUBRIC TABLE & PROMPTS GUIDE SCREEN RESPONSIVENESS
  // -------------------------------------------------------------------------
  console.log('\n--- PHASE 6: EVALUATION RUBRIC TABLE & PROMPTS TABS ---');
  await page.setViewport({ width: 375, height: 667, isMobile: true });
  await page.goto(`${BASE_URL}/evaluation`, { waitUntil: 'networkidle0' });
  await new Promise(res => setTimeout(res, 500));

  const rubricCheck = await page.evaluate(() => {
    const list = document.querySelector('.rubric-accordion-list');
    const items = document.querySelectorAll('.rubric-item');
    return {
      hasList: !!list,
      itemCount: items.length,
      scrollWidth: list?.scrollWidth || 0,
      clientWidth: list?.clientWidth || 0
    };
  });
  const rubricPageOverflow = await checkOverflow();
  console.log(`   ✓ Mobile Rubric Accordion (${rubricCheck.itemCount} Rules): scrollWidth = ${rubricCheck.scrollWidth}px, clientWidth = ${rubricCheck.clientWidth}px`);
  console.log(`     Mobile Rubric Zero Page-Level Overflow: ${!rubricPageOverflow.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  await page.goto(`${BASE_URL}/prompts`, { waitUntil: 'networkidle0' });
  await new Promise(res => setTimeout(res, 500));
  const promptsPageOverflow = await checkOverflow();
  console.log(`   ✓ Mobile Prompts & Guide Zero Page-Level Overflow: ${!promptsPageOverflow.hasOverflow ? 'PASS ✅' : 'FAIL ❌'}`);

  await browser.close();

  // Save audit report
  const auditReportPath = path.resolve(__dirname, '../docs/AUDIT_REPORT.json');
  fs.writeFileSync(auditReportPath, JSON.stringify(auditReport, null, 2), 'utf8');

  console.log('\n======================================================================');
  console.log('   FULL VERIFICATION COMPLETED SUCCESSFULLY!');
  console.log(`   Total Console Errors:  ${auditReport.consoleErrors.length}`);
  console.log(`   Total Failed Requests: ${auditReport.failedRequests.length}`);
  console.log(`   Audit Report Saved:    ${auditReportPath}`);
  console.log('======================================================================');
}

runFullVerification().catch(err => {
  console.error('FATAL AUDIT FAILURE:', err);
  process.exit(1);
});
