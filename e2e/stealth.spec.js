const { test, expect } = require('@playwright/test');

const normalizeIdentity = (value) =>
  JSON.stringify(value).toLowerCase().replace(/[^a-z0-9]+/g, '');

const expectNoSuperAdminText = async (page) => {
  await expect(page.locator('body')).not.toContainText(/super\s*admin/i);
};

async function login(page, username, password) {
  await page.goto('/staff-login');
  await page.getByPlaceholder('admin or staff username').fill(username);
  await page.getByPlaceholder('Enter your security password').fill(password);
  await page.getByRole('button', { name: /Sign In to Portal/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe('Superadmin stealth', () => {
  test('the staff login screen never exposes the superadmin identity', async ({ page }) => {
    await page.goto('/staff-login');

    await expect(
      page.getByRole('heading', { name: /Hospital Staff Sign In/i })
    ).toBeVisible();
    await expectNoSuperAdminText(page);
    await expect(page.locator('#quick-login-admin')).toBeVisible();
    await expect(page.locator('[id^="quick-login-"]')).toHaveCount(1);
  });

  test('administrator API responses and screens are blind to the superadmin', async ({
    page,
  }) => {
    await login(page, 'admin', 'Admin@2026');
    await expectNoSuperAdminText(page);

    const usersResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/auth/users') &&
        response.request().method() === 'GET'
    );
    await page.goto('/admin/users');
    const usersResponse = await usersResponsePromise;
    expect(usersResponse.ok()).toBeTruthy();

    const usersPayload = await usersResponse.json();
    expect(normalizeIdentity(usersPayload)).not.toContain('superadmin');
    expect(JSON.stringify(usersPayload)).not.toContain('superadmin@sreemantha.hospital');

    await expect(page.getByRole('heading', { name: 'Users & Roles' })).toBeVisible();
    await expect(page.getByText('Hospital Administrator').first()).toBeVisible();
    await expect(page.getByText('Clinical Operations Staff').first()).toBeVisible();
    await expectNoSuperAdminText(page);

    await page.getByRole('button', { name: /Add Staff Account/i }).click();
    await expect(page.getByText(/Pre-assigned for Administrator/i)).toBeVisible();
    await expectNoSuperAdminText(page);

    const auditResponsePromise = page.waitForResponse(
      (response) =>
        response.url().includes('/api/audit-logs') &&
        response.request().method() === 'GET'
    );
    await page.goto('/admin/audit-logs');
    const auditResponse = await auditResponsePromise;
    expect(auditResponse.ok()).toBeTruthy();

    const auditPayload = await auditResponse.json();
    expect(normalizeIdentity(auditPayload)).not.toContain('superadmin');
    await expect(page.getByRole('heading', { name: 'System Audit Trail' })).toBeVisible();
    await expectNoSuperAdminText(page);
  });

  test('staff accounts receive no superadmin data and cannot open privileged screens', async ({
    page,
  }) => {
    await login(page, 'staff', 'Staff@2026');
    await expectNoSuperAdminText(page);

    await expect(page.getByRole('link', { name: /Users & Roles/i })).toHaveCount(0);
    await expect(page.getByRole('link', { name: /Audit Logs/i })).toHaveCount(0);

    const token = await page.evaluate(() =>
      localStorage.getItem('sreemantha_auth_token')
    );
    expect(token).toBeTruthy();

    const usersResponse = await page.request.get('/api/auth/users', {
      headers: { Authorization: `Bearer ${token}` },
    });
    expect(usersResponse.status()).toBe(403);
    const usersPayload = await usersResponse.json();
    expect(normalizeIdentity(usersPayload)).not.toContain('superadmin');

    await page.goto('/admin/users');
    await expect(
      page.getByRole('heading', { name: 'Access Restricted' })
    ).toBeVisible();
    await expectNoSuperAdminText(page);

    await page.goto('/admin/audit-logs');
    await expect(
      page.getByRole('heading', { name: 'Access Restricted' })
    ).toBeVisible();
    await expectNoSuperAdminText(page);
  });
});
