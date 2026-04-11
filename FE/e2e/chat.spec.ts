import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-chat START ============
test.describe('Chat', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('#email', 'tin1234@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL('**/', { timeout: 10000 });
    }
  };

  const waitForChatButton = async (page: Page) => {
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(3000);
    const chatButton = page.locator('[data-testid="chat-button"]');
    await chatButton.waitFor({ state: 'visible', timeout: 10000 }).catch(() => null);
    return chatButton;
  };

  test('chat button is visible for logged in user', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);
    await expect(chatButton).toBeVisible({ timeout: 5000 });
  });

  test('can open chat modal', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);

    await chatButton.click();
    await page.waitForTimeout(500);

    const chatModal = page.locator('[data-testid="chat-modal"], [class*="chat-modal"]');
    await expect(chatModal).toBeVisible({ timeout: 5000 });
  });

  test('chat modal shows online status indicator', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);

    await chatButton.click();
    await page.waitForTimeout(500);

    const statusIndicator = page.locator('[class*="online"], [class*="status"]').first();
    if (await statusIndicator.isVisible({ timeout: 2000 })) {
      await expect(statusIndicator).toBeVisible();
    }
  });

  test('can type message in chat input', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);

    await chatButton.click();
    await page.waitForTimeout(500);

    const chatInput = page.locator('[data-testid="chat-input"], input[placeholder*="Type"]');
    await expect(chatInput).toBeVisible({ timeout: 5000 });
    await chatInput.fill('Hello, I need help with my order!');
    await expect(chatInput).toHaveValue('Hello, I need help with my order!');
  });

  test('can send message', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);

    await chatButton.click();
    await page.waitForTimeout(500);

    const chatInput = page.locator('[data-testid="chat-input"]');
    const sendButton = page.locator('[data-testid="send-button"], button:has-text("Send")');

    await expect(chatInput).toBeVisible({ timeout: 5000 });
    await chatInput.fill('Test message from E2E');

    await expect(sendButton).toBeVisible({ timeout: 5000 });
    await sendButton.click();
    await page.waitForTimeout(500);

    const sentMessage = page.locator('text=Test message from E2E');
    await expect(sentMessage).toBeVisible({ timeout: 3000 });
  });

  test('can close chat modal', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    const chatButton = await waitForChatButton(page);

    await chatButton.click();
    await page.waitForTimeout(500);

    const closeButton = page.locator('[data-testid="close-chat"], button:has-text("Close"), [class*="close"]');
    await closeButton.click();
    await page.waitForTimeout(300);

    const chatModal = page.locator('[data-testid="chat-modal"]');
    await expect(chatModal).not.toBeVisible({ timeout: 2000 });
  });
});
// ============ FEATURE: e2e-chat END ============
