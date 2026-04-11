import { test as base, Page, Locator, Expectation } from '@playwright/test';

export { defineConfig } from '@playwright/test';

// Custom test fixture with helpful utilities
export const test = base.extend<{
  loginAsUser: () => Promise<void>;
  loginAsAdmin: () => Promise<void>;
  logout: () => Promise<void>;
  waitForToast: () => Promise<Locator>;
}>({
  loginAsUser: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/login');
      await page.fill('#email', 'tin1234@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL(/\/(home|admin)/, { timeout: 10000 });
    });
  },
  
  loginAsAdmin: async ({ page }, use) => {
    await use(async () => {
      await page.goto('/login');
      await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL(/\/admin/, { timeout: 10000 });
    });
  },
  
  logout: async ({ page }, use) => {
    await use(async () => {
      const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
      if (await logoutButton.isVisible()) {
        await logoutButton.click();
        await page.waitForURL(/\/login/);
      }
    });
  },
  
  waitForToast: async ({ page }, use) => {
    await use(async () => {
      const toast = page.locator('[data-testid="toast"], [class*="toast"]');
      await toast.waitFor({ state: 'visible', timeout: 5000 });
      return toast;
    });
  }
});

export { expect } from '@playwright/test';
export { Page, Locator, Expectation };
