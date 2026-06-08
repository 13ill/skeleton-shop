# Session Management — การจัดการ Session

> วิธีเริ่ม/จบ session และโหลด context อย่างมีประสิทธิภาพ

---

## 🌅 เริ่ม Session ใหม่

### AI ต้องทำอัตโนมัติ (ทุกครั้ง)

```
1. ✅ อ่าน MASTER-PROMPT.md (ครั้งแรกของวัน)
2. ✅ เช็คงานค้าง (อ่าน logs/wip/)
3. ✅ แจ้งเตือนงานค้าง (ถ้ามี)
4. ✅ ถาม: "ทำงานอะไรวันนี้?"
5. ✅ โหลด context ตาม level
6. ✅ อ่าน logs ล่าสุด (3 ไฟล์)
7. ✅ รัน Gate Selector
8. ✅ พร้อมทำงาน
```

### ตัวอย่าง Session Start

```
AI: 🌅 สวัสดีตอนเช้า!

🔔 คุณมีงานค้าง 2 งาน:

1. [TASK-001] สร้างระบบ POS - Progress 30%
   - ทำไปถึง: สร้าง API endpoints เสร็จแล้ว
   - ค้างอยู่: ต้องเขียน tests
   - ค้างมา: 2 วัน
   - Priority: 🔴 High

2. [TASK-002] แก้ bug stock calculation - Progress 70%
   - ทำไปถึง: Frontend เกือบเสร็จ
   - ค้างอยู่: ต้อง integrate กับ backend
   - ค้างมา: 1 วัน
   - Priority: 🟡 Medium

💡 แนะนำ: ควรทำ TASK-001 ต่อ (ค้างนานแล้ว)

คุณต้องการ:
A. ทำ TASK-001 ต่อ
B. ทำ TASK-002 ต่อ
C. เริ่มงานใหม่
D. ดูรายละเอียดงานค้าง
```

---

## 🔄 Context Loading Levels

### Level 0: Root Overview (ทุก session)

**โหลดเสมอ:**
- `docs/architecture.md` (ภาพรวมระบบ)
- Module connections
- สถานะรวม

**ประหยัด context:** ~500 tokens

### Level 1: Module Level (เมื่อทำงานใน module)

**โหลดเมื่อ:** จะแก้/เพิ่ม feature ใน module

**โหลด:**
- `docs/modules/[module-name].md`
- Module dependencies
- Module interface

### Level 2: Flow Level (เมื่อต้อง trace)

**โหลดเมื่อ:** ต้อง debug หรือ trace flow

**โหลด:**
- Flow diagram
- Sequence diagram
- Related files

### Level 3: File Level (เมื่อต้องเจาะลึก)

**โหลดเมื่อ:** ต้องแก้ไขไฟล์เฉพาะ

**โหลด:**
- ไฟล์ที่เกี่ยวข้อง
- Dependencies
- Tests

---

## ⏸️ หยุดงานชั่วคราว

### User บอก: "หยุดก่อน ไปทำอย่างอื่นก่อน"

AI ต้องทำอัตโนมัติ:

```
1. ✅ สร้าง checkpoint
2. ✅ บันทึกลง logs/wip/[task-id].md:
   - Progress: X%
   - ทำไปถึงไหน
   - ค้างอะไรอยู่
   - Context สำคัญ
   - Next steps
3. ✅ แจ้ง: "✅ บันทึก checkpoint แล้ว - กลับมาทำต่อได้เลย"
```

### Checkpoint Format

```yaml
checkpoint:
  task_id: "TASK-001"
  task_name: "สร้างระบบ POS"
  timestamp: "2026-05-31 14:30"
  progress: 30%
  
  gates_completed:
    - gate-0: ✅ Task Intake
    - gate-1: ✅ Business Understanding
    - gate-2: ✅ System Understanding
    - gate-3: ✅ Risk Discovery
    - gate-4: ✅ Solution Design
    - gate-5: ✅ Decision
    - gate-6: ✅ Planning
    - gate-7: 🔄 Execution (30%)
  
  files_modified:
    - src/api/orders.ts (created)
    - src/api/products.ts (created)
    - prisma/schema.prisma (modified)
  
  current_context:
    - "กำลังสร้าง API endpoints สำหรับ orders"
    - "ใช้ Prisma + PostgreSQL"
    - "ต้องเขียน tests ต่อ"
  
  next_steps:
    - "เขียน unit tests สำหรับ orders API"
    - "เขียน integration tests"
    - "ทดสอบกับ frontend"
  
  blockers:
    - "ยังไม่มี test database setup"
  
  notes:
    - "ใช้ pattern จาก products API"
    - "ระวังเรื่อง stock validation"
```

---

## 🔙 กลับมาทำต่อ

### User บอก: "กลับมาทำงานเดิมต่อ"

AI ต้องทำอัตโนมัติ:

```
1. ✅ อ่าน checkpoint ล่าสุด
2. ✅ โหลด context ตามระยะเวลาที่หยุด:
   - < 2 ชม: โหลดแค่ checkpoint + ไฟล์ที่กำลังแก้
   - 1 วัน: โหลด + architecture doc + module doc
   - > 3 วัน: โหลดเต็ม + decision logs + lesson logs
3. ✅ สรุปสถานะ
4. ✅ ถาม: "พร้อมทำต่อไหม?"
```

### ตัวอย่าง Resume

```
AI: กลับมาที่งาน: สร้างระบบ POS

📊 สถานะปัจจุบัน:
- Progress: 30%
- ผ่าน Gate: 0-6 ✅
- กำลังทำ Gate: 7 (Execution)

📝 ทำไปแล้ว:
- สร้าง API endpoints สำหรับ orders ✅
- สร้าง API endpoints สำหรับ products ✅
- แก้ไข database schema ✅

⏳ ค้างอยู่:
- เขียน unit tests สำหรับ orders API
- เขียน integration tests
- ทดสอบกับ frontend

⚠️ ต้องระวัง:
- ยังไม่มี test database setup
- ต้องใช้ pattern จาก products API
- ระวังเรื่อง stock validation

🎯 Next Step:
เริ่มจากเขียน unit tests สำหรับ orders API

พร้อมทำต่อไหม?
```

---

## ✅ จบงาน

### User บอก: "เสร็จแล้ว"

AI ต้องทำอัตโนมัติ:

```
1. ✅ รัน Gate 8-9 (Review + Learning)
2. ✅ เขียน decision log (ถ้ามี decision สำคัญ)
3. ✅ เขียน lesson log
4. ✅ ย้าย logs/wip/[task-id].md → logs/completed/
5. ✅ สร้าง/อัปเดต architecture docs (ถ้ายังไม่มี→สร้าง, มี→อัปเดต) + module docs ต่อ module
6. ✅ สรุปงาน
```

### ตัวอย่าง Session End

```
AI: 🎉 งานเสร็จแล้ว!

📊 สรุปงาน: สร้างระบบ POS
- เวลาที่ใช้: 3 วัน
- Gates ที่ผ่าน: 0-9 ✅
- Files ที่สร้าง: 15 ไฟล์
- Tests ที่เขียน: 25 tests
- Code coverage: 85%

📝 Decisions สำคัญ:
1. เลือกใช้ PostgreSQL (เพราะ relational data)
2. เลือกใช้ Prisma (เพราะ type-safe)
3. เลือกใช้ Next.js API routes (เพราะ simple)

💡 Lessons ที่เรียนรู้:
1. ต้องทำ test database setup ก่อนเขียน tests
2. Pattern จาก products API ใช้ได้ดี
3. Stock validation ซับซ้อนกว่าที่คิด

🎯 Next Steps:
- Deploy to staging
- ทดสอบกับ user จริง
- เก็บ feedback

✅ บันทึกทุกอย่างเรียบร้อยแล้ว

ต้องการทำอะไรต่อไหม?
```

---

## 📅 Daily Routine

### เช้า (9:00)

```
1. AI แจ้งงานค้าง
2. User เลือกงาน
3. AI โหลด context
4. เริ่มทำงาน
```

### เย็น (18:00)

```
1. AI ถาม: "เสร็จแล้วหรือยัง?"
2. User ตอบ
3. AI บันทึก checkpoint/log
4. สรุปวันนี้
```

---

## 🔄 Smart Context Reload

### ถ้าหยุดไปไม่นาน (< 2 ชั่วโมง)

```
โหลดแค่:
- Checkpoint ล่าสุด
- ไฟล์ที่กำลังแก้
```

### ถ้าหยุดไป 1 วัน

```
โหลด:
- Checkpoint ล่าสุด
- Architecture doc (refresh ความจำ)
- Module doc ที่เกี่ยวข้อง
- Decision logs ล่าสุด
```

### ถ้าหยุดไป > 3 วัน

```
โหลดเต็ม:
- Checkpoint ล่าสุด
- Architecture doc
- Module doc ทั้งหมดที่เกี่ยวข้อง
- Decision logs ทั้งหมด
- Lesson logs (ดูว่าเคยเจออะไรมา)

แล้วสรุปให้:
"งานนี้คือ: [X]
 เป้าหมาย: [Y]
 ทำไปแล้ว: [Z]
 ค้างอยู่: [W]
 ต้องระวัง: [V] (จาก lessons)"
```

---

## 💡 Tips สำหรับคนสะเพร่า

### ลืมว่าทำอะไรไปแล้ว

```
User: "ช่วยสรุปว่าเมื่อวานทำอะไรไปแล้ว"

AI:
1. อ่าน logs วันเมื่อวาน
2. สรุปสั้นๆ
3. บอกว่าค้างอะไรอยู่
4. แนะนำว่าวันนี้ควรทำอะไรต่อ
```

### ลืมว่ามีงานค้างอะไรบ้าง

```
User: "มีงานค้างอะไรบ้าง?"

AI:
1. อ่าน logs/wip/
2. แสดงรายการงานค้างทั้งหมด
3. เรียงตาม priority
4. แนะนำว่าควรทำอะไรก่อน
```

---

## 🎯 เป้าหมาย

Session Management ที่ดีทำให้:

1. **ไม่ลืม** — AI เตือนทุกครั้ง
2. **ไม่เสียเวลา** — โหลด context อัตโนมัติ
3. **ไม่งง** — รู้ว่าทำไปถึงไหน
4. **ทำงานหลายอย่างได้** — สลับไปมาไม่สับสน

---

> **"เริ่มง่าย จบชัด ไม่ลืม ไม่หาย"**
