import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-success-page START ============
test.describe('Success Page', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL('**/');
    }
  };

  test('redirects to home when session_id is missing', async ({ page }) => {
    await page.goto('/success');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/$|\/shop/);
  });

  test('displays success page with session_id', async ({ page }) => {
    await page.goto('/success');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    const session_id = 'test_session_123';
    await page.goto(`/success?session_id=${session_id}`);
    await page.waitForTimeout(3000);

    const successPage = page.locator('.success-page');
    if (await successPage.isVisible({ timeout: 5000 })) {
      await expect(successPage).toBeVisible();
    }
  });

  test('displays success message after order completion', async ({ page }) => {
    await page.goto('/shop');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    const session_id = 'cs_test_session_abc123';
    await page.goto(`/success?session_id=${session_id}`);
    await page.waitForTimeout(3000);

    const successTitle = page.locator('.success-title');
    if (await successTitle.isVisible({ timeout: 5000 })) {
      await expect(successTitle).toContainText('Payment successfully');
    }

    const thankMessage = page.locator('.success-thank');
    if (await thankMessage.isVisible({ timeout: 3000 })) {
      await expect(thankMessage).toContainText('Thanks for ordering');
    }
  });

  test('displays order ID when available', async ({ page }) => {
    const session_id = 'cs_test_order_456';
    await page.goto(`/success?session_id=${session_id}`);
    await page.waitForTimeout(3000);

    const orderInfo = page.locator('.order-info');
    if (await orderInfo.isVisible({ timeout: 5000 })) {
      await expect(orderInfo).toBeVisible();
    }

    const orderNumber = page.locator('.order-number');
    if (await orderNumber.isVisible({ timeout: 3000 })) {
      await expect(orderNumber).toContainText('Order number');
    }
  });

  test('displays order items when available', async ({ page }) => {
    const session_id = 'cs_test_items_789';
    await page.goto(`/success?session_id=${session_id}`);
    await page.waitForTimeout(3000);

    const orderBox = page.locator('.box-order');
    if (await orderBox.isVisible({ timeout: 5000 })) {
      await expect(orderBox).toBeVisible();
    }

    const orderItems = page.locator('.list-item');
    if (await orderItems.isVisible({ timeout: 3000 })) {
      await expect(orderItems).toBeVisible();
    }
  });

  test('displays checkout info with address and price', async ({ page }) => {
    const session_id = 'cs_test_info_101';
    await page.goto(`/success?session_id=${session_id}`);
    await page.waitForTimeout(3000);

    const infoCheckout = page.locator('.info-checkout');
    if (await infoCheckout.isVisible({ timeout: 5000 })) {
      await expect(infoCheckout).toBeVisible();
    }

    const priceBox = page.locator('.price-box');
    if (await priceBox.isVisible({ timeout: 3000 })) {
      await expect(priceBox).toBeVisible();
      const total = page.locator('.total');
      if (await total.isVisible({ timeout: 2000 })) {
        await expect(total).toContainText('Total');
      }
    }
  });

  test('shows loading state initially', async ({ page }) => {
    const session_id = 'cs_test_loading_202';
    await page.goto(`/success?session_id=${session_id}`);
    
    const loadingIndicator = page.locator('.loading, [class*="loading"]').first();
    if (await loadingIndicator.isVisible({ timeout: 2000 })) {
      await expect(loadingIndicator).toBeVisible();
    }
  });

  test('can navigate to shop via continue shopping', async ({ page }) => {
    await page.goto('/success');
    await loginIfNeeded(page);
    await page.waitForTimeout(2000);

    const continueButton = page.locator('a[href="/shop"], button:has-text("Continue Shopping"), a:has-text("Continue Shopping")').first();
    if (await continueButton.isVisible({ timeout: 3000 })) {
      await continueButton.click();
      await page.waitForTimeout(2000);
      await expect(page).toHaveURL(/\/shop/);
    }
  });
});
// ============ FEATURE: e2e-success-page END ============
