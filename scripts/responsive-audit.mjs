// Checagem do site no PC, tablet e celular: layout, fotos, galerias, menu e eventos de conversão.
// Uso: AUDIT_BASE_URL=https://sa-engenharia.vercel.app node scripts/responsive-audit.mjs
import { mkdir } from 'node:fs/promises'
import { chromium } from 'playwright-core'

const executablePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe'
const baseURL = process.env.AUDIT_BASE_URL ?? 'http://127.0.0.1:4174'
const outputDir = new URL('../audit-output/', import.meta.url)
const out = (name) => new URL(name, outputDir).pathname.slice(1)

await mkdir(outputDir, { recursive: true })

const browser = await chromium.launch({ executablePath, headless: true })
const results = []

for (const device of [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'tablet', width: 768, height: 900 },
  { name: 'mobile', width: 360, height: 800 },
]) {
  const page = await browser.newPage({ viewport: { width: device.width, height: device.height }, deviceScaleFactor: 1 })
  const consoleErrors = []
  const missingResources = []
  page.on('console', (message) => {
    if (message.type() === 'error') consoleErrors.push(message.text())
  })
  page.on('pageerror', (error) => consoleErrors.push(error.message))
  page.on('response', (response) => {
    if (response.status() === 404) missingResources.push(response.url())
  })
  // Nunca abre o WhatsApp de verdade durante o teste.
  await page.context().route(/wa\.me|whatsapp\.com/, (route) => route.abort())

  await page.goto(baseURL, { waitUntil: 'networkidle' })
  await page.evaluate(() => document.fonts.ready)
  const pageHeight = await page.evaluate(() => document.documentElement.scrollHeight)
  for (let position = 0; position < pageHeight; position += Math.max(400, Math.floor(device.height * 0.7))) {
    await page.evaluate((top) => window.scrollTo({ top, behavior: 'instant' }), position)
    await page.waitForTimeout(70)
  }
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.waitForTimeout(300)
  await page.screenshot({ path: out(`${device.name}.png`), fullPage: true })
  await page.locator('.hero').screenshot({ path: out(`${device.name}-hero.png`) })
  for (const section of ['services', 'management', 'portfolio', 'projects', 'contact']) {
    await page.locator(`.${section}`).screenshot({ path: out(`${device.name}-${section}.png`) })
  }

  const baseChecks = await page.evaluate(() => {
    const actions = [...document.querySelectorAll('a.btn, button, a.option')]
    return {
      title: document.title,
      h1Count: document.querySelectorAll('h1').length,
      horizontalOverflow: document.documentElement.scrollWidth - window.innerWidth,
      fontsLoaded: document.fonts.check('800 16px Archivo') && document.fonts.check('500 16px "JetBrains Mono"'),
      whatsappLinks: document.querySelectorAll('a[href^="https://wa.me/"]').length,
      smallestVisibleAction: Math.min(...actions
        .filter((element) => {
          const rect = element.getBoundingClientRect()
          return getComputedStyle(element).display !== 'none' && rect.width > 0 && rect.height > 0
        })
        .map((element) => Math.round(element.getBoundingClientRect().height))),
    }
  })

  const portfolioItems = page.locator('.bento__item')
  const portfolioCount = await portfolioItems.count()
  const portfolioImagesLoaded = await portfolioItems.locator('img').evaluateAll((images) => images.every((image) => image.complete && image.naturalWidth > 0))
  await portfolioItems.first().click()
  const portfolioLightboxOpened = await page.locator('.lightbox').isVisible()
  await page.getByRole('button', { name: 'Fechar foto' }).click()
  const portfolioLightboxClosed = await page.locator('.lightbox').count() === 0
  await page.getByRole('button', { name: 'Obras e vistorias' }).click()
  const filteredCount = await portfolioItems.count()
  await page.getByRole('button', { name: 'Todas' }).click()
  const portfolio = { portfolioCount, filteredCount, portfolioImagesLoaded, portfolioLightboxOpened, portfolioLightboxClosed }

  const shots = page.locator('.shot')
  const autocadCount = await shots.count()
  await page.getByRole('tab', { name: 'Visualização 3D' }).click()
  const threeDCount = await shots.count()
  for (const image of await shots.locator('img').all()) await image.scrollIntoViewIfNeeded()
  const shotImagesLoaded = await page.waitForFunction(
    () => [...document.querySelectorAll('.shot img')].every((image) => image.complete && image.naturalWidth > 0),
    null,
    { timeout: 8000 },
  ).then(() => true, () => false)
  await shots.first().click()
  const projectLightboxOpened = await page.locator('.lightbox').isVisible()
  await page.getByRole('button', { name: 'Fechar foto' }).click()
  const projects = { autocadCount, threeDCount, shotImagesLoaded, projectLightboxOpened, projectLightboxClosed: await page.locator('.lightbox').count() === 0 }

  await page.getByRole('tab', { name: 'Gerenciamento de obra' }).click()
  const howSwitched = (await page.locator('.timeline li h3').first().textContent()) === 'Conversa sobre a obra'

  let mobileMenu = null
  if (device.width <= 1180) {
    await page.getByRole('button', { name: 'Abrir menu' }).click()
    await page.waitForTimeout(300)
    mobileMenu = await page.locator('#menu-principal').evaluate((menu) => ({
      visible: getComputedStyle(menu).visibility === 'visible' && getComputedStyle(menu).opacity === '1',
      expanded: document.querySelector('.header__toggle')?.getAttribute('aria-expanded'),
    }))
    await page.locator('#menu-principal a[href="#vistorias"]').click()
    await page.waitForTimeout(350)
    mobileMenu.afterNavigationHash = await page.evaluate(() => location.hash)
    mobileMenu.bodyLockedAfterNavigation = await page.evaluate(() => document.body.classList.contains('is-locked'))
  }

  // Conversões: cada clique de WhatsApp deve gerar um único whatsapp_open.
  await page.evaluate(() => window.scrollTo({ top: 0, behavior: 'instant' }))
  await page.locator('.hero__cta').click()
  await page.locator('.whatsapp-float').click()
  await page.locator('.option').first().click()
  const analytics = await page.evaluate(() => ({
    gtmLoaded: Boolean(window.google_tag_manager?.['GTM-WNMVBDVM']),
    events: (window.dataLayer ?? [])
      .filter((entry) => entry.event === 'cta_click' || entry.event === 'whatsapp_open')
      .map((entry) => `${entry.event}:${entry.location}`),
  }))

  results.push({ device, ...baseChecks, portfolio, projects, howSwitched, mobileMenu, analytics, missingResources, consoleErrors })
  await page.close()
}

await browser.close()
console.log(JSON.stringify(results, null, 2))
