import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-products START ============
test.describe('Admin Product Management', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    await page.waitForURL('**/admin**', { timeout: 10000 });
  };

  test('admin can add new product', async ({ page }) => {
    await page.goto('/admin/products');
    await loginAsAdmin(page);

    const addButton = page.locator('button:has-text("Add Product")');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(300);

      const form = page.locator('[data-testid="product-form"]');
      await expect(form).toBeVisible({ timeout: 3000 });

      const timestamp = Date.now();
      await page.fill('input[name="name"]', `Test Product ${timestamp}`);
      await page.fill('input[name="price"]', '99.99');
      await page.fill('textarea[name="description"]', 'E2E test product description');

      const createButton = page.locator('button:has-text("Create")');
      await createButton.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/created|success|added/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('admin can edit product', async ({ page }) => {
    await page.goto('/admin/products');
    await loginAsAdmin(page);

    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      await page.waitForTimeout(300);

      const form = page.locator('[data-testid="product-form"]');
      await expect(form).toBeVisible({ timeout: 3000 });

      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      const timestamp = Date.now();
      await nameInput.fill(`Updated Product ${timestamp}`);

      const priceInput = page.locator('input[name="price"]');
      await priceInput.clear();
      await priceInput.fill('149.99');

      const updateButton = page.locator('button:has-text("Update")');
      await updateButton.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/updated|success|edited/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('admin can delete product', async ({ page }) => {
    await page.goto('/admin/products');
    await loginAsAdmin(page);

    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible({ timeout: 3000 })) {
      deleteButton.click();
      await page.waitForTimeout(200);

      page.on('dialog', dialog => dialog.accept());
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/deleted|removed|success/i');
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });
});
// ============ FEATURE: e2e-admin-products END ============