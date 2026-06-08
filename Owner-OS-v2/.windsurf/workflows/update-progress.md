---
description: อัปเดตความคืบหน้า + architecture/flow ลงไฟล์เป้าหมาย (Phase Tracker/SOW/README)
---

# Update Progress Workflow

อัปเดตความคืบหน้าหลังทำงาน และอัปเดต architecture/flow หลังผ่าน feature

## ขั้นตอน

### 1. ระบุไฟล์เป้าหมาย (Target File)
เลือกตามลำดับความสำคัญ:
- ถ้ามี Phase Tracker (`Owner-OS-v2/04-templates/phase-tracker.md` หรือ `docs/phase-tracker.md`) → ใช้ตัวนี้
- ถ้ามี SOW (`docs/SOW-*.md`) → ใช้ section ความคืบหน้ารายวัน
- ถ้ามี README ที่มี section Progress → ใช้ตัวนี้
- ถ้าไม่มี → ถาม user ว่าจะอัปเดตที่ไฟล์ไหน

### 2. สรุปสิ่งที่ทำตั้งแต่อัปเดตครั้งล่าสุด
รวบรวมไฟล์ที่แก้ + tests + ปัญหาที่แก้

### 3. เขียนความคืบหน้าลงไฟล์เป้าหมาย
ใช้รูปแบบนี้เสมอ:
```
### YYYY-MM-DD
- ✅ [รายละเอียดสิ่งที่แก้ไข/ทดสอบ]

**ปัญหาที่พบและแก้ไข:** (ถ้ามี)
- **[ชื่อปัญหา]**: [รายละเอียด] → [วิธีแก้]
```

### 4. ถ้าเป็น Phase Tracker — อัปเดต feature progress ด้วย
- คำนวณ progress จาก gate ที่ผ่าน (gate/9 × 100)
- อัปเดตตาราง feature

### 5. อัปเดต Architecture/Flow (เมื่อ user บอก "ผ่านแล้ว"/"ไปต่อ")
- ถ้ายังไม่มี `docs/architecture.md` → **สร้างใหม่** จาก `Owner-OS-v2/04-templates/architecture-doc.md`
- ถ้ายังไม่มี `docs/modules/[module].md` → **สร้างใหม่** จาก `Owner-OS-v2/04-templates/module-doc.md`
- ถ้ามีแล้ว → อัปเดต module/dependency/data flow ที่เปลี่ยน

### 6. แจ้งผล
รายงานว่าอัปเดตไฟล์ไหนไปบ้าง

## หมายเหตุ
- รันคำสั่งนี้หลังทำงานเสร็จทุกครั้ง
- architecture สร้างครั้งแรกถ้ายังไม่มี — อย่ารอจนจบ project
