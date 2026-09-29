const { test, expect } = require('@playwright/test');

test.describe('Patient Interactions & Appointment Booking', () => {
  test('Patient can submit appointment enquiry and see confirmation screen', async ({ page }) => {
    await page.goto('/book-appointment');

    await expect(page.locator('h1')).toContainText(/Schedule an OPD Consultation/i);

    // Fill form
    await page.fill('input[placeholder*="Ramesh Kumar"]', 'Playwright Test Patient');
    await page.fill('input[placeholder*="9876543210"]', '9876543210');
    await page.fill('input[placeholder*="name@example.com"]', 'patient@example.com');
    await page.fill('textarea[placeholder*="symptoms"]', 'Automated E2E booking test inquiry.');

    // Check consent checkbox
    await page.locator('#consent').check();

    // Submit
    await page.getByRole('button', { name: /Confirm Appointment Request/i }).click();

    // Verify confirmation message
    await expect(page.locator('text=Request Received')).toBeVisible();
    await expect(page.locator('text=Thank You, Playwright Test Patient!')).toBeVisible();
  });
});
