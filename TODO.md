# TODO - Display Order Management Optimization

## ✅ Completed

### Phase 1: Database Schema
- [x] Add Category model with priority field
- [x] Add globalOrder and categoryOrder to Product model
- [x] Create database migration
- [x] Seed categories and products with order fields

### Phase 2: Backend API
- [x] GET /categories
- [x] POST /categories
- [x] PUT /categories/:id/priority
- [x] PUT /products/:id/globalOrder
- [x] PUT /products/:id/categoryOrder
- [x] GET /products?mode=interleaved
- [x] GET /products?mode=grouped

### Phase 3: Frontend Admin Dashboard
- [x] Create CategoryPriority component with drag-and-drop
- [x] Create GlobalProductOrder component with drag-and-drop
- [x] Update ProductsList to integrate new components
- [x] Add Toggle Interleaved/Grouped
- [x] Add Preview Button

### Phase 4: Frontend Customer View
- [x] Update Home page to display interleaved mode
- [x] Update Category page to display grouped mode
- [x] Add Toggle Interleaved/Grouped for customers

### Phase 5: Performance Optimization
- [x] Optimize drag and drop - update only affected items
- [x] Fix unnecessary data fetching - use refs to track prop changes
- [x] Add logging and fix initial mount issue
- [x] Add bulk update endpoints
- [x] Fix lint errors - use env config
- [x] Optimize drag and drop - send only index + productId
- [x] Fix reorder endpoint - handle null order values
- [x] Fix route matching - move /products/reorder before /products/:id
- [x] Add test script for reorder endpoints
- [x] Remove debug console logs

---

## 🔄 In Progress

### Phase 6: UX Improvements
- [x] Fix images blink/flicker during drag and drop
- [ ] Add visual feedback for drag and drop
- [ ] Improve error handling with retry mechanism
- [ ] Add loading states for drag and drop operations

---

## 📋 Pending

### Phase 6: UX Improvements (Continued)
- [ ] Add visual feedback for drag and drop
- [ ] Improve error handling with retry mechanism
- [ ] Add loading states for drag and drop operations

### Phase 7: Testing
- [ ] Add frontend test script
- [ ] Add E2E tests for drag and drop
- [ ] Add performance tests

### Phase 8: Documentation
- [ ] Update API documentation
- [ ] Add user guide for display order management
- [ ] Add developer guide for extending features

---

## 🐛 Known Issues

1. ~~**Images blink/flicker during drag and drop**~~
   - Cause: Component re-renders even though data is the same
   - Priority: HIGH
   - Status: ✅ FIXED

2. **No visual feedback for drag and drop**
   - Cause: Only "Saving..." text shown
   - Priority: MEDIUM
   - Status: Pending

3. **No retry mechanism for network failures**
   - Cause: Basic error handling only
   - Priority: LOW
   - Status: Pending

---

## 📊 Performance Metrics

### Before Optimization
- Drag and drop: N API calls (N = total items)
- Payload size: N * 3 fields (300 fields for 100 items)
- Network traffic: HIGH

### After Optimization
- Drag and drop: 1 API call
- Payload size: 4 fields (fromIndex, toIndex, productId, mode)
- Network traffic: LOW (~99% reduction)

---

## 🧪 Test Results

### Backend Tests
- Categories reorder: ✅ PASS
- Products reorder: ✅ PASS

### Frontend Tests
- [ ] Pending

---

## 📝 Notes

- Backend server: http://localhost:3001
- Frontend server: http://localhost:5173
- Admin login: admin@test.com / password123
- Test script: `node backend/test-reorder.js`
