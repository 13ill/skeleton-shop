# Smart Context Reload Protocol

> โหลด context ตามระยะเวลาที่หยุด

---

## 🎯 วัตถุประสงค์

- โหลด context ที่เหมาะสม
- ไม่โหลดมากเกินไป
- ไม่โหลดน้อยเกินไป
- ประหยัดเวลา

---

## ⏱️ Reload Strategy ตามเวลา

### < 2 ชั่วโมง (Quick Resume)

**สถานการณ์:** หยุดไปทานข้าว ไปประชุม

**โหลด:**
- ✅ Checkpoint ล่าสุด
- ✅ ไฟล์ที่กำลังแก้

**ไม่ต้องโหลด:**
- ❌ Architecture docs (จำได้อยู่)
- ❌ Decision logs (จำได้อยู่)

**ขนาด:** ~2,000 tokens

### 2 ชม - 1 วัน (Standard Resume)

**สถานการณ์:** กลับมาทำต่อวันรุ่งขึ้น

**โหลด:**
- ✅ Checkpoint ล่าสุด
- ✅ Architecture doc
- ✅ Module doc
- ✅ ไฟล์ที่กำลังแก้

**ไม่ต้องโหลด:**
- ❌ Decision logs (ยังจำได้)
- ❌ Lesson logs (ยังจำได้)

**ขนาด:** ~5,000 tokens

### 1-3 วัน (Full Resume)

**สถานการณ์:** หยุดสุดสัปดาห์ กลับมาจันทร์

**โหลด:**
- ✅ Checkpoint ล่าสุด
- ✅ Architecture doc
- ✅ Module doc
- ✅ Decision logs (3 วันล่าสุด)
- ✅ Lesson logs (3 วันล่าสุด)
- ✅ WIP summary

**ขนาด:** ~10,000 tokens

### > 3 วัน (Deep Resume)

**สถานการณ์:** หยุดยาว กลับมาทำต่อ

**โหลด:**
- ✅ Root Overview (MASTER-PROMPT.md)
- ✅ Checkpoint ล่าสุด
- ✅ Architecture doc
- ✅ Module doc
- ✅ All decision logs
- ✅ All lesson logs
- ✅ WIP summary
- ✅ Investigation logs (ถ้ามี)

**ขนาด:** ~15,000 tokens

---

## 🤖 AI Auto-Detect

AI จะ detect อัตโนมัติว่าหยุดไปนานแค่ไหน:

```typescript
const lastSessionTime = checkpoint.timestamp
const now = Date.now()
const hoursSinceLastSession = (now - lastSessionTime) / (1000 * 60 * 60)

if (hoursSinceLastSession < 2) {
  return 'quick-resume'
} else if (hoursSinceLastSession < 24) {
  return 'standard-resume'
} else if (hoursSinceLastSession < 72) {
  return 'full-resume'
} else {
  return 'deep-resume'
}
```

---

## 📋 Resume Checklist

### Quick Resume (< 2 ชม)

- [ ] อ่าน checkpoint
- [ ] โหลดไฟล์ที่กำลังแก้
- [ ] สรุปสถานะ (1-2 ประโยค)
- [ ] ถาม: "พร้อมทำต่อไหม?"

### Standard Resume (2 ชม - 1 วัน)

- [ ] อ่าน checkpoint
- [ ] โหลด architecture doc
- [ ] โหลด module doc
- [ ] สรุปสถานะ (3-5 ประโยค)
- [ ] แจ้งงานค้าง (ถ้ามี)
- [ ] ถาม: "พร้อมทำต่อไหม?"

### Full Resume (1-3 วัน)

- [ ] อ่าน checkpoint
- [ ] โหลด architecture doc
- [ ] โหลด module doc
- [ ] อ่าน decision logs (3 วันล่าสุด)
- [ ] อ่าน lesson logs (3 วันล่าสุด)
- [ ] สรุปสถานะ (5-10 ประโยค)
- [ ] แจ้งงานค้าง
- [ ] แจ้ง decisions ที่ทำไว้
- [ ] ถาม: "พร้อมทำต่อไหม?"

### Deep Resume (> 3 วัน)

- [ ] โหลด Root Overview
- [ ] อ่าน checkpoint
- [ ] โหลด architecture doc
- [ ] โหลด module doc
- [ ] อ่าน all decision logs
- [ ] อ่าน all lesson logs
- [ ] อ่าน WIP summary
- [ ] สรุปสถานะแบบละเอียด
- [ ] แจ้งงานค้าง
- [ ] แจ้ง decisions ที่ทำไว้
- [ ] แจ้ง lessons ที่เรียนรู้
- [ ] ถาม: "พร้อมทำต่อไหม? หรือต้องการทบทวนก่อน?"

---

## 💡 Tips

### สำหรับคนที่ลืมง่าย

- ใช้ Deep Resume เสมอ (แม้หยุดไม่นาน)
- อ่าน all logs
- สรุปแบบละเอียด

### สำหรับคนที่จำได้ดี

- ใช้ Quick/Standard Resume
- โหลดแค่ checkpoint
- สรุปแบบสั้น

---

## 🔗 เอกสารอ้างอิง

- `00-core/session-management.md` — Session management
- `02-protocols/context-loading.md` — Context loading
- `07-automation/session-resume.md` — Auto resume

---

> **"โหลดตามความจำเป็น = ประหยัดเวลา"**
