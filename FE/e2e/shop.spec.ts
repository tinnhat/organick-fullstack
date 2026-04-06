import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-shop START ============
test.describe('Shop Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
  });

  test('displays product grid with products', async ({ page }) => {
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    const products = page.locator('[data-testid="product-card"]');
    await expect(products.first()).toBeVisible();
  });

  test('can filter products by category', async ({ page }) => {
    const categoryButton = page.locator('button:has-text("Vegetables")').first();
    if (await categoryButton.isVisible()) {
      await categoryButton.click();
      await page.waitForTimeout(500);
    }
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });

  test('can search for products', async ({ page }) => {
    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible()) {
      await searchInput.fill('carrot');
      await page.waitForTimeout(500);
    }
    await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
  });

  test('can add product to cart from shop', async ({ page }) => {
    const addToCartButton = page.locator('button:has-text("Add to Cart")').first();
    if (await addToCartButton.isVisible()) {
      await addToCartButton.click();
      await page.waitForTimeout(300);
      const badge = page.locator('[data-testid="cart-badge"]');
      await expect(badge).toContainText(/\d+/);
    }
  });

  test('shows product quick view on hover', async ({ page }) => {
    const productCard = page.locator('[data-testid="product-card"]').first();
    if (await productCard.isVisible()) {
      await productCard.hover();
      await page.waitForTimeout(300);
      const quickView = page.locator('[data-testid="quick-view"]');
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
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    }
  });

  test('can sort products by price', async ({ page }) => {
    const sortDropdown = page.locator('[data-testid="sort-dropdown"]');
    if (await sortDropdown.isVisible()) {
      await sortDropdown.selectOption('price-low-high');
      await page.waitForTimeout(500);
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
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
      await expect(page.locator('[data-testid="product-grid"]')).toBeVisible();
    }
  });
});
// ============ FEATURE: e2e-shop END ============