const { test, expect } = require('@playwright/test');

test.describe('Public Website & Navigation Tests', () => {
  test('Homepage loads with all required navbar buttons and sliding insurance strip', async ({ page }) => {
    await page.goto('/');

    // Verify Title / Branding
    await expect(page).toHaveTitle(/Sreemantha Hospital/i);

    // Verify all specified navbar buttons
    const nav = page.locator('nav');
    await expect(page.getByRole('link', { name: /^Home$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^About us$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Facilities$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Specialties$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Treatments$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Doctors$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Gallery$/i }).first()).toBeVisible();
    await expect(page.getByRole('link', { name: /^Insights$/i }).first()).toBeVisible();

    // Verify Book Appointment CTA button
    await expect(page.getByRole('link', { name: /Book Appointment/i }).first()).toBeVisible();

    // Verify Staff Login button
    await expect(page.getByRole('link', { name: /Staff Login/i }).first()).toBeVisible();

    // Verify Sliding Insurance Strip section
    const insuranceSection = page.locator('text=Accepted Insurance & TPA Partners');
    await expect(insuranceSection).toBeVisible();

    // Check that insurance partner badges are rendered
    await expect(page.locator('img[src*="star-health.webp"]').first()).toBeAttached();
    await expect(page.locator('img[src*="icici-lombard.webp"]').first()).toBeAttached();

    // Verify Floating Contact Buttons (Phone and WhatsApp)
    const phoneBtn = page.locator('a[href^="tel:"]').first();
    const whatsappBtn = page.locator('a[href*="wa.me"]').first();
    await expect(phoneBtn).toBeVisible();
    await expect(whatsappBtn).toBeVisible();
  });

  test('Navbar links navigate to respective collection listing pages', async ({ page }) => {
    await page.goto('/');

    // Navigate to Facilities
    await page.getByRole('link', { name: /^Facilities$/i }).first().click();
    await expect(page).toHaveURL(/\/facilities/);
    await expect(page.locator('h1')).toContainText(/Facilities/i);

    // Navigate to Specialties
    await page.getByRole('link', { name: /^Specialties$/i }).first().click();
    await expect(page).toHaveURL(/\/specialties/);
    await expect(page.locator('h1')).toContainText(/Specialties/i);

    // Navigate to Treatments
    await page.getByRole('link', { name: /^Treatments$/i }).first().click();
    await expect(page).toHaveURL(/\/treatments/);
    await expect(page.locator('h1')).toContainText(/Treatments/i);

    // Navigate to Doctors
    await page.getByRole('link', { name: /^Doctors$/i }).first().click();
    await expect(page).toHaveURL(/\/doctors/);
    await expect(page.locator('h1')).toContainText(/Doctors/i);

    // Navigate to Gallery
    await page.getByRole('link', { name: /^Gallery$/i }).first().click();
    await expect(page).toHaveURL(/\/gallery/);
    await expect(page.locator('h1')).toContainText(/Gallery/i);

    // Navigate to Insights
    await page.getByRole('link', { name: /^Insights$/i }).first().click();
    await expect(page).toHaveURL(/\/insights/);
    await expect(page.locator('h1')).toContainText(/Insights/i);
  });
});
