# Progress Update Setup Prompt — Prompt สำหรับ deploy ไป project อื่น

> Copy prompt นี้ไปสั่ง AI ใน project อื่น ให้สร้างระบบอัปเดตความคืบหน้า + architecture

---

## วัตถุประสงค์

ให้ AI สร้าง workflow และคู่มือการอัปเดตความคืบหน้าสำหรับ project ของคุณ
รวมถึงการสร้าง/อัปเดต architecture doc ตาม module

---

## วิธีใช้

1. เปิด project ที่ต้องการ
2. Copy prompt ในส่วน "Prompt สำเร็จรูป" ด้านล่าง
3. ปรับชื่อไฟล์/section ให้ตรงกับ project
4. วางใส่ AI แล้วรัน

---

## 📋 Prompt สำเร็จรูป (Copy ส่วนนี้)

```
สร้างระบบอัปเดตความคืบหน้าและ architecture สำหรับ project นี้

### Step 1: สร้าง workflow อัปเดตความคืบหน้า
- สร้างไฟล์ .windsurf/workflows/update-progress.md
- เลือกไฟล์เป้าหมายตามลำดับ: Phase Tracker > SOW > README > ไฟล์ที่กำหนด
- อัปเดตความคืบหน้าหลังแก้โค้ด/ทำงานเสร็จ
- อัปเดต architecture / flow หลังบอกว่า "ผ่านแล้ว" หรือ "ไปต่อ"

### Step 2: สร้าง architecture doc ครั้งแรก (ถ้ายังไม่มี)
- สร้างไฟล์ docs/architecture.md (ภาพรวมระบบ + modules + data flow)
- สร้างไฟล์ docs/modules/[module].md ต่อ module ที่มี
- ถ้ามีอยู่แล้ว → อัปเดตให้ตรงกับโค้ดปัจจุบัน

### Step 3: สร้างคู่มือการใช้
- สร้างไฟล์ docs/update-progress-guide.md
- อธิบายวิธีใช้ workflow + รูปแบบการอัปเดต + ตัวอย่าง

### Step 4: ใช้งาน
- หลังทำงานเสร็จ พิมพ์: /update-progress หรือ "อัปเดตความคืบหน้า"
- หลังผ่าน feature พิมพ์: "ผ่านแล้ว" หรือ "ไปต่อ" → อัปเดต architecture

### รูปแบบการอัปเดต (ใช้ให้สอดคล้อง)
- การแก้โค้ด:    - ✅ [รายละเอียดสิ่งที่แก้ไข]
- การทดสอบ:     - ✅ [รายละเอียดสิ่งที่ทดสอบ]
- ปัญหาที่แก้:
  **ปัญหาที่พบและแก้ไข:**
  - **[ชื่อปัญหา]**: [รายละเอียด] → [วิธีแก้]

### กฎ
- อัปเดตความคืบหน้าหลังทำงานทุกครั้งที่สั่ง
- สร้าง architecture doc ครั้งแรกถ้ายังไม่มี (อย่ารอจนจบ)
- อัปเดต architecture/flow หลังบอก "ผ่านแล้ว"/"ไปต่อ"
- ปรับชื่อไฟล์/section ให้ตรงกับ project
```

---

## 🎯 ตัวอย่างการปรับตาม Project

### Project ที่ใช้ Phase Tracker (แนะนำ — เข้ากับ Owner-OS)
```
- อัปเดตลงไฟล์ docs/phase-tracker.md
- Section: Daily Updates + Feature Progress
```

### Project ที่ใช้ SOW
```
- อัปเดตลงไฟล์ docs/SOW-[project-name].md
- Section: ความคืบหน้ารายวัน
```

### Project ที่ใช้ README
```
- อัปเดตลงไฟล์ README.md
- Section: Progress
```

### Project ที่ใช้ไฟล์อื่น
```
- อัปเดตลงไฟล์ [ชื่อไฟล์ที่กำหนด]
- Section: [ชื่อ section ที่กำหนด]
```

---

## 📝 หมายเหตุสำคัญ

- **architecture ต้องสร้างครั้งแรก** ไม่ใช่แค่ "อัปเดต" — ถ้า project ยังไม่มี doc ให้สร้างเลย
- ให้อัปเดตความคืบหน้าหลังแก้ไขทุกครั้งที่สั่ง
- ให้อัปเดต architecture / flow หลังบอกว่าผ่านแล้วหรือไปต่อ
- ใช้รูปแบบที่กำหนดเพื่อความสอดคล้อง

---

## 🔗 เอกสารอ้างอิง (ภายใน Owner-OS-v2)

- `07-automation/progress-update-workflow.md` — workflow เต็ม
- `04-templates/phase-tracker.md` — ไฟล์เป้าหมายหลัก
- `04-templates/architecture-doc.md` / `module-doc.md` — templates architecture
- `01-gates/full-mode/gate-6-planning.md` — สร้าง architecture doc ครั้งแรก

---

> **"Deploy ครั้งเดียว ใช้ได้ทุก project"**
