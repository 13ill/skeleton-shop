# Checkpoint Template

> Template สำหรับบันทึก checkpoint เมื่อหยุดงานชั่วคราว

---

## 📝 Template (YAML Format)

```yaml
---
checkpoint_id: CP-YYYYMMDD-HHMM
timestamp: YYYY-MM-DD HH:MM:SS
task_id: TASK-XXX
task_name: [ชื่องาน]
status: [in_progress / paused / blocked]
priority: [high / medium / low]
gate_mode: [full / quick / hotfix / owner]
current_gate: [gate-X]
---

## Progress Summary

[สรุปความคืบหน้าโดยรวม 2-3 ประโยค]

## Current Status

**What I'm doing:**
[กำลังทำอะไรอยู่]

**Progress:**
- [x] Task 1 — เสร็จแล้ว
- [ ] Task 2 — กำลังทำ (50%)
- [ ] Task 3 — ยังไม่เริ่ม

**Current Gate:** [gate-X]

**Gate Progress:**
- [x] Checklist item 1
- [ ] Checklist item 2
- [ ] Checklist item 3

## Files Modified

[รายการไฟล์ที่แก้]
- `src/module/file1.ts` — [ทำอะไร]
- `src/module/file2.ts` — [ทำอะไร]

## Important Context

[ข้อมูลสำคัญที่ต้องจำ]

### Decisions Made

- [Decision 1]
- [Decision 2]

### Issues Found

- [Issue 1]
- [Issue 2]

### Notes

[บันทึกอื่นๆ]

## Next Steps

[ขั้นตอนถัดไปที่ต้องทำ]

1. [ ] [Step 1]
2. [ ] [Step 2]
3. [ ] [Step 3]

## Blockers

[สิ่งที่ block งาน (ถ้ามี)]

- [ ] [Blocker 1]
- [ ] [Blocker 2]

## Estimated Time to Complete

[เวลาที่คาดว่าจะเสร็จ]

## Related Logs

- Decision: [DEC-XXX]
- Lesson: [LES-XXX]
- Investigation: [INV-XXX]
```

---

## 🎯 ตัวอย่าง

```yaml
---
checkpoint_id: CP-20260601-1430
timestamp: 2026-06-01 14:30:00
task_id: TASK-001
task_name: สร้างระบบ POS - Orders Module
status: in_progress
priority: high
gate_mode: full
current_gate: gate-7
---

## Progress Summary

กำลังเขียน Orders Service และ Repository เสร็จแล้ว 60%
ยังเหลือ payment integration และ tests

## Current Status

**What I'm doing:**
เขียน Orders Service — createOrder() function

**Progress:**
- [x] Orders Service — 80%
- [x] Orders Repository — 100%
- [ ] Payment Integration — 0%
- [ ] Tests — 0%

**Current Gate:** gate-7 (Execution)

**Gate Progress:**
- [x] โค้ดทำงานได้ถูกต้อง (partial)
- [ ] Follow best practices
- [ ] มี tests ครอบคลุม 80%+
- [ ] มี documentation

## Files Modified

- `src/modules/orders/orders.service.ts` — เพิ่ม createOrder()
- `src/modules/orders/orders.repository.ts` — เพิ่ม insert()
- `src/modules/orders/orders.types.ts` — เพิ่ม types

## Important Context

### Decisions Made

- ใช้ Prisma แทน raw SQL (DEC-003)
- ใช้ Stripe สำหรับ payment (DEC-004)

### Issues Found

- Prisma schema ต้องเพิ่ม relation ระหว่าง orders และ order_items

### Notes

- Payment integration ต้องรอ Stripe API key จาก owner
- Tests จะเขียนหลังจาก payment integration เสร็จ

## Next Steps

1. [ ] แก้ Prisma schema (เพิ่ม relation)
2. [ ] รอ Stripe API key
3. [ ] Integrate Stripe payment
4. [ ] เขียน tests (TDD)
5. [ ] เขียน documentation

## Blockers

- [ ] รอ Stripe API key จาก owner (ETA: วันนี้ 16:00)

## Estimated Time to Complete

- Payment Integration: 2 ชม
- Tests: 3 ชม
- Documentation: 1 ชม
- **Total: 6 ชม** (เสร็จพรุ่งนี้ 12:00)

## Related Logs

- Decision: DEC-003, DEC-004
- Lesson: ไม่มี (ยังไม่เจอปัญหา)
- Investigation: ไม่มี
```

---

## 💡 Tips

### เมื่อไหร่ควรสร้าง Checkpoint

- ✅ เมื่อหยุดงานชั่วคราว (ไปทานข้าว ไปประชุม)
- ✅ เมื่อเลิกงานประจำวัน
- ✅ เมื่อเจอ blocker
- ✅ เมื่อเปลี่ยนไปทำงานอื่น

### Checkpoint ที่ดี

- ✅ สรุปสถานะชัดเจน
- ✅ ระบุ next steps
- ✅ ระบุ blockers (ถ้ามี)
- ✅ ประเมินเวลาที่เหลือ

---

> **"Checkpoint ที่ดี = กลับมาทำต่อได้ง่าย"**
