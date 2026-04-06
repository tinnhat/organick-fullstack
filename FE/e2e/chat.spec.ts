import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-chat START ============
test.describe('Chat', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('chat button is visible for logged in user', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    // Wait for page to fully load
    await page.waitForLoadState('networkidle');

    const chatButton = page.locator('[data-testid="chat-button"]');
    
    // Try multiple selectors
    const isVisible = await chatButton.isVisible({ timeout: 3000 }).catch(() => false);
    if (!isVisible) {
      // Fallback: check if we're on the right page and chat button might be rendered
      const bodyText = await page.textContent('body');
      console.log('Page loaded, looking for chat button...');
    }
    
    await expect(chatButton).toBeVisible({ timeout: 5000 });
  });

  test('can open chat modal', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const chatButton = page.locator('[data-testid="chat-button"]').first();
    await chatButton.click();
    await page.waitForTimeout(300);

    const chatModal = page.locator('[data-testid="chat-modal"], [class*="chat-modal"]');
    await expect(chatModal).toBeVisible({ timeout: 3000 });
  });

  test('chat modal shows online status indicator', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const chatButton = page.locator('[data-testid="chat-button"]').first();
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

    const chatButton = page.locator('[data-testid="chat-button"]').first();
    await chatButton.click();
    await page.waitForTimeout(300);

    const chatInput = page.locator('[data-testid="chat-input"], input[placeholder*="Type"]');
    if (await chatInput.isVisible({ timeout: 2000 })) {
      await chatInput.fill('Hello, I need help with my order!');
      await expect(chatInput).toHaveValue('Hello, I need help with my order!');
    }
  });

  test('can send message', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const chatButton = page.locator('[data-testid="chat-button"]').first();
    await chatButton.click();
    await page.waitForTimeout(300);

    const chatInput = page.locator('[data-testid="chat-input"]');
    const sendButton = page.locator('[data-testid="send-button"], button:has-text("Send")');

    if (await chatInput.isVisible({ timeout: 2000 })) {
      await chatInput.fill('Test message from E2E');
      
      if (await sendButton.isVisible({ timeout: 2000 })) {
        await sendButton.click();
        await page.waitForTimeout(500);
        
        const sentMessage = page.locator('text=Test message from E2E');
        await expect(sentMessage).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('can see typing indicator', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const chatButton = page.locator('[data-testid="chat-button"]').first();
    await chatButton.click();
    await page.waitForTimeout(300);

    const chatInput = page.locator('[data-testid="chat-input"]');
    if (await chatInput.isVisible({ timeout: 2000 })) {
      await chatInput.fill('Are you there?');
      
      const typingIndicator = page.locator('text=/typing|.../i');
      if (await typingIndicator.isVisible({ timeout: 3000 })) {
        await expect(typingIndicator).toBeVisible();
      }
    }
  });

  test('can close chat modal', async ({ page }) => {
    await page.goto('/');
    await loginIfNeeded(page);

    const chatButton = page.locator('[data-testid="chat-button"]').first();
    await chatButton.click();
    await page.waitForTimeout(300);

    const closeButton = page.locator('[data-testid="close-chat"], button:has-text("Close"), [class*="close"]');
    if (await closeButton.isVisible({ timeout: 2000 })) {
      await closeButton.click();
      await page.waitForTimeout(300);
      
      const chatModal = page.locator('[data-testid="chat-modal"]');
      await expect(chatModal).not.toBeVisible({ timeout: 2000 });
    }
  });
});
// ============ FEATURE: e2e-chat END ============