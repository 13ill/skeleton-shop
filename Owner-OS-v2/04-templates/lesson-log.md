# Lesson Log Template

> บันทึกบทเรียนที่เรียนรู้

---

## 📝 Template

```yaml
---
lesson_id: LES-XXX
date: YYYY-MM-DD
task: [ชื่องาน/โปรเจกต์]
category: [Technical / Business / Process / Mindset]
---

## What I Learned (เรียนรู้อะไร)

[อธิบายว่าเรียนรู้อะไร]

## Why It Matters (ทำไมสำคัญ)

[อธิบายว่าทำไมสำคัญ]

## Context (บริบท)

[สถานการณ์ที่เกิดขึ้น]

## What Happened (เกิดอะไรขึ้น)

[เล่าเรื่องที่เกิดขึ้น]

## What I Did Wrong (ทำผิดตรงไหน)

[ถ้ามีความผิดพลาด]

## What I Should Have Done (ควรทำยังไง)

[วิธีที่ถูกต้อง]

## Next Time (ครั้งหน้าจะทำยังไง)

[แผนสำหรับครั้งหน้า]

## Related Decisions

[ถ้ามี decision ที่เกี่ยวข้อง]
- DEC-XXX

## Tags

[tags สำหรับค้นหา]
```

---

## 🎯 ตัวอย่าง

### Lesson 1: ถามคำถามก่อนเขียนโค้ด

```yaml
---
lesson_id: LES-001
date: 2026-06-01
task: ระบบ POS
category: Process
---

## What I Learned

ต้องถามคำถามให้ครบก่อนเขียนโค้ด ไม่ใช่กระโดดเข้าไปเขียนทันที

## Why It Matters

ถ้าไม่ถามคำถาม จะทำผิดทิศทาง เสียเวลาเขียนโค้ดใหม่

## Context

ลูกค้าขอทำหน้า login ฉันเขียนโค้ดทันทีโดยไม่ถามคำถาม

## What Happened

เขียนเสร็จแล้วลูกค้าบอกว่าต้องการ social login ด้วย
ต้องเขียนใหม่ทั้งหมด เสียเวลา 2 วัน

## What I Did Wrong

- ไม่ถามว่าต้องการ social login ไหม
- ไม่ถามว่า forgot password ต้องมีไหม
- ไม่ถามว่า 2FA ต้องมีไหม

## What I Should Have Done

ควรถามคำถาม Gate 0:
1. งานนี้คืออะไร?
2. ใครเป็น user?
3. ขอบเขตงานอยู่ตรงไหน?
4. Success criteria คืออะไร?
5. ข้อมูลอะไรที่ยังขาด?

## Next Time

- ใช้ Gate 0 checklist ทุกครั้ง
- ถามคำถามให้ครบก่อนเขียนโค้ด
- ขอ confirmation จากลูกค้า

## Related Decisions

ไม่มี (เพราะไม่ได้ตัดสินใจอะไร แค่กระโดดเข้าไปทำ)

## Tags

#gate-0 #ask-before-assume #process
```

### Lesson 2: ใช้ TDD ทำให้ Refactor ได้อุ่นใจ

```yaml
---
lesson_id: LES-002
date: 2026-06-01
task: ระบบ POS - Payment Module
category: Technical
---

## What I Learned

ใช้ TDD ทำให้ refactor ได้อุ่นใจ เพราะมี tests คุ้มครอง

## Why It Matters

ถ้าไม่มี tests จะกลัว refactor กลัวทำพัง
มี tests = refactor ได้อุ่นใจ

## Context

Payment module มี code ที่ซับซ้อน ต้องการ refactor

## What Happened

เขียน tests ก่อน (TDD) แล้ว refactor
Tests ผ่านทั้งหมด มั่นใจว่าไม่ทำพัง

## What I Did Right

- เขียน tests ครอบคลุม 90%
- Refactor ทีละนิด
- รัน tests บ่อยๆ

## Next Time

- ใช้ TDD ทุกครั้ง
- เขียน tests ก่อนเขียน code
- Refactor เมื่อมี tests

## Related Decisions

- DEC-005: เลือกใช้ TDD

## Tags

#tdd #testing #refactoring #technical
```

---

## 💡 Tips

### เมื่อไหร่ควรเขียน Lesson Log

- ✅ เมื่อเรียนรู้อะไรใหม่
- ✅ เมื่อทำผิดพลาด
- ✅ เมื่อเจอปัญหาที่น่าสนใจ
- ✅ เมื่อแก้ปัญหาได้

### หมวดหมู่

- **Technical** — เทคนิค เครื่องมือ
- **Business** — ธุรกิจ การตลาด
- **Process** — กระบวนการทำงาน
- **Mindset** — ความคิด ทัศนคติ

### Tags ที่ควรมี

- `#gate-X` — Gate ที่เกี่ยวข้อง
- `#tdd` — TDD
- `#testing` — Testing
- `#architecture` — Architecture
- `#refactoring` — Refactoring
- `#debugging` — Debugging
- `#process` — Process
- `#mindset` — Mindset

---

> **"เรียนรู้ทุกครั้ง = เติบโตทุกวัน"**
