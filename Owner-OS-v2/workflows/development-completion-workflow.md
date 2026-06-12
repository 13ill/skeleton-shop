---
description: Development Task Completion Workflow — ขั้นตอนมาตรฐานเมื่อทำงานเสร็จ
---

# 🔄 Development Completion Workflow

**Purpose:** ขั้นตอนมาตรฐานที่ต้องทำทุกครั้งเมื่อได้รับคำสั่งให้ทำงานหรือแก้โค้ด และทำเสร็จแล้ว

**Trigger:** เมื่อทำงาน development task เสร็จ (feature ใหม่, bug fix, refactor)

---

## 📋 Workflow Steps

### Step 1: ทำงานตามแผน/คำสั่ง
- ทำตาม requirements ที่ได้รับ
- ปฏิบัติตาม Gate System (ถ้ามี)
- เขียนโค้ดตาม best practices

### Step 2: Recheck — ตรวจสอบความถูกต้อง
```bash
# Backend
- รัน migrations (ถ้ามี): php artisan migrate
- เช็ค syntax errors: php artisan route:list
- ทดสอบ API endpoints (manual หรือ automated)

# Frontend  
- เช็ค build: npm run build (ต้องผ่าน)
- เช็ค lint warnings (แก้ critical, ignore minor)
- ทดสอบ UI ใน browser
```

**Output:** รายการสิ่งที่ตรวจสอบแล้ว + ผลลัพธ์

### Step 3: Reverse Engineer — วิเคราะห์ Flow
อ่านโค้ดที่เขียนใหม่ + โค้ดที่แก้ไข แล้วอธิบาย:

1. **Data Flow:** ข้อมูลไหลจากไหนไปไหน (Frontend → API → DB → Response)
2. **Key Logic:** Logic สำคัญทำอะไร (เช่น tax calculation, stock validation)
3. **Side Effects:** มีผลข้างเคียงอะไรบ้าง (DB changes, state updates)
4. **Edge Cases:** จัดการ error/edge cases ยังไง

**Format:**
```markdown
## Flow Analysis

### Flow 1: [ชื่อ Flow]
1. User action → ...
2. Frontend → API call
3. Backend → validation
4. DB → transaction
5. Response → UI update

### Key Logic
- Tax calculation: subtotal × tax_rate (from DB, not frontend)
- Security: Backend recalculates to prevent tampering

### Edge Cases Handled
- ✅ Stock insufficient → reject sale
- ✅ Migration already run → skip with hasColumn()
```

### Step 4: ทดสอบว่าใช้งานได้จริงหรือยัง
// turbo
```bash
# Manual Testing Checklist
- [ ] Happy path: ทำงานปกติสำเร็จ
- [ ] Error handling: กรอกข้อมูลผิด/ไม่ครบ → แสดง error ถูกต้อง
- [ ] Edge cases: ทดสอบกรณีพิเศษ (เช่น สต็อกไม่พอ, ยกเลิกบิล)
- [ ] Backward compatibility: ระบบเดิมยังทำงานได้ปกติ
```

**Output:** รายการ test cases + ผลลัพธ์

### Step 5: บันทึก Progress
อัปเดตไฟล์ documentation:

#### 5.1 Progress Log
**File:** `docs/08-implementation/progress-log.md`

เพิ่ม section ใหม่:
```markdown
## [Phase/Week X] Summary (วันที่) ⚠️ Pending Approval

**Duration:** X hours
**Status:** ✅ Complete (รอ User Confirm)
**Achievement:** [สรุปสั้นๆ]

### What We Built:
- ✅ [Feature 1]
- ✅ [Feature 2]

### Key Features:
- ✅ [Feature detail]

### Technical Highlights:
- ✅ [Technical decision]

### Issues Fixed:
- ⚠️ [Issue] → Fixed: [Solution]

### Verification:
- ✅ [Test result]

### Lessons Learned:
1. **[Topic]:** [Lesson]

**Next:** รอ User Approval → [Next Phase]
```

#### 5.2 Completion Report (สำหรับงานใหญ่)
**File:** `docs/08-implementation/[phase-name]-completion.md`

สร้างเอกสารรายละเอียดเต็ม:
- What Was Done (รายละเอียดทุก file ที่แก้)
- Data Flow Analysis (flow diagrams)
- Verification Tests (test cases + results)
- Known Issues (ถ้ามี)
- Database State (schema changes)
- Impact Analysis (backward compatibility)
- Lessons Learned

#### 5.3 Update Timeline
**Files:** `CONTINUE.md`, `README.md`

อัปเดต progress bars:
```markdown
Week X: [████████████████████] 100% ✅ [Phase Name]
Overall: [████████████████░░░░] X% Complete
```

### Step 6: ระบุสถานะ "Pending Approval"
⚠️ **สำคัญ:** ทุก progress log ต้องระบุชัดเจนว่า:

```markdown
**Status:** ✅ Complete (รอ User Confirm)
⚠️ Pending Approval
```

**เหตุผล:**
- ให้ user รับรู้ว่างานเสร็จแล้ว แต่ยังไม่ได้ verify
- ป้องกันความเข้าใจผิดว่า "เสร็จแล้ว = ใช้งานได้แน่นอน"
- เปิดโอกาสให้ user review ก่อน approve

### Step 7: สรุปส่งงาน
สร้าง summary message:

```markdown
# ✅ [Phase/Task Name] Complete

## สิ่งที่ทำเสร็จ
- [List of deliverables]

## Flow Analysis
[Key flows explained]

## Verification
- ✅ [Test results]

## Documentation
- 📄 [File 1]
- 📄 [File 2]

**Status:** ✅ Complete — รอ User Approval ก่อนไป [Next Phase]
```

---

## 🎯 Success Criteria

งานถือว่า "เสร็จสมบูรณ์" เมื่อ:

- [x] โค้ดทำงานได้ตาม requirements
- [x] ผ่าน recheck (no critical errors)
- [x] มี flow analysis อธิบายชัดเจน
- [x] ทดสอบแล้ว (manual/automated)
- [x] บันทึก progress log แล้ว
- [x] ระบุ "Pending Approval" ชัดเจน
- [x] สรุปส่งงานให้ user review

---

## 📝 Template: Quick Summary

ใช้ template นี้สำหรับงานเล็ก:

```markdown
# ✅ [Task Name] Complete

**What:** [1-line description]
**Files Changed:** [list]
**Tested:** [yes/no + how]
**Status:** ⚠️ Pending Approval

## Key Changes
- [Change 1]
- [Change 2]

## Verification
- ✅ [Test 1]
- ✅ [Test 2]

**Next:** รอ User Confirm
```

---

## 🚨 Common Mistakes to Avoid

1. ❌ **ไม่ทดสอบก่อนส่งงาน** → ต้องทดสอบ happy path อย่างน้อย
2. ❌ **ไม่อธิบาย flow** → user ไม่รู้ว่าโค้ดทำงานยังไง
3. ❌ **ไม่บันทึก progress** → ลืมว่าทำอะไรไปแล้ว
4. ❌ **ไม่ระบุ "Pending Approval"** → user คิดว่าใช้งานได้เลย แต่จริงๆ ยังไม่ได้ verify
5. ❌ **เขียน documentation แบบ "ทำแล้ว ✅"** → ควรเขียน "ทำแล้ว รอ confirm ⚠️"

---

## 🎓 Why This Workflow Matters

### For Developer (AI)
- มีขั้นตอนชัดเจน ไม่พลาด
- ฝึก reverse engineering → เข้าใจโค้ดลึกขึ้น
- สร้าง documentation ไปพร้อมกัน

### For Owner (User)
- รู้ว่างานเสร็จแล้ว แต่ยังไม่ได้ approve
- มี documentation ครบ review ง่าย
- เห็น flow ชัดเจน ตัดสินใจได้เร็ว

### For Project
- Progress tracking ชัดเจน
- Knowledge transfer ง่าย (มี flow analysis)
- Debugging ง่าย (มี completion report)

---

## 📚 Related Workflows

- `/gate-selector` — เลือก gate mode ก่อนเริ่มงาน
- `/coaching-mode` — อธิบายสิ่งที่เรียนรู้หลังจบงาน
- `/checkpoint` — บันทึกงานค้างเมื่อหยุดชั่วคราว

---

> **Auto-trigger:** ใช้ workflow นี้ทุกครั้งที่ได้รับคำสั่ง "ทำตามแผน" หรือ "แก้โค้ด" และทำเสร็จแล้ว
