# Bug Fix Workflow

> Step-by-step สำหรับแก้ bug

---

## 🐛 Quick Mode (ใช้ Hotfix Mode)

### สำหรับ Production Bug ด่วน

- [ ] **Gate 0:** Symptom
  - อาการคืออะไร?
  - User กระทบไหม?
  - Urgent จริงหรือไม่?

- [ ] **Gate 7:** Fix
  - แก้ยังไง?
  - Rollback ได้ไหม?
  - Test แล้วหรือยัง?

**⚠️ หลังแก้เสร็จ:**
- ต้องทำ Full Mode ทีหลัง (หา root cause)
- บันทึก investigation log
- บันทึก lesson log

---

## 🔍 Full Mode (ใช้เมื่อไม่ด่วน)

### Phase 1: Investigation

- [ ] **Gate 0:** รับ bug report + AI Model Selection
  - อาการคืออะไร?
  - Reproduce ได้ไหม?
  - Priority เท่าไหร่?
  - **คำถามเพื่อเลือก AI Model:**
    1. งานนี้ใหญ่แค่ไหน? (เล็ก/กลาง/ใหญ่)
    2. ซับซ้อนแค่ไหน? (ง่าย/ปานกลาง/ซับซ้อน)
    3. ด่วนแค่ไหน? (ด่วนมาก/ด่วน/ไม่ด่วน)
    4. สำคัญแค่ไหนต่อธุรกิจ? (Critical/Important/Normal)
  - **AI เลือก Mode และ Model ตามคำตอบ** (หรือ user สามารถ override)

- [ ] **Gate 1:** Business Impact + Business Coach Analysis
  - กระทบ user แค่ไหน?
  - กระทบ revenue ไหม?
  - **ROI:** แก้ bug นี้คุ้มค่าต่อการทำไหม? เทียบกับทรัพยากรที่ใช้
  - **UX:** มีผลต่อประสบการณ์ผู้ใช้อย่างไร? ผู้ใช้จะรู้สึกอย่างไรเมื่อแก้แล้ว?
  - **Business Impact:** ถ้าไม่แก้จะเกิดอะไร? แก้แล้วจะได้อะไร?
  - **Risk:** ถ้าแก้ผิดจะเกิดอะไร? มี mitigation plan ไหม?

- [ ] **Gate 2:** System Investigation
  - Bug อยู่ที่ module ไหน?
  - กระทบระบบอื่นไหม?

- [ ] **Gate 3:** Root Cause Analysis
  - สาเหตุที่แท้จริงคืออะไร?
  - ทำไมถึงเกิด bug?
  - มี bug อื่นที่คล้ายกันไหม?

### Phase 2: Fix

- [ ] **Gate 4:** Solution Design
  - แก้ยังไง?
  - มีทางเลือกอื่นไหม?

- [ ] **Gate 5:** Decision
  - เลือกทางไหน?
  - ยอมรับความเสี่ยงอะไร?

- [ ] **Gate 6:** Planning
  - แบ่งงานเป็น tasks
  - ประเมินเวลา

- [ ] **Gate 7:** Execution
  - แก้ bug
  - เขียน regression tests
  - เขียน documentation

### Phase 3: Verification

- [ ] **Gate 8:** Review
  - แก้ถูกต้องหรือไม่?
  - มี side effects ไหม?
  - Tests ผ่านหรือไม่?

- [ ] **Gate 9:** Learning
  - ทำไมถึงเกิด bug?
  - จะป้องกันยังไงครั้งหน้า?
  - บันทึก lesson log

---

## 💡 Tips

- Bug ด่วน → Hotfix Mode
- Bug ไม่ด่วน → Full Mode
- หา root cause เสมอ
- เขียน regression tests

---

> **"แก้ bug ที่ root cause = ไม่เกิดซ้ำ"**
