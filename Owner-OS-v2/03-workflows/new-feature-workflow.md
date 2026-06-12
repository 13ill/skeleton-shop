# New Feature Workflow

> Step-by-step สำหรับสร้าง feature ใหม่

---

## 📋 Checklist

### Phase 1: Discovery (Gate 0-3)

- [ ] **Gate 0:** รับ feature request + AI Model Selection + Progress Log
  - เข้าใจว่า feature คืออะไร
  - รู้ว่า user คือใคร
  - กำหนดขอบเขต
  - เช็ค Owner Escalation
  - **คำถามเพื่อเลือก AI Model:**
    1. งานนี้ใหญ่แค่ไหน? (เล็ก/กลาง/ใหญ่)
    2. ซับซ้อนแค่ไหน? (ง่าย/ปานกลาง/ซับซ้อน)
    3. ด่วนแค่ไหน? (ด่วนมาก/ด่วน/ไม่ด่วน)
    4. สำคัญแค่ไหนต่อธุรกิจ? (Critical/Important/Normal)
  - **AI เลือก Mode และ Model ตามคำตอบ** (หรือ user สามารถ override)
  - **บันทึก Progress Log:** "Gate 0 รับ feature request เสร็จ - เลือก Mode: [mode], Model: [model]"

- [ ] **Gate 1:** ทำความเข้าใจธุรกิจ + Business Coach Analysis
  - ทำไมต้องมี feature นี้?
  - แก้ปัญหาอะไร?
  - Success criteria คืออะไร?
  - **ROI:** คุ้มค่าต่อการทำไหม? ใช้ทรัพยากรเท่าไหร่ ได้ผลลัพธ์เท่าไหร่?
  - **UX:** มีผลต่อประสบการณ์ผู้ใช้อย่างไร? ผู้ใช้จะรู้สึกอย่างไร?
  - **Scalability:** จะช่วยสเกลธุรกิจในอนาคตได้อย่างไร? รองรับ user เพิ่ม 10x ไหม?
  - **Business Impact:** กระทบ revenue/cost/retention ไหม?
  - **Risk:** ถ้าพังจะเกิดอะไร? มี mitigation plan ไหม?

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
  - **สร้าง architecture doc + module doc ครั้งแรก (ถ้ายังไม่มี)** ⭐

- [ ] **Gate 7:** ลงมือทำ + Progress Log
  - เขียนโค้ด
  - เขียน tests
  - เขียน documentation
  - **บันทึก Progress Log:** "Gate 7 ลงมือทำเสร็จ"

### Phase 4: Quality Assurance (Gate 8-9)

- [ ] **Gate 8:** Review
  - Code review
  - Test coverage
  - Security check
  - Performance check

- [ ] **Gate 8.5:** Architecture Review
  - อัปเดต architecture docs
  - อัปเดต dependency map

- [ ] **Gate 9:** Learning + Progress Log
  - เรียนรู้อะไร?
  - Skill ไหนที่พัฒนา?
  - บันทึก lesson log
  - **บันทึก Progress Log:** "Review เสร็จ - ส่งงานรอ User ยืนยัน"

### Phase 5: User Confirmation

- [ ] **User Confirmation**
  - ส่งงานพร้อมผลการตรวจสอบให้ User
  - **บันทึก Progress Log:** "ส่งงานรอ User ยืนยัน"
  - รอ User ยืนยันหรือขอแก้ไข

**ถ้า User ยืนยัน:**
- บันทึก Progress Log: "User ยืนยันงาน - เสร็จสมบูรณ์"
- สิ้นสุด workflow

**ถ้า User ขอแก้ไข:**
- บันทึก Progress Log: "User ขอแก้ไข - กลับไป Gate 6-7"
- กลับไป Gate 6-7 แก้ไข

---

## 💡 Tips

- ใช้ HTML checklist ตอนคุยกับลูกค้า
- บันทึก decision ทุกครั้ง
- ถ้าติดขัด ย้อนกลับไป gate ก่อนหน้า

---

> **"Feature ที่ดี = ผ่านทุก gate"**
