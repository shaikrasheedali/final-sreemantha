const { test, expect } = require('@playwright/test');

const MAP_LINK =
  'https://www.google.com/maps/place/sreemantha+hospital+khammam/data=!4m2!3m1!1s0x3a345911b67355c5:0x5209b6d9472bf0b2?sa=X&ved=1t:242&ictx=111';
const MAP_EMBED =
  'https://www.google.com/maps?q=Sreemantha%20Fertility%20Women%20And%20Chil%20Care%20Hospital,%20Khammam,%20Telangana&ll=17.249826,80.14765&z=17&output=embed';

const VIEWPORTS = [
  { name: 'iPhone SE', width: 320, height: 568 },
  { name: 'iPhone SE 2', width: 375, height: 667 },
  { name: 'iPhone 14', width: 390, height: 844 },
  { name: 'iPhone 16 Pro Max', width: 430, height: 932 },
  { name: 'iPad Mini', width: 768, height: 1024 },
  { name: 'iPad Air', width: 820, height: 1180 },
  { name: 'iPad Landscape', width: 1024, height: 768 },
  { name: 'Desktop', width: 1440, height: 900 },
];

async function loginAsAdmin(page) {
  await page.goto('/staff-login');
  await page.locator('#staff-username').fill('admin');
  await page.locator('#staff-password').fill('Admin@2026');
  await page.getByRole('button', { name: /Sign In to Portal/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe('Public experience: topbar, translations, maps, carousel and booking', () => {
  test('the staff login screen no longer offers quick-login shortcuts', async ({ page }) => {
    await page.goto('/staff-login');

    await expect(page.getByRole('heading', { name: /Hospital Staff Sign In/i })).toBeVisible();
    await expect(page.locator('[id^="quick-login-"]')).toHaveCount(0);
    await expect(page.getByText(/Quick Personnel Sign-In/i)).toHaveCount(0);
    await expect(page.getByRole('button', { name: /^Administrator$/i })).toHaveCount(0);
    await expect(page.locator('#staff-username')).toBeVisible();
    await expect(page.locator('#staff-password')).toBeVisible();
  });

  test('topbar language picker and calendar appointment trigger are reachable', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('/');

    const language = page.locator('.topbar-language select');
    await expect(language).toBeVisible();
    await expect(language.locator('option')).toHaveCount(3);
    await expect(language.locator('option')).toHaveText(['English', 'తెలుగు', 'हिन्दी']);

    const topbar = await page.locator('.topbar').boundingBox();
    const navbar = await page.locator('.navbar').boundingBox();
    expect(topbar.y + topbar.height).toBeLessThanOrEqual(navbar.y + 1);

    const phoneBox = await page.locator('.topbar-phone').boundingBox();
    const appointmentBox = await page.locator('#topbar-appointment').boundingBox();
    expect(appointmentBox.x).toBeGreaterThan(phoneBox.x);

    await page.locator('#topbar-appointment').click();
    const dialog = page.getByRole('dialog', { name: /Book a visit/i });
    await expect(dialog).toBeVisible();
    await expect(dialog.locator('input[name="name"]')).toBeVisible();
    await expect(page.locator('body')).toHaveCSS('overflow', 'hidden');

    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).toHaveCount(0);
    await expect(page.locator('#topbar-appointment')).toBeFocused();
  });

  test('drawer booking validates, animates into a success tick, and reaches the admin list', async ({
    page,
  }) => {
    test.slow();
    const bookingName = `Drawer E2E ${Date.now()}`;

    await page.setViewportSize({ width: 390, height: 844 });
    await page.goto('/');
    await page.locator('#topbar-appointment').click();

    const drawer = page.locator('.appointment-drawer');
    await expect(page.getByRole('dialog', { name: /Book a visit/i })).toBeVisible();

    await drawer.getByRole('button', { name: /Request appointment/i }).click();
    await expect(drawer.getByRole('alert')).toContainText(/patient name/i);

    await page.locator('input[name="name"]').fill(bookingName);
    await page.locator('input[name="phone"]').fill('9876501234');
    await page.locator('input[name="email"]').fill('drawer.e2e@example.com');
    await page.locator('textarea[name="message"]').fill('Drawer booking automated verification.');

    await drawer.getByRole('button', { name: /Request appointment/i }).click();
    await expect(drawer.getByRole('heading', { name: /Request received/i })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.locator('.appointment-drawer__success-mark')).toBeVisible();
    await expect(page.locator('.appointment-drawer__form')).toHaveAttribute('aria-hidden', 'true');

    await page.locator('.appointment-drawer__success-actions button', { hasText: 'Done' }).click();
    await expect(page.getByRole('dialog')).toHaveCount(0);

    await loginAsAdmin(page);
    await page.goto('/admin/appointments');
    await page.getByPlaceholder(/Search by patient name/i).fill(bookingName);
    await expect(page.getByRole('cell').filter({ hasText: bookingName })).toBeVisible({
      timeout: 15000,
    });
    await expect(page.getByText(/Drawer booking automated verification/i).first()).toBeVisible();
  });

  test('Telugu and Hindi translation persist, translate SPA routes, and stay out of staff pages', async ({
    page,
  }) => {
    test.slow();
    const language = page.locator('.topbar-language select');
    const heroHeading = page.locator('.hero h1').first();

    await page.goto('/');
    await expect(heroHeading).toContainText(/Every beginning deserves/i);

    await language.selectOption('te');
    await expect.poll(async () => heroHeading.innerText(), { timeout: 30000 }).toMatch(
      /[\u0C00-\u0C7F]/
    );
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');

    await page.goto('/contact');
    await expect.poll(async () => page.locator('main h1').first().innerText(), { timeout: 30000 }).toMatch(
      /[\u0C00-\u0C7F]/
    );

    await page.reload();
    await expect(page.locator('html')).toHaveAttribute('lang', 'te');
    await expect.poll(async () => page.locator('main h1').first().innerText(), { timeout: 30000 }).toMatch(
      /[\u0C00-\u0C7F]/
    );

    await language.selectOption('hi');
    await expect(page.locator('html')).toHaveAttribute('lang', 'hi');
    await expect.poll(async () => page.locator('main h1').first().innerText(), { timeout: 30000 }).toMatch(
      /[\u0900-\u097F]/
    );

    await language.selectOption('en');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect.poll(async () => page.locator('main h1').first().innerText(), { timeout: 30000 }).toContain(
      'We’re here to listen'
    );

    await page.goto('/staff-login');
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(page.locator('html')).toHaveClass(/notranslate/);
    await expect(page.getByRole('heading', { name: /Hospital Staff Sign In/i })).toBeVisible();

    await page.goto('/');
    await expect(page.locator('html')).not.toHaveClass(/notranslate/);
    await expect(page.locator('html')).toHaveAttribute('lang', 'en');
    await expect(heroHeading).toContainText(/Every beginning deserves/i);
  });

  test('home and contact use the exact Google Maps place link and a working embed', async ({
    page,
  }) => {
    for (const route of ['/', '/contact']) {
      await page.goto(route);
      const map = page.locator('.location-map').first();
      await expect(map).toBeVisible();
      await expect(map.locator('iframe')).toHaveAttribute('src', MAP_EMBED);
      await expect(map.locator('a[href*="google.com/maps/place"]')).toHaveAttribute(
        'href',
        MAP_LINK
      );
      await expect(map.locator('iframe')).toHaveAttribute(
        'title',
        /Sreemantha Hospital location on Google Maps/i
      );
    }
  });

  test('hero carousel rotates through all five slides', async ({ page }) => {
    test.slow();
    await page.goto('/');
    const slides = page.locator('.hero-slide');
    await expect(slides).toHaveCount(5);
    await expect(page.locator('.hero-slide.is-active')).toHaveCount(1);

    const initial = await page.locator('.hero-slide.is-active img').getAttribute('src');
    await expect
      .poll(
        async () => page.locator('.hero-slide.is-active img').getAttribute('src'),
        { timeout: 14000 }
      )
      .not.toBe(initial);
  });

  for (const viewport of VIEWPORTS) {
    test(`${viewport.name} (${viewport.width}x${viewport.height}) has no horizontal overflow and keeps actions reachable`, async ({
      page,
    }) => {
      await page.setViewportSize({ width: viewport.width, height: viewport.height });
      await page.goto('/');
      await expect(page.locator('.hero h1')).toBeVisible();

      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        viewport: window.innerWidth,
      }));
      expect(overflow.doc).toBeLessThanOrEqual(overflow.viewport + 1);
      expect(overflow.body).toBeLessThanOrEqual(overflow.viewport + 1);

      const language = page.locator('.topbar-language select');
      await expect(language).toBeVisible();
      const languageBox = await language.boundingBox();
      expect(languageBox.x).toBeGreaterThanOrEqual(0);
      expect(languageBox.x + languageBox.width).toBeLessThanOrEqual(viewport.width + 1);

      const appointment = page.locator('#topbar-appointment');
      await expect(appointment).toBeVisible();
      const appointmentBox = await appointment.boundingBox();
      expect(appointmentBox.x).toBeGreaterThanOrEqual(0);
      expect(appointmentBox.x + appointmentBox.width).toBeLessThanOrEqual(viewport.width + 1);

      const trust = await page.locator('.hero-trust').boundingBox();
      expect(trust.x).toBeGreaterThanOrEqual(0);
      expect(trust.x + trust.width).toBeLessThanOrEqual(viewport.width + 1);

      const bookLink = page.locator('.hero-ctas a', { hasText: /Book Appointment/i }).first();
      await expect(bookLink).toBeVisible();

      if (viewport.width < 1280) {
        const menuButton = page.locator('.menu-btn');
        await expect(menuButton).toBeVisible();
        await menuButton.click();
        await expect(page.locator('#mobile-navigation')).toBeVisible();
        await expect(page.locator('#mobile-navigation').getByRole('link', { name: /^Contact$/i })).toBeVisible();
        await menuButton.click();
        await expect(page.locator('#mobile-navigation')).toHaveCount(0);
      }

      if (viewport.width <= 1023) {
        await expect(page.locator('.floating-contact')).toHaveClass(/is-hero-hidden/);
        await page.locator('.insurance-strip').scrollIntoViewIfNeeded();
        await expect(page.locator('.floating-contact')).not.toHaveClass(/is-hero-hidden/);
      }
    });
  }
});
