# 📋 Checklists — ใช้งานจริง

> HTML checklists และ CSV templates สำหรับใช้งานจริง (ไม่ต้องเปิด AI)

---

## 📁 ไฟล์ในโฟลเดอร์นี้

### HTML Checklists (Interactive)

- `gate-0-checklist.html` — Gate 0: Task Intake
- `gate-1-checklist.html` — Gate 1: Business Understanding
- `gate-2-checklist.html` — Gate 2: System Understanding
- ... (จะสร้างให้ครบทุก gate)

**Features:**
- ✅ Checkbox แบบ interactive
- ✅ Progress bar
- ✅ บันทึกข้อมูลใน browser (localStorage)
- ✅ Export เป็น text file
- ✅ ใช้งานได้ offline

### CSV Templates (สำหรับ Google Sheets/Excel)

- `all-gates-checklist.csv` — Checklist ทุก gate รวมกัน
- `gate-questions-template.csv` — คำถามแต่ละ gate

---

## 🚀 วิธีใช้งาน

### HTML Checklists

1. **เปิดไฟล์ HTML ใน browser**
   ```bash
   open gate-0-checklist.html
   ```

2. **ตอบคำถามและเช็ค checklist**
   - พิมพ์คำตอบในช่อง textarea
   - เช็ค checkbox เมื่อทำเสร็จ
   - ดู progress bar

3. **บันทึกข้อมูล**
   - กดปุ่ม "💾 บันทึกข้อมูล" — บันทึกใน browser
   - กดปุ่ม "📄 Export เป็น Text" — ดาวน์โหลดเป็นไฟล์

### CSV Templates (Google Sheets)

1. **Import เข้า Google Sheets**
   - เปิด Google Sheets
   - File → Import → Upload
   - เลือก `all-gates-checklist.csv`

2. **ใช้งาน**
   - เปลี่ยน Status จาก "Pending" → "Done"
   - เขียน Notes
   - ใส่ Date

3. **แชร์กับทีม**
   - Share link ให้ทีม
   - ทุกคนเห็นความคืบหน้าเดียวกัน

---

## 💡 Use Cases

### เมื่อคุยกับลูกค้า

```
1. เปิด gate-0-checklist.html
2. ถามคำถามตาม checklist
3. พิมพ์คำตอบลงไป
4. Export เป็น text file
5. ส่งให้ลูกค้า confirm
```

### เมื่อทำงานเป็นทีม

```
1. Import all-gates-checklist.csv เข้า Google Sheets
2. แชร์ให้ทีม
3. ทุกคนเช็ค checklist พร้อมกัน
4. เห็นความคืบหน้าแบบ real-time
```

### เมื่อทำงานคนเดียว

```
1. เปิด HTML checklist
2. ทำตาม checklist
3. บันทึกใน browser
4. กลับมาทำต่อได้เลย (ข้อมูลยังอยู่)
```

---

## 🎨 Customization

### แก้ไข HTML

ไฟล์ HTML สามารถแก้ไขได้ง่าย:

```html
<!-- เปลี่ยนสี -->
<style>
    .btn {
        background: #3498db;  /* เปลี่ยนสีปุ่ม */
    }
</style>

<!-- เพิ่มคำถาม -->
<div class="question">
    <h3>6. "คำถามใหม่?"</h3>
    <textarea id="q6"></textarea>
</div>
```

### แก้ไข CSV

เปิดด้วย Excel/Google Sheets แล้วแก้ได้เลย

---

## 📊 ตัวอย่าง Workflow

### Workflow 1: รับงานจากลูกค้า

```
1. เปิด gate-0-checklist.html
2. ถามคำถาม 5 ข้อ
3. เขียนคำตอบ
4. Export เป็น text
5. ส่งให้ลูกค้า confirm
6. ได้ confirmation → ผ่าน Gate 0 ✅
```

### Workflow 2: ทำงานเป็นทีม

```
1. Import all-gates-checklist.csv เข้า Google Sheets
2. แชร์ให้ทีม
3. แต่ละคนรับผิดชอบ gate ต่างกัน
4. เช็ค checklist เมื่อทำเสร็จ
5. ทุกคนเห็นความคืบหน้า
```

---

## 🔗 Links

- **HTML Checklists** — ใช้งาน offline ได้
- **CSV Templates** — Import เข้า Google Sheets
- **MASTER-PROMPT.md** — อ่านรายละเอียดแต่ละ gate

---

> **"Checklist ที่ดี = ไม่พลาดขั้นตอนสำคัญ"** ✅
