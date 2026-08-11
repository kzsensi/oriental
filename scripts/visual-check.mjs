import { chromium } from 'playwright-core';

const browser = await chromium.launch({
  executablePath: 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe',
  headless: true,
});

const cases = [
  { name: 'home-wide', url: 'http://127.0.0.1:5174/', width: 2304, height: 1113 },
  { name: 'home-desktop', url: 'http://127.0.0.1:5174/', width: 1536, height: 742 },
  { name: 'home-mobile', url: 'http://127.0.0.1:5174/', width: 390, height: 844 },
  { name: 'about-desktop', url: 'http://127.0.0.1:5174/about-us', width: 1440, height: 900 },
  { name: 'principal-mobile', url: 'http://127.0.0.1:5174/principal', width: 390, height: 844 },
];

const results = [];

async function scrollThroughPage(page) {
  const { height, viewportHeight } = await page.evaluate(() => ({
    height: document.documentElement.scrollHeight,
    viewportHeight: window.innerHeight,
  }));

  for (let y = 0; y <= height; y += Math.max(360, Math.floor(viewportHeight * 0.72))) {
    await page.evaluate((nextY) => window.scrollTo({ top: nextY, behavior: 'instant' }), y);
    await page.waitForTimeout(80);
  }

  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }));
  await page.waitForTimeout(300);
}

for (const item of cases) {
  const page = await browser.newPage({ viewport: { width: item.width, height: item.height } });
  const errors = [];
  const failedResources = [];
  page.on('console', (message) => {
    if (message.type() === 'error') errors.push(message.text());
  });
  page.on('pageerror', (error) => errors.push(error.message));
  page.on('response', (response) => {
    if (response.status() >= 400) failedResources.push({ status: response.status(), url: response.url() });
  });
  await page.addInitScript(() => sessionStorage.setItem('oriental-popup-dismissed', 'true'));
  await page.goto(item.url, { waitUntil: 'networkidle' });
  await scrollThroughPage(page);
  await page.screenshot({ path: `visual-${item.name}.png`, fullPage: true });

  const metrics = await page.evaluate(() => ({
    title: document.title,
    bodyWidth: document.body.scrollWidth,
    viewportWidth: document.documentElement.clientWidth,
    height: document.body.scrollHeight,
    brokenImages: [...document.images]
      .filter((image) => !image.complete || image.naturalWidth === 0)
      .map((image) => image.src),
    textOverflow: [...document.querySelectorAll('h1,h2,h3,a,button,label')]
      .filter((element) => element.scrollWidth > element.clientWidth + 2)
      .slice(0, 10)
      .map((element) => ({
        tag: element.tagName,
        text: element.textContent.trim().slice(0, 80),
        scroll: element.scrollWidth,
        client: element.clientWidth,
      })),
    hiddenReveals: [...document.querySelectorAll('[data-reveal]')]
      .filter((element) => Number.parseFloat(getComputedStyle(element).opacity) < 0.95)
      .map((element) => element.className)
      .slice(0, 10),
    contentCoverage: {
      removedHomeIntro: document.querySelectorAll('.home-intro').length === 0,
      removedCalendarPanel: document.querySelectorAll('.events-panel').length === 0,
      noticeCards: document.querySelectorAll('.notice-list-card').length,
      educationServices: document.body.innerText.includes('Education Services'),
      scholarships: document.body.innerText.includes('Scholarships'),
      metricIntermediate: document.body.innerText.includes('Metric And Intermediate'),
      cbseBoard: document.body.innerText.includes('CBSE Board'),
      admissionFormFields: document.querySelectorAll('.admission-enquiry-form input, .admission-enquiry-form textarea').length,
    },
    requestedDesignChanges: {
      navy: getComputedStyle(document.documentElement).getPropertyValue('--navy').trim(),
      navyDark: getComputedStyle(document.documentElement).getPropertyValue('--navy-dark').trim(),
      principalHeight: document.querySelector('.principal-preview')?.getBoundingClientRect().height || 0,
      principalBackground: document.querySelector('.principal-preview') ? getComputedStyle(document.querySelector('.principal-preview')).backgroundColor : '',
      admissionBackground: document.querySelector('.admission-band') ? getComputedStyle(document.querySelector('.admission-band')).backgroundColor : '',
      highlightDuration: document.querySelector('.highlight-progress') ? getComputedStyle(document.querySelector('.highlight-progress')).animationDuration : '',
      noticeSectionHeight: document.querySelector('.notice-wall-section')?.getBoundingClientRect().height || 0,
    },
  }));

  results.push({ name: item.name, errors, failedResources, metrics });
  await page.close();
}

const interactionPage = await browser.newPage({ viewport: { width: 2304, height: 1113 } });
await interactionPage.addInitScript(() => sessionStorage.setItem('oriental-popup-dismissed', 'true'));
await interactionPage.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
await interactionPage.locator('#notices').scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(900);
await interactionPage.locator('.notice-list-card').nth(2).click();
await interactionPage.waitForTimeout(250);
const selectedNotice = await interactionPage.locator('.notice-feature h3').textContent();
await interactionPage.screenshot({ path: 'visual-notice-wide.png' });

await interactionPage.locator('.profile-story').scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(700);
await interactionPage.mouse.wheel(0, 1600);
await interactionPage.waitForTimeout(900);
const profileTransform = await interactionPage.locator('.profile-story-track').evaluate((element) => getComputedStyle(element).transform);
await interactionPage.screenshot({ path: 'visual-profile-scroll.png' });
await interactionPage.locator('.principal-preview').scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(700);
await interactionPage.screenshot({ path: 'visual-principal-preview.png' });
await interactionPage.locator('.admission-band').scrollIntoViewIfNeeded();
await interactionPage.waitForTimeout(700);
await interactionPage.screenshot({ path: 'visual-admission-band.png' });
results.push({ name: 'interactions', selectedNotice, profileTransform });
await interactionPage.close();

const noticeScenarios = [
  { name: 'empty', notices: [], expectedCards: 0 },
  {
    name: 'single',
    notices: [{ id: 'single', date: '2026-08-11', title: 'One Published Notice', body: 'A single notice should keep the board composed and readable.', archived: false }],
    expectedCards: 1,
  },
  {
    name: 'single-mobile',
    notices: [{ id: 'single-mobile', date: '2026-08-11', title: 'One Mobile Notice', body: 'The single-notice composition should also remain clear on a narrow screen.', archived: false }],
    expectedCards: 1,
    viewport: { width: 390, height: 844 },
  },
  {
    name: 'many',
    notices: Array.from({ length: 9 }, (_, index) => ({
      id: `notice-${index + 1}`,
      date: `2026-08-${String(index + 1).padStart(2, '0')}`,
      title: `Notice ${index + 1}`,
      body: `Modular notice body ${index + 1}.`,
      archived: index < 4,
    })),
    expectedCards: 4,
  },
  {
    name: 'many-mobile',
    notices: Array.from({ length: 9 }, (_, index) => ({
      id: `mobile-notice-${index + 1}`,
      date: `2026-08-${String(index + 1).padStart(2, '0')}`,
      title: `Mobile Notice ${index + 1}`,
      body: `Mobile modular notice body ${index + 1}.`,
      archived: index < 4,
    })),
    expectedCards: 4,
    viewport: { width: 390, height: 844 },
  },
];

for (const scenario of noticeScenarios) {
  const page = await browser.newPage({ viewport: scenario.viewport || { width: 1536, height: 900 } });
  const scenarioErrors = [];
  page.on('console', (message) => {
    if (message.type() === 'error') scenarioErrors.push(message.text());
  });
  page.on('pageerror', (error) => scenarioErrors.push(error.message));
  await page.addInitScript((notices) => {
    sessionStorage.setItem('oriental-popup-dismissed', 'true');
    window.__ORIENTAL_TEST_STATE__ = { content: { notices } };
  }, scenario.notices);
  await page.goto('http://127.0.0.1:5174/', { waitUntil: 'networkidle' });
  await page.locator('#notices').evaluate((element) => window.scrollTo(0, element.offsetTop - 30));
  await page.waitForTimeout(700);

  const scenarioMetrics = {
    cards: await page.locator('.notice-list-card').count(),
    emptyState: await page.locator('.notice-empty-state').count(),
    pagination: await page.locator('.notice-pagination').count(),
    errors: scenarioErrors,
  };

  if (scenario.name.startsWith('many')) {
    await page.locator('.notice-pagination button').last().click();
    await page.waitForTimeout(450);
    scenarioMetrics.secondPageFirstTitle = await page.locator('.notice-list-copy > strong').first().textContent();
    scenarioMetrics.cardsAfterPaging = await page.locator('.notice-list-card').count();
  }

  await page.screenshot({ path: `visual-notice-${scenario.name}.png` });
  results.push({
    name: `notice-${scenario.name}`,
    expectedCards: scenario.expectedCards,
    metrics: scenarioMetrics,
  });
  await page.close();
}

const adminPage = await browser.newPage({ viewport: { width: 1440, height: 1000 } });
const adminErrors = [];
adminPage.on('console', (message) => {
  if (message.type() === 'error') adminErrors.push(message.text());
});
adminPage.on('pageerror', (error) => adminErrors.push(error.message));
await adminPage.addInitScript(() => {
  window.__ORIENTAL_TEST_STATE__ = { admin: true, content: { notices: [] } };
});
await adminPage.goto('http://127.0.0.1:5174/admin', { waitUntil: 'networkidle' });
await adminPage.screenshot({ path: 'visual-admin-dashboard.png', fullPage: true });
await adminPage.locator('aside nav button').filter({ hasText: 'Notice board' }).click();
await adminPage.getByRole('button', { name: 'Create notice' }).click();
const noticeRow = adminPage.locator('.cms-collection-row').last();
await noticeRow.locator('input').nth(0).fill('Admin Created Notice');
await noticeRow.locator('input[type="date"]').fill('2026-08-12');
await noticeRow.locator('textarea').fill('Created through the modular Supabase editor.');
const adminDraftCount = await adminPage.locator('.cms-collection-row').count();
await adminPage.locator('.cms-publish').click();
const publicCountAfterSave = await adminPage.evaluate(() => window.__ORIENTAL_TEST_STATE__.content.notices.length);
await adminPage.screenshot({ path: 'visual-admin-notices.png', fullPage: true });
await adminPage.locator('.cms-collection-row .cms-row-actions .danger').last().click();
await adminPage.locator('.cms-publish').click();
const emptyAfterDelete = await adminPage.evaluate(() => window.__ORIENTAL_TEST_STATE__.content.notices.length === 0);
const localContentStored = await adminPage.evaluate(() => Object.keys(localStorage).some((key) => key.includes('orientalPublicSchool.siteContent')));

const webpMetrics = await adminPage.evaluate(async () => {
  const canvas = document.createElement('canvas');
  canvas.width = 320;
  canvas.height = 160;
  const context = canvas.getContext('2d');
  context.fillStyle = '#0b427e';
  context.fillRect(0, 0, canvas.width, canvas.height);
  const sourceBlob = await new Promise((resolve) => canvas.toBlob(resolve, 'image/png'));
  const sourceFile = new File([sourceBlob], 'test-upload.png', { type: 'image/png' });
  const { prepareWebp } = await import('/src/lib/imageUpload.js');
  const result = await prepareWebp(sourceFile, { maxWidth: 120, maxHeight: 120, quality: 0.8 });
  return { type: result.file.type, width: result.width, height: result.height, originalBytes: result.originalBytes, outputBytes: result.outputBytes };
});

results.push({ name: 'admin-notice-crud', adminDraftCount, publicCountAfterSave, emptyAfterDelete, localContentStored, webpMetrics, errors: adminErrors });
await adminPage.close();

const adminMobilePage = await browser.newPage({ viewport: { width: 390, height: 844 } });
const adminMobileErrors = [];
adminMobilePage.on('console', (message) => {
  if (message.type() === 'error') adminMobileErrors.push(message.text());
});
adminMobilePage.on('pageerror', (error) => adminMobileErrors.push(error.message));
await adminMobilePage.addInitScript(() => {
  window.__ORIENTAL_TEST_STATE__ = { admin: true, content: {} };
});
await adminMobilePage.goto('http://127.0.0.1:5174/admin', { waitUntil: 'networkidle' });
await adminMobilePage.locator('.cms-menu-button').click();
await adminMobilePage.waitForTimeout(300);
await adminMobilePage.screenshot({ path: 'visual-admin-mobile-menu.png' });
await adminMobilePage.locator('aside nav button').filter({ hasText: 'School toppers' }).click();
await adminMobilePage.waitForTimeout(250);
const adminMobileMetrics = await adminMobilePage.evaluate(() => ({
  bodyWidth: document.body.scrollWidth,
  viewportWidth: document.documentElement.clientWidth,
  rowCount: document.querySelectorAll('.cms-collection-row').length,
  overflowingControls: [...document.querySelectorAll('input:not([type="file"]),textarea,button,label')].filter((element) => element.scrollWidth > element.clientWidth + 2).length,
}));
await adminMobilePage.screenshot({ path: 'visual-admin-mobile-results.png', fullPage: true });
results.push({ name: 'admin-mobile', metrics: adminMobileMetrics, errors: adminMobileErrors });
await adminMobilePage.close();

await browser.close();
console.log(JSON.stringify(results, null, 2));
