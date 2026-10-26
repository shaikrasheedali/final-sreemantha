const { test, expect } = require('@playwright/test');

test.describe('Staff Authentication & Admin CMS Workflows', () => {
  test('Staff Login with Argon2 and navigation to CMS Dashboard', async ({ page }) => {
    await page.goto('/staff-login');

    await expect(page.locator('h2')).toContainText(/Hospital Staff Sign In/i);

    // Sign in with the administrator credentials
    await page.locator('#staff-username').fill('admin');
    await page.locator('#staff-password').fill('Admin@2026');

    // Submit login
    await page.getByRole('button', { name: /Sign In to Portal/i }).click();

    // Verify successful redirection to /admin
    await expect(page).toHaveURL(/\/admin/);
    await expect(page.locator('h1')).toContainText(/Welcome back/i);

    // Verify stats cards
    await expect(page.locator('text=Hospital Platform Overview')).toBeVisible();
    await expect(page.locator('text=Facilities').first()).toBeVisible();
    await expect(page.locator('text=Treatments').first()).toBeVisible();
    await expect(page.locator('text=Doctors').first()).toBeVisible();
  });

  test('CMS Collection Manager loads MS Word-like WYSIWYG editor for Treatments', async ({ page }) => {
    // Login as Admin
    await page.goto('/staff-login');
    await page.locator('#staff-username').fill('admin');
    await page.locator('#staff-password').fill('Admin@2026');
    await page.getByRole('button', { name: /Sign In to Portal/i }).click();
    await expect(page).toHaveURL(/\/admin/);

    // Navigate to Treatments CMS
    await page.goto('/admin/treatments');
    await expect(page.locator('h1')).toContainText(/Treatments/i);

    // Click Add New Treatment
    await page.getByRole('button', { name: /Add New Treatment/i }).click();

    // Verify WYSIWYG editor toolbar is present with MS Word features
    const wysiwyg = page.locator('.wysiwyg-editor').first();
    await expect(wysiwyg).toBeVisible();

    // Verify toolbar options
    await expect(wysiwyg.locator('button[title*="Bold"]')).toBeVisible();
    await expect(wysiwyg.locator('button[title*="Italic"]')).toBeVisible();
    await expect(wysiwyg.locator('button[title*="Underline"]')).toBeVisible();
    await expect(wysiwyg.locator('button[title*="Align Left"]')).toBeVisible();
    await expect(wysiwyg.locator('button[title*="Justify"]')).toBeVisible();
    await expect(wysiwyg.locator('select').first()).toBeVisible(); // Font family or size select
  });

  test('Admin Gallery management supports media upload and YouTube/Instagram/Facebook embeds', async ({ page }) => {
    // Login as Admin
    await page.goto('/staff-login');
    await page.locator('#staff-username').fill('admin');
    await page.locator('#staff-password').fill('Admin@2026');
    await page.getByRole('button', { name: /Sign In to Portal/i }).click();
    await expect(page).toHaveURL(/\/admin/);

    // Navigate to Gallery CMS
    await page.goto('/admin/gallery');
    await expect(page.locator('h1')).toContainText(/Gallery Management/i);

    // Click Add Gallery Media
    await page.getByRole('button', { name: /Add Gallery Media/i }).click();

    // Verify media source buttons
    await expect(page.getByRole('button', { name: /^Image$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Video$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^YouTube$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Instagram$/i })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Facebook$/i })).toBeVisible();
  });
});
