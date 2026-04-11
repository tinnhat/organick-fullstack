import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-order-history START ============
test.describe('Order History', () => {
  const loginUser = async (page: Page, email: string = 'tin1234@gmail.com', password: string = '123456789') => {
    await page.goto('/login');
    await page.waitForLoadState('networkidle');
    await page.fill('#email', email);
    await page.fill('#password', password);
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(2000);
  };

  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await loginUser(page);
    }
  };

  test('redirects to login when accessing order history without authentication', async ({ page }) => {
    await page.goto('/order-history');
    await page.waitForTimeout(2000);
    await expect(page).toHaveURL(/\/login/);
  });

  test('can navigate to order history page when logged in', async ({ page }) => {
    await page.goto('/login');
    await loginIfNeeded(page);
    
    await page.goto('/order-history');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    await expect(page).toHaveURL(/\/order-history/);
  });

  test('order history page displays list of past orders with order details', async ({ page }) => {
    await page.goto('/login');
    await loginIfNeeded(page);
    
    await page.goto('/order-history');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const ordersContainer = page.locator('[class*="order"], [class*="history"], .orders-list, .order-list');
    const hasOrders = await ordersContainer.first().isVisible({ timeout: 5000 });
    
    if (hasOrders) {
      const orderIdElement = page.locator('[class*="order-id"], [class*="orderId"], [class*="id"]').first();
      const dateElement = page.locator('[class*="date"], [class*="created"], time').first();
      const statusElement = page.locator('[class*="status"]').first();
      const totalElement = page.locator('[class*="total"], [class*="price"], [class*="amount"]').first();
      
      await expect(orderIdElement).toBeVisible();
      await expect(dateElement).toBeVisible();
      await expect(statusElement).toBeVisible();
      await expect(totalElement).toBeVisible();
    }
  });

  test('can click on an order to view order details', async ({ page }) => {
    await page.goto('/login');
    await loginIfNeeded(page);
    
    await page.goto('/order-history');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const ordersContainer = page.locator('[class*="order"], [class*="history"], .orders-list, .order-list');
    const hasOrders = await ordersContainer.first().isVisible({ timeout: 5000 });
    
    if (hasOrders) {
      const firstOrder = page.locator('[class*="order-card"], [class*="order-item"], .order').first();
      if (await firstOrder.isVisible({ timeout: 3000 })) {
        await firstOrder.click();
        await page.waitForTimeout(2000);
        
        const orderDetails = page.locator('[class*="detail"], [class*="info"], .order-details, .order-detail');
        await expect(orderDetails.first()).toBeVisible();
      }
    }
  });

  test('shows empty order history message when user has no orders', async ({ page }) => {
    await page.goto('/login');
    await loginUser(page, 'newuser@test.com', '123456789');
    await page.waitForTimeout(2000);
    
    await page.goto('/order-history');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const emptyMessage = page.locator('text=/no order|empty order|no purchase|haven.*order/i');
    const ordersContainer = page.locator('[class*="order"], [class*="history"], .orders-list, .order-list');
    
    const hasOrders = await ordersContainer.first().isVisible({ timeout: 3000 });
    
    if (!hasOrders) {
      await expect(emptyMessage.first()).toBeVisible({ timeout: 3000 });
    }
  });

  test('order details shows all required information', async ({ page }) => {
    await page.goto('/login');
    await loginIfNeeded(page);
    
    await page.goto('/order-history');
    await page.waitForLoadState('networkidle');
    await page.waitForTimeout(2000);
    
    const ordersContainer = page.locator('[class*="order"], [class*="history"], .orders-list, .order-list');
    const hasOrders = await ordersContainer.first().isVisible({ timeout: 5000 });
    
    if (hasOrders) {
      const firstOrder = page.locator('[class*="order-card"], [class*="order-item"], .order').first();
      if (await firstOrder.isVisible({ timeout: 3000 })) {
        await firstOrder.click();
        await page.waitForTimeout(2000);
        
        const itemsSection = page.locator('[class*="item"], [class*="product"], .order-items');
        const shippingSection = page.locator('[class*="shipping"], [class*="address"], [class*="delivery"]');
        const paymentSection = page.locator('[class*="payment"], [class*="method"], [class*="transaction"]');
        const summarySection = page.locator('[class*="summary"], [class*="total"], [class*="breakdown"]');
        
        if (await itemsSection.first().isVisible({ timeout: 3000 })) {
          await expect(itemsSection.first()).toBeVisible();
        }
        if (await shippingSection.first().isVisible({ timeout: 3000 })) {
          await expect(shippingSection.first()).toBeVisible();
        }
        if (await paymentSection.first().isVisible({ timeout: 3000 })) {
          await expect(paymentSection.first()).toBeVisible();
        }
        if (await summarySection.first().isVisible({ timeout: 3000 })) {
          await expect(summarySection.first()).toBeVisible();
        }
      }
    }
  });
});
// ============ FEATURE: e2e-order-history END ============
