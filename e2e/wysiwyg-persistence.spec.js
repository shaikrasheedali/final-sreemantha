const { test, expect } = require('@playwright/test');

async function loginAsAdmin(page) {
  await page.goto('/staff-login');
  await page.locator('#staff-username').fill('admin');
  await page.locator('#staff-password').fill('Admin@2026');
  await page.getByRole('button', { name: /Sign In to Portal/i }).click();
  await expect(page).toHaveURL(/\/admin/);
}

test.describe('WYSIWYG persistence', () => {
  test('saves formatted content to MySQL and exposes it through the API', async ({
    page,
    request,
  }) => {
    const title = `E2E WYSIWYG Save ${Date.now()}`;
    let token = '';
    let createdId = null;

    try {
      await loginAsAdmin(page);
      await page.goto('/admin/treatments');
      await page.getByRole('button', { name: /Add New Treatment/i }).click();

      await page.locator('input[placeholder="e.g. Level-III Advanced NICU"]').fill(title);

      const wysiwyg = page.locator('.wysiwyg-editor').first();
      const editor = wysiwyg.locator('.wysiwyg-content');
      await editor.click();
      await editor.press('Control+A');
      await editor.press('Backspace');
      await editor.pressSequentially('E2E persistence check');
      await editor.press('Control+A');
      await wysiwyg.getByRole('button', { name: 'Bold', exact: true }).click();
      await wysiwyg.getByLabel('Paragraph style').selectOption('h2');

      const createResponsePromise = page.waitForResponse(
        (response) =>
          response.url().includes('/api/treatments') &&
          response.request().method() === 'POST'
      );
      await page.getByRole('button', { name: /Save to MySQL Database/i }).click();
      const createResponse = await createResponsePromise;
      expect(createResponse.status()).toBe(201);

      const createPayload = await createResponse.json();
      createdId = createPayload.id;
      token = await page.evaluate(() => localStorage.getItem('sreemantha_auth_token'));
      expect(token).toBeTruthy();

      await expect(page.getByText(/New treatment created in database/i)).toBeVisible();

      const listResponse = await request.get('/api/treatments', {
        headers: { Authorization: `Bearer ${token}` },
      });
      expect(listResponse.ok()).toBeTruthy();

      const payload = await listResponse.json();
      const saved = payload.treatments.find((item) => item.title === title);
      expect(saved).toBeTruthy();
      createdId = saved.id;

      expect(saved.overview).toContain('E2E persistence check');
      expect(saved.overview).toMatch(/<h2[\s>]/i);
      expect(saved.overview).toMatch(/font-weight:\s*(bold|700)|<b>|<strong>/i);
    } finally {
      if (token) {
        const headers = { Authorization: `Bearer ${token}` };

        if (!createdId) {
          const listResponse = await request.get('/api/treatments', { headers });
          if (listResponse.ok()) {
            const payload = await listResponse.json();
            createdId = payload.treatments.find((item) => item.title === title)?.id || null;
          }
        }

        if (createdId) {
          const deleteResponse = await request.delete(`/api/treatments/${createdId}`, {
            headers,
          });
          expect(deleteResponse.ok()).toBeTruthy();
        }
      }
    }
  });
});
