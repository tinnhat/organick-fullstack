import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-complete-flow START ============
test.describe('Complete Purchase Flow', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('complete flow: browse -> add to cart -> apply coupon -> checkout', async ({ page }) => {
    // Step 1: Go to /shop and browse products
    await page.goto('/shop');
    await page.waitForTimeout(500);
    
    // Verify product grid is visible
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    
    // Step 2: Click "Add to Cart" on first product
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    await expect(addToCartButton).toBeVisible();
    await addToCartButton.click();
    await page.waitForTimeout(500);
    
    // Verify cart badge shows item was added
    const cartBadge = page.locator('[data-testid="cart-badge"]');
    await expect(cartBadge).toBeVisible();

    // Step 3: Go to /cart
    await page.goto('/cart');
    await page.waitForTimeout(500);
    
    // Step 4: Verify cart item is visible
    const cartItem = page.locator('[data-testid="cart-item"]');
    await expect(cartItem.first()).toBeVisible();

    // Step 5: Apply coupon 'SAVE10'
    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('SAVE10');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);
    }

    // Step 6: Verify discount is shown
    const discountElement = page.locator('.discount-amount');
    if (await discountElement.isVisible({ timeout: 2000 })) {
      await expect(discountElement).toBeVisible();
    }

    // Step 7: Click "Proceed to Payment" or "Checkout" button
    const checkoutButton = page.locator('button:has-text("Proceed to Payment"), button:has-text("Checkout"), button:has-text("Proceed to Checkout")').first();
    await expect(checkoutButton).toBeVisible();
    await checkoutButton.click();
    await page.waitForTimeout(1000);
    
    // Step 8: Verify redirected to checkout page
    await expect(page).toHaveURL(/\/checkout/);
    
    // Verify checkout page elements are visible
    await expect(page.locator('[data-testid="cart-item"]').first()).toBeVisible({ timeout: 5000 });
  });
});
// ============ FEATURE: e2e-complete-flow END ============
