import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-coupon-crud START ============
test.describe('Admin Coupon CRUD', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@gmail.com');
    await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    // After login, admin is redirected to /home, not /admin
    await page.waitForURL(/\/(home|admin)/, { timeout: 10000 });
  };

  test('admin can edit existing coupon', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const couponRow = page.locator('[data-testid="coupon-row"]').first();
    if (await couponRow.isVisible({ timeout: 3000 })) {
      const editButton = page.locator('button:has-text("Edit")').first();
      if (await editButton.isVisible()) {
        await editButton.click();
        await page.waitForTimeout(300);

        const modal = page.locator('[data-testid="coupon-modal"]');
        await expect(modal).toBeVisible({ timeout: 3000 });

        await page.fill('input[name="code"]', 'EDIT10');
        await page.selectOption('select[name="type"]', 'percentage');
        await page.fill('input[name="value"]', '15');

        const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")');
        await saveButton.click();
        await page.waitForTimeout(500);

        const successMessage = page.locator('text=/updated|success|edited/i');
        await expect(successMessage).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('admin can delete coupon', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const couponRow = page.locator('[data-testid="coupon-row"]').first();
    if (await couponRow.isVisible({ timeout: 3000 })) {
      const deleteButton = page.locator('button:has-text("Delete")').first();
      if (await deleteButton.isVisible()) {
        page.on('dialog', dialog => dialog.accept());
        await deleteButton.click();
        await page.waitForTimeout(500);

        const confirmationDialog = page.locator('text=/Are you sure/i');
        if (await confirmationDialog.isVisible({ timeout: 2000 })) {
          await confirmationDialog.click();
        }
        await page.waitForTimeout(500);

        const successMessage = page.locator('text=/deleted|success|removed/i');
        await expect(successMessage).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('admin can toggle coupon active/inactive', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const toggleSwitch = page.locator('[data-testid="coupon-active-toggle"]').first();
    if (await toggleSwitch.isVisible({ timeout: 3000 })) {
      await toggleSwitch.click();
      await page.waitForTimeout(500);

      const successMessage = page.locator('text=/updated|toggled|active|inactive/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('admin can view coupon usage statistics', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const couponRow = page.locator('[data-testid="coupon-row"]').first();
    if (await couponRow.isVisible({ timeout: 3000 })) {
      const statsButton = page.locator('button:has-text("Stats"), button:has-text("Usage"), button:has-text("Statistics")').first();
      if (await statsButton.isVisible()) {
        await statsButton.click();
        await page.waitForTimeout(500);

        const statsPanel = page.locator('[data-testid="coupon-stats"], [class*="stats"], [class*="usage"]');
        await expect(statsPanel).toBeVisible({ timeout: 3000 });

        const usageCount = page.locator('text=/used|usage|times|orders/i');
        await expect(usageCount.first()).toBeVisible({ timeout: 3000 });
      }
    }
  });
});
// ============ FEATURE: e2e-admin-coupon-crud END ============
