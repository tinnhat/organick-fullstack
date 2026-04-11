import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-cart-wishlist START ============
test.describe('Cart, Quick View, and Wishlist Features', () => {
  const loginUser = async (page: Page) => {
    await page.goto('/login');
    await page.fill('#email', 'tin1234@gmail.com');
    await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    await page.waitForURL(/\/(home|admin)/, { timeout: 10000 });
  };

  const getToast = (page: Page) => page.locator('[data-sonner-toast]').first();

  // Helper to extract cart count from badge
  const getCartCount = async (page: Page): Promise<number> => {
    const badge = page.locator('[aria-label="Cart"]');
    const text = await badge.textContent() || '';
    const match = text.match(/\d+/);
    return match ? parseInt(match[0]) : 0;
  };

  // ============ TEST 1: Add to Cart from Shop Page Product Card ============
  test('Add to Cart from Shop Page Product Card', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await expect(productCard).toBeVisible();

    await productCard.hover();
    await page.waitForTimeout(500);

    // First button in overlay is Add to Cart (ShoppingCartIcon)
    const addToCartButton = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);

    const toast = getToast(page);
    await expect(toast).toBeVisible({ timeout: 5000 });

    const cartBadge = page.locator('[aria-label="Cart"]');
    await expect(cartBadge).toBeVisible();
    const badgeCount = await getCartCount(page);
    expect(badgeCount).toBeGreaterThan(0);
  });

  // ============ TEST 2: Quick View Modal ============
  test('Quick View Modal', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await expect(productCard).toBeVisible();

    await productCard.hover();
    await page.waitForTimeout(500);

    // Second button in overlay is Quick View (VisibilityIcon)
    const quickViewButton = page.locator('[class*="product-overlay"] button').nth(1);
    await quickViewButton.click();
    await page.waitForTimeout(1000);

    // Modal should have role dialog
    const modal = page.locator('[role="dialog"]').first();
    await expect(modal).toBeVisible({ timeout: 5000 });

    // Product name is in Typography h5
    await expect(modal.locator('h5, h4, h3').first()).toBeVisible();
    
    // Price element
    await expect(modal.locator('[class*="price"], h4').first()).toBeVisible();
    await expect(modal.locator('img').first()).toBeVisible();

    // Add to Cart button in modal
    const modalAddToCart = modal.locator('button').filter({ hasText: /Add to Cart|add to cart/i }).first();
    await modalAddToCart.click();
    await page.waitForTimeout(1000);

    // Close modal using the close icon button
    const closeButton = modal.locator('button[aria-label="Close"], button').filter({ hasText: /×/i }).first();
    if (await closeButton.isVisible({ timeout: 2000 })) {
      await closeButton.click();
    }
    await page.waitForTimeout(500);
    await expect(modal).not.toBeVisible({ timeout: 3000 });
  });

  // ============ TEST 3: Wishlist Toggle ============
  test('Wishlist Toggle', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await expect(productCard).toBeVisible();

    await productCard.hover();
    await page.waitForTimeout(500);

    // Third button in overlay is Wishlist (FavoriteBorderIcon)
    const wishlistButton = page.locator('[class*="product-overlay"] button').nth(2);
    await wishlistButton.click();
    await page.waitForTimeout(1000);

    // Verify wishlist was added via toast
    const toast = getToast(page);
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/wishlist/i);

    // Verify wishlist count increased
    const wishlistBadge = page.locator('[aria-label="Wishlist"]');
    if (await wishlistBadge.isVisible()) {
      const wishlistText = await wishlistBadge.textContent() || '';
      const match = wishlistText.match(/\d+/);
      const count = match ? parseInt(match[0]) : 0;
      expect(count).toBeGreaterThan(0);
    }
  });

  // ============ TEST 4: Wishlist Modal ============
  test('Wishlist Modal', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    // Third button in overlay is Wishlist
    const wishlistButton = page.locator('[class*="product-overlay"] button').nth(2);
    await wishlistButton.click();
    await page.waitForTimeout(1000);

    // Click the wishlist icon in header
    const wishlistIcon = page.locator('[aria-label="Wishlist"]').first();
    await wishlistIcon.click();
    await page.waitForTimeout(1000);

    // Wishlist modal uses className='modalWishlist'
    const wishlistModal = page.locator('.modalWishlist').first();
    await expect(wishlistModal).toBeVisible({ timeout: 5000 });

    // Items are in ul.list-items with className='item'
    const wishlistItem = wishlistModal.locator('.item').first();
    await expect(wishlistItem).toBeVisible();

    // Add to Cart from wishlist uses className='btn-add-cart'
    const addToCartFromWishlist = wishlistModal.locator('.btn-add-cart').first();
    await addToCartFromWishlist.click();
    await page.waitForTimeout(1000);

    const cartBadge = page.locator('[aria-label="Cart"]');
    await expect(cartBadge).toBeVisible();

    // Remove button uses className='btn-remove'
    const removeFromWishlist = wishlistModal.locator('.btn-remove').first();
    await removeFromWishlist.click();
    await page.waitForTimeout(500);

    // Close modal using the X icon
    const closeModalButton = wishlistModal.locator('.icon').first();
    if (await closeModalButton.isVisible({ timeout: 2000 })) {
      await closeModalButton.click();
    }
    await page.waitForTimeout(500);
    await expect(wishlistModal).not.toBeVisible({ timeout: 3000 });
  });

  // ============ TEST 5: Cart persistence ============
  test('Cart persistence', async ({ page }) => {
    await loginUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard1 = page.locator('.products-grid > div').first();
    await productCard1.hover();
    await page.waitForTimeout(500);

    // First button in overlay is Add to Cart
    const addToCartButton1 = page.locator('[class*="product-overlay"] button').first();
    await addToCartButton1.click();
    await page.waitForTimeout(1000);

    // Open wishlist
    const wishlistIcon = page.locator('[aria-label="Wishlist"]').first();
    await wishlistIcon.click();
    await page.waitForTimeout(1000);

    // Wishlist modal uses className='modalWishlist'
    const wishlistModal = page.locator('.modalWishlist').first();
    await expect(wishlistModal).toBeVisible({ timeout: 5000 });

    // Check if there's an item and add to cart from wishlist
    const productInWishlist = wishlistModal.locator('.item').first();
    if (await productInWishlist.isVisible({ timeout: 2000 })) {
      const addToCartFromWishlist = wishlistModal.locator('.btn-add-cart').first();
      if (await addToCartFromWishlist.isVisible()) {
        await addToCartFromWishlist.click();
        await page.waitForTimeout(1000);
      }
    }

    // Close modal using the X icon
    const closeModalButton = wishlistModal.locator('.icon').first();
    if (await closeModalButton.isVisible({ timeout: 2000 })) {
      await closeModalButton.click();
    }
    await page.waitForTimeout(500);

    const cartIcon = page.locator('[aria-label="Cart"]').first();
    await cartIcon.click();
    await page.waitForTimeout(1000);

    const cartModal = page.locator('.modalCart').first();
    await expect(cartModal).toBeVisible({ timeout: 5000 });

    const cartItems = cartModal.locator('.item, [class*="cart-item"]');
    const itemCount = await cartItems.count();
    expect(itemCount).toBeGreaterThanOrEqual(1);
  });
});
// ============ FEATURE: e2e-cart-wishlist END ============
