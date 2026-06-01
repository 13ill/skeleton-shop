# TDD Workflow — Test-Driven Development

> เขียน test ก่อน เขียน code ทีหลัง

---

## 🎯 TDD คืออะไร?

**TDD (Test-Driven Development)** = เขียน test ก่อน แล้วค่อยเขียน code ให้ผ่าน test

### ทำไมต้องทำ TDD?

✅ **คุณภาพโค้ดดีขึ้น** — โค้ดที่เขียนได้ต้องผ่าน test
✅ **Design ดีขึ้น** — คิดถึง interface ก่อนเขียน implementation
✅ **Refactor ได้อุ่นใจ** — มี test คุ้มครอง
✅ **Documentation ฟรี** — test เป็น documentation
✅ **Bug น้อยลง** — จับ bug ได้เร็ว

---

## 🔄 TDD Cycle (Red-Green-Refactor)

```
1. 🔴 Red — เขียน test ที่ fail
2. 🟢 Green — เขียน code ให้ผ่าน test (แค่ผ่านพอ)
3. 🔵 Refactor — ปรับปรุงโค้ดให้ดีขึ้น (test ยังผ่านอยู่)
4. Repeat
```

### ตัวอย่าง: สร้างฟังก์ชัน `add(a, b)`

#### Step 1: 🔴 Red — เขียน test ที่ fail

```typescript
// add.test.ts
import { add } from './add'

describe('add', () => {
  it('should add two numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
})
```

**รัน test → ❌ Fail** (เพราะยังไม่มีฟังก์ชัน `add`)

#### Step 2: 🟢 Green — เขียน code ให้ผ่าน test

```typescript
// add.ts
export function add(a: number, b: number): number {
  return a + b
}
```

**รัน test → ✅ Pass**

#### Step 3: 🔵 Refactor — ปรับปรุงโค้ด

```typescript
// add.ts
export function add(a: number, b: number): number {
  // โค้ดง่ายแล้ว ไม่ต้อง refactor
  return a + b
}
```

**รัน test → ✅ Pass** (ยังผ่านอยู่)

#### Step 4: Repeat — เพิ่ม test cases

```typescript
// add.test.ts
describe('add', () => {
  it('should add two positive numbers', () => {
    expect(add(2, 3)).toBe(5)
  })
  
  it('should add negative numbers', () => {
    expect(add(-2, -3)).toBe(-5)
  })
  
  it('should add zero', () => {
    expect(add(0, 5)).toBe(5)
  })
})
```

---

## 📋 TDD Workflow ทีละขั้นตอน

### Phase 1: เขียน Test ก่อน

1. **คิดว่าต้องการ behavior อะไร**
   - ฟังก์ชันนี้ทำอะไร?
   - Input/Output คืออะไร?
   - Edge cases มีอะไรบ้าง?

2. **เขียน test case**
   ```typescript
   it('should [behavior]', () => {
     // Arrange — เตรียมข้อมูล
     const input = ...
     
     // Act — เรียกใช้ฟังก์ชัน
     const result = myFunction(input)
     
     // Assert — ตรวจสอบผลลัพธ์
     expect(result).toBe(expected)
   })
   ```

3. **รัน test → ต้อง fail**
   - ถ้าผ่าน = test ไม่ได้ test อะไรเลย

### Phase 2: เขียน Code ให้ผ่าน Test

1. **เขียน code แค่ให้ผ่าน test**
   - ไม่ต้องสมบูรณ์แบบ
   - ไม่ต้อง optimize
   - แค่ให้ผ่าน test

2. **รัน test → ต้องผ่าน**
   - ถ้าไม่ผ่าน = แก้ code

### Phase 3: Refactor

1. **ปรับปรุงโค้ด**
   - Clean code
   - Remove duplication
   - Improve naming

2. **รัน test → ต้องยังผ่าน**
   - ถ้าไม่ผ่าน = refactor ผิด ต้องแก้

### Phase 4: Repeat

1. **เพิ่ม test case ใหม่**
2. **กลับไป Phase 1**

---

## 💡 TDD Best Practices

### 1. เขียน Test ที่ดี

✅ **Test one thing** — แต่ละ test ทดสอบ 1 behavior
✅ **Clear naming** — ชื่อ test บอกว่า test อะไร
✅ **AAA Pattern** — Arrange, Act, Assert
✅ **Independent** — test ไม่พึ่งพากัน
✅ **Fast** — รันเร็ว

### 2. เริ่มจาก Happy Path

```typescript
// เริ่มจาก happy path ก่อน
it('should create order successfully', () => {
  const order = createOrder({ customerId: 1, items: [...] })
  expect(order.status).toBe('created')
})

// แล้วค่อยเพิ่ม edge cases
it('should throw error when customer not found', () => {
  expect(() => createOrder({ customerId: 999 })).toThrow()
})
```

### 3. Test Behavior, Not Implementation

❌ **ไม่ดี — Test implementation:**
```typescript
it('should call database.save', () => {
  const spy = jest.spyOn(database, 'save')
  createOrder(...)
  expect(spy).toHaveBeenCalled()
})
```

✅ **ดี — Test behavior:**
```typescript
it('should save order to database', async () => {
  const order = await createOrder(...)
  const saved = await database.findById(order.id)
  expect(saved).toBeDefined()
})
```

### 4. เขียน Test ที่อ่านง่าย

✅ **ดี:**
```typescript
describe('Order', () => {
  describe('create', () => {
    it('should create order with valid data', () => {
      // ...
    })
    
    it('should throw error when customer not found', () => {
      // ...
    })
  })
})
```

### 5. ใช้ Test Fixtures

```typescript
// test-helpers.ts
export const validCustomer = {
  id: 1,
  name: 'John Doe',
  email: 'john@example.com'
}

export const validOrder = {
  customerId: 1,
  items: [
    { productId: 1, quantity: 2, price: 100 }
  ]
}

// order.test.ts
import { validCustomer, validOrder } from './test-helpers'

it('should create order', () => {
  const order = createOrder(validOrder)
  expect(order.customerId).toBe(validCustomer.id)
})
```

---

## 🎯 TDD สำหรับงานจริง

### สถานการณ์ 1: สร้าง API Endpoint

**Requirement:** สร้าง POST /api/orders

#### Step 1: เขียน test

```typescript
describe('POST /api/orders', () => {
  it('should create order and return 201', async () => {
    const response = await request(app)
      .post('/api/orders')
      .send({
        customerId: 1,
        items: [
          { productId: 1, quantity: 2, price: 100 }
        ]
      })
    
    expect(response.status).toBe(201)
    expect(response.body.orderId).toBeDefined()
    expect(response.body.status).toBe('created')
  })
})
```

#### Step 2: เขียน code ให้ผ่าน

```typescript
app.post('/api/orders', async (req, res) => {
  const { customerId, items } = req.body
  
  const order = await db.order.create({
    data: {
      customerId,
      items: {
        create: items
      }
    }
  })
  
  res.status(201).json({
    orderId: order.id,
    status: 'created'
  })
})
```

#### Step 3: เพิ่ม test cases

```typescript
it('should return 400 when customerId is missing', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({ items: [...] })
  
  expect(response.status).toBe(400)
})

it('should return 404 when customer not found', async () => {
  const response = await request(app)
    .post('/api/orders')
    .send({ customerId: 999, items: [...] })
  
  expect(response.status).toBe(404)
})
```

---

## 🚨 TDD Anti-Patterns

### ❌ อย่าทำ

1. **เขียน code ก่อน test**
   - ไม่ใช่ TDD แล้ว

2. **เขียน test หลายตัวพร้อมกัน**
   - ทำทีละ test

3. **Test implementation details**
   - Test behavior แทน

4. **Test ที่ไม่มี assertion**
   ```typescript
   // ❌ ไม่ดี
   it('should create order', () => {
     createOrder(...)
     // ไม่มี expect?
   })
   ```

5. **Test ที่พึ่งพากัน**
   ```typescript
   // ❌ ไม่ดี
   it('should create order', () => {
     order = createOrder(...)
   })
   
   it('should update order', () => {
     updateOrder(order.id, ...) // พึ่งพา test ก่อนหน้า
   })
   ```

---

## 📊 Test Coverage

### เป้าหมาย

- **Unit Tests:** 80%+ coverage
- **Integration Tests:** ครอบคลุม critical paths
- **E2E Tests:** ครอบคลุม user flows สำคัญ

### เช็ค Coverage

```bash
# Jest
npm test -- --coverage

# Vitest
npm test -- --coverage
```

---

## 💡 Tips

### เริ่มต้น TDD

1. **เริ่มจากฟังก์ชันง่ายๆ**
   - Pure functions
   - No side effects

2. **ฝึกทำ TDD Kata**
   - FizzBuzz
   - Roman Numerals
   - Bowling Game

3. **ใช้ TDD กับ bug fixes**
   - เขียน test ที่ reproduce bug
   - แก้ให้ test ผ่าน

### TDD กับ Legacy Code

1. **เพิ่ม test ก่อนแก้**
2. **Refactor ทีละนิด**
3. **รัน test บ่อยๆ**

---

## 🔗 เอกสารอ้างอิง

- **Testing Strategy:** `06-references/testing-strategy.md`
- **Code Quality Checklist:** `06-references/code-quality-checklist.md`
- **Gate 7 (Execution):** `01-gates/full-mode/gate-7-execution.md`

---

## 🎓 สรุป

**TDD = Red → Green → Refactor**

1. 🔴 เขียน test ที่ fail
2. 🟢 เขียน code ให้ผ่าน
3. 🔵 Refactor
4. Repeat

**ประโยชน์:**
- คุณภาพโค้ดดีขึ้น
- Design ดีขึ้น
- Refactor ได้อุ่นใจ
- Bug น้อยลง

---

> **"Test first, code later = Better code"** ✅
