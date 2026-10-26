const { test, expect } = require('@playwright/test');

async function loginAndOpenTreatmentEditor(page) {
  await page.goto('/staff-login');
  await page.locator('#quick-login-admin').click();
  await page.getByRole('button', { name: /Sign In to Portal/i }).click();
  await expect(page).toHaveURL(/\/admin/);

  await page.goto('/admin/treatments');
  await page.getByRole('button', { name: /Add New Treatment/i }).click();

  const wysiwyg = page.locator('.wysiwyg-editor').first();
  await expect(wysiwyg).toBeVisible();

  return {
    wysiwyg,
    editor: wysiwyg.locator('.wysiwyg-content'),
    toolbar: wysiwyg.locator('.wysiwyg-toolbar'),
  };
}

async function selectAll(editor) {
  await editor.click();
  await editor.press('Control+A');
}

async function replaceEditorText(editor, text) {
  await editor.click();
  await editor.press('Control+A');
  await editor.press('Backspace');
  await editor.pressSequentially(text);
  await editor.press('Control+A');
}

async function setColorInput(input, value) {
  await input.evaluate((element, color) => {
    const nativeSetter = Object.getOwnPropertyDescriptor(
      window.HTMLInputElement.prototype,
      'value'
    ).set;
    nativeSetter.call(element, color);
    element.dispatchEvent(new Event('input', { bubbles: true }));
    element.dispatchEvent(new Event('change', { bubbles: true }));
  }, value);
}

test.describe('WYSIWYG Editor Toolbar', () => {
  test('applies and clears inline formatting, alignment and block styles', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Rich text validation');
    await wysiwyg.getByRole('button', { name: 'Bold', exact: true }).click();
    await expectHtml(editor, /font-weight:\s*(bold|700)|<b>|<strong>/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Italic', exact: true }).click();
    await expectHtml(editor, /font-style:\s*italic|<i>|<em>/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Underline', exact: true }).click();
    await expectHtml(editor, /text-decoration[^;"]*underline|<u>/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Strikethrough', exact: true }).click();
    await expectHtml(editor, /line-through|<s>|<strike>/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Clear formatting', exact: true }).click();
    await expect
      .poll(async () => (await editor.innerHTML()).toLowerCase())
      .not.toMatch(/font-weight|font-style|line-through/);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Align center', exact: true }).click();
    await expectHtml(editor, /text-align:\s*center|align="center"/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Align right', exact: true }).click();
    await expectHtml(editor, /text-align:\s*right|align="right"/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Justify', exact: true }).click();
    await expectHtml(editor, /text-align:\s*justify|align="justify"/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Align left', exact: true }).click();
    await expectHtml(editor, /text-align:\s*left|align="left"/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Bullet list', exact: true }).click();
    await expectHtml(editor, /<ul[\s>]/i);

    await selectAll(editor);
    await wysiwyg.getByRole('button', { name: 'Numbered list', exact: true }).click();
    await expectHtml(editor, /<ol[\s>]/i);

    await selectAll(editor);
    await wysiwyg.getByLabel('Paragraph style').selectOption('h2');
    await expectHtml(editor, /<h2[\s>]/i);

    await selectAll(editor);
    await wysiwyg.getByLabel('Paragraph style').selectOption('blockquote');
    await expectHtml(editor, /<blockquote[\s>]/i);
  });

  test('applies font family, font size and colours', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Typography colours');
    await wysiwyg.getByLabel('Font family').selectOption('Georgia');
    await expectHtml(editor, /font-family:\s*[^;"]*Georgia|<font[^>]*Georgia/i);

    await selectAll(editor);
    await wysiwyg.getByLabel('Font size').selectOption('24px');
    await expectHtml(editor, /font-size:\s*24px/i);

    await selectAll(editor);
    await setColorInput(wysiwyg.getByLabel('Text colour'), '#ff0000');
    await expectHtml(editor, /color:\s*(rgb\(255,\s*0,\s*0\)|#ff0000)/i);

    await selectAll(editor);
    // Use a non-default colour so a genuine colour change is exercised.
    await setColorInput(wysiwyg.getByLabel('Highlight colour'), '#00ff00');
    await expectHtml(editor, /background-color:\s*(rgb\(0,\s*255,\s*0\)|#00ff00)/i);
  });

  test('inserts, edits and removes links', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Book a consultation');
    await wysiwyg.getByRole('button', { name: 'Insert or edit link' }).click();

    const dialog = wysiwyg.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await dialog.locator('input[type="text"]').first().fill('https://example.com/consult');
    await dialog.getByRole('button', { name: 'Insert Link' }).click();

    const link = editor.locator('a[href="https://example.com/consult"]');
    await expect(link).toHaveText('Book a consultation');

    await link.click();
    await wysiwyg.getByRole('button', { name: 'Insert or edit link' }).click();
    const editDialog = wysiwyg.getByRole('dialog');
    await expect(editDialog.getByText('Edit Link')).toBeVisible();
    await editDialog.locator('input[type="text"]').first().fill('https://example.com/updated');
    await editDialog.getByRole('button', { name: 'Update Link' }).click();
    await expect(editor.locator('a[href="https://example.com/updated"]')).toBeVisible();

    await editor.locator('a[href="https://example.com/updated"]').click();
    await wysiwyg.getByRole('button', { name: 'Insert or edit link' }).click();
    await wysiwyg.getByRole('dialog').getByRole('button', { name: 'Remove Link' }).click();
    await expect(editor.locator('a')).toHaveCount(0);
  });

  test('inserts media, tables, divider lines and quotes', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Media block');

    await wysiwyg.getByRole('button', { name: 'Insert image or video' }).click();
    const imageDialog = wysiwyg.getByRole('dialog');
    const imageInputs = imageDialog.locator('input[type="text"]');
    await imageInputs.first().fill('/uploads/test-wysiwyg-image.webp');
    await imageInputs.nth(1).fill('WYSIWYG test image');
    await imageDialog.getByRole('button', { name: 'Insert Media' }).click();

    const insertedImage = editor.locator('img[alt="WYSIWYG test image"]');
    await expect(insertedImage).toHaveAttribute('src', '/uploads/test-wysiwyg-image.webp');

    await wysiwyg.getByRole('button', { name: 'Insert table' }).click();
    const tableDialog = wysiwyg.getByRole('dialog');
    await tableDialog.locator('input[type="number"]').first().fill('2');
    await tableDialog.locator('input[type="number"]').nth(1).fill('3');
    await tableDialog.getByRole('button', { name: 'Insert Table' }).click();

    await expect(editor.locator('table')).toBeVisible();
    await expect(editor.locator('th')).toHaveCount(3);
    await expect(editor.locator('td')).toHaveCount(6);

    await editor.click();
    await wysiwyg.getByRole('button', { name: 'Insert divider line' }).click();
    await expect(editor.locator('hr')).toHaveCount(1);

    await replaceEditorText(editor, 'Quoted guidance');
    await wysiwyg.getByRole('button', { name: 'Quote block' }).click();
    await expect(editor.locator('blockquote')).toContainText('Quoted guidance');
  });

  test('inserts an asset chosen from the media library and a video by URL', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Media library and video');
    await wysiwyg.getByRole('button', { name: 'Insert image or video' }).click();
    await wysiwyg
      .getByRole('dialog')
      .getByRole('button', { name: /Choose from Media Library or Upload/i })
      .click();

    await expect(wysiwyg.getByRole('heading', { name: 'Insert Media into Content' })).toBeVisible();
    await expect(wysiwyg.getByText('Loading media library...')).toBeHidden();

    const libraryAsset = wysiwyg
      .getByRole('img', { name: 'Embryology Lab Cleanroom' })
      .first();
    await expect(libraryAsset).toBeVisible();
    await libraryAsset.click();
    await expect(wysiwyg.getByText('1 asset selected')).toBeVisible();
    await wysiwyg.getByRole('button', { name: 'Confirm Selection' }).click();

    await expect(
      editor.locator('img[src="/uploads/departments/fertility-reproductive-medicine.webp"]')
    ).toBeVisible();

    await editor.click();
    await wysiwyg.getByRole('button', { name: 'Insert image or video' }).click();
    const videoDialog = wysiwyg.getByRole('dialog');
    const videoInputs = videoDialog.locator('input[type="text"]');
    await videoInputs.first().fill('/uploads/wysiwyg-demo.mp4');
    await videoInputs.nth(1).fill('Demo procedure video');
    await videoDialog.getByRole('button', { name: 'Insert Media' }).click();

    const insertedVideo = editor.locator('video[src="/uploads/wysiwyg-demo.mp4"]');
    await expect(insertedVideo).toBeVisible();
    await expect(insertedVideo).toHaveAttribute('controls', '');
  });

  test('navigates table cells with Tab and appends rows at the end', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await wysiwyg.getByRole('button', { name: 'Insert table' }).click();
    const tableDialog = wysiwyg.getByRole('dialog');
    await tableDialog.locator('input[type="number"]').first().fill('2');
    await tableDialog.locator('input[type="number"]').nth(1).fill('2');
    await tableDialog.getByRole('checkbox').uncheck();
    await tableDialog.getByRole('button', { name: 'Insert Table' }).click();

    const cells = editor.locator('td');
    await expect(cells).toHaveCount(4);

    await cells.nth(0).click();
    await page.keyboard.type('One');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Two');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Three');
    await page.keyboard.press('Tab');
    await page.keyboard.type('Four');

    await expect(cells.nth(0)).toContainText('One');
    await expect(cells.nth(1)).toContainText('Two');
    await expect(cells.nth(2)).toContainText('Three');
    await expect(cells.nth(3)).toContainText('Four');

    await page.keyboard.press('Tab');
    await page.keyboard.type('Five');

    await expect(cells).toHaveCount(6);
    await expect(cells.nth(4)).toContainText('Five');
  });

  test('round-trips HTML source and supports undo and redo', async ({ page }) => {
    const { wysiwyg, editor } = await loginAndOpenTreatmentEditor(page);

    await replaceEditorText(editor, 'Undo redo check');
    const beforeUndo = await editor.innerHTML();

    await wysiwyg.getByRole('button', { name: 'Undo' }).click();
    await expect.poll(async () => editor.innerHTML()).not.toBe(beforeUndo);

    await wysiwyg.getByRole('button', { name: 'Redo' }).click();
    await expectHtml(editor, /Undo redo check/);

    await editor.click();
    await editor.press('Control+A');
    await editor.press('Backspace');
    await editor.pressSequentially('Source mode test');

    await wysiwyg.getByRole('button', { name: 'Switch to HTML source' }).click();
    const source = wysiwyg.getByLabel('HTML source');
    await expect(source).toBeVisible();
    await source.fill('<p>Source <strong>mode</strong> test</p>');

    await wysiwyg.getByRole('button', { name: 'Switch to visual editor' }).click();
    await expectHtml(editor, /<strong>mode<\/strong>/i);
    await expect(editor).toContainText('Source mode test');
  });
});

async function expectHtml(editor, pattern) {
  await expect.poll(async () => editor.innerHTML()).toMatch(pattern);
}
