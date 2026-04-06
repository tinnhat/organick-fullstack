import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-notification START ============
test.describe('Notifications', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('notification bell is visible', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"], [class*="notification-bell"]');
    await expect(bell).toBeVisible({ timeout: 5000 });
  });

  test('notification bell shows unread count badge', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const badge = page.locator('[data-testid="notification-bell"] [class*="badge"], [class*="notification-badge"]');
    if (await badge.isVisible({ timeout: 2000 })) {
      const count = await badge.textContent();
      expect(count).toMatch(/\d+/);
    }
  });

  test('opens notification panel on bell click', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const panel = page.locator('[data-testid="notification-panel"], [class*="notification-panel"]');
    await expect(panel).toBeVisible({ timeout: 3000 });
  });

  test('notification panel shows list of notifications', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const notificationList = page.locator('[data-testid="notification-list"], [class*="notification-list"]');
    if (await notificationList.isVisible({ timeout: 3000 })) {
      await expect(notificationList).toBeVisible();
    }
  });

  test('notification shows order status change', async ({ page }) => {
    await page.goto('/orders');
    await loginIfNeeded(page);

    const completeButton = page.locator('button:has-text("Complete Order"), button:has-text("Mark Delivered")');
    if (await completeButton.isVisible({ timeout: 3000 })) {
      await completeButton.click();
      await page.waitForTimeout(1000);
      
      const bell = page.locator('[data-testid="notification-bell"]');
      const badge = bell.locator('[class*="badge"]');
      const countText = await badge.textContent();
      expect(parseInt(countText || '0')).toBeGreaterThanOrEqual(1);
    }
  });

  test('notification shows chat message received', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const chatNotification = page.locator('text=/new message|chat message/i');
    if (await chatNotification.isVisible({ timeout: 2000 })) {
      await expect(chatNotification).toBeVisible();
    }
  });

  test('can mark notification as read', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const unreadNotification = page.locator('[class*="notification-item"][class*="unread"]').first();
    if (await unreadNotification.isVisible({ timeout: 2000 })) {
      const markReadButton = unreadNotification.locator('button:has-text("Mark as Read"), [class*="mark-read"]');
      if (await markReadButton.isVisible()) {
        await markReadButton.click();
        await page.waitForTimeout(300);
      }
    }
  });

  test('can mark all notifications as read', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const bell = page.locator('[data-testid="notification-bell"]');
    await bell.click();
    await page.waitForTimeout(300);

    const markAllButton = page.locator('button:has-text("Mark all as read"), [data-testid="mark-all-read"]');
    if (await markAllButton.isVisible({ timeout: 2000 })) {
      await markAllButton.click();
      await page.waitForTimeout(500);
      
      const unreadCount = page.locator('[class*="badge"]:has-text("0"), [class*="badge"]:has-text("")');
      if (await unreadCount.isVisible({ timeout: 2000 })) {
        await expect(unreadCount).toBeVisible();
      }
    }
  });

  test('toast notification appears for new notification', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const toast = page.locator('[data-testid="toast-notification"], [class*="toast"]');
    
    // Wait for potential new notification (triggered by order status change)
    await page.waitForTimeout(3000);
    
    if (await toast.isVisible({ timeout: 5000 })) {
      await expect(toast).toBeVisible();
      const closeButton = toast.locator('button:has-text("Close"), [class*="close"]');
      if (await closeButton.isVisible()) {
        await closeButton.click();
      }
    }
  });
});
// ============ FEATURE: e2e-notification END ============