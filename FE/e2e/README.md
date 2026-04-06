# E2E Tests - Organick Fullstack

## Overview
End-to-end tests for the Organick E-commerce application using Playwright.

## Test Coverage

### 1. Auth (`auth.spec.ts`)
- User login with valid credentials
- User logout
- Error handling for invalid credentials
- Protected route redirection

### 2. Shop (`shop.spec.ts`)
- Product grid display
- Category filtering
- Search functionality
- Add to cart
- Product sorting (price, newest, popular)
- Price range filter
- Pagination

### 3. Checkout (`checkout.spec.ts`)
- Apply valid coupon
- Error handling for invalid coupons
- Minimum order requirement error
- Remove applied coupon
- Cart items display
- Proceed to payment

### 4. Chat (`chat.spec.ts`)
- Chat button visibility
- Open/close chat modal
- Online status indicator
- Send message
- Typing indicator
- Message display

### 5. Reviews (`review.spec.ts`)
- Write review button visibility
- Star rating selection
- Form validation
- Submit review
- View reviews list
- Review pagination
- Average rating display

### 6. Notifications (`notification.spec.ts`)
- Notification bell visibility
- Unread count badge
- Open notification panel
- Notification list display
- Order status change notification
- Chat message notification
- Mark as read (single/all)
- Toast notifications

### 7. Admin (`admin.spec.ts`)
- Admin login and dashboard access
- Sidebar navigation
- Orders management
- Orders filter and search
- Products management
- Coupon CRUD operations
- Chat page with online users
- Users management
- Unauthorized access blocking

## Setup

### 1. Install Dependencies
```bash
cd FE
npm install
npx playwright install
```

### 2. Configure Environment
Create `FE/.env` file:
```env
NEXT_PUBLIC_API_URL=http://localhost:3001/api/v1
NEXT_PUBLIC_SOCKET_URL=http://localhost:3001
```

### 3. Run Tests

#### Run all tests
```bash
cd FE
npm run test:e2e
```

#### Run specific test file
```bash
npx playwright test auth.spec.ts
```

#### Run with UI
```bash
npx playwright test --headed
```

#### Run specific test
```bash
npx playwright test auth.spec.ts --grep "user can login"
```

#### Debug mode
```bash
npx playwright test --debug
```

## Configuration

Edit `playwright.config.ts` to modify:
- Test timeout
- Retry attempts
- Screenshot/video settings
- Base URL
- Browser targets

## Helper Functions

Available in `helpers.ts`:
- `login(page, userType)` - Login as regular or admin user
- `logout(page)` - Logout current user
- `waitForLoading(page, timeout)` - Wait for loading states
- `clickButtonByText(page, text)` - Click button by text content

## Adding New Tests

1. Create new spec file in `FE/e2e/`
2. Import base test utilities
3. Use `test.describe` to group related tests
4. Use `test.beforeEach` for common setup
5. Follow the FEATURE comment convention:
```typescript
// ============ FEATURE: e2e-feature-name START ============
// ... tests ...
// ============ FEATURE: e2e-feature-name END ============
```

## Best Practices

1. **Login**: Use `loginIfNeeded` helper in each test
2. **Selectors**: Use `data-testid` attributes when available
3. **Assertions**: Always use `expect` with meaningful messages
4. **Timeouts**: Use reasonable timeouts (default 30s)
5. **Cleanup**: Let tests be independent, avoid dependencies
6. **Screenshots**: Configured to capture on failure

## Troubleshooting

### Tests fail with "Element not found"
- Check if page is still loading
- Use `waitForSelector` instead of assuming element exists
- Verify element is in viewport

### Socket connection errors
- Ensure backend server is running on configured port
- Check CORS settings in backend
- Verify environment variables

### Authentication errors
- Verify test user credentials match actual users
- Check if login endpoint changed
- Ensure cookies are being set properly

## CI/CD Integration

For GitHub Actions or other CI:
```yaml
- name: Run E2E Tests
  run: npx playwright test --reporter=html
- name: Upload artifacts
  if: failure()
  uses: actions/upload-artifact@v2
  with:
    name: playwright-report
    path: playwright-report/
```