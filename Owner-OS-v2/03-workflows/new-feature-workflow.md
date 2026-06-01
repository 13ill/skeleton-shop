# New Feature Workflow

> Step-by-step สำหรับสร้าง feature ใหม่

---

## 📋 Checklist

### Phase 1: Discovery (Gate 0-3)

- [ ] **Gate 0:** รับ feature request
  - เข้าใจว่า feature คืออะไร
  - รู้ว่า user คือใคร
  - กำหนดขอบเขต
  - เช็ค Owner Escalation

- [ ] **Gate 1:** ทำความเข้าใจธุรกิจ
  - ทำไมต้องมี feature นี้?
  - แก้ปัญหาอะไร?
  - Success criteria คืออะไร?

- [ ] **Gate 2:** ทำความเข้าใจระบบ
  - Feature นี้เกี่ยวกับ module ไหน?
  - กระทบระบบอื่นไหม?
  - Dependency มีอะไรบ้าง?

- [ ] **Gate 3:** ค้นหาความเสี่ยง
  - ถ้าพังจะเกิดอะไร?
  - Rollback ทำได้ไหม?
  - มี mitigation plan ไหม?

### Phase 2: Design (Gate 4-5)

- [ ] **Gate 4:** ออกแบบ Solution
  - เสนอ 2-3 ทางเลือก
  - วิเคราะห์ tradeoff
  - ออกแบบ architecture
  - เลือก tech stack

- [ ] **Gate 5:** ตัดสินใจ
  - เลือกทางที่เหมาะสม
  - มีเหตุผลชัดเจน
  - รอ user confirm
  - บันทึก decision log

### Phase 3: Implementation (Gate 6-7)

- [ ] **Gate 6:** วางแผน
  - แบ่งงานเป็น tasks
  - ประเมินเวลา
  - กำหนด priority

- [ ] **Gate 7:** ลงมือทำ
  - เขียนโค้ด
  - เขียน tests
  - เขียน documentation

### Phase 4: Quality Assurance (Gate 8-9)

- [ ] **Gate 8:** Review
  - Code review
  - Test coverage
  - Security check
  - Performance check

- [ ] **Gate 8.5:** Architecture Review
  - อัปเดต architecture docs
  - อัปเดต dependency map

- [ ] **Gate 9:** Learning
  - เรียนรู้อะไร?
  - Skill ไหนที่พัฒนา?
  - บันทึก lesson log

---

## 💡 Tips

- ใช้ HTML checklist ตอนคุยกับลูกค้า
- บันทึก decision ทุกครั้ง
- ถ้าติดขัด ย้อนกลับไป gate ก่อนหน้า

---

> **"Feature ที่ดี = ผ่านทุก gate"**
