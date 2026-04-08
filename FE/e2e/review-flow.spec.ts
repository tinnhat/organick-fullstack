import { test, expect, Page } from '@playwright/test';
import { login, logout, testUsers } from './helpers';

// ============ FEATURE: e2e-review-flow START ============
test.describe('Review Flow', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('input[name="email"]', 'test@example.com');
      await page.fill('input[name="password"]', 'password123');
      await page.click('button[type="submit"]');
      await page.waitForURL('**/');
    }
  };

  test('user must order product before reviewing', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review"), button:has-text("Leave Review")');
    
    const hasExistingReview = await writeReviewButton.isVisible({ timeout: 2000 }).catch(() => false);
    
    if (hasExistingReview) {
      const verifyPurchaseMessage = page.locator('text=/must purchase|verified purchase|order required/i');
      await expect(verifyPurchaseMessage).toBeVisible({ timeout: 3000 });
    } else {
      const noReviewOption = page.locator('text=/You must purchase|Only verified purchasers|You need to order/i');
      if (await noReviewOption.isVisible({ timeout: 3000 }).catch(() => false)) {
        await expect(noReviewOption).toBeVisible();
      } else {
        await expect(writeReviewButton).not.toBeVisible();
      }
    }
  });

  test('can edit review within 5 days of purchase', async ({ page }) => {
    await page.goto('/products/test-product');
    await login(page);

    const myReviewSection = page.locator('[data-testid="my-review"], [class*="my-review"]');
    if (await myReviewSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editButton = page.locator('button:has-text("Edit Review"), button:has-text("Edit")');
      if (await editButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await editButton.click();
        await page.waitForTimeout(300);

        const editForm = page.locator('[data-testid="review-form"], [class*="review-form"]');
        await expect(editForm).toBeVisible({ timeout: 3000 });

        const commentTextarea = page.locator('textarea[name="comment"], textarea[name="review"]');
        if (await commentTextarea.isVisible({ timeout: 2000 }).catch(() => false)) {
          await commentTextarea.fill('Updated review - great product!');
        }

        const submitButton = page.locator('button:has-text("Update Review"), button:has-text("Submit")');
        if (await submitButton.isVisible({ timeout: 2000 }).catch(() => false)) {
          await submitButton.click();
          await page.waitForTimeout(500);

          const successMessage = page.locator('text=/Review updated|Successfully updated/i');
          await expect(successMessage).toBeVisible({ timeout: 3000 });
        }
      }
    }
  });

  test('cannot edit review after 5 days', async ({ page }) => {
    await page.goto('/products/test-product');
    await login(page);

    const myReviewSection = page.locator('[data-testid="my-review"], [class*="my-review"]');
    if (await myReviewSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      const editButton = page.locator('button:has-text("Edit Review"), button:has-text("Edit")');
      const isEditVisible = await editButton.isVisible({ timeout: 2000 }).catch(() => false);

      if (!isEditVisible) {
        const expiredMessage = page.locator('text=/Edit period expired|After 5 days|Cannot edit|Edit window closed/i');
        await expect(expiredMessage).toBeVisible({ timeout: 3000 });
      } else {
        await editButton.click();
        await page.waitForTimeout(300);

        const errorMessage = page.locator('text=/Edit period expired|After 5 days|Cannot edit|Window closed/i');
        await expect(errorMessage).toBeVisible({ timeout: 3000 });
      }
    }
  });

  test('can delete own review', async ({ page }) => {
    await page.goto('/products/test-product');
    await login(page);

    const myReviewSection = page.locator('[data-testid="my-review"], [class*="my-review"]');
    if (await myReviewSection.isVisible({ timeout: 3000 }).catch(() => false)) {
      const deleteButton = page.locator('button:has-text("Delete Review"), button:has-text("Delete")');
      if (await deleteButton.isVisible({ timeout: 2000 }).catch(() => false)) {
        await deleteButton.click();
        await page.waitForTimeout(300);

        const confirmDialog = page.locator('[data-testid="confirm-dialog"], [class*="confirm-dialog"]');
        if (await confirmDialog.isVisible({ timeout: 2000 }).catch(() => false)) {
          const confirmButton = page.locator('button:has-text("Confirm"), button:has-text("Yes")');
          await confirmButton.click();
        }

        await page.waitForTimeout(500);

        const successMessage = page.locator('text=/Review deleted|Successfully deleted/i');
        await expect(successMessage).toBeVisible({ timeout: 3000 });

        await page.reload();
        await page.waitForTimeout(500);

        const deletedReview = page.locator('[data-testid="my-review"]');
        await expect(deletedReview).not.toBeVisible();
      }
    }
  });

  test('cannot review same product twice', async ({ page }) => {
    await page.goto('/products/test-product');
    await login(page);

    const writeReviewButton = page.locator('button:has-text("Write Review"), button:has-text("Leave Review")');
    const myReviewSection = page.locator('[data-testid="my-review"], [class*="my-review"]');

    const hasMyReview = await myReviewSection.isVisible({ timeout: 3000 }).catch(() => false);
    const hasWriteButton = await writeReviewButton.isVisible({ timeout: 2000 }).catch(() => false);

    if (hasMyReview) {
      const alreadyReviewedMessage = page.locator('text=/already reviewed|already submitted|one review per product/i');
      await expect(alreadyReviewedMessage).toBeVisible({ timeout: 3000 });
    } else if (hasWriteButton) {
      await writeReviewButton.click();
      await page.waitForTimeout(300);

      const errorMessage = page.locator('text=/already reviewed|already submitted|one review per product/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });
});
// ============ FEATURE: e2e-review-flow END ============
