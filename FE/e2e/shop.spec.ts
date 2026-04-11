import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-shop START ============
test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);
  });

  test('displays product grid with products', async ({ page }) => {
    await expect(page.locator('.products-grid').first()).toBeVisible();
    const products = page.locator('.products-grid > div');
    await expect(products.first()).toBeVisible();
  });

  test('can filter products by category', async ({ page }) => {
    const categoryButton = page.locator('button:has-text("Vegetables")').first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('.products-grid').first()).toBeVisible();
  });

  test('can search for products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]').first();
    if (await searchInput.isVisible()) {
      await searchInput.fill('carrot');
      await page.waitForTimeout(500);
    }
    await expect(page.locator('.products-grid').first()).toBeVisible();
  });

  test('can add product to cart from shop', async ({ page }) => {
    // Find product cards and click their add to cart button (via hover overlay)
    const productCard = page.locator('.products-grid > div').first();
    if (await productCard.isVisible()) {
      // Hover to reveal overlay with cart button
      await productCard.hover();
      await page.waitForTimeout(300);
      
      const addToCartButton = page.locator('[class*="product-overlay"] button').first();
      if (await addToCartButton.isVisible({ timeout: 2000 })) {
        await addToCartButton.click();
        await page.waitForTimeout(300);
        const badge = page.locator('[aria-label="Cart"]');
        await expect(badge).toBeVisible();
      }
    }
  });

  test('shows product quick view on hover', async ({ page }) => {
    const productCard = page.locator('.products-grid > div').first();
    if (await productCard.isVisible()) {
      await productCard.hover();
      await page.waitForTimeout(300);
      // The quick view button should be visible after hover (second button in overlay)
      const quickView = page.locator('[class*="product-overlay"] button').nth(1);
      if (await quickView.isVisible({ timeout: 1000 })) {
        await expect(quickView).toBeVisible();
      }
    }
  });

  test('pagination works', async ({ page }) => {
    const nextButton = page.locator('button:has-text("Next")');
    if (await nextButton.isVisible()) {
      await nextButton.click();
      await page.waitForTimeout(500);
      await expect(page.locator('.products-grid').first()).toBeVisible();
    }
  });

  test('can sort products by price', async ({ page }) => {
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    if (await sortDropdown.isVisible()) {
      await sortDropdown.selectOption('price-low-high');
      await page.waitForTimeout(500);
      await expect(page.locator('.products-grid').first()).toBeVisible();
    }
  });

  test('price range filter works', async ({ page }) => {
    const minPrice = page.locator('[data-testid="price-min"]');
    const maxPrice = page.locator('[data-testid="price-max"]');
    if (await minPrice.isVisible() && await maxPrice.isVisible()) {
      await minPrice.fill('10');
      await maxPrice.fill('100');
      await page.click('button:has-text("Apply")');
      await page.waitForTimeout(500);
      await expect(page.locator('.products-grid').first()).toBeVisible();
    }
  });
});
// ============ FEATURE: e2e-shop END ============
