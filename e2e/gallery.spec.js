const { test, expect } = require('@playwright/test');

test.describe('Gallery & Interactive Modal Tests', () => {
  test('Clicking a gallery item opens the interactive modal lightbox', async ({ page }) => {
    await page.goto('/gallery');

    // Wait for gallery items to render
    const firstItem = page.locator('[data-testid="gallery-card"]').first();
    await expect(firstItem).toBeVisible();

    // Click on the item
    await firstItem.click();

    // Modal should be visible
    const modal = page.locator('div[role="dialog"]');
    await expect(modal).toBeVisible();

    // Verify modal has content (image or video/iframe)
    const mediaContainer = modal.locator('img, video, iframe').first();
    await expect(mediaContainer).toBeVisible();

    // Close the modal using close button
    const closeBtn = modal.locator('button[title="Close (Esc)"]');
    await closeBtn.click();

    // Modal should be dismissed
    await expect(modal).not.toBeVisible();
  });

  test('Gallery filtering by media type works', async ({ page }) => {
    await page.goto('/gallery');

    // Filter by Photos
    await page.getByRole('button', { name: /Photos/i }).click();
    await expect(page.locator('[data-testid="gallery-card"]').first()).toBeVisible();

    // Filter by Videos
    await page.getByRole('button', { name: /Videos/i }).click();
    // Verify video cards or empty state handled gracefully
    await expect(page.locator('body')).not.toHaveText(/Internal Server Error/i);

    // Filter by Social / Embeds
    await page.getByRole('button', { name: /Social \/ Embeds/i }).click();
    await expect(page.locator('body')).not.toHaveText(/Internal Server Error/i);
  });
});
