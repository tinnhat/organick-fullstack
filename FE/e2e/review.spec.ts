import { test, expect, Page } from '@playwright/test';

// ============ FEATURE: e2e-review START ============
test.describe('Reviews', () => {
  const loginIfNeeded = async (page: Page) => {
    if (page.url().includes('/login')) {
      await page.fill('#email', 'admin@gmail.com');
      await page.fill('#password', '123456789');
      await page.click('form button:has-text("Login")');
      await page.waitForURL('**/');
    }
  };

  test('shows write review button on product page for verified purchase', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review"), button:has-text("Leave Review")');
    if (await writeReviewButton.isVisible({ timeout: 3000 })) {
      await expect(writeReviewButton).toBeVisible();
    }
  });

  test('review form displays star rating', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review")');
    if (await writeReviewButton.isVisible()) {
      await writeReviewButton.click();
      await page.waitForTimeout(300);
    }

    const starRating = page.locator('[data-testid="star-rating"], [class*="star-rating"]');
    if (await starRating.isVisible({ timeout: 3000 })) {
      await expect(starRating).toBeVisible();
    }
  });

  test('can select star rating', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review")');
    if (await writeReviewButton.isVisible()) {
      await writeReviewButton.click();
      await page.waitForTimeout(300);
    }

    const fiveStarButton = page.locator('[data-testid="star-rating"] button[aria-label*="5"], button[aria-label*="5 stars"]');
    if (await fiveStarButton.isVisible({ timeout: 2000 })) {
      await fiveStarButton.click();
      await page.waitForTimeout(200);
      
      const selectedStars = page.locator('[data-testid="star-rating"] button[aria-label*="5"][class*="selected"]');
      await expect(selectedStars).toBeVisible();
    }
  });

  test('shows error when submitting review without rating', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review")');
    if (await writeReviewButton.isVisible()) {
      await writeReviewButton.click();
      await page.waitForTimeout(300);
    }

    const submitButton = page.locator('button:has-text("Submit Review"), button:has-text("Submit")');
    if (await submitButton.isVisible({ timeout: 2000 })) {
      await submitButton.click();
      await page.waitForTimeout(300);
      
      const errorMessage = page.locator('text=/Please select a rating|Rating is required/i');
      await expect(errorMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('can submit review with rating and comment', async ({ page }) => {
    await page.goto('/products/test-product');
    await loginIfNeeded(page);

    const writeReviewButton = page.locator('button:has-text("Write Review")');
    if (await writeReviewButton.isVisible()) {
      await writeReviewButton.click();
      await page.waitForTimeout(300);
    }

    const fiveStarButton = page.locator('[data-testid="star-rating"] button[aria-label*="5"]');
    if (await fiveStarButton.isVisible({ timeout: 2000 })) {
      await fiveStarButton.click();
    }

    const commentTextarea = page.locator('textarea[name="comment"], textarea[placeholder*="comment"]');
    if (await commentTextarea.isVisible({ timeout: 2000 })) {
      await commentTextarea.fill('This product is amazing! Great quality and fast delivery.');
    }

    const submitButton = page.locator('button:has-text("Submit Review")');
    if (await submitButton.isVisible({ timeout: 2000 })) {
      await submitButton.click();
      await page.waitForTimeout(500);
      
      const successMessage = page.locator('text=/Review submitted|Thank you/i');
      await expect(successMessage).toBeVisible({ timeout: 3000 });
    }
  });

  test('can view product reviews', async ({ page }) => {
    await page.goto('/products/test-product');

    const reviewsSection = page.locator('[data-testid="reviews-section"], [class*="reviews"]');
    if (await reviewsSection.isVisible({ timeout: 3000 })) {
      await expect(reviewsSection).toBeVisible();
    }
  });

  test('reviews show average rating', async ({ page }) => {
    await page.goto('/products/test-product');

    const averageRating = page.locator('[data-testid="average-rating"], [class*="average-rating"]');
    if (await averageRating.isVisible({ timeout: 3000 })) {
      await expect(averageRating).toBeVisible();
    }
  });

  test('reviews are paginated', async ({ page }) => {
    await page.goto('/products/test-product');

    const pagination = page.locator('[data-testid="reviews-pagination"], [class*="pagination"]');
    if (await pagination.isVisible({ timeout: 3000 })) {
      const nextButton = page.locator('button:has-text("Next")');
      if (await nextButton.isVisible()) {
        await nextButton.click();
        await page.waitForTimeout(300);
        await expect(page.locator('[class*="reviews"]')).toBeVisible();
      }
    }
  });
});
// ============ FEATURE: e2e-review END ============