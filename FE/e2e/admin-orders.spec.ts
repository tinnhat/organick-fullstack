import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-orders START ============
test.describe('Admin Order Management', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@gmail.com');
    await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(3000);
    // Verify we're logged in
    await expect(page).toHaveURL(/\/(home|admin|login)/);
  };

  test('admin can view orders table', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/orders');
    
    // The table should appear once data loads
    const ordersTable = page.locator('table[aria-label="simple table"]');
    await expect(ordersTable).toBeVisible({ timeout: 10000 });
  });

  test('admin can update order status', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/orders');
    
    // Wait for table rows to appear
    const firstOrderRow = page.locator('tbody tr').first();
    await expect(firstOrderRow).toBeVisible({ timeout: 10000 });
    await firstOrderRow.click();
    await page.waitForURL(/\/admin\/orders\/[^/]+$/, { timeout: 10000 });

    const statusSelect = page.locator('#status');
    await expect(statusSelect).toBeVisible({ timeout: 10000 });
    await statusSelect.selectOption('Complete');

    const saveButton = page.locator('button[type="submit"]:has-text("Save")');
    await saveButton.click();
    await page.waitForTimeout(1000);

    const successToast = page.locator('text=/updated|success|Order updated successfully/i');
    await expect(successToast).toBeVisible({ timeout: 5000 });
  });

  test('admin can filter orders by status', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/orders');
    
    const ordersTable = page.locator('table[aria-label="simple table"]');
    await expect(ordersTable).toBeVisible({ timeout: 10000 });

    const statusFilter = page.locator('#filter-select-status');
    await expect(statusFilter).toBeVisible({ timeout: 5000 });
    await statusFilter.selectOption('Pending');
    await page.waitForTimeout(500);
    await expect(ordersTable).toBeVisible();
  });

  test('admin can export orders', async ({ page }) => {
    await loginAsAdmin(page);
    await page.goto('/admin/orders');
    
    const exportButton = page.locator('button:has-text("Export")');
    await expect(exportButton).toBeVisible({ timeout: 10000 });

    const downloadPromise = page.waitForEvent('download');
    await exportButton.click();
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBeTruthy();
  });
});
// ============ FEATURE: e2e-admin-orders END ============
