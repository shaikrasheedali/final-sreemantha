const { test, expect } = require('@playwright/test');

test.describe('User Requested Features Verification', () => {
  test('1. Enterprise Logging & Error Handling Verification', async ({ request }) => {
    // Check that API responses include x-request-id header
    const healthRes = await request.get('/api/health');
    expect(healthRes.status()).toBe(200);
    const reqId = healthRes.headers()['x-request-id'];
    expect(reqId).toBeTruthy();

    // Check centralized error handler returns structured format with requestId and error message
    const errorRes = await request.get('/api/appointments/invalid-id-slug');
    expect(errorRes.status()).toBe(404);
    const errBody = await errorRes.json();
    expect(errBody.error).toBeTruthy();
    expect(errBody.requestId).toBeTruthy();
    expect(errBody.timestamp).toBeTruthy();
  });

  test('2. Admin Dashboard Logo Responsiveness on Multiple Viewports', async ({ page }) => {
    // 2.1 Desktop View (1280x800)
    await page.setViewportSize({ width: 1280, height: 800 });
    await page.goto('/staff-login');
    await page.locator('#quick-login-admin').click();
    await page.getByRole('button', { name: /Sign In to Portal/i }).click();
    await expect(page).toHaveURL(/\/admin/);

    // Locate sidebar and brand logo
    const sidebar = page.locator('aside.sidebar');
    await expect(sidebar).toBeVisible();

    const brandLogo = sidebar.locator('.brand-logo');
    await expect(brandLogo).toBeVisible();

    // Verify logo fits completely inside the sidebar width
    const sidebarBox = await sidebar.boundingBox();
    const logoBox = await brandLogo.boundingBox();

    expect(sidebarBox).not.toBeNull();
    expect(logoBox).not.toBeNull();

    console.log(`Desktop - Sidebar: width=${sidebarBox.width}, right=${sidebarBox.x + sidebarBox.width}`);
    console.log(`Desktop - Logo: width=${logoBox.width}, right=${logoBox.x + logoBox.width}`);

    // Logo right edge must be strictly less than or equal to sidebar right edge
    expect(logoBox.x + logoBox.width).toBeLessThanOrEqual(sidebarBox.x + sidebarBox.width);
    // Logo width should be reasonably sized (<= 220px) to prevent breaking
    expect(logoBox.width).toBeLessThanOrEqual(215);

    // 2.2 Tablet View (768x1024)
    await page.setViewportSize({ width: 768, height: 1024 });
    // Open mobile sidebar drawer if hidden
    const mobileMenuBtn = page.locator('header.admin-mobile-header button');
    if (await mobileMenuBtn.isVisible()) {
      await mobileMenuBtn.click();
    }
    await expect(brandLogo).toBeVisible();
    const tabletSidebarBox = await sidebar.boundingBox();
    const tabletLogoBox = await brandLogo.boundingBox();
    expect(tabletLogoBox.x + tabletLogoBox.width).toBeLessThanOrEqual(tabletSidebarBox.x + tabletSidebarBox.width);

    // 2.3 Mobile View (375x667)
    await page.setViewportSize({ width: 375, height: 667 });
    const mobileLogoBox = await brandLogo.boundingBox();
    const mobileSidebarBox = await sidebar.boundingBox();
    expect(mobileLogoBox.x + mobileLogoBox.width).toBeLessThanOrEqual(mobileSidebarBox.x + mobileSidebarBox.width);
  });

  test('3. Real Hospital Images, Doctors & Blogs Verification', async ({ page }) => {
    // 3.1 Homepage real hospital WebP images
    await page.goto('/');
    const heroImg = page.locator('.hero-media img');
    await expect(heroImg).toBeVisible();
    const heroSrc = await heroImg.getAttribute('src');
    expect(heroSrc).toContain('/images/hospital-exterior-banner.webp');

    // 3.2 Doctors Page Verification
    await page.goto('/doctors');
    await expect(page.locator('text=Dr. G. Sindhu')).toBeVisible();
    await expect(page.locator('text=Dr. B. V. N. Krishna')).toBeVisible();
    await expect(page.locator('text=TSMC/FMR/03919')).toBeVisible();
    await expect(page.locator('text=TSMC/FMR/07376')).toBeVisible();

    // 3.3 Insights/Blogs Page Verification with Real Hospital Posters
    await page.goto('/insights');
    await expect(page.locator('text=You Trust, We Care')).toBeVisible();
    await expect(page.locator('text=Let Wonderful Things Happen')).toBeVisible();
    await expect(page.locator('text=Beat Male Infertility')).toBeVisible();

    const blogImg = page.locator('img[src*="/images/blogs/"]').first();
    await expect(blogImg).toBeVisible();
    const blogSrc = await blogImg.getAttribute('src');
    expect(blogSrc).toContain('/images/blogs/');
    expect(blogSrc).toContain('.webp');
  });

  test('4. Accepted Insurance Partners (24 Partners with WebP Badges)', async ({ page }) => {
    await page.goto('/');
    // Scroll to insurance section
    const insuranceHeader = page.locator('text=Accepted Insurance & TPA Partners');
    await insuranceHeader.scrollIntoViewIfNeeded();
    await expect(insuranceHeader).toBeVisible();

    // Verify marquee contains partner badges attached in the DOM track
    const adityaBirlaBadge = page.locator('img[src*="aditya-birla-health.webp"]').first();
    await expect(adityaBirlaBadge).toBeAttached();

    const starHealthBadge = page.locator('img[src*="star-health.webp"]').first();
    await expect(starHealthBadge).toBeAttached();

    const sbiBadge = page.locator('img[src*="sbi-general-insurance.webp"]').first();
    await expect(sbiBadge).toBeAttached();

    const iciciBadge = page.locator('img[src*="icici-lombard.webp"]').first();
    await expect(iciciBadge).toBeAttached();
  });
});

