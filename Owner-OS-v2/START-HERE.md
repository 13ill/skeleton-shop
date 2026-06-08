# 🚀 START HERE — อ่านตัวนี้ก่อนทุกอย่าง (5 นาที)

> **Owner OS Framework v2.0** — ระบบที่ช่วยให้คุณเติบโตจาก Developer → Business Owner ภายใน 9 เดือน

---

## 🎯 ระบบนี้คืออะไร?

ระบบที่บังคับให้ AI ทำงานเป็น **operational partner** ไม่ใช่แค่ code generator

- **คิดก่อนทำ** — ผ่าน Gate System ก่อนเขียนโค้ดทุกครั้ง
- **ไม่ลืม** — AI เตือนงานค้าง + โหลด context อัตโนมัติ
- **เรียนรู้ตลอด** — บันทึก decision + lesson ทุกครั้ง
- **ใช้ได้กับทุก AI** — Windsurf, Cursor, Claude, Cline

---

## ⚡ เริ่มใช้ใน 3 ขั้นตอน

### ขั้นที่ 1: Copy Rules File (30 วินาที)

```bash
# เลือก AI ที่คุณใช้:

# Windsurf
cp .rules/.windsurfrules ~/.windsurfrules

# Cursor
cp .rules/.cursorrules ~/.cursorrules

# Cline
cp .rules/.clinerules ~/.clinerules

# Claude Desktop
cp .rules/.clauderules ~/.clauderules
```

### ขั้นที่ 2: อ่าน MASTER-PROMPT.md (3 นาที)

```bash
# เปิดไฟล์นี้อ่าน
open MASTER-PROMPT.md
```

### ขั้นที่ 3: ทดสอบ (2 นาที)

เปิด AI แล้วพิมพ์:

```
"สวัสดี ฉันต้องการทำระบบ POS"
```

AI ควรจะ:
1. ✅ ไม่เขียนโค้ดทันที
2. ✅ ถามคำถาม 5 ข้อ (Gate 0)
3. ✅ เสนอทางเลือกพร้อม tradeoff

---

## 📚 ไฟล์สำคัญที่ต้องรู้จัก

| ไฟล์ | อ่านเมื่อไร | ทำไมต้องอ่าน |
|---|---|---|
| **MASTER-PROMPT.md** | ครั้งเดียวตอนเริ่ม | Core framework ทั้งหมด |
| **QUICK-REFERENCE.md** | เมื่อต้องการ cheat sheet | AI commands สำเร็จรูป |
| **00-core/session-management.md** | ครั้งเดียวตอนเริ่ม | วิธีเริ่ม/จบ session |
| **00-core/tower-control-guide.md** | เมื่อต้องการใช้ multi-AI | วิธีสั่งงาน AI หลายตัว |
| **01-gates/_gate-selector.md** | เมื่อไม่แน่ใจว่าใช้ mode ไหน | AI เลือก mode ให้อัตโนมัติ |
| **07-automation/auto-session-start.md** | ไม่ต้องอ่าน | AI ทำอัตโนมัติ |

---

## 🎮 การใช้งานจริง

### ทุกเช้า (AI ทำอัตโนมัติ)

```
1. เปิด IDE
2. AI แจ้ง: "🔔 คุณมีงานค้าง 2 งาน..."
3. คุณเลือก: "ทำงาน A ต่อ"
4. AI โหลด context + เริ่มทำงาน
```

### เมื่อเริ่มงานใหม่

```
คุณ: "ทำระบบ Stock"

AI:
1. สร้าง PRD (Product Requirements Document) ⭐
2. แบ่ง phases: MVP → Enhancement → Scale ⭐
3. รัน Gate 0-5 (ถาม วิเคราะห์ ออกแบบ)
4. ได้ requirement ครบ
5. สร้าง execution plan
6. ถาม: "พร้อมเขียนโค้ดไหม?"
7. อัปเดต progress อัตโนมัติทุกครั้งที่ผ่าน gate ⭐
```

### เมื่อหยุดงานชั่วคราว

```
คุณ: "หยุดก่อน ไปแก้ bug ด่วน"

AI:
1. บันทึก checkpoint อัตโนมัติ
2. แจ้ง: "✅ บันทึกแล้ว - กลับมาทำต่อได้เลย"
```

### เมื่อกลับมาทำต่อ

```
AI (อัตโนมัติ):
"กลับมาที่งาน: ระบบ Stock
 หยุดไปตอน: สร้าง API (30%)
 ค้างอยู่: เขียน tests
 พร้อมทำต่อไหม?"
```

---

## 🚪 Gate System — 4 Modes

| Mode | Gates | ใช้เมื่อ | เวลา |
|---|---|---|---|
| **Full Mode** | 10 gates | โปรเจกต์ใหม่ / งานสำคัญ | 2-4 ชม. |
| **Quick Mode** | 4 gates | Feature เล็ก / เคยทำแล้ว | 30-60 นาที |
| **Hotfix Mode** | 2 gates | Bug ด่วน | 10-20 นาที |
| **Owner Mode** | 10 gates + review | Payment/Auth/Data | 4-8 ชม. |

**AI จะเลือก mode ให้อัตโนมัติ** — ดูที่ `01-gates/_gate-selector.md`

---

## 🗂️ โครงสร้างโฟลเดอร์

```
Owner-OS-v2/
├── 📄 START-HERE.md              ← คุณอยู่ที่นี่
├── 📄 MASTER-PROMPT.md           ← อ่านต่อ
├── 📄 QUICK-REFERENCE.md         ← Cheat sheet
│
├── 📁 00-core/                   ← อ่านครั้งเดียว
│   ├── identity.md               (ฉันคือใคร)
│   ├── principles.md             (10 หลักคิด)
│   ├── roadmap-9months.md        (แผนพัฒนาตัวเอง)
│   ├── tower-control-guide.md   (ใช้ multi-AI)
│   └── session-management.md    (เริ่ม/จบ session)
│
├── 📁 01-gates/                  ← โหลดตอนรัน gate
│   ├── _gate-selector.md         (AI เลือก mode)
│   ├── full-mode/                (10 gates)
│   ├── quick-mode/               (4 gates)
│   ├── hotfix-mode/              (2 gates)
│   └── owner-mode/               (10 gates + review)
│
├── 📁 02-protocols/              ← อ่านตอนเจอสถานการณ์
│   ├── owner-escalation.md
│   ├── anti-rush.md
│   ├── tower-control.md
│   ├── similar-project-research.md
│   ├── context-loading.md
│   └── smart-context-reload.md
│
├── 📁 03-workflows/              ← อ่านตอนเริ่มงาน
│   ├── new-project.md
│   ├── fix-existing.md
│   ├── daily-routine.md
│   └── weekly-review.md
│
├── 📁 04-templates/              ← Copy ไปใช้
│   ├── prd-template.md           ⭐ (PRD - Product Requirements)
│   ├── phase-tracker.md          ⭐ (ติดตาม phase/feature)
│   ├── progress-update-setup-prompt.md ⭐ (deploy progress ไป project อื่น)
│   ├── kpi-template.md           ⭐ (KPI ที่วัดได้)
│   ├── decision-log.md
│   ├── lesson-log.md
│   ├── investigation-log.md
│   ├── architecture-doc.md
│   ├── module-doc.md
│   ├── wip-log-template.md
│   ├── checkpoint-template.md
│   └── estimation.md
│
├── 📁 05-playbooks/              ← Copy ตามประเภทงาน
│   ├── pos-system.md
│   ├── stock-system.md
│   └── service-system.md
│
├── 📁 06-references/             ← เปิดตอนสงสัย
│   ├── question-bank.md
│   ├── glossary.md
│   ├── ai-commands.md
│   ├── coaching-format.md
│   └── maturity-levels.md
│
├── 📁 07-automation/             ← AI ทำอัตโนมัติ
│   ├── auto-session-start.md
│   ├── auto-log-system.md
│   ├── auto-phase-update.md      ⭐ (อัปเดต PRD/Phase อัตโนมัติ)
│   ├── progress-update-workflow.md ⭐ (อัปเดตความคืบหน้า + architecture)
│   ├── wip-tracker.md
│   ├── session-resume.md
│   ├── context-checkpoint.md
│   ├── daily-wip-summary.md
│   ├── smart-reminder.md
│   ├── forgetful-mode.md
│   └── daily-checklist.md
│
├── 📁 08-tower-prompts/          ← สำหรับ multi-AI
│   ├── meta-tower-prompt.md
│   ├── execution-tower-prompt.md
│   └── specialist-agents.md
│
├── 📁 .rules/                    ← Multi-platform rules
│   ├── .windsurfrules
│   ├── .cursorrules
│   ├── .clinerules
│   └── .clauderules
│
└── 📁 logs/                      ← AI เขียนให้อัตโนมัติ
    ├── wip/                      (งานค้าง)
    ├── completed/                (งานเสร็จ)
    ├── decisions/                (การตัดสินใจ)
    ├── lessons/                  (บทเรียน)
    ├── investigations/           (การสืบค้น)
    └── checkpoints/              (จุดหยุด)
```

---

## 🎯 เป้าหมาย 9 เดือน

### Phase 1 (เดือน 1-3): คิดเป็น ถามเป็น
- ✅ ผ่าน Gate ทุก task โดยไม่ต้องถูกเตือน
- ✅ ถาม owner ได้คล่อง
- ✅ มี decision log 10+ entries

### Phase 2 (เดือน 4-6): เร็วขึ้น มั่นใจขึ้น
- ✅ ประเมินเวลาแม่น ±20%
- ✅ ต่อรองได้ ปฏิเสธได้
- ✅ มี product idea 1 ตัว

### Phase 3 (เดือน 7-9): สร้าง product ขายได้
- ✅ มี product ใช้งานได้จริง
- ✅ มีรายได้จาก product
- ✅ สั่ง AI ทำงาน 80%

ดูรายละเอียดที่ `00-core/roadmap-9months.md`

---

## 💡 Tips สำหรับคนสะเพร่า

### ถ้าลืมว่าทำอะไรไปแล้ว
```
สั่ง AI: "ช่วยสรุปว่าเมื่อวานทำอะไรไปแล้ว"
```

### ถ้าไม่รู้ว่าจะถามอะไร
```
เปิด: 06-references/question-bank.md
```

### ถ้าไม่เข้าใจศัพท์
```
เปิด: 06-references/glossary.md
```

### ถ้าต้องการ AI command สำเร็จรูป
```
เปิด: QUICK-REFERENCE.md
```

---

## ✅ Next Steps

1. ✅ คุณอ่านไฟล์นี้แล้ว
2. ⬜ อ่าน `MASTER-PROMPT.md` (3 นาที)
3. ⬜ Copy rules file ไปที่ home directory
4. ⬜ ทดสอบกับ AI
5. ⬜ เริ่มโปรเจกต์แรก!

---

## 🆘 ต้องการความช่วยเหลือ?

- **ไม่รู้จะเริ่มยังไง**: อ่าน `03-workflows/new-project.md`
- **AI ไม่ทำตาม**: เช็คว่า copy rules file แล้วหรือยัง
- **งานค้างเยอะ**: ดู `07-automation/wip-tracker.md`
- **ต้องการ coaching**: AI จะ coach อัตโนมัติตาม `06-references/coaching-format.md`

---

> **"AI ไม่ใช่เครื่องมือ แต่เป็น partner ที่ต้องมีกระบวนการ"**

**พร้อมแล้ว? → อ่าน MASTER-PROMPT.md ต่อ** 🚀
