const { test, expect } = require('@playwright/test');

async function loginAsAdmin(page) {
  await page.goto('/staff-login');
  await page.locator('#staff-username').fill('admin');
  await page.locator('#staff-password').fill('Admin@2026');
  await page.getByRole('button', { name: /Sign In to Portal/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe('Lazy route deep links', () => {
  test('every public page loads directly with its own chunk', async ({ page }) => {
    const pageErrors = [];
    page.on('pageerror', (error) => pageErrors.push(error.message));

    const routes = [
      '/about',
      '/facilities',
      '/specialties',
      '/treatments',
      '/doctors',
      '/gallery',
      '/insights',
      '/book-appointment',
      '/contact',
      '/privacy-policy',
      '/terms-of-service',
      '/patient-rights',
    ];

    for (const route of routes) {
      const response = await page.goto(route, { waitUntil: 'domcontentloaded' });
      expect(response && response.status()).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
    }

    expect(pageErrors).toEqual([]);
  });

  test('collection detail pages load directly from their URLs', async ({ page, request }) => {
    const endpoints = [
      ['treatments', 'treatments'],
      ['doctors', 'doctors'],
      ['facilities', 'facilities'],
      ['specialties', 'specialties'],
      ['insights', 'insights'],
    ];

    for (const [route, responseKey] of endpoints) {
      const response = await request.get(`/api/${route}`);
      expect(response.ok()).toBeTruthy();
      const payload = await response.json();
      const item = payload[responseKey][0];
      expect(item && item.slug).toBeTruthy();

      const pageResponse = await page.goto(`/${route}/${item.slug}`, {
        waitUntil: 'domcontentloaded',
      });
      expect(pageResponse && pageResponse.status()).toBe(200);
      await expect(page.locator('main h1').first()).toBeVisible();
      await expect(page.locator('main h1').first()).not.toBeEmpty();
    }
  });

  test('staff login and authenticated admin deep links load without the index route', async ({
    page,
  }) => {
    const staffLoginResponse = await page.goto('/staff-login', {
      waitUntil: 'domcontentloaded',
    });
    expect(staffLoginResponse && staffLoginResponse.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: /Hospital Staff Sign In/i })
    ).toBeVisible();

    await loginAsAdmin(page);
    const adminResponse = await page.goto('/admin/treatments', {
      waitUntil: 'domcontentloaded',
    });
    expect(adminResponse && adminResponse.status()).toBe(200);
    await expect(
      page.getByRole('heading', { name: 'Treatments & Clinical Services' })
    ).toBeVisible();

    await page.getByRole('button', { name: /Add New Treatment/i }).click();
    await expect(page.locator('.wysiwyg-editor').first()).toBeVisible();
  });
});
