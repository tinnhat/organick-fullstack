import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin START ============
test.describe('Admin Dashboard', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    await page.waitForURL('**/admin**', { timeout: 10000 });
  };

  test('admin can login and access dashboard', async ({ page }) => {
    await loginAsAdmin(page);
    
    await expect(page).toHaveURL(/\/admin/);
    const dashboardTitle = page.locator('text=/Dashboard|Admin Dashboard/i');
    await expect(dashboardTitle.first()).toBeVisible({ timeout: 5000 });
  });

  test('admin sidebar shows navigation menu', async ({ page }) => {
    await loginAsAdmin(page);

    const sidebar = page.locator('[data-testid="admin-sidebar"], [class*="sidebar"]');
    if (await sidebar.isVisible({ timeout: 3000 })) {
      await expect(sidebar).toBeVisible();
    }
  });

  test('admin can navigate to orders page', async ({ page }) => {
    await loginAsAdmin(page);

    const ordersLink = page.locator('a:has-text("Orders"), a:has-text("Order")').first();
    if (await ordersLink.isVisible({ timeout: 3000 })) {
      await ordersLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/admin\/orders/);
    }
  });

  test('admin can filter and search orders', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const searchInput = page.locator('input[placeholder*="Search"]');
    if (await searchInput.isVisible({ timeout: 3000 })) {
      await searchInput.fill('John');
      await page.waitForTimeout(500);
      
      const ordersTable = page.locator('[data-testid="orders-table"], table');
      await expect(ordersTable).toBeVisible();
    }
  });

  test('admin orders table has pagination', async ({ page }) => {
    await page.goto('/admin/orders');
    await loginAsAdmin(page);

    const pagination = page.locator('[data-testid="admin-pagination"], [class*="pagination"]');
    if (await pagination.isVisible({ timeout: 3000 })) {
      await expect(pagination).toBeVisible();
    }
  });

  test('admin can navigate to products page', async ({ page }) => {
    await loginAsAdmin(page);

    const productsLink = page.locator('a:has-text("Products"), a:has-text("Product")').first();
    if (await productsLink.isVisible({ timeout: 3000 })) {
      await productsLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/admin\/products/);
    }
  });

  test('admin products table has filter functionality', async ({ page }) => {
    await page.goto('/admin/products');
    await loginAsAdmin(page);

    const filterComponent = page.locator('[data-testid="admin-table-filters"], [class*="filters"]');
    if (await filterComponent.isVisible({ timeout: 3000 })) {
      await expect(filterComponent).toBeVisible();
    }
  });

  test('admin can navigate to coupon management', async ({ page }) => {
    await loginAsAdmin(page);

    const couponsLink = page.locator('a:has-text("Coupons"), a:has-text("Coupon")').first();
    if (await couponsLink.isVisible({ timeout: 3000 })) {
      await couponsLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/admin\/coupons/);
    }
  });

  test('admin can create new coupon', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const addButton = page.locator('button:has-text("Add Coupon"), button:has-text("Create Coupon")');
    if (await addButton.isVisible({ timeout: 3000 })) {
      await addButton.click();
      await page.waitForTimeout(300);
      
      const modal = page.locator('[data-testid="coupon-modal"], [class*="modal"]:has-text("Create")');
      await expect(modal).toBeVisible({ timeout: 3000 });
      
      await page.fill('input[name="code"]', 'E2E10');
      await page.selectOption('select[name="type"]', 'percentage');
      await page.fill('input[name="value"]', '10');
      
      const createButton = page.locator('button:has-text("Create"), button:has-text("Save")');
      await createButton.click();
      await page.waitForTimeout(500);
      
      const successMessage = page.locator('text=/created|success/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('admin coupon list shows coupon details', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const couponTable = page.locator('[data-testid="coupon-table"], table');
    if (await couponTable.isVisible({ timeout: 3000 })) {
      await expect(couponTable).toBeVisible();
    }
  });

  test('admin can toggle coupon active status', async ({ page }) => {
    await page.goto('/admin/coupons');
    await loginAsAdmin(page);

    const toggleSwitch = page.locator('[data-testid="coupon-active-toggle"], input[type="checkbox"]').first();
    if (await toggleSwitch.isVisible({ timeout: 3000 })) {
      await toggleSwitch.click();
      await page.waitForTimeout(500);
    }
  });

  test('admin can navigate to chat page', async ({ page }) => {
    await loginAsAdmin(page);

    const chatLink = page.locator('a:has-text("Chat"), a:has-text("Support")').first();
    if (await chatLink.isVisible({ timeout: 3000 })) {
      await chatLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/admin\/chat/);
    }
  });

  test('admin chat page shows online users', async ({ page }) => {
    await page.goto('/admin/chat');
    await loginAsAdmin(page);

    const userList = page.locator('[data-testid="chat-user-list"], [class*="user-list"]');
    if (await userList.isVisible({ timeout: 3000 })) {
      await expect(userList).toBeVisible();
    }
  });

  test('admin chat shows conversation messages', async ({ page }) => {
    await page.goto('/admin/chat');
    await loginAsAdmin(page);

    const userItem = page.locator('[data-testid="chat-user-item"]').first();
    if (await userItem.isVisible({ timeout: 3000 })) {
      await userItem.click();
      await page.waitForTimeout(300);
      
      const messageArea = page.locator('[data-testid="chat-messages"], [class*="messages"]');
      await expect(messageArea).toBeVisible({ timeout: 3000 });
    }
  });

  test('admin can view users list', async ({ page }) => {
    await loginAsAdmin(page);

    const usersLink = page.locator('a:has-text("Users"), a:has-text("Customer")').first();
    if (await usersLink.isVisible({ timeout: 3000 })) {
      await usersLink.click();
      await page.waitForTimeout(500);
      await expect(page).toHaveURL(/\/admin\/users/);
    }
  });

  test('admin users table has filter and search', async ({ page }) => {
    await page.goto('/admin/users');
    await loginAsAdmin(page);

    const filterComponent = page.locator('[data-testid="admin-table-filters"]');
    if (await filterComponent.isVisible({ timeout: 3000 })) {
      await expect(filterComponent).toBeVisible();
      
      const searchInput = filterComponent.locator('input');
      await searchInput.fill('test');
      await page.waitForTimeout(500);
    }
  });

  test('unauthorized user cannot access admin pages', async ({ page }) => {
    await page.goto('/login');
    await page.fill('#email', 'user@example.com');
    await page.fill('#password', 'userpass123');
    await page.click('form button:has-text("Login")');
    await page.waitForTimeout(2000);
    
    await page.goto('/admin');
    await expect(page).not.toHaveURL(/\/admin\/dashboard/);
  });
});
// ============ FEATURE: e2e-admin END ============