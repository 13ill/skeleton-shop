# 📋 QUICK REFERENCE — AI Commands Cheat Sheet

> Copy ไปใช้ได้เลย ไม่ต้องคิด

---

## 🚀 เริ่ม Session

```
"สวัสดี กลับมาทำงานต่อ"
```

AI จะ:
- เช็คงานค้าง
- แจ้งเตือน
- โหลด context
- พร้อมทำงาน

---

## 🎯 เริ่มงานใหม่

### งานปกติ
```
"[intake-mode] ได้รับ task: ทำระบบ POS"
```

### งานที่ต้องคิดก่อน
```
"[thinking-mode] ต้องทำ: เพิ่ม feature ชำระเงิน"
```

### งานที่ต้องออกแบบ
```
"[architect-mode] ออกแบบระบบ Stock Management"
```

---

## 🔍 วิเคราะห์และตัดสินใจ

### เปรียบเทียบทางเลือก
```
"[tradeoff-mode] ต้องเลือก database: PostgreSQL vs MongoDB"
```

### ประเมินเวลา
```
"[estimation-mode] ประเมินเวลาทำงาน: สร้าง API สำหรับ orders"
```

### วิเคราะห์ความเสี่ยง
```
"[risk-mode] วิเคราะห์ความเสี่ยงของการเปลี่ยน database schema"
```

---

## 🐛 Debug และแก้ไข

### Debug
```
"[debug-mode] Symptom: ระบบ stock ตัดไม่ถูก"
```

### Hotfix (ด่วน)
```
"[hotfix-mode] Bug ด่วน: user ล็อกอินไม่ได้"
```

---

## 📖 อ่านและทำความเข้าใจ

### อ่าน Project
```
"[architect-mode] อ่าน project นี้แล้วสรุปภาพรวม"
```

### อ่าน Module
```
"[architect-mode] อ่าน module orders แล้วสรุป"
```

### Trace Flow
```
"[architect-mode] trace flow ตั้งแต่ user กดปุ่มขาย จนถึง stock ถูกตัด"
```

---

## 🔄 กลับมาทำต่อ

### กลับมาทำงานเดิม
```
"กลับมาทำงาน [ชื่องาน] ต่อ"
```

### ลืมว่าทำอะไรไปแล้ว
```
"ช่วยสรุปว่าเมื่อวานทำอะไรไปแล้ว"
```

### ดูงานค้าง
```
"มีงานค้างอะไรบ้าง?"
```

---

## ✅ Review และเรียนรู้

### Review Code
```
"[review-mode] review code ที่เพิ่งเขียน"
```

### ทบทวนสัปดาห์นี้
```
"ทบทวนสัปดาห์นี้ ทำอะไรไปบ้าง เรียนรู้อะไร"
```

### ดู Progress
```
"ฉันอยู่ phase ไหนของ roadmap 9 เดือน?"
```

---

## 🎓 Coaching

### ฝึกคิด
```
"[coaching-mode] ฉันต้องทำ: เพิ่ม feature ส่วนลด"
```

### ถามคำถาม
```
"ฉันควรถามอะไร owner เกี่ยวกับ feature นี้?"
```

### ขอคำแนะนำ
```
"ฉันกำลังจะเลือก [X] ช่วยวิเคราะห์ให้หน่อย"
```

---

## 📝 บันทึก

### บันทึก Decision
```
"ช่วย log decision: เลือกใช้ PostgreSQL เพราะ [เหตุผล]"
```

### บันทึก Lesson
```
"ช่วย log lesson: วันนี้เรียนรู้ว่า [X]"
```

---

## 🏗️ Architecture

### สร้าง Architecture Doc
```
"[architect-mode] สร้าง docs/architecture.md สำหรับ project นี้"
```

### สร้าง Module Doc
```
"[architect-mode] สร้าง docs/modules/orders.md"
```

### อัปเดต Architecture
```
"อัปเดต architecture doc — เพิ่ม module payments"
```

---

## 🎯 Gate System

### เช็คว่าผ่าน Gate ไหนแล้ว
```
"งานนี้ผ่าน gate ไหนแล้วบ้าง?"
```

### ข้าม Gate (ใช้เฉพาะเมื่อจำเป็น)
```
"ข้าม gate [X] ไปก่อน เพราะ [เหตุผล]"
```

### กลับไป Gate ก่อนหน้า
```
"กลับไป gate [X] ต้องทบทวนอีกรอบ"
```

---

## 🚨 Emergency

### หยุดทันที
```
"หยุดก่อน ไปทำอย่างอื่นก่อน"
```

AI จะ:
- บันทึก checkpoint
- แจ้ง: "✅ บันทึกแล้ว"

### Rollback
```
"ย้อนกลับไปก่อนเปลี่ยนแปลง"
```

---

## 🔧 Utility

### อธิบายศัพท์
```
"[ศัพท์] คืออะไร?"
```

### ยกตัวอย่าง
```
"ยกตัวอย่าง [แนวคิด] ให้หน่อย"
```

### เปรียบเทียบ
```
"เปรียบเทียบ [A] กับ [B]"
```

---

## 🎨 Modes อ้างอิง

| Mode | ใช้เมื่อ |
|---|---|
| `thinking-mode` | คิดวิเคราะห์ก่อน ห้าม execute |
| `coaching-mode` | ฝึกให้คิดเอง ถามกลับก่อนตอบ |
| `intake-mode` | ถาม requirement เจาะลึก |
| `architect-mode` | อ่านระบบ/โค้ด + ออกแบบ |
| `tradeoff-mode` | เสนอทางเลือก + วิเคราะห์ข้อดี/ข้อเสีย |
| `estimation-mode` | ประเมินเวลา + ราคา + scope |
| `code-mode` | เขียนโค้ด (หลังผ่าน gate แล้วเท่านั้น) |
| `review-mode` | review งาน + ตรวจ risk |
| `debug-mode` | หาสาเหตุปัญหาอย่างเป็นระบบ |
| `hotfix-mode` | แก้ bug ด่วน |
| `risk-mode` | วิเคราะห์ความเสี่ยง |

---

## 💡 Tips

### ถ้าไม่รู้จะใช้ mode ไหน
```
"ฉันต้องทำ [X] ควรใช้ mode ไหน?"
```

### ถ้า AI ไม่ทำตาม
```
"อ่าน MASTER-PROMPT.md แล้วทำตาม protocol"
```

### ถ้าต้องการตอบตรงไม่ต้อง coach
```
"ตอบเลย ไม่ต้อง coach"
```

---

## 🔗 Quick Links

- **ไม่รู้จะถามอะไร**: `06-references/question-bank.md`
- **ไม่เข้าใจศัพท์**: `06-references/glossary.md`
- **ต้องการ template**: `04-templates/`
- **ต้องการ playbook**: `05-playbooks/`
- **ดู workflow**: `03-workflows/`

---

> **Copy command ที่ต้องการ → Paste → Enter → Done!** 🚀
