const { test, expect } = require('@playwright/test');

test.describe('Collection Detail Page Templates', () => {
  test('Treatment detail page renders media, overview, protocol, and consultation link', async ({ page }) => {
    await page.goto('/treatments');

    // Click on the first treatment
    const firstTreatmentLink = page.locator('a[href^="/treatments/"]').first();
    await expect(firstTreatmentLink).toBeVisible();
    await firstTreatmentLink.click();

    // Verify detail page elements
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=At a Glance')).toBeVisible();
    await expect(page.locator('text=Overview & Clinical Protocol')).toBeVisible();
    await expect(page.getByRole('link', { name: /Book Consultation/i }).first()).toBeVisible();
  });

  test('Doctor detail page renders profile, qualifications, and consultation schedule', async ({ page }) => {
    await page.goto('/doctors');

    // Click on the first doctor
    const firstDoctorLink = page.locator('a[href^="/doctors/"]').first();
    await expect(firstDoctorLink).toBeVisible();
    await firstDoctorLink.click();

    // Verify doctor detail layout
    await expect(page.locator('h1')).toBeVisible();
    await expect(page.locator('text=Professional Overview')).toBeVisible();
    await expect(page.locator('text=Consultation Schedule')).toBeVisible();
    await expect(page.getByRole('link', { name: /Book Appointment/i }).first()).toBeVisible();
  });
});
