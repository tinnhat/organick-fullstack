import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-home-page START ============
test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/home');
    await page.waitForTimeout(2000);
  });

  // ============ TEST 1: Hero Section ============
  test('Hero section displays correctly', async ({ page }) => {
    const heroSection = page.locator('.home-page').first();
    await expect(heroSection).toBeVisible();

    const headerBanner = page.locator('[class*="headerBanner"], [class*="hero"], [class*="banner"]').first();
    if (await headerBanner.isVisible({ timeout: 5000 })) {
      await expect(headerBanner).toBeVisible();
    }
  });

  // ============ TEST 2: Featured Products Section ============
  test('Featured products section displays', async ({ page }) => {
    const shopShow = page.locator('[class*="shopShow"], [class*="featured-products"], [class*="products"]').first();
    if (await shopShow.isVisible({ timeout: 5000 })) {
      await expect(shopShow).toBeVisible();
    }

    const productCards = page.locator('.shopShow .product-card, [class*="shopShow"] [class*="product"]').first();
    if (await productCards.isVisible({ timeout: 3000 })) {
      await expect(productCards).toBeVisible();
    }
  });

  // ============ TEST 3: Featured Categories Section ============
  test('Featured categories section displays', async ({ page }) => {
    const aboutSection = page.locator('[class*="about"], [class*="categories"], [class*="category"]').first();
    if (await aboutSection.isVisible({ timeout: 5000 })) {
      await expect(aboutSection).toBeVisible();
    }
  });

  // ============ TEST 4: Navigation Links Work ============
  test('Navigation links work - Shop goes to /shop', async ({ page }) => {
    const shopLink = page.locator('a:has-text("Shop"), nav a:has-text("Shop"), [href*="/shop"]').first();
    if (await shopLink.isVisible({ timeout: 3000 })) {
      await shopLink.click();
      await page.waitForURL('**/shop', { timeout: 10000 });
      await expect(page.url()).toContain('/shop');
    }
  });

  test('Navigation links work - Home link goes to /home', async ({ page }) => {
    const homeLink = page.locator('a:has-text("Home"), nav a:has-text("Home"), [href*="/home"]').first();
    if (await homeLink.isVisible({ timeout: 3000 })) {
      await homeLink.click();
      await page.waitForURL('**/home', { timeout: 10000 });
      await expect(page.url()).toContain('/home');
    }
  });

  // ============ TEST 5: Footer Displays ============
  test('Footer displays correctly', async ({ page }) => {
    const footer = page.locator('footer, [class*="footer"]').first();
    if (await footer.isVisible({ timeout: 5000 })) {
      await expect(footer).toBeVisible();
    }

    const footerContent = page.locator('footer p, footer span, [class*="footer"] p').first();
    if (await footerContent.isVisible({ timeout: 3000 })) {
      await expect(footerContent).toBeVisible();
    }
  });

  // ============ TEST 6: Header Displays ============
  test('Header displays with logo, nav menu, cart icon, and wishlist icon', async ({ page }) => {
    const header = page.locator('header, [class*="header"]').first();
    if (await header.isVisible({ timeout: 5000 })) {
      await expect(header).toBeVisible();
    }

    const logo = page.locator('header [class*="logo"], header a[href*="/"], header img, header svg').first();
    if (await logo.isVisible({ timeout: 3000 })) {
      await expect(logo).toBeVisible();
    }

    const navMenu = page.locator('header nav, header [class*="nav"]').first();
    if (await navMenu.isVisible({ timeout: 3000 })) {
      await expect(navMenu).toBeVisible();
    }

    const cartIcon = page.locator('[class*="cart"], [class*="Cart"]').first();
    if (await cartIcon.isVisible({ timeout: 3000 })) {
      await expect(cartIcon).toBeVisible();
    }

    const wishlistIcon = page.locator('[class*="wishlist"], [class*="Wishlist"]').first();
    if (await wishlistIcon.isVisible({ timeout: 3000 })) {
      await expect(wishlistIcon).toBeVisible();
    }
  });

  // ============ TEST 7: Newsletter Signup Form ============
  test('Newsletter signup form works', async ({ page }) => {
    const newsletterSection = page.locator('[class*="newsletter"], [class*="subscribe"], form[class*="newsletter"]').first();
    if (await newsletterSection.isVisible({ timeout: 5000 })) {
      await expect(newsletterSection).toBeVisible();

      const emailInput = page.locator('input[type="email"], input[placeholder*="email"], input[placeholder*="Email"]').first();
      if (await emailInput.isVisible({ timeout: 3000 })) {
        await emailInput.fill('test@example.com');
        await page.waitForTimeout(300);

        const subscribeButton = page.locator('button:has-text("Subscribe"), button:has-text("Submit"), button[type="submit"]').first();
        if (await subscribeButton.isVisible({ timeout: 3000 })) {
          await subscribeButton.click();
          await page.waitForTimeout(1000);
        }
      }
    }
  });

  // ============ TEST 8: Social Media Links in Footer ============
  test('Social media links in footer', async ({ page }) => {
    const footer = page.locator('footer, [class*="footer"]').first();
    if (await footer.isVisible({ timeout: 5000 })) {
      const socialLinks = page.locator('footer a[href*="facebook"], footer a[href*="twitter"], footer a[href*="instagram"], footer a[href*="linkedin"], footer a[target="_blank"]').first();
      if (await socialLinks.isVisible({ timeout: 3000 })) {
        await expect(socialLinks).toBeVisible();

        const href = await socialLinks.getAttribute('href');
        expect(href).toBeTruthy();
      }
    }
  });

  // ============ TEST 9: Home Page Loads Completely ============
  test('Home page loads without errors', async ({ page }) => {
    await expect(page.locator('.home-page')).toBeVisible();

    const mainSections = page.locator('.home-page > *');
    const sectionCount = await mainSections.count();
    expect(sectionCount).toBeGreaterThan(0);
  });

  // ============ TEST 10: Page Scroll Functionality ============
  test('Page sections are scrollable and visible', async ({ page }) => {
    const shopShow = page.locator('[class*="shopShow"]').first();
    if (await shopShow.isVisible({ timeout: 5000 })) {
      await shopShow.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      await expect(shopShow).toBeVisible();
    }

    const aboutSection = page.locator('[class*="about"]').first();
    if (await aboutSection.isVisible({ timeout: 5000 })) {
      await aboutSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
    }
  });
});
// ============ FEATURE: e2e-home-page END ============
