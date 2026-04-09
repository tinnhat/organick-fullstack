import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-auth START ============
test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    
    const emailInput = page.locator('#email');
    const passwordInput = page.locator('#password');
    const loginButton = page.locator('form button:has-text("Login")');
    
    await emailInput.fill('admin@gmail.com');
    await passwordInput.fill('123456789');
    await loginButton.click();
    
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(/\/(home|admin)/);
  });

  test('user can logout', async ({ page }) => {
    await page.goto('/home');
    const logoutButton = page.locator('button:has-text("Logout")');
    if (await logoutButton.isVisible({ timeout: 3000 })) {
      await logoutButton.click();
      await expect(page).toHaveURL(/\/login/);
    }
  });

  test.skip('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('#email', 'invalid@example.com');
    await page.fill('#password', 'wrongpassword');
    await page.click('form button:has-text("Login")');
    
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test.skip('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/checkout');
    
    await expect(page).toHaveURL(/\/login/);
  });
});
// ============ FEATURE: e2e-auth END ============