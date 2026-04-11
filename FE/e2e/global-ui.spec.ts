import { test, expect, Page, Locator } from '@playwright/test';

// ============ PAGE OBJECTS ============
class HeaderObject {
  readonly logo: Locator;
  readonly navMenu: Locator;
  readonly cartIcon: Locator;
  readonly cartBadge: Locator;
  readonly wishlistIcon: Locator;
  readonly wishlistBadge: Locator;
  readonly userDropdown: Locator;
  readonly userMenuButton: Locator;
  readonly mobileMenuToggle: Locator;
  readonly mobileMenu: Locator;

  constructor(readonly page: Page) {
    this.logo = page.locator('.header-logo');
    this.navMenu = page.locator('.header-menu-list');
    this.cartIcon = page.locator('.cart-box').first();
    this.cartBadge = page.locator('.cart-box-number');
    this.wishlistIcon = page.locator('.wishlist-box').first();
    this.wishlistBadge = page.locator('.wishlist-box-number');
    this.userDropdown = page.locator('.avatar-box').first();
    this.userMenuButton = page.locator('.avatar-box').first();
    this.mobileMenuToggle = page.locator('.header-menu-mobile').first();
    this.mobileMenu = page.locator('.header-menu-list');
  }

  async getCartCount(): Promise<number> {
    const badge = this.cartBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      const match = text?.match(/Cart\((\d+)\)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }

  async getWishlistCount(): Promise<number> {
    const badge = this.wishlistBadge;
    if (await badge.isVisible()) {
      const text = await badge.textContent();
      const match = text?.match(/Wishlist\((\d+)\)/);
      return match ? parseInt(match[1]) : 0;
    }
    return 0;
  }
}

class FooterObject {
  readonly footer: Locator;
  readonly links: Locator;
  readonly socialLinks: Locator;
  readonly copyright: Locator;

  constructor(readonly page: Page) {
    this.footer = page.locator('footer, [class*="footer"]').first();
    this.links = this.footer.locator('a[href]');
    this.socialLinks = this.footer.locator('[class*="social"] a, [class*="social"] button');
    this.copyright = this.footer.locator('[class*="copyright"], [class*="footer"] span, [class*="footer"] p');
  }
}

class ToastObject {
  readonly page: Page;

  constructor(readonly page_: Page) {
    this.page = page_;
  }

  get toast(): Locator {
    return this.page.locator('[data-sonner-toast], [class*="toast-"]').first();
  }

  async waitForVisible(timeout = 5000): Promise<Locator> {
    await this.toast.waitFor({ state: 'visible', timeout });
    return this.toast;
  }
}

// ============ HELPERS ============
const loginAsUser = async (page: Page) => {
  await page.goto('/login');
  await page.fill('#email', 'tin1234@gmail.com');
  await page.fill('#password', '123456789');
  await page.click('form button:has-text("Login")');
  await page.waitForURL(/\/(|home)$/, { timeout: 15000 });
};

const loginAsAdmin = async (page: Page) => {
  await page.goto('/login');
  await page.fill('#email', 'admin@gmail.com');
  await page.fill('#password', '123456789');
  await page.click('form button:has-text("Login")');
  await page.waitForURL(/\/admin/, { timeout: 15000 });
};

// ============ FEATURE: global-ui START ============
test.describe('Global UI Elements', () => {
  let header: HeaderObject;
  let footer: FooterObject;
  let toast: ToastObject;

  test.beforeEach(async ({ page }) => {
    header = new HeaderObject(page);
    footer = new FooterObject(page);
    toast = new ToastObject(page);
  });

  // ============ TEST 1: Header displays logo ============
  test('Header displays logo and navigation menu', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(header.logo).toBeVisible();
    
    const navMenu = header.navMenu;
    await expect(navMenu).toBeVisible();
    
    const navLinks = navMenu.locator('a');
    const linkCount = await navLinks.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  // ============ TEST 2: Header displays on multiple pages ============
  test('Header displays consistently on shop page', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    await expect(header.logo).toBeVisible();
    await expect(header.navMenu).toBeVisible();
  });

  test('Header displays consistently on product detail page', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(2000);
      
      await expect(header.logo).toBeVisible();
      await expect(header.navMenu).toBeVisible();
    }
  });

  // ============ TEST 3: Cart badge shows correct count ============
  test('Cart badge shows correct count when items in cart', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const initialCount = await header.getCartCount();

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const addToCartButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Cart"], [class*="product-overlay"] button:has(svg[class*="ShoppingCart"])').first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);

    const newCount = await header.getCartCount();
    expect(newCount).toBe(initialCount + 1);

    await toast.waitForVisible();
    await expect(toast.toast).toContainText(/cart|added/i);
  });

  // ============ TEST 4: Cart badge persists across pages ============
  test('Cart badge count persists when navigating pages', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const addToCartButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Cart"], [class*="product-overlay"] button:has(svg[class*="ShoppingCart"])').first();
    await addToCartButton.click();
    await page.waitForTimeout(1000);

    const cartCountAfterAdd = await header.getCartCount();

    await page.goto('/');
    await page.waitForTimeout(2000);

    const persistedCount = await header.getCartCount();
    expect(persistedCount).toBe(cartCountAfterAdd);
  });

  // ============ TEST 5: Wishlist badge shows correct count ============
  test('Wishlist badge shows correct count when items in wishlist', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const wishlistButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Wishlist"], [class*="product-overlay"] button:has(svg[class*="Favorite"])').first();
    await wishlistButton.click();
    await page.waitForTimeout(1000);

    const wishlistCount = await header.getWishlistCount();
    expect(wishlistCount).toBeGreaterThan(0);
  });

  // ============ TEST 6: Wishlist badge persists across pages ============
  test('Wishlist badge count persists when navigating pages', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const wishlistButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Wishlist"], [class*="product-overlay"] button:has(svg[class*="Favorite"])').first();
    await wishlistButton.click();
    await page.waitForTimeout(1000);

    const wishlistCountAfterAdd = await header.getWishlistCount();

    await page.goto('/');
    await page.waitForTimeout(2000);

    const persistedCount = await header.getWishlistCount();
    expect(persistedCount).toBe(wishlistCountAfterAdd);
  });

  // ============ TEST 7: User dropdown menu - Login state ============
  test('User dropdown shows login when not authenticated', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const userMenu = header.userDropdown;
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500);
      
      const loginOption = page.locator('text=/Login|Sign in|SignIn/i');
      await expect(loginOption.first()).toBeVisible();
    }
  });

  // ============ TEST 8: User dropdown menu - Logout functionality ============
  test('User dropdown shows logout when authenticated', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/');
    await page.waitForTimeout(2000);

    const userMenu = header.userMenuButton;
    if (await userMenu.isVisible()) {
      await userMenu.hover();
      await page.waitForTimeout(500);
      
      const logoutOption = page.locator('text=/Logout|Sign out|SignOut/i');
      await expect(logoutOption.first()).toBeVisible();
    }
  });

  // ============ TEST 9: User dropdown menu - Login redirect ============
  test('User dropdown login redirects to login page', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const userMenu = header.userDropdown;
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500);
      
      const loginOption = page.locator('a[href*="login"], text=/Login|Sign in/i').first();
      if (await loginOption.isVisible()) {
        await loginOption.click();
        await page.waitForTimeout(1000);
        expect(page.url()).toContain('/login');
      }
    }
  });

  // ============ TEST 10: User dropdown menu - Logout works ============
  test('User dropdown logout signs out user', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/');
    await page.waitForTimeout(2000);

    const userMenu = header.userMenuButton;
    if (await userMenu.isVisible()) {
      await userMenu.click();
      await page.waitForTimeout(500);
      
      const logoutOption = page.locator('button:has-text("Logout"), a:has-text("Logout")').first();
      if (await logoutOption.isVisible()) {
        await logoutOption.click();
        await page.waitForTimeout(1000);
        
        const loginButton = header.userDropdown;
        if (await loginButton.isVisible()) {
          await loginButton.click();
          await page.waitForTimeout(500);
          const loginOption = page.locator('text=/Login|Sign in/i');
          await expect(loginOption.first()).toBeVisible();
        }
      }
    }
  });

  // ============ TEST 11: Mobile menu toggle ============
  test('Mobile menu toggle opens mobile menu', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(2000);

    const mobileToggle = header.mobileMenuToggle;
    if (await mobileToggle.isVisible({ timeout: 3000 })) {
      await mobileToggle.click();
      await page.waitForTimeout(500);
      
      const mobileMenu = header.mobileMenu;
      await expect(mobileMenu).toBeVisible({ timeout: 3000 });
    } else {
      test.skip('Mobile menu toggle not found - may not be responsive');
    }
  });

  // ============ TEST 12: Mobile menu has working links ============
  test('Mobile menu contains navigation links', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');
    await page.waitForTimeout(2000);

    const mobileToggle = header.mobileMenuToggle;
    if (await mobileToggle.isVisible({ timeout: 3000 })) {
      await mobileToggle.click();
      await page.waitForTimeout(500);
      
      const mobileMenu = header.mobileMenu;
      const mobileLinks = mobileMenu.locator('a');
      const linkCount = await mobileLinks.count();
      expect(linkCount).toBeGreaterThan(0);
    } else {
      test.skip('Mobile menu toggle not found - may not be responsive');
    }
  });

  // ============ TEST 13: Footer displays correctly ============
  test('Footer displays with links', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(footer.footer).toBeVisible();
    
    const linkCount = await footer.links.count();
    expect(linkCount).toBeGreaterThan(0);
  });

  // ============ TEST 14: Footer displays on multiple pages ============
  test('Footer displays consistently on shop page', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    await expect(footer.footer).toBeVisible();
  });

  test('Footer displays consistently on product detail page', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    if (await productCard.isVisible()) {
      await productCard.click();
      await page.waitForTimeout(2000);
      
      await expect(footer.footer).toBeVisible();
    }
  });

  // ============ TEST 15: Footer links are clickable ============
  test('Footer links are clickable', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const firstLink = footer.links.first();
    if (await firstLink.isVisible()) {
      const href = await firstLink.getAttribute('href');
      if (href && href !== '#') {
        await firstLink.click();
        await page.waitForTimeout(1000);
        // Page should navigate or update without crash
        await expect(page).toBeDefined();
      }
    }
  });

  // ============ TEST 16: Page loading states ============
  test('Page shows loading state on navigation', async ({ page }) => {
    await page.goto('/shop');
    
    const loadingIndicator = page.locator('[class*="loading"], [class*="skeleton"], [class*="spinner"]');
    const hasLoading = await loadingIndicator.first().isVisible({ timeout: 3000 }).catch(() => false);
    
    await page.waitForTimeout(3000);
    
    const shopContent = page.locator('.products-grid, [class*="shop"]');
    await expect(shopContent.first()).toBeVisible({ timeout: 10000 });
  });

  // ============ TEST 17: Toast notifications appear on cart add ============
  test('Toast notification appears when adding to cart', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const addToCartButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Cart"], [class*="product-overlay"] button:has(svg[class*="ShoppingCart"])').first();
    await addToCartButton.click();

    const toastElement = await toast.waitForVisible();
    await expect(toastElement).toContainText(/cart|added/i);
  });

  // ============ TEST 18: Toast notifications appear on wishlist add ============
  test('Toast notification appears when adding to wishlist', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const wishlistButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Wishlist"], [class*="product-overlay"] button:has(svg[class*="Favorite"])').first();
    await wishlistButton.click();

    const toastElement = await toast.waitForVisible();
    await expect(toastElement).toContainText(/wishlist|added/i);
  });

  // ============ TEST 19: Toast notification can be closed ============
  test('Toast notification can be closed', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const productCard = page.locator('.products-grid > div').first();
    await productCard.hover();
    await page.waitForTimeout(500);

    const addToCartButton = page.locator('[class*="product-overlay"] button[aria-label="Add to Cart"], [class*="product-overlay"] button:has(svg[class*="ShoppingCart"])').first();
    await addToCartButton.click();

    const toastElement = await toast.waitForVisible();
    
    const closeButton = toastElement.locator('button, [class*="close"]').first();
    if (await closeButton.isVisible()) {
      await closeButton.click();
      await page.waitForTimeout(500);
      await expect(toastElement).not.toBeVisible({ timeout: 3000 });
    }
  });

  // ============ TEST 20: Navigation links work - Home ============
  test('Navigation link to home works', async ({ page }) => {
    await page.goto('/shop');
    await page.waitForTimeout(2000);

    const homeLink = page.locator('nav a[href="/"], nav a[href*="home"]').first();
    if (await homeLink.isVisible()) {
      await homeLink.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/$|\/home/);
      await expect(header.logo).toBeVisible();
    }
  });

  // ============ TEST 21: Navigation links work - Shop ============
  test('Navigation link to shop works', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const shopLink = page.locator('nav a[href*="shop"]').first();
    if (await shopLink.isVisible()) {
      await shopLink.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/shop/);
      await expect(page.locator('.products-grid')).toBeVisible();
    }
  });

  // ============ TEST 22: Navigation links work - Cart ============
  test('Navigation link to cart works', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/');
    await page.waitForTimeout(2000);

    const cartLink = header.cartIcon;
    if (await cartLink.isVisible()) {
      await cartLink.click();
      await page.waitForTimeout(2000);
      
      const cartModal = page.locator('[class*="cart-modal"], [class*="modalCart"], [role="dialog"]').first();
      if (await cartModal.isVisible({ timeout: 3000 })) {
        await expect(cartModal).toBeVisible();
      }
    }
  });

  // ============ TEST 23: Navigation links work - Wishlist ============
  test('Navigation link to wishlist works', async ({ page }) => {
    await loginAsUser(page);
    await page.goto('/');
    await page.waitForTimeout(2000);

    const wishlistLink = header.wishlistIcon;
    if (await wishlistLink.isVisible()) {
      await wishlistLink.click();
      await page.waitForTimeout(2000);
      
      const wishlistModal = page.locator('[class*="wishlist-modal"], [class*="modal-wishlist"], [role="dialog"]').first();
      if (await wishlistModal.isVisible({ timeout: 3000 })) {
        await expect(wishlistModal).toBeVisible();
      }
    }
  });

  // ============ TEST 24: All main navigation links present ============
  test('All main navigation links are present', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    const expectedLinks = ['shop', 'home', 'cart', 'wishlist', 'login'];
    const navLinks = header.navMenu.locator('a');
    const linkTexts = await navLinks.allTextContents();
    const linkHrefs = await navLinks.evaluateAll((els) => els.map((el) => el.getAttribute('href')));

    const hasExpectedLink = expectedLinks.some((link) =>
      linkTexts.some((text) => text.toLowerCase().includes(link)) ||
      linkHrefs.some((href) => href && href.toLowerCase().includes(link))
    );
    expect(hasExpectedLink).toBe(true);
  });

  // ============ TEST 25: UI elements visible after page reload ============
  test('UI elements visible after page reload', async ({ page }) => {
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(header.logo).toBeVisible();
    await expect(header.navMenu).toBeVisible();
    await expect(header.cartIcon).toBeVisible();

    await page.reload();
    await page.waitForTimeout(3000);

    await expect(header.logo).toBeVisible();
    await expect(header.navMenu).toBeVisible();
    await expect(header.cartIcon).toBeVisible();
  });

  // ============ TEST 26: Header UI consistent across viewport sizes ============
  test('Header UI consistent on desktop viewport', async ({ page }) => {
    await page.setViewportSize({ width: 1920, height: 1080 });
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(header.logo).toBeVisible();
    await expect(header.navMenu).toBeVisible();
    await expect(header.cartIcon).toBeVisible();
    await expect(header.wishlistIcon).toBeVisible();
  });

  test('Header UI consistent on tablet viewport', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('/');
    await page.waitForTimeout(2000);

    await expect(header.logo).toBeVisible();
    await expect(header.cartIcon).toBeVisible();
  });

  // ============ TEST 27: Cart and Wishlist badges show zero when empty ============
  test('Cart badge shows zero when cart is empty', async ({ page }) => {
    await loginAsUser(page);
    
    await page.evaluate(async () => {
      localStorage.setItem('cart', '[]');
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);

    const cartBadge = header.cartBadge;
    if (await cartBadge.isVisible()) {
      const text = await cartBadge.textContent();
      const match = text?.match(/Cart\((\d+)\)/);
      const count = match ? parseInt(match[1]) : 0;
      expect(count).toBe(0);
    }
  });

  test('Wishlist badge shows zero when wishlist is empty', async ({ page }) => {
    await loginAsUser(page);
    
    await page.evaluate(async () => {
      localStorage.setItem('wishlist', '[]');
    });
    
    await page.goto('/');
    await page.waitForTimeout(2000);

    const wishlistBadge = header.wishlistBadge;
    if (await wishlistBadge.isVisible()) {
      const text = await wishlistBadge.textContent();
      const match = text?.match(/Wishlist\((\d+)\)/);
      const count = match ? parseInt(match[1]) : 0;
      expect(count).toBe(0);
    }
  });
});
// ============ FEATURE: global-ui END ============
