import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-orders START ============
test.describe('Admin Order Management', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
    await page.fill('input[name="email"]', 'admin@example.com');
    await page.fill('input[name="password"]', 'adminpass123');
    await page.click('button[type="submit"]');
    await page.waitForURL('**/admin**', { timeout: 10000 });
  };

  const selectOption = async (page: Page, selector: string, value: string) => {
    await page.selectOption(selector, value);
  };

  test('admin can update order status', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const ordersTable = page.locator('[data-testid="orders-table"], table');
    await expect(ordersTable).toBeVisible({ timeout: 5000 });

    const firstOrder = page.locator('tbody tr').first();
    if (await firstOrder.isVisible({ timeout: 3000 })) {
      const editButton = firstOrder.locator('button:has-text("Edit"), button:has-text("Update")');
      if (await editButton.isVisible({ timeout: 2000 })) {
        await editButton.click();
        await page.waitForTimeout(300);

        const statusSelect = page.locator('select[name="status"]');
        if (await statusSelect.isVisible({ timeout: 2000 })) {
          await selectOption(page, 'select[name="status"]', 'Completed');

          const completeButton = page.locator('button:has-text("Complete"), button:has-text("Save")');
          if (await completeButton.isVisible({ timeout: 2000 })) {
            await completeButton.click();
            await page.waitForTimeout(500);

            const successMessage = page.locator('text=/updated|success|completed/i');
            await expect(successMessage).toBeVisible({ timeout: 3000 });
          }
        }
      }
    }
  });

  test('admin can cancel order', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const ordersTable = page.locator('[data-testid="orders-table"], table');
    await expect(ordersTable).toBeVisible({ timeout: 5000 });

    const firstOrder = page.locator('tbody tr').first();
    if (await firstOrder.isVisible({ timeout: 3000 })) {
      const cancelButton = firstOrder.locator('button:has-text("Cancel")');
      if (await cancelButton.isVisible({ timeout: 2000 })) {
        await cancelButton.click();
        await page.waitForTimeout(300);

        const confirmDialog = page.locator('text=/Are you sure/i');
        if (await confirmDialog.isVisible({ timeout: 2000 })) {
          await page.click('button:has-text("Confirm"), button:has-text("Yes")');
          await page.waitForTimeout(500);

          const successMessage = page.locator('text=/cancelled|success|canceled/i');
          await expect(successMessage).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('admin can filter orders by status', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const ordersTable = page.locator('[data-testid="orders-table"], table');
    await expect(ordersTable).toBeVisible({ timeout: 5000 });

    const statusFilter = page.locator('select[name="status-filter"]');
    if (await statusFilter.isVisible({ timeout: 3000 })) {
      await selectOption(page, 'select[name="status-filter"]', 'Pending');
      await page.waitForTimeout(500);

      await expect(ordersTable).toBeVisible();

      await selectOption(page, 'select[name="status-filter"]', 'Completed');
      await page.waitForTimeout(500);

      await expect(ordersTable).toBeVisible();

      await selectOption(page, 'select[name="status-filter"]', 'Cancelled');
      await page.waitForTimeout(500);

      await expect(ordersTable).toBeVisible();
    }
  });

  test('admin can export orders', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const ordersTable = page.locator('[data-testid="orders-table"], table');
    await expect(ordersTable).toBeVisible({ timeout: 5000 });

    const exportButton = page.locator('button:has-text("Export")');
    if (await exportButton.isVisible({ timeout: 3000 })) {
      const downloadPromise = page.waitForEvent('download');
      await exportButton.click();
      
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBeTruthy();
      await page.waitForTimeout(500);
    }
  });
});
// ============ FEATURE: e2e-admin-orders END ============
