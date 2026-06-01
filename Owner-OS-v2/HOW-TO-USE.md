# 🎓 วิธีใช้งาน Owner OS Framework v2.0

> คู่มือการใช้งานทีละขั้นตอน สำหรับผู้เริ่มต้น

สร้างเมื่อ: 1 มิ.ย. 2026

---

## 🚀 Quick Start (5 นาที)

### Step 1: Setup Rules File

```bash
# Copy rules file ไปที่ home directory
cp .rules/.windsurfrules ~/.windsurfrules

# หรือถ้าใช้ Cursor
cp .rules/.cursorrules ~/.cursorrules
```

### Step 2: เปิด HTML Checklists

```bash
# เปิด Master Checklist
open checklists/master-checklist.html

# เปิด Decision Log
open checklists/decision-log.html
```

### Step 3: Import CSV เข้า Google Sheets

1. เปิด [Google Sheets](https://sheets.google.com)
2. File → Import → Upload
3. เลือก `checklists/all-gates-checklist.csv`
4. เลือก `checklists/gate-questions-template.csv`

### Step 4: ทดสอบกับ AI

```
เปิด AI แล้วพิมพ์:
"สวัสดี ฉันต้องการทำระบบ POS"
```

**AI ควรจะ:**
- ❌ ไม่เขียนโค้ดทันที
- ✅ ถามคำถาม 5 ข้อ (Gate 0)
- ✅ เสนอทางเลือกพร้อม tradeoff

---

## 📚 เข้าใจระบบ (10 นาที)

### อ่านเอกสารสำคัญ

1. **START-HERE.md** — เริ่มต้นใช้งาน
2. **MASTER-PROMPT.md** — Core framework
3. **QUICK-REFERENCE.md** — AI commands

### ทำความเข้าใจ Gate System

**Gate System = ขั้นตอนการทำงาน 10 ขั้นตอน**

```
Gate 0: รับงาน
Gate 1: ทำความเข้าใจธุรกิจ
Gate 2: ทำความเข้าใจระบบ
Gate 3: ค้นหาความเสี่ยง
Gate 4: ออกแบบ Solution
Gate 5: ตัดสินใจ
Gate 6: วางแผน
Gate 7: ลงมือทำ
Gate 8: Review
Gate 8.5: Architecture Review
Gate 9: เรียนรู้และโค้ช
```

**มี 4 Modes:**
- **Full Mode** (10 gates) — งานใหม่ ซับซ้อน
- **Quick Mode** (4 gates) — งานเล็ก คุ้นเคย
- **Hotfix Mode** (2 gates) — แก้ bug ด่วน
- **Owner Mode** (10 gates + review) — งานสำคัญ

---

## 💼 Use Cases จริง

### 🎯 Use Case 1: รับงานจากลูกค้า

**สถานการณ์:** ลูกค้าโทรมาขอทำระบบ POS

**ขั้นตอน:**

1. **เปิด gate-0-checklist.html บนมือถือ/แท็บเล็ต**
   ```bash
   open checklists/gate-0-checklist.html
   ```

2. **ถามคำถาม 5 ข้อ ตาม checklist**
   - งานนี้คืออะไร?
   - ใครเป็น user?
   - ขอบเขตงานอยู่ตรงไหน?
   - งานนี้ urgent จริงหรือไม่?
   - ข้อมูลอะไรที่ยังขาด?

3. **พิมพ์คำตอบลงใน HTML checklist**
   - ระบบจะบันทึกอัตโนมัติ (localStorage)

4. **Export เป็น text file**
   - กดปุ่ม "📄 Export เป็น Text"
   - ส่งให้ลูกค้า confirm

5. **ได้ confirmation → ผ่าน Gate 0 ✅**

6. **ไปต่อ Gate 1-9**
   - ใช้ Master Checklist ติดตามความคืบหน้า

---

### 👥 Use Case 2: ทำงานเป็นทีม

**สถานการณ์:** ทีม 3 คน ทำโปรเจกต์ใหญ่

**ขั้นตอน:**

1. **Import CSV เข้า Google Sheets**
   - เปิด Google Sheets
   - Import `all-gates-checklist.csv`
   - Import `gate-questions-template.csv`

2. **แชร์ให้ทีม**
   - Share link ให้ทีม
   - ตั้งสิทธิ์เป็น "Editor"

3. **แบ่งงาน**
   - คนที่ 1: Gate 0-3 (Discovery)
   - คนที่ 2: Gate 4-7 (Design + Implementation)
   - คนที่ 3: Gate 8-9 (Review + Learning)

4. **ทุกคนเช็ค checklist**
   - เปลี่ยน Status จาก "Pending" → "Done"
   - เขียน Notes
   - ใส่ Date

5. **เห็นความคืบหน้า real-time**
   - ทุกคนเห็นว่าใครทำอะไรไปแล้ว

---

### 🧑‍💻 Use Case 3: ทำงานคนเดียว

**สถานการณ์:** Freelancer ทำโปรเจกต์คนเดียว

**ขั้นตอน:**

1. **เปิด Master Checklist**
   ```bash
   open checklists/master-checklist.html
   ```

2. **ทำตาม checklist**
   - เช็ค checkbox เมื่อทำเสร็จ
   - ดู progress bar

3. **บันทึกอัตโนมัติ**
   - ระบบบันทึกใน browser
   - กลับมาทำต่อได้เลย (ข้อมูลยังอยู่)

4. **บันทึก Decision**
   - เปิด decision-log.html
   - บันทึกการตัดสินใจสำคัญ

5. **Export progress**
   - กดปุ่ม "📄 Export"
   - ส่งให้ลูกค้าดู

---

## 🎯 Workflows สำหรับงานต่างๆ

### สร้าง Feature ใหม่

อ่าน: `03-workflows/new-feature-workflow.md`

```
Phase 1: Discovery (Gate 0-3)
Phase 2: Design (Gate 4-5)
Phase 3: Implementation (Gate 6-7)
Phase 4: Quality Assurance (Gate 8-9)
```

### แก้ Bug

อ่าน: `03-workflows/bug-fix-workflow.md`

```
Bug ด่วน → Hotfix Mode (Gate 0, 7)
Bug ไม่ด่วน → Full Mode (Gate 0-9)
```

### กิจวัตรประจำวัน

อ่าน: `03-workflows/daily-routine-workflow.md`

```
เช้า: เปิด AI + Master Checklist
ระหว่างวัน: ทำงานตาม Workflow
เย็น: สรุปงาน + บันทึก Lesson
```

---

## 🤖 ใช้งานกับ AI

### คำสั่งพื้นฐาน

```
# เริ่ม session
"สวัสดี กลับมาทำงานต่อ"

# รับงานใหม่
"ฉันต้องการทำ [งาน]"

# ถามคำถาม
"ช่วยถามคำถาม Gate 0"

# ขอทางเลือก
"มีทางเลือกอะไรบ้าง? วิเคราะห์ tradeoff"

# ตัดสินใจ
"ฉันเลือกทาง A เพราะ [เหตุผล]"

# หยุดชั่วคราว
"หยุดก่อน ไปทำอย่างอื่นก่อน"

# กลับมาทำต่อ
"กลับมาทำงานเดิมต่อ"

# สรุปงาน
"สรุปงานวันนี้"
```

### AI จะทำอะไร

**เมื่อรับงานใหม่:**
- ❌ ไม่เขียนโค้ดทันที
- ✅ ถามคำถาม (Gate 0)
- ✅ เช็ค Owner Escalation
- ✅ เสนอทางเลือก (Gate 4)
- ✅ วิเคราะห์ tradeoff

**เมื่อหยุดชั่วคราว:**
- ✅ บันทึก checkpoint
- ✅ แจ้ง: "✅ บันทึกแล้ว"

**เมื่อกลับมาทำต่อ:**
- ✅ อ่าน checkpoint
- ✅ สรุปสถานะ
- ✅ พร้อมทำต่อ

---

## 📊 ติดตามความคืบหน้า

### Master Checklist (HTML)

```bash
open checklists/master-checklist.html
```

**Features:**
- ✅ เห็นภาพรวมทั้งโปรเจกต์
- ✅ Progress bar
- ✅ บันทึกอัตโนมัติ
- ✅ Export ได้

### Google Sheets

**Features:**
- ✅ แชร์ให้ทีมได้
- ✅ Real-time collaboration
- ✅ Filter, Sort ได้
- ✅ สร้าง chart ได้

---

## 💡 Tips สำหรับผู้เริ่มต้น

### สำหรับคนสะเพร่า

- ✅ ตั้ง alarm เตือน 9:00 (เริ่มงาน)
- ✅ ตั้ง alarm เตือน 18:00 (สรุปงาน)
- ✅ ใช้ Master Checklist ทุกวัน
- ✅ บันทึก decision ทุกครั้ง

### สำหรับคนที่ลืมง่าย

- ✅ เปิด Master Checklist ทิ้งไว้
- ✅ บันทึก checkpoint บ่อยๆ
- ✅ ใช้ AI เตือนงานค้าง
- ✅ Export progress ทุกวัน

### สำหรับคนที่รีบ

- ⚠️ อย่ารีบ!
- ✅ ใช้ Quick Mode (ถ้างานเล็ก)
- ✅ ใช้ Hotfix Mode (ถ้าด่วนจริงๆ)
- ❌ อย่าข้าม gate

---

## 🚨 ข้อควรระวัง

### ❌ อย่าทำ

1. **อย่าข้าม gate**
   - ทุก gate มีเหตุผล
   - ข้าม gate = พลาดขั้นตอนสำคัญ

2. **อย่าเขียนโค้ดทันที**
   - ต้องผ่าน Gate 0-5 ก่อน
   - เข้าใจงานก่อน แล้วค่อยเขียน

3. **อย่าลืมบันทึก decision**
   - ทุกการตัดสินใจต้องมีบันทึก
   - ย้อนดูได้ว่าทำไมตัดสินใจแบบนี้

4. **อย่าลืม Owner Escalation**
   - งานสำคัญต้อง escalate
   - ดูรายการใน `02-protocols/owner-escalation.md`

### ✅ ควรทำ

1. **ใช้ HTML checklists**
   - ง่าย สะดวก ดูสวย
   - บันทึกอัตโนมัติ

2. **บันทึก decision ทุกครั้ง**
   - ใช้ decision-log.html
   - Export เป็น text file

3. **ทบทวนบทเรียน**
   - เรียนรู้จากทุกโปรเจกต์
   - บันทึก lesson log

4. **ใช้ AI เป็นโค้ช**
   - ถามคำถาม
   - ขอ tradeoff analysis
   - ขอ feedback

---

## 📞 ต้องการความช่วยเหลือ?

### ไม่รู้จะเริ่มยังไง

1. อ่าน START-HERE.md
2. ทดสอบกับ AI
3. ลองใช้ HTML checklists

### AI ไม่ทำตาม

1. เช็คว่า copy rules file แล้วหรือยัง
2. Restart AI
3. ลองพิมพ์: "อ่าน MASTER-PROMPT.md"

### ต้องการสร้างไฟล์เพิ่ม

- ดูรายการไฟล์ที่ยังขาดใน FINAL-SUMMARY.md
- บอก AI ว่าต้องการสร้างไฟล์อะไร

---

## 🎓 เรียนรู้เพิ่มเติม

### เอกสารอ้างอิง

- `00-core/principles.md` — 10 หลักคิด
- `00-core/roadmap-9months.md` — แผนพัฒนา 9 เดือน
- `00-core/tower-control-guide.md` — ใช้ multi-AI

### Workflows

- `03-workflows/new-feature-workflow.md`
- `03-workflows/bug-fix-workflow.md`
- `03-workflows/daily-routine-workflow.md`

---

## 🏆 เป้าหมาย

**ภายใน 9 เดือน คุณจะเป็น:**

- ✅ Business Owner — คิดเชิงธุรกิจ
- ✅ Solution Architect — ออกแบบระบบได้
- ✅ AI-Native Developer — ใช้ AI เป็นเครื่องมือ

**วิธีการ:**

- ✅ ใช้ Gate System ทุกโปรเจกต์
- ✅ บันทึก decision + lesson ทุกครั้ง
- ✅ ทบทวนบทเรียนสัปดาห์ละครั้ง
- ✅ ติดตามความคืบหน้าด้วย Progress Tracker

---

> **"ระบบที่ดี + ใช้อย่างสม่ำเสมอ = ประสบความสำเร็จ"** 🚀

**พร้อมเริ่มแล้วใช่ไหม?** 🎉
