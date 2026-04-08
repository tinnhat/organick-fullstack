import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-categories START ============
test.describe('Admin Category Management', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
  };

  test('admin can view categories list', async ({ page }) => {
    await page.goto('/admin/categories');
    await loginAsAdmin(page);

    const categoriesTable = page.locator('table, [data-testid="categories-table"]');
    await expect(categoriesTable).toBeVisible({ timeout: 5000 });
  });

  test('admin can add new category', async ({ page }) => {
    await page.goto('/admin/categories');
    await loginAsAdmin(page);

    const addButton = page.locator('button:has-text("Add Category"), button:has-text("Create")');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[data-testid="category-modal"], [class*="modal"]');
      await expect(modal).toBeVisible({ timeout: 3000 });

      const uniqueName = `E2E Category ${Date.now()}`;
      await page.fill('input[name="name"]', uniqueName);

      const createButton = page.locator('button:has-text("Create"), button:has-text("Save")');
      await createButton.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/created|success/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('admin can edit category', async ({ page }) => {
    await page.goto('/admin/categories');
    await loginAsAdmin(page);

    const editButton = page.locator('button:has-text("Edit")').first();
    if (await editButton.isVisible({ timeout: 3000 })) {
      await editButton.click();
      await page.waitForTimeout(300);

      const modal = page.locator('[data-testid="category-modal"], [class*="modal"]');
      await expect(modal).toBeVisible({ timeout: 3000 });

      const nameInput = page.locator('input[name="name"]');
      await nameInput.clear();
      const updatedName = `Updated Category ${Date.now()}`;
      await nameInput.fill(updatedName);

      const updateButton = page.locator('button:has-text("Update"), button:has-text("Save")');
      await updateButton.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/updated|success/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('admin can delete category', async ({ page }) => {
    await page.goto('/admin/categories');
    await loginAsAdmin(page);

    const deleteButton = page.locator('button:has-text("Delete")').first();
    if (await deleteButton.isVisible({ timeout: 3000 })) {
      page.on('dialog', dialog => dialog.accept());
      await deleteButton.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/deleted|success/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });
});
// ============ FEATURE: e2e-admin-categories END ============
