# Module Documentation Template

> Template สำหรับเขียน module docs

---

## 📝 Template

```markdown
# Module: [Module Name]

> [อธิบาย module นี้ทำอะไร 1-2 ประโยค]

---

## 🎯 Responsibility

[Module นี้รับผิดชอบอะไร]

---

## 📦 Structure

```
src/modules/[module-name]/
├── index.ts              # Entry point
├── [module].service.ts   # Business logic
├── [module].repository.ts # Data access
├── [module].validation.ts # Input validation
├── [module].types.ts     # TypeScript types
└── __tests__/
    ├── [module].service.test.ts
    └── [module].repository.test.ts
```

---

## 🔗 Dependencies

### Internal Dependencies

- **[Module A]** — [ทำไมต้องใช้]
- **[Module B]** — [ทำไมต้องใช้]

### External Dependencies

- **[Library A]** — [ทำไมต้องใช้]
- **[Library B]** — [ทำไมต้องใช้]

---

## 📊 Dependents

Modules ที่พึ่งพา module นี้:

- **[Module C]** — [ใช้ทำอะไร]
- **[Module D]** — [ใช้ทำอะไร]

---

## 🔄 Data Flow

### Flow 1: [Flow Name]

```
Input → Validation → Service → Repository → Database
                                    ↓
                                Response
```

**Input:**
```typescript
{
  field1: string
  field2: number
}
```

**Output:**
```typescript
{
  success: boolean
  data: any
}
```

---

## 🎯 API

### Function 1: [functionName]

**Purpose:** [ทำอะไร]

**Signature:**
```typescript
function functionName(
  param1: Type1,
  param2: Type2
): Promise<ReturnType>
```

**Parameters:**
- `param1` — [อธิบาย]
- `param2` — [อธิบาย]

**Returns:**
- `ReturnType` — [อธิบาย]

**Example:**
```typescript
const result = await functionName('value1', 123)
```

**Throws:**
- `ValidationError` — [เมื่อไหร่]
- `NotFoundError` — [เมื่อไหร่]

---

## 🗄️ Database

### Tables Used

- **[table1]** — [ใช้ทำอะไร]
- **[table2]** — [ใช้ทำอะไร]

### Queries

**Query 1: [Query Name]**

```sql
SELECT * FROM table1
WHERE condition = ?
```

**Performance:** [O(n), indexed, etc.]

---

## ✅ Tests

### Test Coverage

- Unit Tests: [X%]
- Integration Tests: [Y%]

### Key Test Cases

1. **[Test Case 1]**
   - Input: [...]
   - Expected: [...]

2. **[Test Case 2]**
   - Input: [...]
   - Expected: [...]

---

## 🚨 Error Handling

### Errors

- **ValidationError** — [เมื่อไหร่]
- **NotFoundError** — [เมื่อไหร่]
- **DatabaseError** — [เมื่อไหร่]

### Error Codes

- `E001` — [อธิบาย]
- `E002` — [อธิบาย]

---

## 🎯 Design Decisions

### Decision 1: [Decision]

**Date:** [YYYY-MM-DD]

**Decision:** [ตัดสินใจอะไร]

**Rationale:** [เหตุผล]

**Reference:** [DEC-XXX]

---

## 🔮 Future Plans

- [ ] [Feature 1]
- [ ] [Feature 2]

---

## 📚 References

- [Link to architecture doc]
- [Link to API doc]
```

---

## 🎯 ตัวอย่าง

### Module: Orders

```markdown
# Module: Orders

> จัดการออเดอร์ทั้งหมด รวมถึงการสร้าง อัปเดต และยกเลิกออเดอร์

---

## 🎯 Responsibility

- สร้างออเดอร์ใหม่
- อัปเดตสถานะออเดอร์
- ยกเลิกออเดอร์
- ดึงข้อมูลออเดอร์

---

## 📦 Structure

```
src/modules/orders/
├── index.ts
├── orders.service.ts
├── orders.repository.ts
├── orders.validation.ts
├── orders.types.ts
└── __tests__/
    ├── orders.service.test.ts
    └── orders.repository.test.ts
```

---

## 🔗 Dependencies

### Internal Dependencies

- **Products** — ตรวจสอบสินค้าและราคา
- **Payments** — ประมวลผลการชำระเงิน
- **Customers** — ดึงข้อมูลลูกค้า

### External Dependencies

- **Prisma** — Database ORM
- **Zod** — Validation

---

## 📊 Dependents

- **Reports** — ดึงข้อมูลออเดอร์สำหรับรายงาน
- **Notifications** — ส่งการแจ้งเตือนเมื่อสถานะออเดอร์เปลี่ยน

---

## 🔄 Data Flow

### Flow 1: Create Order

```
Input → Validation → Orders Service → Products Service
                            ↓
                    Orders Repository → Database
                            ↓
                    Payments Service → Stripe
                            ↓
                        Response
```

---

## 🎯 API

### Function: createOrder

**Purpose:** สร้างออเดอร์ใหม่

**Signature:**
```typescript
async function createOrder(
  data: CreateOrderInput
): Promise<Order>
```

**Parameters:**
- `data.customerId` — ID ของลูกค้า
- `data.items` — รายการสินค้า
- `data.total` — ยอดรวม

**Returns:**
- `Order` — ออเดอร์ที่สร้างแล้ว

**Example:**
```typescript
const order = await createOrder({
  customerId: 'cust-123',
  items: [
    { productId: 'prod-1', quantity: 2, price: 100 }
  ],
  total: 200
})
```

**Throws:**
- `ValidationError` — ข้อมูล input ไม่ถูกต้อง
- `NotFoundError` — ไม่พบลูกค้าหรือสินค้า
- `PaymentError` — การชำระเงินล้มเหลว

---

## 🗄️ Database

### Tables Used

- **orders** — เก็บข้อมูลออเดอร์
- **order_items** — เก็บรายการสินค้าในออเดอร์

### Queries

**Query 1: Create Order**

```sql
INSERT INTO orders (id, customer_id, total, status)
VALUES (?, ?, ?, 'pending')
RETURNING *
```

**Performance:** O(1), indexed on id

---

## ✅ Tests

### Test Coverage

- Unit Tests: 85%
- Integration Tests: 70%

### Key Test Cases

1. **สร้างออเดอร์สำเร็จ**
   - Input: Valid order data
   - Expected: Order created with status 'pending'

2. **สร้างออเดอร์ล้มเหลว (customer not found)**
   - Input: Invalid customer ID
   - Expected: Throw NotFoundError

---

## 🎯 Design Decisions

### Decision 1: ใช้ Prisma แทน raw SQL

**Date:** 2026-06-01

**Decision:** ใช้ Prisma ORM

**Rationale:** Type-safe, Auto-migration, Good DX

**Reference:** DEC-003
```

---

> **"Module doc ที่ดี = เข้าใจโค้ดได้เร็ว"**
