# Estimation Template

> Template สำหรับประเมินเวลาทำงาน

---

## 📝 Template

```markdown
# Estimation: [Task Name]

Date: [YYYY-MM-DD]
Estimator: [ชื่อ]

---

## 🎯 Task Overview

**Task:** [ชื่องาน]

**Description:** [อธิบายงาน]

**Scope:**
- ✅ In scope: [...]
- ❌ Out of scope: [...]

---

## 📋 Breakdown

### Subtask 1: [Subtask Name]

**Description:** [อธิบาย]

**Complexity:** [Low / Medium / High]

**Estimated Time:** [X hours]

**Dependencies:** [ต้องรอ subtask ไหน]

**Risks:** [ความเสี่ยง]

### Subtask 2: [Subtask Name]

[...]

---

## ⏱️ Time Estimation

| Subtask | Complexity | Best Case | Likely Case | Worst Case |
|---|---|---|---|---|
| Subtask 1 | Medium | 2h | 4h | 8h |
| Subtask 2 | High | 4h | 8h | 16h |
| Subtask 3 | Low | 1h | 2h | 4h |
| **Total** | | **7h** | **14h** | **28h** |

**Recommended Estimate:** [Likely Case] = **14 hours**

**Buffer:** +20% = **17 hours**

**Final Estimate:** **2-3 days**

---

## 🚨 Risks & Assumptions

### Risks

1. **[Risk 1]**
   - Impact: [High / Medium / Low]
   - Probability: [High / Medium / Low]
   - Mitigation: [วิธีลดความเสี่ยง]

2. **[Risk 2]**
   [...]

### Assumptions

- [Assumption 1]
- [Assumption 2]

---

## 📊 Confidence Level

**Confidence:** [High / Medium / Low]

**Reason:** [เหตุผล]

---

## 🔄 Re-estimation Triggers

Re-estimate ถ้า:
- [ ] Scope เปลี่ยน
- [ ] เจอ blocker ใหม่
- [ ] Complexity สูงกว่าที่คิด
- [ ] ใช้เวลามากกว่า 50% ของ estimate

---

## 📝 Notes

[บันทึกอื่นๆ]
```

---

## 🎯 ตัวอย่าง

```markdown
# Estimation: Orders Module

Date: 2026-06-01
Estimator: Developer

---

## 🎯 Task Overview

**Task:** สร้าง Orders Module สำหรับระบบ POS

**Description:** 
สร้าง module สำหรับจัดการออเดอร์ รวมถึง:
- สร้างออเดอร์
- อัปเดตสถานะ
- ยกเลิกออเดอร์
- ดึงข้อมูลออเดอร์

**Scope:**
- ✅ In scope: CRUD operations, Payment integration, Tests
- ❌ Out of scope: Reports, Notifications

---

## 📋 Breakdown

### Subtask 1: Database Schema

**Description:** สร้าง Prisma schema สำหรับ orders และ order_items

**Complexity:** Low

**Estimated Time:** 1 hour

**Dependencies:** ไม่มี

**Risks:** ไม่มี

### Subtask 2: Orders Service

**Description:** เขียน business logic สำหรับ orders

**Complexity:** Medium

**Estimated Time:** 4 hours

**Dependencies:** Subtask 1 (Database Schema)

**Risks:** อาจต้อง integrate กับ Products Module (ยังไม่มี)

### Subtask 3: Orders Repository

**Description:** เขียน data access layer

**Complexity:** Low

**Estimated Time:** 2 hours

**Dependencies:** Subtask 1 (Database Schema)

**Risks:** ไม่มี

### Subtask 4: Payment Integration

**Description:** Integrate Stripe payment

**Complexity:** High

**Estimated Time:** 6 hours

**Dependencies:** Subtask 2 (Orders Service)

**Risks:** 
- ยังไม่เคยใช้ Stripe
- ต้องรอ API key

### Subtask 5: Tests

**Description:** เขียน unit tests และ integration tests

**Complexity:** Medium

**Estimated Time:** 4 hours

**Dependencies:** Subtask 2, 3, 4

**Risks:** ไม่มี

### Subtask 6: Documentation

**Description:** เขียน API docs และ module docs

**Complexity:** Low

**Estimated Time:** 1 hour

**Dependencies:** Subtask 2, 3, 4

**Risks:** ไม่มี

---

## ⏱️ Time Estimation

| Subtask | Complexity | Best Case | Likely Case | Worst Case |
|---|---|---|---|---|
| Database Schema | Low | 0.5h | 1h | 2h |
| Orders Service | Medium | 2h | 4h | 8h |
| Orders Repository | Low | 1h | 2h | 4h |
| Payment Integration | High | 4h | 6h | 12h |
| Tests | Medium | 2h | 4h | 8h |
| Documentation | Low | 0.5h | 1h | 2h |
| **Total** | | **10h** | **18h** | **36h** |

**Recommended Estimate:** [Likely Case] = **18 hours**

**Buffer:** +20% = **22 hours**

**Final Estimate:** **3 days** (ทำ 8 ชม/วัน)

---

## 🚨 Risks & Assumptions

### Risks

1. **Stripe Integration ซับซ้อนกว่าที่คิด**
   - Impact: High
   - Probability: Medium
   - Mitigation: อ่าน Stripe docs ก่อน, ถาม ChatGPT

2. **ยังไม่มี Products Module**
   - Impact: Medium
   - Probability: High
   - Mitigation: Mock Products Service ไปก่อน

3. **รอ Stripe API key**
   - Impact: High
   - Probability: Low
   - Mitigation: ขอ API key ล่วงหน้า

### Assumptions

- มี Prisma setup แล้ว
- มี NextAuth setup แล้ว
- มี Stripe account แล้ว
- ไม่ต้องทำ UI (มีทีมอื่นทำ)

---

## 📊 Confidence Level

**Confidence:** Medium

**Reason:** 
- ✅ เคยทำ CRUD มาก่อน
- ⚠️ ยังไม่เคยใช้ Stripe
- ⚠️ Products Module ยังไม่มี

---

## 🔄 Re-estimation Triggers

Re-estimate ถ้า:
- [ ] Scope เปลี่ยน (เพิ่ม features)
- [ ] Stripe integration ซับซ้อนกว่าที่คิด
- [ ] ต้องทำ Products Module ด้วย
- [ ] ใช้เวลามากกว่า 9 ชม (50% ของ 18h)

---

## 📝 Notes

- ถ้า Stripe ซับซ้อนมาก อาจต้องใช้เวลา 1-2 วันเพิ่ม
- ควร mock Products Service ไปก่อน แล้วค่อย integrate ทีหลัง
```

---

## 💡 Tips

### Estimation Best Practices

1. **แบ่งงานเป็น subtasks เล็กๆ**
   - แต่ละ subtask ไม่เกิน 1 วัน

2. **ประเมิน 3 กรณี**
   - Best case (ทุกอย่างลื่นไหล)
   - Likely case (ปกติ)
   - Worst case (เจอปัญหา)

3. **เพิ่ม buffer 20%**
   - เผื่อเจอปัญหาไม่คาดคิด

4. **ระบุ risks และ assumptions**
   - รู้ว่าอะไรที่อาจทำให้ estimate ผิด

5. **Re-estimate เมื่อจำเป็น**
   - ถ้าใช้เวลามากกว่า 50% ของ estimate แล้วยังไม่เสร็จครึ่ง

---

> **"Estimate ที่ดี = วางแผนได้ดี"**
