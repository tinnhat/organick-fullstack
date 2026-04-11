import { Page } from '@playwright/test';

// ============ FEATURE: e2e-helpers START ============

export const testUsers = {
  regular: {
    email: 'admin@gmail.com',
    password: '123456789',
    name: 'Admin User'
  },
  admin: {
    email: 'admin@gmail.com',
    password: '123456789',
    name: 'Admin User'
  }
};

export async function login(page: Page, userType: 'regular' | 'admin' = 'regular') {
  const user = testUsers[userType];
  await page.goto('/login');
  await page.fill('#email', user.email);
  await page.fill('#password', user.password);
  await page.click('form button:has-text("Login")');
  await page.waitForURL(/\/(home|admin)/, { timeout: 10000 });
}

export async function logout(page: Page) {
  const logoutButton = page.locator('button:has-text("Logout"), a:has-text("Logout")');
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
    await page.waitForURL(/\/login/);
  }
}

export async function waitForLoading(page: Page, timeout = 3000) {
  await page.waitForTimeout(timeout);
}

export async function getInputByPlaceholder(page: Page, placeholder: string) {
  return page.locator(`input[placeholder*="${placeholder}"]`);
}

export async function clickButtonByText(page: Page, text: string) {
  const button = page.locator(`button:has-text("${text}"), a:has-text("${text}")`);
  await button.click();
}

// ============ FEATURE: e2e-helpers END ============
