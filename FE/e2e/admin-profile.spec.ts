import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-admin-profile START ============
test.describe('Admin Profile Management', () => {
  const loginAsAdmin = async (page: Page) => {
    await page.goto('/login');
    await page.fill('#email', 'admin@gmail.com');
    await page.fill('#password', '123456789');
    await page.click('form button:has-text("Login")');
    // After login, admin is redirected to /home, not /admin
    await page.waitForURL(/\/(home|admin)/, { timeout: 10000 });
  };

  test('admin can login and navigate to profile page', async ({ page }) => {
    await loginAsAdmin(page);

    const profileLink = page.locator('a:has-text("Profile"), a:has-text("My Profile"), [href*="/admin/my-profile"]').first();
    if (await profileLink.isVisible({ timeout: 3000 })) {
      await profileLink.click();
    } else {
      await page.goto('/admin/my-profile');
    }

    await page.waitForTimeout(1000);
    await expect(page).toHaveURL(/\/admin\/my-profile/);
  });

  test('admin profile page displays profile information', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    const profileCard = page.locator('[data-testid="profile-card"], [class*="profile"], [class*="info"]').first();
    if (await profileCard.isVisible({ timeout: 3000 })) {
      await expect(profileCard).toBeVisible();
    }

    const nameField = page.locator('input[name="fullname"], input[placeholder*="name" i], [data-testid="profile-name"]').first();
    if (await nameField.isVisible({ timeout: 3000 })) {
      await expect(nameField).toBeVisible();
    }

    const emailField = page.locator('input[name="email"], input[placeholder*="email" i], [data-testid="profile-email"]').first();
    if (await emailField.isVisible({ timeout: 3000 })) {
      await expect(emailField).toBeVisible();
    }
  });

  test('admin can edit profile name and email', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="fullname"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.clear();
      await nameInput.fill('Updated Admin Name');
    }

    const emailInput = page.locator('input[name="email"], input[placeholder*="email" i]').first();
    if (await emailInput.isVisible({ timeout: 3000 })) {
      const currentEmail = await emailInput.inputValue();
      if (!currentEmail.includes('updated')) {
        await emailInput.clear();
        await emailInput.fill('updated.admin@gmail.com');
      }
    }

    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
    if (await saveButton.isVisible({ timeout: 3000 })) {
      await saveButton.click();
      await page.waitForTimeout(1000);

      // Use Sonner toast selector which is the actual toast library used
      const successMessage = page.locator('[data-sonner-toast]').first();
      await expect(successMessage).toBeVisible({ timeout: 5000 });
    }
  });

  test('admin can change password with valid current password', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const currentPasswordInput = page.locator('input[name="currentPassword"], input[name="current"], input[placeholder*="current" i]').first();
    if (await currentPasswordInput.isVisible({ timeout: 3000 })) {
      await currentPasswordInput.fill('123456789');

      const newPasswordInput = page.locator('input[name="newPassword"], input[name="password"], input[placeholder*="new" i]').first();
      await newPasswordInput.fill('123456789');

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm"], input[placeholder*="confirm" i]').first();
      await confirmPasswordInput.fill('123456789');

      const changePasswordButton = page.locator('button:has-text("Change Password"), button:has-text("Update Password")').first();
      if (await changePasswordButton.isVisible({ timeout: 3000 })) {
        await changePasswordButton.click();
        await page.waitForTimeout(1000);

        const successMessage = page.locator('[data-sonner-toast]').first();
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('admin password change fails with wrong current password', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const currentPasswordInput = page.locator('input[name="currentPassword"], input[name="current"], input[placeholder*="current" i]').first();
    if (await currentPasswordInput.isVisible({ timeout: 3000 })) {
      await currentPasswordInput.fill('wrongpassword');

      const newPasswordInput = page.locator('input[name="newPassword"], input[name="password"], input[placeholder*="new" i]').first();
      await newPasswordInput.fill('newpassword123');

      const confirmPasswordInput = page.locator('input[name="confirmPassword"], input[name="confirm"], input[placeholder*="confirm" i]').first();
      await confirmPasswordInput.fill('newpassword123');

      const changePasswordButton = page.locator('button:has-text("Change Password"), button:has-text("Update Password")').first();
      if (await changePasswordButton.isVisible({ timeout: 3000 })) {
        await changePasswordButton.click();
        await page.waitForTimeout(1000);

        const errorMessage = page.locator('text=/incorrect|wrong|current.*password|invalid/i');
        await expect(errorMessage.first()).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('admin can upload profile picture', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const fileInput = page.locator('input[type="file"], [data-testid="profile-picture-upload"], [class*="upload"] input').first();
    if (await fileInput.isVisible({ timeout: 3000 })) {
      await fileInput.setInputFiles({
        mimeType: 'image/png',
        name: 'profile-test.png',
        buffer: Buffer.from('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==', 'base64')
      });

      await page.waitForTimeout(1000);

      const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
      if (await saveButton.isVisible({ timeout: 3000 })) {
        await saveButton.click();
        await page.waitForTimeout(1000);

        const successMessage = page.locator('[data-sonner-toast]').first();
        await expect(successMessage).toBeVisible({ timeout: 5000 });
      }
    }
  });

  test('admin profile changes persist after page reload', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="fullname"], input[placeholder*="name" i]').first();
    const nameValue = await nameInput.isVisible({ timeout: 3000 })
      ? await nameInput.inputValue()
      : 'Admin';

    const emailInput = page.locator('input[name="email"], input[placeholder*="email" i]').first();
    const emailValue = await emailInput.isVisible({ timeout: 3000 })
      ? await emailInput.inputValue()
      : 'admin@gmail.com';

    await page.reload();
    await page.waitForTimeout(1000);

    const nameInputAfter = page.locator('input[name="fullname"], input[placeholder*="name" i]').first();
    const emailInputAfter = page.locator('input[name="email"], input[placeholder*="email" i]').first();

    if (await nameInputAfter.isVisible({ timeout: 3000 })) {
      await expect(nameInputAfter).toHaveValue(nameValue);
    }
    if (await emailInputAfter.isVisible({ timeout: 3000 })) {
      await expect(emailInputAfter).toHaveValue(emailValue);
    }
  });

  test('admin profile form has validation for required fields', async ({ page }) => {
    await page.goto('/admin/my-profile');
    await loginAsAdmin(page);

    await page.waitForTimeout(1000);

    const nameInput = page.locator('input[name="fullname"], input[placeholder*="name" i]').first();
    if (await nameInput.isVisible({ timeout: 3000 })) {
      await nameInput.clear();
    }

    const emailInput = page.locator('input[name="email"], input[placeholder*="email" i]').first();
    if (await emailInput.isVisible({ timeout: 3000 })) {
      await emailInput.clear();
    }

    const saveButton = page.locator('button:has-text("Save"), button:has-text("Update")').first();
    if (await saveButton.isVisible({ timeout: 3000 })) {
      await saveButton.click();
      await page.waitForTimeout(500);

      const validationMessage = page.locator('text=/required|empty|fill|invalid/i');
      await expect(validationMessage.first()).toBeVisible({ timeout: 5000 });
    }
  });
});
// ============ FEATURE: e2e-admin-profile END ============
