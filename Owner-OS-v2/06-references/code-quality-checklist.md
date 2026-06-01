# Code Quality Checklist

> เช็คคุณภาพโค้ดก่อนส่ง

---

## ✅ Checklist ก่อน Commit

### 1. Code Style

- [ ] ใช้ naming convention ที่ตกลงกัน
- [ ] Indentation ถูกต้อง (2 spaces / 4 spaces / tabs)
- [ ] ไม่มี trailing whitespace
- [ ] ไม่มี console.log / debugger
- [ ] ผ่าน linter (ESLint, Prettier)

### 2. Code Quality

- [ ] ไม่มี code duplication
- [ ] ฟังก์ชันสั้น กระชับ (< 20 lines)
- [ ] ตัวแปรมีชื่อที่อธิบายตัวเอง
- [ ] ไม่มี magic numbers
- [ ] ไม่มี nested if มากเกินไป (< 3 levels)

### 3. Tests

- [ ] มี unit tests
- [ ] Tests ผ่านทั้งหมด
- [ ] Coverage > 80%
- [ ] ไม่มี flaky tests

### 4. Documentation

- [ ] มี JSDoc / comments สำหรับฟังก์ชันซับซ้อน
- [ ] อัปเดต README (ถ้ามีการเปลี่ยนแปลง)
- [ ] อัปเดต API docs (ถ้ามี API ใหม่)

### 5. Security

- [ ] ไม่มี hardcoded secrets
- [ ] ไม่มี SQL injection
- [ ] ไม่มี XSS vulnerabilities
- [ ] ไม่มี sensitive data ใน logs

### 6. Performance

- [ ] ไม่มี N+1 queries
- [ ] ไม่มี unnecessary re-renders (React)
- [ ] ไม่มี memory leaks
- [ ] ใช้ caching ที่เหมาะสม

---

## 🎯 SOLID Principles

### S — Single Responsibility

❌ **ไม่ดี:**
```typescript
class User {
  save() { /* save to DB */ }
  sendEmail() { /* send email */ }
  generateReport() { /* generate report */ }
}
```

✅ **ดี:**
```typescript
class User {
  save() { /* save to DB */ }
}

class EmailService {
  send() { /* send email */ }
}

class ReportGenerator {
  generate() { /* generate report */ }
}
```

### O — Open/Closed

✅ **เปิดให้ extend, ปิดให้ modify:**
```typescript
interface PaymentMethod {
  pay(amount: number): void
}

class CreditCard implements PaymentMethod {
  pay(amount: number) { /* ... */ }
}

class PayPal implements PaymentMethod {
  pay(amount: number) { /* ... */ }
}
```

### L — Liskov Substitution

✅ **Subclass ต้องใช้แทน parent class ได้:**
```typescript
class Bird {
  fly() { /* ... */ }
}

class Sparrow extends Bird {
  fly() { /* ... */ } // ✅ ใช้ได้
}

// ❌ Penguin ไม่ควร extend Bird เพราะบินไม่ได้
```

### I — Interface Segregation

✅ **แยก interface ให้เล็ก:**
```typescript
interface Readable {
  read(): string
}

interface Writable {
  write(data: string): void
}

class File implements Readable, Writable {
  read() { /* ... */ }
  write(data: string) { /* ... */ }
}
```

### D — Dependency Inversion

✅ **Depend on abstractions, not concretions:**
```typescript
interface Database {
  save(data: any): void
}

class PostgreSQL implements Database {
  save(data: any) { /* ... */ }
}

class UserService {
  constructor(private db: Database) {} // ✅ Depend on interface
  
  createUser(data: any) {
    this.db.save(data)
  }
}
```

---

## 🧹 Clean Code Principles

### 1. Meaningful Names

❌ **ไม่ดี:**
```typescript
const d = new Date()
const x = users.filter(u => u.a > 18)
```

✅ **ดี:**
```typescript
const currentDate = new Date()
const adultUsers = users.filter(user => user.age > 18)
```

### 2. Functions Should Do One Thing

❌ **ไม่ดี:**
```typescript
function processOrder(order) {
  // Validate
  if (!order.customerId) throw new Error('Invalid')
  
  // Calculate
  const total = order.items.reduce((sum, item) => sum + item.price, 0)
  
  // Save
  database.save(order)
  
  // Send email
  emailService.send(order.customerId, 'Order created')
}
```

✅ **ดี:**
```typescript
function processOrder(order) {
  validateOrder(order)
  const total = calculateTotal(order)
  saveOrder(order)
  sendOrderConfirmation(order)
}
```

### 3. Avoid Magic Numbers

❌ **ไม่ดี:**
```typescript
if (user.age > 18) { /* ... */ }
if (order.status === 1) { /* ... */ }
```

✅ **ดี:**
```typescript
const ADULT_AGE = 18
if (user.age > ADULT_AGE) { /* ... */ }

enum OrderStatus {
  PENDING = 1,
  COMPLETED = 2
}
if (order.status === OrderStatus.PENDING) { /* ... */ }
```

### 4. DRY (Don't Repeat Yourself)

❌ **ไม่ดี:**
```typescript
const user1Total = user1.orders.reduce((sum, o) => sum + o.total, 0)
const user2Total = user2.orders.reduce((sum, o) => sum + o.total, 0)
```

✅ **ดี:**
```typescript
function calculateUserTotal(user) {
  return user.orders.reduce((sum, o) => sum + o.total, 0)
}

const user1Total = calculateUserTotal(user1)
const user2Total = calculateUserTotal(user2)
```

---

## 🚨 Code Smells

### 1. Long Function

❌ **ไม่ดี:** ฟังก์ชันยาวเกิน 20 lines

✅ **ดี:** แยกเป็นฟังก์ชันเล็กๆ

### 2. Large Class

❌ **ไม่ดี:** Class มี methods เยอะเกินไป

✅ **ดี:** แยกเป็น classes เล็กๆ

### 3. Too Many Parameters

❌ **ไม่ดี:**
```typescript
function createUser(name, email, age, address, phone, country) { /* ... */ }
```

✅ **ดี:**
```typescript
interface UserData {
  name: string
  email: string
  age: number
  address: string
  phone: string
  country: string
}

function createUser(data: UserData) { /* ... */ }
```

### 4. Nested If

❌ **ไม่ดี:**
```typescript
if (user) {
  if (user.isActive) {
    if (user.age > 18) {
      // ...
    }
  }
}
```

✅ **ดี:**
```typescript
if (!user) return
if (!user.isActive) return
if (user.age <= 18) return

// ...
```

---

## 🔍 Code Review Checklist

### ก่อน Review

- [ ] อ่าน requirement
- [ ] อ่าน design doc
- [ ] เข้าใจ context

### ระหว่าง Review

- [ ] โค้ดทำตาม requirement ไหม?
- [ ] มี tests ไหม?
- [ ] มี security issues ไหม?
- [ ] มี performance issues ไหม?
- [ ] อ่านง่ายไหม?
- [ ] มี documentation ไหม?

### หลัง Review

- [ ] ให้ feedback ที่สร้างสรรค์
- [ ] Approve หรือ Request changes
- [ ] Follow up

---

## 📊 Metrics

### ติดตาม

- **Code Coverage** — > 80%
- **Cyclomatic Complexity** — < 10
- **Function Length** — < 20 lines
- **File Length** — < 300 lines

---

## 🎓 สรุป

**ก่อน Commit:**
- ✅ Code style ถูกต้อง
- ✅ มี tests
- ✅ ไม่มี security issues
- ✅ มี documentation

**Clean Code:**
- ✅ Meaningful names
- ✅ Functions do one thing
- ✅ No magic numbers
- ✅ DRY

**SOLID:**
- ✅ Single Responsibility
- ✅ Open/Closed
- ✅ Liskov Substitution
- ✅ Interface Segregation
- ✅ Dependency Inversion

---

> **"Code quality = ความรับผิดชอบของทุกคน"** ✅
