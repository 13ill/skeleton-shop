# Architecture Documentation Template

> Template สำหรับเขียน architecture docs

---

## 📝 Template

```markdown
# [Project Name] Architecture

> สถาปัตยกรรมของระบบ

Last Updated: [YYYY-MM-DD]

---

## 🎯 Overview

[อธิบายระบบโดยรวม 2-3 ประโยค]

---

## 🏗️ System Architecture

### High-Level Architecture

```
[Diagram หรืออธิบายเป็นข้อความ]

User → Frontend → API Gateway → Backend Services → Database
```

### Components

1. **Frontend**
   - Technology: [Next.js, React, etc.]
   - Responsibility: [...]
   - Location: `/frontend`

2. **Backend**
   - Technology: [Node.js, Python, etc.]
   - Responsibility: [...]
   - Location: `/backend`

3. **Database**
   - Technology: [PostgreSQL, MongoDB, etc.]
   - Responsibility: [...]

---

## 📦 Modules

### Module 1: [Module Name]

**Responsibility:** [ทำอะไร]

**Dependencies:**
- [Module ที่พึ่งพา]

**Dependents:**
- [Module ที่พึ่งพา module นี้]

**Location:** `/src/modules/[module-name]`

**Key Files:**
- `index.ts` — Entry point
- `service.ts` — Business logic
- `repository.ts` — Data access

### Module 2: [Module Name]

[...]

---

## 🔄 Data Flow

### Flow 1: [Flow Name]

**Scenario:** [สถานการณ์]

**Steps:**
1. User → Frontend: [...]
2. Frontend → API: [...]
3. API → Service: [...]
4. Service → Database: [...]
5. Database → Service: [...]
6. Service → API: [...]
7. API → Frontend: [...]
8. Frontend → User: [...]

**Data:**
```typescript
// Request
{
  userId: string
  action: string
}

// Response
{
  success: boolean
  data: any
}
```

---

## 🗄️ Database Schema

### Table 1: users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  name VARCHAR(255) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table 2: orders

[...]

---

## 🔗 External Dependencies

### Service 1: [Service Name]

**Purpose:** [ทำไมใช้]

**Provider:** [Stripe, AWS, etc.]

**Integration:** [REST API, SDK, etc.]

**Documentation:** [URL]

---

## 🚀 Deployment

### Environments

- **Development:** `http://localhost:3000`
- **Staging:** `https://staging.example.com`
- **Production:** `https://example.com`

### Infrastructure

- **Hosting:** [Vercel, AWS, etc.]
- **Database:** [Supabase, AWS RDS, etc.]
- **CDN:** [Cloudflare, etc.]

---

## 🔒 Security

### Authentication

- Method: [JWT, Session, OAuth]
- Provider: [NextAuth, Auth0, etc.]

### Authorization

- Method: [RBAC, ABAC]
- Roles: [admin, user, guest]

---

## 📊 Performance

### Caching

- **Redis:** [ใช้ cache อะไร]
- **CDN:** [ใช้ cache อะไร]

### Optimization

- [การ optimize ต่างๆ]

---

## 🎯 Design Decisions

### Decision 1: [Decision]

**Date:** [YYYY-MM-DD]

**Decision:** [ตัดสินใจอะไร]

**Rationale:** [เหตุผล]

**Tradeoffs:** [ข้อแลกเปลี่ยน]

**Reference:** [DEC-XXX]

---

## 🔮 Future Plans

- [ ] [Feature 1]
- [ ] [Feature 2]
- [ ] [Feature 3]

---

## 📚 References

- [Link to design docs]
- [Link to API docs]
- [Link to decision logs]
```

---

## 🎯 ตัวอย่าง

### POS System Architecture

```markdown
# POS System Architecture

> สถาปัตยกรรมของระบบ POS

Last Updated: 2026-06-01

---

## 🎯 Overview

ระบบ Point of Sale (POS) สำหรับร้านค้าปลีก รองรับการขาย การจัดการสินค้า และรายงาน

---

## 🏗️ System Architecture

### High-Level Architecture

```
Customer → Web App (Next.js)
              ↓
         API Routes
              ↓
    ┌─────────┴─────────┐
    ↓                   ↓
Database (PostgreSQL)  Stripe (Payment)
```

### Components

1. **Frontend (Next.js)**
   - Responsibility: UI, UX, Client-side logic
   - Location: `/app`

2. **Backend (Next.js API Routes)**
   - Responsibility: Business logic, Data validation
   - Location: `/app/api`

3. **Database (PostgreSQL + Prisma)**
   - Responsibility: Data storage
   - Schema: `/prisma/schema.prisma`

---

## 📦 Modules

### Module 1: Orders

**Responsibility:** จัดการออเดอร์

**Dependencies:**
- Products (ดึงข้อมูลสินค้า)
- Payments (ชำระเงิน)

**Dependents:**
- Reports (ดึงข้อมูลออเดอร์)

**Location:** `/src/modules/orders`

**Key Files:**
- `orders.service.ts` — Business logic
- `orders.repository.ts` — Database access
- `orders.validation.ts` — Input validation

---

## 🔄 Data Flow

### Flow 1: Create Order

**Scenario:** ลูกค้าสั่งซื้อสินค้า

**Steps:**
1. User → Frontend: เลือกสินค้า + กด "Checkout"
2. Frontend → API: POST /api/orders
3. API → Orders Service: createOrder()
4. Orders Service → Products Service: validateProducts()
5. Orders Service → Database: INSERT order
6. Orders Service → Payments Service: processPayment()
7. Payments Service → Stripe: charge()
8. Stripe → Payments Service: success
9. Orders Service → Database: UPDATE order status
10. API → Frontend: { orderId, status: 'completed' }
11. Frontend → User: แสดงหน้า "Order Success"

---

## 🗄️ Database Schema

### Table: orders

```sql
CREATE TABLE orders (
  id UUID PRIMARY KEY,
  customer_id UUID REFERENCES customers(id),
  total DECIMAL(10,2) NOT NULL,
  status VARCHAR(50) NOT NULL,
  created_at TIMESTAMP DEFAULT NOW()
);
```

### Table: order_items

```sql
CREATE TABLE order_items (
  id UUID PRIMARY KEY,
  order_id UUID REFERENCES orders(id),
  product_id UUID REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10,2) NOT NULL
);
```

---

## 🔗 External Dependencies

### Stripe (Payment)

**Purpose:** ชำระเงิน

**Provider:** Stripe

**Integration:** REST API + SDK

**Documentation:** https://stripe.com/docs

---

## 🚀 Deployment

### Environments

- **Development:** `http://localhost:3000`
- **Production:** `https://pos.example.com`

### Infrastructure

- **Hosting:** Vercel
- **Database:** Supabase (PostgreSQL)
- **Payment:** Stripe

---

## 🔒 Security

### Authentication

- Method: JWT
- Provider: NextAuth.js

### Authorization

- Roles: admin, cashier, manager

---

## 🎯 Design Decisions

### Decision 1: ใช้ PostgreSQL แทน MongoDB

**Date:** 2026-06-01

**Decision:** ใช้ PostgreSQL

**Rationale:** ข้อมูลมี relation ชัดเจน ต้องการ ACID

**Tradeoffs:** Scale ยากกว่า NoSQL แต่ data integrity ดีกว่า

**Reference:** DEC-001
```

---

> **"Architecture doc ที่ดี = ทีมเข้าใจระบบ"**
