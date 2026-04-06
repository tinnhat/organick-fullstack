import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-auth START ============
test.describe('Authentication', () => {
  test('user can login with valid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'test@example.com');
    await page.fill('input[name="password"]', 'password123');
    await page.click('button[type="submit"]');
    
    await expect(page).toHaveURL('/');
    await expect(page.locator('text=Welcome')).toBeVisible();
  });

  test('user can logout', async ({ page }) => {
    await page.goto('/');
    await page.click('text=Logout');
    
    await expect(page).toHaveURL('/login');
  });

  test('shows error for invalid credentials', async ({ page }) => {
    await page.goto('/login');
    
    await page.fill('input[name="email"]', 'invalid@example.com');
    await page.fill('input[name="password"]', 'wrongpassword');
    await page.click('button[type="submit"]');
    
    await expect(page.locator('text=Invalid email or password')).toBeVisible();
  });

  test('redirects to login when accessing protected route', async ({ page }) => {
    await page.goto('/checkout');
    
    await expect(page).toHaveURL(/\/login/);
  });
});
// ============ FEATURE: e2e-auth END ============