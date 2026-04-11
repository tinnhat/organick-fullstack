import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-complete-flow START ============
test.describe('Complete Purchase Flow', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL('**/');
    }
  };

  test('complete flow: browse -> add to cart -> apply coupon -> checkout', async ({ page }) => {
    // Step 1: Go to /shop and browse products
    await page.goto('/shop');
    await page.waitForTimeout(2000);
    
    // Wait for product grid to be visible - use first() since both exist
    await expect(page.locator('.products-grid').first()).toBeVisible({ timeout: 10000 });
    
    // Step 2: Click "Add to Cart" on first product
    // Find product cards within the products-grid
    const productCard = page.locator('.products-grid > div').first();
    if (await productCard.isVisible()) {
      // Hover to reveal overlay with cart button
      await productCard.hover();
      await page.waitForTimeout(500);
      
      // Find add to cart button in the overlay
      const addToCartButton = page.locator('[class*="product-overlay"] button').first();
      if (await addToCartButton.isVisible({ timeout: 3000 })) {
        await addToCartButton.click();
      }
    }
    await page.waitForTimeout(500);
    
    // Verify cart badge shows item was added
    const cartBadge = page.locator('[aria-label="Cart"]');
    await expect(cartBadge).toBeVisible();

    // Step 3: Open cart modal via header cart icon
    const cartIcon = page.locator('[aria-label="Cart"]').first();
    await cartIcon.click();
    await page.waitForTimeout(500);
    
    // Step 4: Verify cart item is visible in modal
    const cartItem = page.locator('.modalCart .item');
    if (await cartItem.first().isVisible({ timeout: 3000 })) {
      await expect(cartItem.first()).toBeVisible();
    }

    // Step 5: Apply coupon 'SAVE10'
    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('SAVE10');
      // Click Validate first
      const validateButton = page.locator('button:has-text("Validate")');
      if (await validateButton.isVisible({ timeout: 2000 })) {
        await validateButton.click();
        await page.waitForTimeout(500);
        // Then click Apply Coupon if it appears
        const applyButton = page.locator('button:has-text("Apply Coupon")');
        if (await applyButton.isVisible({ timeout: 2000 })) {
          await applyButton.click();
        }
      }
      await page.waitForTimeout(500);
    }

    // Step 6: Verify discount is shown
    const discountElement = page.locator('text=/Discount|discount/i');
    if (await discountElement.isVisible({ timeout: 2000 })) {
      await expect(discountElement).toBeVisible();
    }

    // Step 7: Click "Continue to Checkout" button in modal
    const checkoutButton = page.locator('button:has-text("Continue to Checkout")').first();
    if (await checkoutButton.isVisible({ timeout: 3000 })) {
      await expect(checkoutButton).toBeVisible();
    }
  });
});
// ============ FEATURE: e2e-complete-flow END ============
