# Testing Strategy — กลยุทธ์การเทส

> Test ให้ครบ Test ให้ดี

---

## 🎯 Testing Pyramid

```
        /\
       /E2E\         น้อย (5-10%)
      /------\
     /Integration\   ปานกลาง (20-30%)
    /------------\
   /  Unit Tests  \  เยอะที่สุด (60-70%)
  /----------------\
```

### 1. Unit Tests (60-70%)

**ทดสอบ:** ฟังก์ชัน/คลาส แยกส่วน

**ตัวอย่าง:**
```typescript
// ทดสอบฟังก์ชัน calculateTotal
it('should calculate total correctly', () => {
  expect(calculateTotal([100, 200, 300])).toBe(600)
})
```

**ข้อดี:**
- เร็ว
- แยกส่วนได้
- หา bug ได้ง่าย

**ข้อเสีย:**
- ไม่ได้ test integration

### 2. Integration Tests (20-30%)

**ทดสอบ:** การทำงานร่วมกันของหลาย components

**ตัวอย่าง:**
```typescript
// ทดสอบ API + Database
it('should create order in database', async () => {
  const order = await createOrder({ customerId: 1, items: [...] })
  const saved = await db.order.findById(order.id)
  expect(saved).toBeDefined()
})
```

**ข้อดี:**
- ทดสอบ integration จริง
- จับ bug ที่ unit test จับไม่ได้

**ข้อเสีย:**
- ช้ากว่า unit tests
- Debug ยากกว่า

### 3. E2E Tests (5-10%)

**ทดสอบ:** User flow ทั้งหมด

**ตัวอย่าง:**
```typescript
// ทดสอบ user flow: สร้าง order
test('user can create order', async ({ page }) => {
  await page.goto('/products')
  await page.click('[data-testid="product-1"]')
  await page.click('[data-testid="add-to-cart"]')
  await page.click('[data-testid="checkout"]')
  await expect(page.locator('[data-testid="order-success"]')).toBeVisible()
})
```

**ข้อดี:**
- ทดสอบ user flow จริง
- ใกล้เคียง production มากที่สุด

**ข้อเสีย:**
- ช้ามาก
- Flaky (ไม่เสถียร)
- Debug ยากมาก

---

## 📋 Test Coverage Goals

### เป้าหมาย

| Type | Coverage | Priority |
|---|---|---|
| **Unit Tests** | 80%+ | สูง |
| **Integration Tests** | Critical paths | สูง |
| **E2E Tests** | Main user flows | ปานกลาง |

### อะไรที่ต้อง test 100%

✅ **Business Logic** — ต้อง test ทุกกรณี
✅ **Critical Paths** — Payment, Authentication, Data loss
✅ **Edge Cases** — Null, Empty, Invalid input

### อะไรที่ไม่ต้อง test

❌ **Third-party libraries** — ไว้ใจ library
❌ **Getters/Setters** — ไม่มี logic
❌ **Constants** — ไม่เปลี่ยน

---

## 🎯 Test Strategy สำหรับงานจริง

### Backend API

```
Unit Tests (70%):
- Business logic
- Validation
- Utilities

Integration Tests (25%):
- API endpoints + Database
- Authentication
- Authorization

E2E Tests (5%):
- Critical user flows
```

### Frontend

```
Unit Tests (60%):
- Components (isolated)
- Utilities
- Hooks

Integration Tests (30%):
- Components + State management
- Forms
- API calls

E2E Tests (10%):
- User flows
- Critical paths
```

---

## 💡 Best Practices

### 1. Test Naming

✅ **ดี:**
```typescript
describe('Order', () => {
  describe('create', () => {
    it('should create order with valid data', () => {})
    it('should throw error when customer not found', () => {})
    it('should throw error when items are empty', () => {})
  })
})
```

❌ **ไม่ดี:**
```typescript
it('test 1', () => {})
it('order test', () => {})
```

### 2. Test Structure (AAA Pattern)

```typescript
it('should calculate total correctly', () => {
  // Arrange — เตรียมข้อมูล
  const items = [
    { price: 100, quantity: 2 },
    { price: 200, quantity: 1 }
  ]
  
  // Act — เรียกใช้ฟังก์ชัน
  const total = calculateTotal(items)
  
  // Assert — ตรวจสอบผลลัพธ์
  expect(total).toBe(400)
})
```

### 3. Test Isolation

✅ **ดี — แยกส่วน:**
```typescript
beforeEach(() => {
  // Setup ใหม่ทุก test
  database.clear()
})

it('should create order', () => {
  const order = createOrder(...)
  expect(order.id).toBeDefined()
})
```

❌ **ไม่ดี — พึ่งพากัน:**
```typescript
let order

it('should create order', () => {
  order = createOrder(...)
})

it('should update order', () => {
  updateOrder(order.id, ...) // พึ่งพา test ก่อนหน้า
})
```

### 4. Mock ที่จำเป็น

✅ **Mock external dependencies:**
```typescript
// Mock API call
jest.mock('./api', () => ({
  fetchUser: jest.fn().mockResolvedValue({ id: 1, name: 'John' })
}))
```

❌ **อย่า mock ทุกอย่าง:**
```typescript
// ไม่ต้อง mock ฟังก์ชันง่ายๆ
const add = (a, b) => a + b
// ไม่ต้อง mock
```

---

## 🚨 Common Mistakes

### 1. Test Implementation, Not Behavior

❌ **ไม่ดี:**
```typescript
it('should call database.save', () => {
  const spy = jest.spyOn(database, 'save')
  createOrder(...)
  expect(spy).toHaveBeenCalled()
})
```

✅ **ดี:**
```typescript
it('should save order to database', async () => {
  const order = await createOrder(...)
  const saved = await database.findById(order.id)
  expect(saved).toBeDefined()
})
```

### 2. Flaky Tests

❌ **ไม่ดี:**
```typescript
it('should load data', async () => {
  loadData()
  await new Promise(resolve => setTimeout(resolve, 1000)) // ❌ ใช้ timeout
  expect(data).toBeDefined()
})
```

✅ **ดี:**
```typescript
it('should load data', async () => {
  await loadData() // ✅ รอให้เสร็จ
  expect(data).toBeDefined()
})
```

### 3. Test ที่ช้า

❌ **ไม่ดี:**
```typescript
it('should process 1000 orders', () => {
  for (let i = 0; i < 1000; i++) {
    processOrder(...)
  }
})
```

✅ **ดี:**
```typescript
it('should process order', () => {
  processOrder(...) // ทดสอบ 1 order พอ
})
```

---

## 🔧 Tools

### Testing Frameworks

- **Jest** — Popular, all-in-one
- **Vitest** — Fast, Vite-compatible
- **Mocha + Chai** — Flexible

### E2E Testing

- **Playwright** — Modern, fast
- **Cypress** — Developer-friendly
- **Puppeteer** — Headless Chrome

### Coverage

- **Istanbul** — Code coverage
- **Codecov** — Coverage tracking

---

## 📊 Metrics

### ติดตาม

- **Coverage** — 80%+ unit tests
- **Test Speed** — < 10 seconds
- **Flakiness** — < 1%
- **Failures** — 0 in main branch

---

## 🎓 สรุป

**Testing Pyramid:**
- Unit Tests (60-70%) — เยอะที่สุด
- Integration Tests (20-30%) — ปานกลาง
- E2E Tests (5-10%) — น้อยที่สุด

**Best Practices:**
- Test behavior, not implementation
- Use AAA pattern
- Isolate tests
- Mock external dependencies

**Goals:**
- 80%+ unit test coverage
- Critical paths covered
- Fast tests (< 10s)

---

> **"Test ให้ครบ Test ให้ดี = โค้ดมีคุณภาพ"** ✅
