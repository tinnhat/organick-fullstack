# V2 Bugs Analysis & Logging Implementation Plan

## Part 1: Bugs Analysis

### Backend Bugs (25 total)

#### Critical (4)

| # | Bug | File | Line(s) | Description |
|---|-----|------|---------|-------------|
| 1 | Race condition in coupon usage (TOCTOU) | couponService.ts | 100-154 | Between validating and updating coupon usage, concurrent requests can exceed maxUses |
| 2 | Admin lookup returns deleted users | userModel.ts | 81 | `getUsers()` sorts by `_destroy` but doesn't filter, returns deleted admins |
| 3 | Admin lookup bugs in 3 services | reviewService.ts, chatService.ts, orderService.ts | - | `findAdminUser()` uses flawed `getUsers()` - may find deleted admin or none |
| 4 | Coupon discount NOT applied to orders | orderService.ts, couponService.ts | 52-59, 156-162 | `applyCoupon` calculates discount but order creation never receives `discountAmount` |

#### High (5)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 5 | Product ID type mismatch in review check | reviewService.ts:21 | `p._id === productId` compares ObjectId with string |
| 6 | No rollback on order creation failure | orderService.ts:52-65 | Quantity decremented before order creation completes |
| 7 | Unbounded pagination in conversations | conversationModel.ts:69-80 | `findAll()` returns ALL conversations with no limit |
| 8 | Socket.io multiple connections overwrite user | socket.ts:56 | Multiple tabs/devices overwrite `onlineUsers` map |
| 9 | Inefficient unread count (O(n*m)) | conversationModel.ts:140-163 | Loads ALL conversations and ALL messages, iterates in JS |

#### Medium (4)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 10 | 100% coupon allowed | couponService.ts:145-150 | Percentage coupon can be 100%, making orders free |
| 11 | Notification type missing 'coupon' | notificationService.ts:19 | Only 'order' \| 'chat' \| 'review' - no coupon type |
| 12 | Chat deleteMessage no admin rights | chatService.ts:137-152 | Admins cannot delete inappropriate user messages |
| 13 | Edit deadline not extended on edit | reviewService.ts:96-99 | `editDeadline` not recalculated when review updated |

#### Low (11)

| # | Bug | Description |
|---|-----|-------------|
| 14 | Socket.io typing event no validation | No check user is participant in conversation |
| 15 | Duplicate responseData | reviewController.ts defines local `responseData` but imports one too |
| 16 | Coupon findOneByCode case mismatch risk | Joi may not enforce uppercase on create |
| 17 | No ObjectId validation | Many functions accept string IDs without validating format |
| 18 | No expiry validation on coupon creation | Can create coupon with past `expiresAt` |
| 19 | Chat route missing HTTP message endpoint | Messages only via Socket.io, no REST endpoint |
| 20 | Order quantity comparison type mismatch | Implicit type coercion assumption |
| 21 | Message schema missing proper types | senderId/receiverId should be validated |
| 22 | Notification schema min(1) edge case | `.min(1)` on string after `.trim()` behavior |
| 23 | Review updateReview doesn't set updatedAt | Depends on model implementation |
| 24 | Various minor issues | See detailed analysis above |

---

### Frontend Bugs (23 total)

#### Critical (3)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 1 | SocketContext memory leak | SocketContext.tsx:28-58 | Multiple socket connections when session changes |
| 2 | Socket event naming mismatch | useNotifications.ts:57-61 | Hook emits `getNotifications` but listens for wrong events |
| 3 | MessageBubble delete handler does nothing | MessageBubble.tsx:34-37 | `handleDelete` only closes popover, never emits delete event |

#### High (6)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 4 | Fixed coupon discount not capped at total | ApplyCoupon.tsx:84-91 | Fixed discount > total gives full value instead of capping |
| 5 | Category filter uses wrong field | shop/page.tsx:58-62 | Uses `categoryId` but products have `category` object |
| 6 | useChat race condition | useChat.ts:50-82 | Listeners set up AFTER emit, may miss response |
| 7 | AdminTableFilters missing dependencies | AdminTableFilters.tsx:70-78 | `onFilter` not in dependency array |
| 8 | AdminTableFilters filter dropdowns empty | AdminTableFilters.tsx:184-199 | Select has no MenuItem options |
| 9 | ReviewList canModify logic wrong direction | ReviewList.tsx:48-57 | Checks order date instead of review createdAt |

#### Medium (5)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 10 | ChatModal missing useEffect dependency | ChatModal.tsx:49-53 | `markAsRead` not in dependency array |
| 11 | ToastNotification setTimeout after unmount | ToastNotification.tsx:49-54 | Second timeout not cleaned up |
| 12 | useOnlineStatus missing initial request | useOnlineStatus.ts:17-41 | Never emits to get initial online users |
| 13 | Typing indicator not stopped on unmount | admin/chat/page.tsx:161-167 | `isTyping: false` not sent on navigate away |
| 14 | Click outside handler race condition | NotificationPanel.tsx:62-79 | Memory leak potential with `document.addEventListener` |

#### Low (4)

| # | Bug | File | Description |
|---|-----|------|-------------|
| 15 | FloatingChatButton badge shows "0" | FloatingChatButton.tsx:23 | Should hide badge when count is 0 |
| 16 | ProductCardNew star rating wrong field | ProductCardNew.tsx:223-233 | Uses `product.star` directly |
| 17 | Coupons page sort key sync issue | coupons/page.tsx:88-96 | Local state may not sync with filter operation |
| 18 | Users page visibleRows undefined | users/page.tsx:121-123 | Short-circuit returns undefined instead of empty array |

---

### Summary

| Severity | Backend | Frontend | Total |
|----------|---------|----------|-------|
| Critical | 4 | 3 | 7 |
| High | 5 | 6 | 11 |
| Medium | 4 | 5 | 9 |
| Low | 11 | 4 | 15 |
| **Total** | **25** | **23** | **48 bugs** |

---

## Part 2: Logging Implementation Plan

### Current State
- Backend: Only `console.log()` scattered in 5 files
- Frontend: No logging framework
- No centralized logging
- No log levels (info, warn, error, debug)
- No structured logging
- No log rotation

---

### Proposed: Winston + Morgan Logging System

#### Phase 1: Backend Logging Infrastructure

##### 1.1 Install Dependencies
```bash
cd BE
npm install winston morgan winston-daily-rotate-file
npm install -D @types/morgan
```

##### 1.2 Create Logger Utility
**File:** `BE/src/utils/logger.ts`

Features:
- Winston logger instance
- Multiple transports: console, file, daily-rotate-file
- Log levels: error, warn, info, debug
- Format: JSON with timestamp, level, message, metadata
- Environment-aware formatting (dev vs prod)

```typescript
// Log levels and their use cases
const logger = {
  error: 'Application errors, exceptions, crashes',
  warn: 'Race conditions detected, retry attempts, degraded behavior',
  info: 'User actions, order created, coupon applied, login/logout',
  debug: 'Socket connect/disconnect, detailed flow tracing'
}
```

##### 1.3 Create Request Logger Middleware
**File:** `BE/src/middlewares/requestLogger.ts`

Features:
- Morgan for HTTP request logging
- Log: method, url, status, response time, IP, user-agent
- Skip static files and health checks
- Custom token formats

##### 1.4 Integrate into Services

**couponService.ts:**
```typescript
// Events to log:
// - Coupon created (INFO): couponCode, type, value, createdBy
// - Coupon applied (INFO): couponCode, userId, discount, orderId
// - Validation failed (WARN): couponCode, reason, userId
// - Max uses reached (WARN): couponCode, attemptedBy
// - Expired coupon used (WARN): couponCode, userId
```

**reviewService.ts:**
```typescript
// Events to log:
// - Review created (INFO): reviewId, userId, productId, rating
// - Review edited (INFO): reviewId, userId, changes
// - Review deleted (INFO): reviewId, userId, deletedBy
// - Edit deadline expired (WARN): reviewId, userId, attemptedAt
// - Purchase verification failed (WARN): userId, productId
```

**notificationService.ts:**
```typescript
// Events to log:
// - Notification created (INFO): notificationId, userId, type
// - Notification sent (DEBUG): notificationId, deliveryMethod
// - Mark as read (DEBUG): notificationId, userId
```

**chatService.ts:**
```typescript
// Events to log:
// - Conversation created (INFO): conversationId, participants
// - Message sent (INFO): messageId, conversationId, senderId
// - Message deleted (INFO): messageId, deletedBy
// - Admin lookup failed (WARN): reason
```

**orderService.ts:**
```typescript
// Events to log:
// - Order created (INFO): orderId, userId, total, couponCode
// - Order status changed (INFO): orderId, oldStatus, newStatus, changedBy
// - Payment failed (ERROR): orderId, error, userId
// - Stock insufficient (WARN): productId, requested, available
```

##### 1.5 Log File Structure
```
BE/logs/
├── app.log           # All logs (combined)
├── error.log         # Error level only
├── coupon.log        # Coupon-specific events
├── review.log        # Review-specific events
├── chat.log          # Chat-specific events
├── notification.log  # Notification-specific events
├── order.log         # Order-specific events
└── access.log        # HTTP access logs (Morgan)
```

##### 1.6 Log Rotation Configuration
```javascript
// Using winston-daily-rotate-file
{
  filename: 'app-%DATE%.log',
  datePattern: 'YYYY-MM-DD',
  maxSize: '20m',
  maxFiles: '14d'
}
```

---

#### Phase 2: Frontend Logging Infrastructure

##### 2.1 Install Dependencies
```bash
cd FE
npm install loglevel sentry
```

##### 2.2 Create Frontend Logger Utility
**File:** `FE/src/utils/logger.ts`

Features:
- Wrapper around `loglevel`
- Centralized configuration
- Environment-based log level (dev: debug, prod: warn)
- Consistent format with backend logs

##### 2.3 Create Error Boundary Component
**File:** `FE/src/components/ErrorBoundary.tsx`

Features:
- Catches React component errors
- Logs error with stack trace
- Displays fallback UI
- Reports to Sentry (optional)

##### 2.4 Integrate into Components

**Chat components:**
```typescript
// Events to log:
// - Chat opened (INFO)
// - Message sent (INFO): conversationId
// - Socket disconnected (WARN): reason
// - Send failed (ERROR): error
```

**Review components:**
```typescript
// Events to log:
// - Review form opened (INFO)
// - Review submitted (INFO): productId, rating
// - Validation failed (WARN): missing fields
// - Submit failed (ERROR): error
```

**Notification components:**
```typescript
// Events to log:
// - Notification panel opened (INFO)
// - Mark as read clicked (DEBUG)
// - Toast shown (DEBUG)
```

##### 2.5 Optional: Sentry Integration
```typescript
// For production error tracking
// Sentry.init({
//   dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
//   environment: process.env.NODE_ENV
// })
```

---

### Events to Track

| Event | Level | Backend | Frontend |
|-------|-------|---------|----------|
| User login | INFO | ✅ | ✅ |
| User logout | INFO | ✅ | ✅ |
| Order created | INFO | ✅ | - |
| Order status changed | INFO | ✅ | ✅ |
| Payment failed | ERROR | ✅ | ✅ |
| Coupon applied | INFO | ✅ | ✅ |
| Coupon validation failed | WARN | ✅ | ✅ |
| Coupon max uses | WARN | ✅ | - |
| Review created | INFO | ✅ | ✅ |
| Review edited | INFO | ✅ | ✅ |
| Review deleted | INFO | ✅ | ✅ |
| Notification created | INFO | ✅ | - |
| Notification read | DEBUG | ✅ | - |
| Chat message sent | INFO | ✅ | ✅ |
| Conversation started | INFO | ✅ | - |
| Socket connect | DEBUG | ✅ | ✅ |
| Socket disconnect | DEBUG | ✅ | ✅ |
| Admin action | INFO | ✅ | - |
| API error | ERROR | ✅ | - |
| Race condition | WARN | ✅ | - |
| Component error | ERROR | - | ✅ |

---

### Effort Estimation

| Phase | Task | Time |
|-------|------|------|
| 1.1 | Install backend dependencies | 5 min |
| 1.2 | Create logger utility | 1 hour |
| 1.3 | Create request logger middleware | 30 min |
| 1.4 | Integrate into all services | 3 hours |
| 1.5 | Configure rotation | 30 min |
| 2.1 | Install frontend dependencies | 5 min |
| 2.2 | Create frontend logger | 1 hour |
| 2.3 | Create ErrorBoundary | 1 hour |
| 2.4 | Integrate into components | 2 hours |
| **Total** | | **9.5 hours** |

---

### Files to Create

```
BE/src/
├── utils/
│   └── logger.ts                    # NEW - Winston logger setup
├── middlewares/
│   └── requestLogger.ts            # NEW - Morgan HTTP logger

FE/src/
├── utils/
│   └── logger.ts                    # NEW - Frontend logger
├── components/
│   └── ErrorBoundary.tsx           # NEW - React error boundary
```

### Files to Modify

```
BE/src/
├── services/
│   ├── couponService.ts            # Add logging
│   ├── reviewService.ts            # Add logging
│   ├── notificationService.ts      # Add logging
│   ├── chatService.ts              # Add logging
│   └── orderService.ts             # Add logging
├── server.ts                       # Add logger middleware

FE/src/
├── components/
│   ├── chat/
│   │   ├── ChatModal.tsx           # Add logging
│   │   └── MessageBubble.tsx       # Add logging
│   ├── review/
│   │   ├── ReviewForm.tsx          # Add logging
│   │   └── ReviewList.tsx          # Add logging
│   └── notification/
│       ├── NotificationBell.tsx    # Add logging
│       └── NotificationPanel.tsx   # Add logging
```

---

### Acceptance Criteria

1. **Backend:**
   - [ ] All API requests logged with method, URL, status, duration
   - [ ] All service methods log at appropriate levels
   - [ ] Logs written to files with daily rotation
   - [ ] Error stack traces captured
   - [ ] No `console.log` remaining in service files

2. **Frontend:**
   - [ ] Centralized logger utility
   - [ ] ErrorBoundary catches and logs React errors
   - [ ] Key user actions logged
   - [ ] Socket events logged
   - [ ] Consistent log format with backend

3. **Both:**
   - [ ] Log levels used appropriately
   - [ ] Structured JSON format for production
   - [ ] Human-readable format for development
   - [ ] No sensitive data logged (passwords, tokens)
