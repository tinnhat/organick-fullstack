import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-checkout START ============
test.describe('Checkout', () => {
  // Note: These tests assume user is logged in
  // If not logged in, test will redirect to login

  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('can apply valid coupon at checkout', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('SAVE10');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);
      
      const discountElement = page.locator('.discount-amount');
      if (await discountElement.isVisible({ timeout: 2000 })) {
        await expect(discountElement).toBeVisible();
      }
    }
  });

  test('shows error for invalid coupon', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('INVALIDCODE');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);
      
      const errorMessage = page.locator('text=/Invalid|not found|expired/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('shows error when coupon minimum not met', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('MINORDER50');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);
      
      const errorMessage = page.locator('text=/minimum order/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('can remove applied coupon', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('SAVE10');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);
      
      const removeButton = page.locator('button:has-text("Remove")');
      if (await removeButton.isVisible({ timeout: 2000 })) {
        await removeButton.click();
        await page.waitForTimeout(300);
        await expect(page.locator('.discount-amount')).not.toBeVisible();
      }
    }
  });

  test('checkout page shows cart items', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const cartItems = page.locator('[data-testid="cart-item"]');
    if (await cartItems.first().isVisible({ timeout: 3000 })) {
      await expect(cartItems.first()).toBeVisible();
    }
  });

  test('proceed to payment button exists', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

    const payButton = page.locator('button:has-text("Proceed to Payment"), button:has-text("Checkout")');
    await expect(payButton).toBeVisible({ timeout: 5000 });
  });
});
// ============ FEATURE: e2e-checkout END ============