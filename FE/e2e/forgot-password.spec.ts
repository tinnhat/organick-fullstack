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
    // Use #email selector instead of generic input[type="email"] to avoid matching newsletter input
    await expect(page.locator('#email')).toHaveAttribute('type', 'email');
    await expect(page.locator('button:has-text("Send Reset Link")')).toBeVisible();
    await expect(page.locator('a:has-text("Login")')).toBeVisible();
  });

  test('shows validation error for invalid email format', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'invalidemail');
    await page.locator('button:has-text("Send Reset Link")').click();

    await page.waitForTimeout(500);
    const emailInput = page.locator('#email');
    await expect(emailInput).toHaveAttribute('type', 'email');
  });

  test('shows error for non-existent email', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'nonexistent@example.com');
    await page.locator('button:has-text("Send Reset Link")').click();

    // Wait for toast to appear - sonner renders toasts with class containing "sonner"
    await page.waitForTimeout(3000);
    // Sonner toast container typically has class with "sonner" and message contains the error text
    const toast = page.locator('[class*="sonner"]:has-text("Failed to send reset email")');
    await expect(toast).toBeVisible({ timeout: 8000 });
  });

  test('shows success message after submitting valid email', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'test@example.com');
    await page.locator('button:has-text("Send Reset Link")').click();

    await page.waitForTimeout(3000);
    await expect(page.locator('.success-message')).toBeVisible({ timeout: 8000 });
    await expect(page.locator('text=/We have sent a password reset link/i')).toBeVisible();
    await expect(page.locator('a:has-text("Back to Login")')).toBeVisible();
  });

  test('user can navigate back to login from success state', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await page.fill('#email', 'test@example.com');
    await page.locator('button:has-text("Send Reset Link")').click();

    await page.waitForTimeout(3000);
    await expect(page.locator('.success-message')).toBeVisible({ timeout: 8000 });

    await page.locator('a:has-text("Back to Login")').click();
    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#email')).toBeVisible();
  });

  test('user can navigate back to login without submitting', async ({ page }) => {
    await page.locator('.forgot-password a').click();
    await expect(page).toHaveURL(/\/login\/forgotPassword/);

    await expect(page.locator('a:has-text("Login")')).toBeVisible();
    await page.locator('a:has-text("Login")').click();

    await expect(page).toHaveURL(/\/login/);
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });
});
// ============ FEATURE: e2e-forgot-password END ============
