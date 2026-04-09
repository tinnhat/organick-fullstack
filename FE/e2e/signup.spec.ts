import { test, expect } from '@playwright/test';

// ============ FEATURE: e2e-signup START ============
test.describe('Signup and Login Flow', () => {
  const uniqueEmail = `test+${Date.now()}@example.com`;
  const testPassword = 'TestPass123!';
  const testName = 'Test User';

  test.beforeEach(async ({ page }) => {
    // Ensure we're on the login page and wait for the form to load
    await page.goto('/login');
    // Wait for loading to finish and form to appear
    await page.waitForSelector('.box', { timeout: 10000 });
    await page.waitForLoadState('networkidle');
  });

  test('user can navigate to registration form', async ({ page }) => {
    // Initially the login form should be visible (look for email input in login form)
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    
    // Click "Register Now" link to show registration form
    const registerNowLink = page.locator('span:has-text("Register Now")');
    await expect(registerNowLink).toBeVisible();
    await registerNowLink.click();
    
    // Wait for registration form to appear
    await page.waitForTimeout(500);
    
    // Verify registration form fields are visible
    await expect(page.locator('#fullname')).toBeVisible();
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
    await expect(page.locator('#confirmPassword')).toBeVisible();
  });

  test('user can register with valid data', async ({ page }) => {
    // Navigate to registration form
    const registerNowLink = page.locator('span:has-text("Register Now")');
    await registerNowLink.click();
    await page.waitForTimeout(500);
    
    // Fill in the registration form
    await page.fill('#fullname', testName);
    await page.fill('#email', uniqueEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', testPassword);
    
    // Submit the registration form - using "Create Account" as that's the actual button text
    const registerButton = page.locator('form button:has-text("Create Account")');
    await expect(registerButton).toBeVisible();
    await registerButton.click();
    
    // Wait for the registration to process
    await page.waitForTimeout(2000);
    
    // Should see a toast message about checking email to activate account
    const toastMessage = page.locator('text=/check your email/i');
    await expect(toastMessage).toBeVisible({ timeout: 5000 });
  });

  test('user can switch back to login from registration', async ({ page }) => {
    // Navigate to registration form
    const registerNowLink = page.locator('span:has-text("Register Now")');
    await registerNowLink.click();
    await page.waitForTimeout(500);
    
    // Verify registration form is visible
    await expect(page.locator('#fullname')).toBeVisible();
    
    // Click "Log in" link to switch back
    const logInLink = page.locator('span:has-text("Log in")');
    await expect(logInLink).toBeVisible();
    await logInLink.click();
    
    // Wait for login form to appear
    await page.waitForTimeout(500);
    
    // Verify login form is visible (email and password fields)
    await expect(page.locator('#email')).toBeVisible();
    await expect(page.locator('#password')).toBeVisible();
  });

  test('password and confirm password must match', async ({ page }) => {
    // Navigate to registration form
    const registerNowLink = page.locator('span:has-text("Register Now")');
    await registerNowLink.click();
    await page.waitForTimeout(500);
    
    // Fill form with mismatched passwords
    await page.fill('#fullname', testName);
    await page.fill('#email', uniqueEmail);
    await page.fill('#password', testPassword);
    await page.fill('#confirmPassword', 'DifferentPassword123!');
    
    // Submit the form
    const registerButton = page.locator('form button:has-text("Create Account")');
    await registerButton.click();
    
    // Wait for validation
    await page.waitForTimeout(500);
    
    // Should see password mismatch error
    const errorMessage = page.locator('text=/passwords must match/i');
    await expect(errorMessage).toBeVisible({ timeout: 3000 });
  });
});
// ============ FEATURE: e2e-signup END ============
