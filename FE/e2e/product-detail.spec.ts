import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-product-detail START ============
test.describe('Product Detail Page', () => {
  const loginUser = async (page: Page) => {
    await page.goto('/login');
    await page.fill('#email', 'tin1234@gmail.com');
    await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    await page.waitForURL('**/', { timeout: 10000 });
  };

  const getToast = (page: Page) => page.locator('[data-testid="toast"], [class*="toast"], [role="alert"]');

  test.beforeEach(async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);
  });

  // ============ TEST 1: Navigate to product detail page from shop ============
  test('Navigate to product detail page from shop', async ({ page }) => {
    const productCard = page.locator('.products-grid > div').first();
    await expect(productCard).toBeVisible();

    const productLink = productCard.locator('a').first();
    await productLink.click();
    await page.waitForTimeout(2000);

    await expect(page.locator('.single-product, .product-container, [class*="product-detail"]')).toBeVisible({ timeout: 10000 });
  });

  // ============ TEST 2: Product image display ============
  test('Product image display', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const productImage = page.locator('.img-box-product__img, [class*="product-image"], [class*="img-box-product"] img').first();
    await expect(productImage).toBeVisible({ timeout: 10000 });
  });

  // ============ TEST 3: Product name display ============
  test('Product name display', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const productName = page.locator('.product-name, [class*="product-name"], h1, h2').first();
    await expect(productName).toBeVisible({ timeout: 10000 });
    const nameText = await productName.textContent();
    expect(nameText?.trim().length).toBeGreaterThan(0);
  });

  // ============ TEST 4: Product price display (with sale price if applicable) ============
  test('Product price display with sale price if applicable', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const productPrice = page.locator('.product-price, [class*="product-price"]').first();
    await expect(productPrice).toBeVisible({ timeout: 10000 });
    const priceText = await productPrice.textContent();
    expect(priceText).toContain('$');

    const salePrice = page.locator('.product-price span, [class*="product-price"] span').first();
    if (await salePrice.isVisible({ timeout: 2000 })) {
      const hasSale = await salePrice.isVisible();
      if (hasSale) {
        const saleText = await salePrice.textContent();
        expect(saleText).toContain('$');
      }
    }
  });

  // ============ TEST 5: Product description display ============
  test('Product description display', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const productDescription = page.locator('.product-info-text, [class*="product-info-text"], [class*="description"]').first();
    await expect(productDescription).toBeVisible({ timeout: 10000 });
    const descText = await productDescription.textContent();
    expect(descText?.trim().length).toBeGreaterThan(0);
  });

  // ============ TEST 6: Product category display ============
  test('Product category display', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const productCategory = page.locator('.product-category, [class*="product-category"]').first();
    await expect(productCategory).toBeVisible({ timeout: 10000 });
    const categoryText = await productCategory.textContent();
    expect(categoryText?.trim().length).toBeGreaterThan(0);
  });

  // ============ TEST 7: Add to cart from product page ============
  test('Add to cart from product page', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const addToCartButton = page.locator('.btn-add-cart, [class*="btn-add-cart"]').first();
    await expect(addToCartButton).toBeVisible({ timeout: 10000 });

    if (!(await addToCartButton.isDisabled())) {
      await addToCartButton.click();
      await page.waitForTimeout(500);

      const toast = getToast(page);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/Added to cart|cart/i);

      const cartBadge = page.locator('[aria-label="Cart"]');
      await expect(cartBadge).toBeVisible();
    }
  });

  // ============ TEST 8: Product quantity selector works (+/- buttons) ============
  test('Product quantity selector works', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const quantityInput = page.locator('.box-quantity input[type="number"], .box-quantity input, [class*="quantity"] input').first();
    await expect(quantityInput).toBeVisible({ timeout: 10000 });

    const initialValue = await quantityInput.inputValue();
    const initialNum = parseInt(initialValue) || 1;

    const increaseBtn = page.locator('.box-quantity button:has-text("+"), [class*="quantity"] button:has-text("+")').first();
    if (await increaseBtn.isVisible({ timeout: 2000 })) {
      await increaseBtn.click();
      await page.waitForTimeout(300);
      const newValue = await quantityInput.inputValue();
      expect(parseInt(newValue)).toBeGreaterThan(initialNum);
    }

    const decreaseBtn = page.locator('.box-quantity button:has-text("-"), [class*="quantity"] button:has-text("-")').first();
    if (await decreaseBtn.isVisible({ timeout: 2000 })) {
      await decreaseBtn.click();
      await page.waitForTimeout(300);
      const newValue = await quantityInput.inputValue();
      expect(parseInt(newValue)).toBeLessThanOrEqual(initialNum);
    }
  });

  // ============ TEST 9: Add to wishlist from product page ============
  test('Add to wishlist from product page', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const wishlistButton = page.locator('[class*="wishlist"], button:has-text("Wishlist"), button:has-text("♡")').first();
    if (await wishlistButton.isVisible({ timeout: 5000 })) {
      await wishlistButton.click();
      await page.waitForTimeout(500);

      const toast = getToast(page);
      await expect(toast).toBeVisible({ timeout: 5000 });
      await expect(toast).toContainText(/Added to wishlist|wishlist/i);
    }
  });

  // ============ TEST 10: Related products display ============
  test('Related products display', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.locator('a').first().click();
    await page.waitForTimeout(2000);

    const relatedProducts = page.locator('[class*="related"], [class*="related-product"]').first();
    await expect(relatedProducts).toBeVisible({ timeout: 10000 });

    const relatedProductItems = relatedProducts.locator('[class*="product-card"], [class*="item"], [class*="related"] > div');
    const itemCount = await relatedProductItems.count();
    expect(itemCount).toBeGreaterThan(0);
  });
});
// ============ FEATURE: e2e-product-detail END ============
