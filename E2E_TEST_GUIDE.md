# E2E Test Guide for Drag and Drop

## Overview

This guide provides manual E2E test procedures for drag and drop functionality in the Jump-1 admin dashboard. Since automated E2E testing requires additional setup (Playwright, Selenium, etc.), these tests are designed to be performed manually.

## Prerequisites

- Backend server running on `http://localhost:3001`
- Frontend server running on `http://localhost:5173`
- Admin account: `admin@test.com` / `password123`
- Database seeded with test data

---

## Test Cases

### Test 1: Category Reordering

**Objective:** Verify that categories can be reordered and the order persists

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Wait for the page to load completely
4. Locate the "Category Order" panel on the left
5. Note the current order of categories (e.g., Ring, Necklace, Earring)
6. Click and drag the second category (Necklace)
7. Drop it at the top position (before Ring)
8. Observe the "Saving..." indicator appears
9. Wait for the "Saved!" confirmation
10. Refresh the page
11. Verify that Necklace is now at the top position

**Expected Results:**
- Categories can be dragged and dropped
- Visual feedback appears during drag (golden border, scale effect)
- "Saving..." indicator appears during save
- "Saved!" confirmation appears after successful save
- Order persists after page refresh

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 2: Product Reordering (Interleaved Mode)

**Objective:** Verify that products can be reordered in interleaved mode

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Wait for the page to load completely
4. Locate the "Product Order" panel
5. Ensure the display mode is set to "Interleaved"
6. Note the current order of the first 3 products
7. Click and drag the third product
8. Drop it at the first position
9. Observe the "Saving..." indicator appears
10. Wait for the "Saved!" confirmation
11. Refresh the page
12. Verify that the dragged product is now at the first position

**Expected Results:**
- Products can be dragged and dropped
- Visual feedback appears during drag (golden border, scale effect, opacity)
- "Saving..." indicator appears during save
- "Saved!" confirmation appears after successful save
- Order persists after page refresh
- Global order values are updated correctly

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 3: Product Reordering (Grouped Mode)

**Objective:** Verify that products can be reordered within a category in grouped mode

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Wait for the page to load completely
4. In the "Category Order" panel, click on a category (e.g., "Ring")
5. Locate the "Product Order" panel
6. Switch the display mode to "Grouped"
7. Note the current order of products in the selected category
8. Click and drag the second product in the category
9. Drop it at the first position within the category
10. Observe the "Saving..." indicator appears
11. Wait for the "Saved!" confirmation
12. Refresh the page
13. Verify that the dragged product is now at the first position within the category

**Expected Results:**
- Products can be dragged and dropped within category
- Visual feedback appears during drag
- "Saving..." indicator appears during save
- "Saved!" confirmation appears after successful save
- Order persists after page refresh
- Category order values are updated correctly
- Products from other categories are not affected

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 4: Error Handling - Network Failure

**Objective:** Verify that the system handles network failures gracefully with retry mechanism

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Open browser DevTools (F12)
4. Go to Network tab
5. Set network throttling to "Offline"
6. In the admin dashboard, try to reorder a category
7. Observe the error message
8. Restore network connection
9. Try the reorder operation again

**Expected Results:**
- Error message appears when network is offline
- Order reverts to original state on error
- System shows user-friendly error message
- Operation succeeds when network is restored
- Retry mechanism attempts to resend the request

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 5: Visual Feedback States

**Objective:** Verify all visual feedback states work correctly

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Test each visual feedback state:

**Idle State:**
- Observe items have normal styling (gray border)
- Hover over items - verify hover effect (darker border)

**Dragging State:**
- Click and drag an item
- Verify golden border appears
- Verify scale effect (item appears larger)
- Verify opacity reduction
- Verify shadow effect

**Saving State:**
- Drop the item
- Verify spinner animation appears
- Verify "Saving..." text appears
- Verify items are disabled during save

**Success State:**
- Wait for save to complete
- Verify green checkmark appears
- Verify "Saved!" text appears
- Verify success message disappears after 2 seconds

**Error State:**
- Simulate an error (disconnect network)
- Try to reorder
- Verify error alert appears
- Verify order reverts to original

**Expected Results:**
- All visual feedback states work as expected
- Transitions between states are smooth
- UI remains responsive during all states

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 6: Display Mode Toggle

**Objective:** Verify that display mode toggle works correctly

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Locate the display mode toggle in Product Order panel
4. Note the current mode (default: Interleaved)
5. Click to switch to "Grouped" mode
6. Verify product order changes to grouped by category
7. Click to switch back to "Interleaved" mode
8. Verify product order changes to interleaved

**Expected Results:**
- Toggle switches between modes
- Product order updates correctly for each mode
- No data loss when switching modes
- UI updates immediately

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 7: Category Filter

**Objective:** Verify that category filtering works correctly

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. In the "Category Order" panel, note all categories
4. Click on a specific category (e.g., "Ring")
5. Verify "Product Order" panel shows only Ring products
6. Click "Show All Products" button
7. Verify "Product Order" panel shows all products
8. Click on a different category
9. Verify only products from that category are shown

**Expected Results:**
- Category selection filters products correctly
- "Show All Products" button resets filter
- Filter state persists during reordering
- Category selection is visually indicated

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

### Test 8: Concurrent Operations

**Objective:** Verify system handles rapid consecutive operations

**Steps:**
1. Navigate to `http://localhost:5173/admin`
2. Login with admin credentials
3. Quickly perform 3 consecutive drag and drop operations:
   - Drag item A to position 2
   - Immediately drag item B to position 3
   - Immediately drag item C to position 1
4. Wait for all operations to complete
5. Refresh the page
6. Verify the final order matches the last operation

**Expected Results:**
- System handles rapid operations without crashing
- Each operation is processed sequentially
- Final state reflects the last completed operation
- No data corruption occurs

**Pass/Fail Criteria:**
- ✅ Pass: All expected results met
- ❌ Fail: Any expected result not met

---

## Test Results Template

Copy this template to record your test results:

```
Date: ___________
Tester: ___________
Environment: ___________

Test 1: Category Reordering
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 2: Product Reordering (Interleaved Mode)
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 3: Product Reordering (Grouped Mode)
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 4: Error Handling - Network Failure
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 5: Visual Feedback States
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 6: Display Mode Toggle
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 7: Category Filter
Status: [ ] Pass [ ] Fail
Notes: ___________

Test 8: Concurrent Operations
Status: [ ] Pass [ ] Fail
Notes: ___________

Overall Result: _____/8 tests passed
```

---

## Automated E2E Testing (Future)

To implement automated E2E testing, consider:

1. **Playwright**: Modern E2E testing framework with excellent drag and drop support
2. **Cypress**: Popular E2E testing framework with good documentation
3. **Selenium**: Traditional E2E testing framework

Example Playwright setup:
```bash
npm install -D @playwright/test
npx playwright install
```

Example test:
```typescript
import { test, expect } from '@playwright/test';

test('category reordering', async ({ page }) => {
  await page.goto('http://localhost:5173/admin');
  await page.fill('input[type="email"]', 'admin@test.com');
  await page.fill('input[type="password"]', 'password123');
  await page.click('button[type="submit"]');

  const category = page.locator('.category-item').nth(1);
  const target = page.locator('.category-item').nth(0);

  await category.dragTo(target);

  await expect(page.locator('.category-item').nth(0)).toContainText('Necklace');
});
```

---

## Known Limitations

- Manual testing is time-consuming
- Human error possible
- Cannot be integrated into CI/CD pipeline
- Difficult to test edge cases consistently

---

## Recommendations

1. Implement automated E2E testing with Playwright for critical paths
2. Integrate E2E tests into CI/CD pipeline
3. Add visual regression testing for UI consistency
4. Monitor error rates in production
5. Collect user feedback on drag and drop experience
