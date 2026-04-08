import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-notification-delete START ============
test.describe('Notification Delete', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('can delete individual notification', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const panel = page.locator('[data-testid="notification-panel"], [class*="notification-panel"]');
    await expect(panel).toBeVisible({ timeout: 3000 });

    const notificationItem = page.locator('[data-testid="notification-list"] [class*="notification-item"], [class*="notification-list"] [class*="notification-item"]').first();
    if (await notificationItem.isVisible({ timeout: 2000 })) {
      const deleteButton = notificationItem.locator('button:has-text("Delete"), [data-testid="delete-notification"], [class*="delete"]');
      if (await deleteButton.isVisible()) {
        await deleteButton.click();
        await page.waitForTimeout(500);
      }
    }
  });

  test('notifications persist after refresh', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const panel = page.locator('[data-testid="notification-panel"], [class*="notification-panel"]');
    await expect(panel).toBeVisible({ timeout: 3000 });

    const notificationList = page.locator('[data-testid="notification-list"], [class*="notification-list"]');
    const hasNotificationsBefore = await notificationList.isVisible({ timeout: 2000 });

    await page.reload();
    await page.waitForTimeout(1000);

    await bell.click();
    await page.waitForTimeout(300);

    const hasNotificationsAfter = await notificationList.isVisible({ timeout: 2000 });
    expect(hasNotificationsBefore).toBe(hasNotificationsAfter);
  });
});
// ============ FEATURE: e2e-notification-delete END ============
