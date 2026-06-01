# Owner OS Framework v2.0

> ระบบปฏิบัติการสำหรับ Business Owner ที่ใช้ AI เป็น Operational Partner

**เป้าหมาย:** เปลี่ยนคุณจาก Developer → Business Owner ภายใน 9 เดือน

---

## 🚀 Quick Start

### 1. อ่านไฟล์นี้ก่อน (5 นาที)

```
START-HERE.md
```

### 2. Copy Rules File

```bash
# เลือก AI ที่คุณใช้:
cp .rules/.windsurfrules ~/.windsurfrules  # Windsurf
cp .rules/.cursorrules ~/.cursorrules      # Cursor
cp .rules/.clinerules ~/.clinerules        # Cline
cp .rules/.clauderules ~/.clauderules      # Claude
```

### 3. ทดสอบ

เปิด AI แล้วพิมพ์:

```
"สวัสดี ฉันต้องการทำระบบ POS"
```

AI ควรจะ:
- ✅ ไม่เขียนโค้ดทันที
- ✅ ถามคำถาม 5 ข้อ
- ✅ เสนอทางเลือกพร้อม tradeoff

---

## 📚 เอกสารสำคัญ

| ไฟล์ | อ่านเมื่อไร |
|---|---|
| `START-HERE.md` | อ่านก่อนทุกอย่าง |
| `MASTER-PROMPT.md` | อ่านครั้งเดียวตอนเริ่ม |
| `QUICK-REFERENCE.md` | เมื่อต้องการ AI commands |

---

## 🗂️ โครงสร้าง

```
Owner-OS-v2/
├── START-HERE.md              ← เริ่มที่นี่
├── MASTER-PROMPT.md           ← Core framework
├── QUICK-REFERENCE.md         ← Cheat sheet
│
├── 00-core/                   ← อ่านครั้งเดียว
├── 01-gates/                  ← Gate System
├── 02-protocols/              ← Protocols
├── 03-workflows/              ← Workflows
├── 04-templates/              ← Templates
├── 05-playbooks/              ← Playbooks
├── 06-references/             ← References
├── 07-automation/             ← Automation
├── 08-tower-prompts/          ← Tower Control
├── .rules/                    ← Multi-platform rules
└── logs/                      ← AI เขียนให้อัตโนมัติ
```

---

## ✨ Features

- **Gate System** — คิดก่อนทำทุกครั้ง
- **WIP Tracker** — ไม่ลืมงานค้าง
- **Auto Context Loading** — โหลด context อัตโนมัติ
- **Decision Logging** — บันทึกการตัดสินใจ
- **Lesson Logging** — บันทึกบทเรียน
- **Coaching Mode** — ฝึกให้คิดเป็น owner
- **Tower Control** — สั่งงาน AI หลายตัว
- **Multi-platform** — ใช้ได้กับทุก AI

---

## 🎯 เป้าหมาย 9 เดือน

### Phase 1 (เดือน 1-3): คิดเป็น ถามเป็น
- ผ่าน Gate ทุก task
- ถาม owner ได้คล่อง
- มี decision log 10+ entries

### Phase 2 (เดือน 4-6): เร็วขึ้น มั่นใจขึ้น
- ประเมินเวลาแม่น ±20%
- ต่อรองได้ ปฏิเสธได้
- มี product idea 1 ตัว

### Phase 3 (เดือน 7-9): สร้าง product ขายได้
- มี product ใช้งานได้จริง
- มีรายได้จาก product
- สั่ง AI ทำงาน 80%

---

## 📖 License

MIT License — ใช้ฟรี แก้ไขได้ แชร์ได้

---

## 🆘 Support

- **ไม่รู้จะเริ่มยังไง**: อ่าน `START-HERE.md`
- **AI ไม่ทำตาม**: เช็คว่า copy rules file แล้วหรือยัง
- **งานค้างเยอะ**: ดู `07-automation/wip-tracker.md`

---

> **"AI ไม่ใช่เครื่องมือ แต่เป็น partner ที่ต้องมีกระบวนการ"**

**พร้อมแล้ว? → อ่าน START-HERE.md** 🚀
