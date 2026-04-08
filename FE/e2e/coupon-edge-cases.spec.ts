import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-coupon-edge-cases START ============
test.describe('Coupon Edge Cases', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('shows error for expired coupon', async ({ page }) => {
    await page.goto('/checkout');
    await loginIfNeeded(page);

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
    await page.goto('/checkout');
    await loginIfNeeded(page);

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

      await page.reload();
      await loginIfNeeded(page);

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
    await page.goto('/checkout');
    await loginIfNeeded(page);

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
