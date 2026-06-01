# WIP Tracker — ติดตามงานค้าง

> ระบบติดตามงานที่กำลังทำ ป้องกันการลืม

---

## 🎯 ปัญหาที่แก้

```
สถานการณ์:
1. ทำงาน A ไป 30%
2. เจอ bug ด่วน → ไปแก้งาน B
3. งาน B เสร็จ → กลับมาทำงาน A ต่อ
4. ❌ ลืมว่าทำไปถึงไหน
5. ❌ ลืมว่าค้างอะไรอยู่
6. ❌ ต้องอ่านโค้ดใหม่ทั้งหมด
```

---

## ✅ โซลูชัน

AI ต้องทำอัตโนมัติ:

### เมื่อเริ่มงานใหม่

```
1. สร้างไฟล์ logs/wip/[task-id].md
2. เขียน:
   - งานคืออะไร
   - Gate ไหนที่ผ่านแล้ว
   - Gate ไหนที่ค้างอยู่
   - ไฟล์ไหนที่แก้ไปแล้ว
   - สิ่งที่ต้องทำต่อ
```

### เมื่อหยุดงานชั่วคราว

```
User: "หยุดก่อน ไปทำงานอื่นก่อน"

AI ทำอัตโนมัติ:
1. อัปเดต logs/wip/[task-id].md:
   - Progress: X%
   - ทำไปถึงไหน (checkpoint)
   - ค้างอะไรอยู่ (next steps)
   - Context สำคัญ (ต้องจำอะไร)
2. แจ้ง: "✅ บันทึก checkpoint แล้ว - กลับมาทำต่อได้เลย"
```

### เมื่อกลับมาทำต่อ

```
User: "กลับมาทำงานเดิมต่อ"

AI ทำอัตโนมัติ:
1. อ่าน logs/wip/[task-id].md
2. สรุปให้ user:
   "กลับมาที่งาน: [X]
    หยุดไปตอน: [Y]
    ค้างอยู่: [Z]
    พร้อมทำต่อไหม?"
3. โหลด context ที่เกี่ยวข้อง
4. เริ่มทำต่อได้เลย
```

### เมื่องานเสร็จ

```
AI ทำอัตโนมัติ:
1. ย้าย logs/wip/[task-id].md → logs/completed/[task-id].md
2. เขียน summary
3. เขียน lesson log
```

---

## 📄 WIP Log Format

```yaml
---
task_id: TASK-001
task_name: สร้างระบบ POS
created: 2026-05-29 10:00
updated: 2026-05-31 14:30
status: in_progress
progress: 30%
priority: high
mode: full
---

## งาน

สร้างระบบ POS (Point of Sale) สำหรับร้านค้า

## Gates

- [x] Gate 0: Task Intake
- [x] Gate 1: Business Understanding
- [x] Gate 2: System Understanding
- [x] Gate 3: Risk Discovery
- [x] Gate 4: Solution Design
- [x] Gate 5: Decision
- [x] Gate 6: Planning
- [ ] Gate 7: Execution (30%)
- [ ] Gate 8: Review
- [ ] Gate 8.5: Architecture Change Review
- [ ] Gate 9: Learning

## Progress

### ทำไปแล้ว (30%)

- ✅ สร้าง database schema
- ✅ สร้าง API endpoints สำหรับ orders
- ✅ สร้าง API endpoints สำหรับ products
- ✅ เขียน Prisma models

### กำลังทำ

- 🔄 เขียน unit tests สำหรับ orders API

### ค้างอยู่

- ⏳ เขียน integration tests
- ⏳ ทดสอบกับ frontend
- ⏳ เขียน API documentation

## Files Modified

- `src/api/orders.ts` (created)
- `src/api/products.ts` (created)
- `prisma/schema.prisma` (modified)
- `src/types/order.ts` (created)

## Context สำคัญ

- ใช้ Prisma + PostgreSQL
- ใช้ pattern จาก products API
- ต้องระวังเรื่อง stock validation
- ยังไม่มี test database setup

## Next Steps

1. Setup test database
2. เขียน unit tests สำหรับ orders API
3. เขียน integration tests
4. ทดสอบกับ frontend

## Blockers

- ยังไม่มี test database setup → ต้องทำก่อน

## Notes

- Stock validation ซับซ้อนกว่าที่คิด
- อาจต้อง refactor ทีหลัง
```

---

## 🔔 Daily WIP Summary

ทุกเช้า AI ต้องแจ้งอัตโนมัติ:

```
🌅 สรุปงานค้าง ณ วันที่ 31 พ.ค. 2026

📊 งานทั้งหมด: 3 งาน
   - ✅ เสร็จแล้ว: 1 งาน
   - 🔄 กำลังทำ: 2 งาน
   - ⏸️  หยุดชั่วคราว: 0 งาน

🔄 งานที่กำลังทำ:

1. [TASK-001] สร้างระบบ POS
   - Progress: 30%
   - ค้างมา: 2 วัน
   - ค้างอยู่: เขียน tests
   - Priority: 🔴 High

2. [TASK-002] แก้ bug stock calculation
   - Progress: 70%
   - ค้างมา: 1 วัน
   - ค้างอยู่: ทดสอบกับข้อมูลจริง
   - Priority: 🟡 Medium

💡 แนะนำ:
- ควรทำ TASK-001 ต่อ (ค้างนานแล้ว)
- TASK-002 เกือบเสร็จ ทำต่อได้เลย

คุณต้องการทำอะไรก่อน?
```

---

## 📁 โครงสร้างไฟล์

```
logs/
├── wip/                        ← งานที่กำลังทำ
│   ├── TASK-001.md
│   ├── TASK-002.md
│   └── TASK-003.md
│
├── completed/                  ← งานที่เสร็จแล้ว
│   ├── TASK-000.md
│   └── ...
│
└── checkpoints/                ← Checkpoints ทั้งหมด
    ├── TASK-001_2026-05-31_1430.md
    └── ...
```

---

## 🎯 ผลลัพธ์

### ก่อนมีระบบนี้

```
❌ ทำงาน A ไป 30% → ไปทำงาน B → กลับมา → ลืมหมด
❌ ต้องอ่านโค้ดใหม่ทั้งหมด
❌ เสียเวลา 30 นาทีในการ "นึกออก"
```

### หลังมีระบบนี้

```
✅ ทำงาน A ไป 30% → AI บันทึก checkpoint อัตโนมัติ
✅ ไปทำงาน B → เสร็จ
✅ กลับมา → AI แจ้งทันที: "งาน A ค้างอยู่ที่ [X]"
✅ AI โหลด context ให้ → ทำต่อได้เลย
✅ ประหยัดเวลา 30 นาที
```

---

## 💡 Tips

### ดูงานค้างทั้งหมด

```
User: "มีงานค้างอะไรบ้าง?"

AI:
1. อ่าน logs/wip/
2. แสดงรายการทั้งหมด
3. เรียงตาม priority
```

### ลืมว่าทำอะไรไปแล้ว

```
User: "ช่วยสรุปว่าเมื่อวานทำอะไรไปแล้ว"

AI:
1. อ่าน logs วันเมื่อวาน
2. สรุปสั้นๆ
3. บอกว่าค้างอะไรอยู่
```

---

> **"ไม่ลืม ไม่หาย ไม่เสียเวลา"**
