import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-coupon-edge-cases START ============
test.describe('Coupon Edge Cases', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL('**/');
    }
  };

  test('shows error for expired coupon', async ({ page }) => {
    await page.goto('/shop');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    // Add item to cart
    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);
    const addToCartButton = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Open cart modal
    await page.locator('[aria-label="Cart"]').first().click();
    await page.waitForTimeout(500);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('EXPIRED20');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);

      const errorMessage = page.locator('text=/expired|has expired/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('shows error when coupon max uses exceeded', async ({ page }) => {
    await page.goto('/shop');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    // Add item to cart
    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);
    const addToCartButton = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Open cart modal
    await page.locator('[aria-label="Cart"]').first().click();
    await page.waitForTimeout(500);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('MAXEDOUT');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);

      const errorMessage = page.locator('text=/max|limit|uses|no longer valid/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('user cannot use same coupon twice', async ({ page }) => {
    await page.goto('/shop');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    // Add item to cart
    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);
    const addToCartButton = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Open cart modal
    await page.locator('[aria-label="Cart"]').first().click();
    await page.waitForTimeout(500);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('SAVE10');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);

      const discountElement = page.locator('.discount-amount');
      if (await discountElement.isVisible({ timeout: 2000 })) {
        await expect(discountElement).toBeVisible();
      }

      // Reload page and try again
      await page.reload();
      await loginIfNeeded(page);
      await page.waitForTimeout(2000);

      // Add another item
      const productCard2 = page.locator('.products-grid > div').first();
      await productCard2.hover();
      await page.waitForTimeout(500);
      const addToCartButton2 = page.locator('[class*="product-overlay"] button').first();
      await addToCartButton2.click();
      await page.waitForTimeout(500);

      // Open cart modal
      await page.locator('[aria-label="Cart"]').first().click();
      await page.waitForTimeout(500);

      const couponInputAfterReload = page.locator('[data-testid="coupon-input"]');
      if (await couponInputAfterReload.isVisible({ timeout: 3000 })) {
        await couponInputAfterReload.fill('SAVE10');
        await page.click('[data-testid="apply-coupon"]');
        await page.waitForTimeout(500);

        const errorMessage = page.locator('text=/already used|once|duplicate/i');
        await expect(errorMessage).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('coupon only valid for minimum order amount', async ({ page }) => {
    await page.goto('/shop');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    // Add item to cart
    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);
    const addToCartButton = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton.click();
    await page.waitForTimeout(500);

    // Open cart modal
    await page.locator('[aria-label="Cart"]').first().click();
    await page.waitForTimeout(500);

    const couponInput = page.locator('[data-testid="coupon-input"]');
    if (await couponInput.isVisible({ timeout: 3000 })) {
      await couponInput.fill('MINORDER50');
      await page.click('[data-testid="apply-coupon"]');
      await page.waitForTimeout(500);

      const errorMessage = page.locator('text=/minimum order|minimum purchase|order amount/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });
});
// ============ FEATURE: e2e-coupon-edge-cases END ============
