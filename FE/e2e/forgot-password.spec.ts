import { test, expect } from '@playwright/test';

// ============ FEATURE: e2e-forgot-password START ============
test.describe('Forgot Password Flow', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    // Wait for the login form to be visible
    await page.waitForSelector('#email', { timeout: 10000 });
  });

  test('user can navigate to forgot password page via link', async ({ page }) => {
    const forgotPasswordLink = page.locator('.forgot-password a');
    await expect(forgotPasswordLink).toBeVisible();
    await forgotPasswordLink.click();

    await expect(page).toHaveURL(/\/login\/forgotPassword/);
    await expect(page.locator('text=Forgot Password')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
  });

  test('user can see forgot password form elements', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('button:has-text("Generate Password")')).toBeVisible();
    await expect(page.locator('text=Remember your password?')).toBeVisible();
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'invalidemail');
    await page.locator('button:has-text("Generate Password")').click();

    // Wait for toast to appear - sonner has specific class structure
    await page.waitForTimeout(1000);
    // Use more generic selector for sonner toasts
    const toast = page.locator('.sonner-toast, [data-sonner-toast], [class*="toast"]').first();
    await expect(toast).toBeVisible({ timeout: 5000 });
  });

  test('shows success modal when submitting valid email', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'test@example.com');
    await page.locator('button:has-text("Generate Password")').click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text="Password Generated"')).toBeVisible();
    await expect(page.locator('[role="dialog"] button:has-text("Back to Login")')).toBeVisible();
  });

  test('user can navigate back to login from success modal', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'test@example.com');
    await page.locator('button:has-text("Generate Password")').click();

    // Wait for modal to appear
    await page.waitForTimeout(1000);
    const dialog = page.locator('[role="dialog"]');
    await expect(dialog).toBeVisible({ timeout: 8000 });

    // Click Back to Login button in modal
    await page.locator('[role="dialog"] button:has-text("Back to Login")').click();

    // Modal should be closed
    await expect(dialog).not.toBeVisible();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#email')).toBeVisible();
  });

  test('user can navigate back to login without submitting', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await expect(page.locator('text=Remember your password?')).toBeVisible();
    // The Login link is inside the page content, scope it specifically
    await page.locator('.box span:has-text("Login")').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});
// ============ FEATURE: e2e-forgot-password END ============
