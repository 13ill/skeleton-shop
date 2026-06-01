# Forgetful Mode

> โหมดพิเศษสำหรับคนที่ลืมง่าย

---

## 🎯 วัตถุประสงค์

- เตือนบ่อยขึ้น
- สรุปบ่อยขึ้น
- บันทึกบ่อยขึ้น
- ไม่ลืม

---

## 🔄 Forgetful Mode Features

### 1. Frequent Reminders

**ปกติ:** เตือนทุก 2 ชั่วโมง
**Forgetful Mode:** เตือนทุก 30 นาที

```
🔔 Reminder (30 นาทีที่แล้ว):

คุณกำลังทำ: Orders Module - Payment Integration
Progress: 70%
Next step: Test payment flow

ต้องการทำต่อไหม?
```

### 2. Frequent Checkpoints

**ปกติ:** Checkpoint ทุก 2 ชั่วโมง
**Forgetful Mode:** Checkpoint ทุก 30 นาที

```
✅ Auto checkpoint (30 นาทีที่แล้ว)
```

### 3. Frequent Summaries

**ปกติ:** สรุปเมื่อเลิกงาน
**Forgetful Mode:** สรุปทุก 1 ชั่วโมง

```
📊 สรุปชั่วโมงนี้:

ทำอะไรไปบ้าง:
- เขียน payment integration (50%)
- เขียน tests (30%)

ชั่วโมงหน้าจะทำ:
- เขียน tests ต่อ (70%)
- Test payment flow
```

### 4. Context Reload ทุกครั้ง

**ปกติ:** โหลด context ตามเวลาที่หยุด
**Forgetful Mode:** โหลด context เต็มทุกครั้ง

```
โหลด:
- Checkpoint ล่าสุด
- Architecture doc
- Module doc
- Decision logs
- Lesson logs
- WIP summary
```

### 5. Repeat Instructions

**ปกติ:** บอกครั้งเดียว
**Forgetful Mode:** ทวนซ้ำ

```
ขั้นตอนถัดไป: Test payment flow

ทำยังไง:
1. เขียน test case
2. Run test
3. Fix bugs
4. Run test again

จำได้ไหม? ถ้าลืมบอกได้เลย!
```

### 6. Visual Progress

**ปกติ:** แสดง progress เป็นตัวเลข
**Forgetful Mode:** แสดง progress เป็น visual

```
Progress: 70%

[████████████████░░░░░░] 70%

เสร็จแล้ว:
✅ Payment integration
✅ Basic tests

ยังเหลือ:
⏳ Advanced tests
⏳ Error handling
```

---

## 🤖 Enable Forgetful Mode

```typescript
// Enable
async function enableForgetfulMode() {
  config.forgetfulMode = true
  config.reminderInterval = 30 * 60 * 1000 // 30 minutes
  config.checkpointInterval = 30 * 60 * 1000 // 30 minutes
  config.summaryInterval = 60 * 60 * 1000 // 1 hour
  config.contextReload = 'full' // always full reload
  config.repeatInstructions = true
  config.visualProgress = true
  
  console.log('✅ เปิด Forgetful Mode แล้ว!')
  console.log('ตอนนี้ AI จะ:')
  console.log('- เตือนทุก 30 นาที')
  console.log('- Checkpoint ทุก 30 นาที')
  console.log('- สรุปทุก 1 ชั่วโมง')
  console.log('- โหลด context เต็มทุกครั้ง')
  console.log('- ทวนคำสั่งซ้ำ')
  console.log('- แสดง progress แบบ visual')
}

// Disable
async function disableForgetfulMode() {
  config.forgetfulMode = false
  config.reminderInterval = 2 * 60 * 60 * 1000 // 2 hours
  config.checkpointInterval = 2 * 60 * 60 * 1000 // 2 hours
  config.summaryInterval = null // only at end of day
  config.contextReload = 'smart' // smart reload
  config.repeatInstructions = false
  config.visualProgress = false
  
  console.log('✅ ปิด Forgetful Mode แล้ว!')
}
```

---

## 💡 Tips

### เมื่อไหร่ควรใช้ Forgetful Mode

- ✅ เมื่อทำงานที่ซับซ้อน
- ✅ เมื่อทำงานที่ต้องจำเยอะ
- ✅ เมื่อถูกรบกวนบ่อย
- ✅ เมื่อลืมง่าย

### เมื่อไหร่ไม่ควรใช้

- ❌ เมื่อทำงานที่ง่าย
- ❌ เมื่อจำได้ดี
- ❌ เมื่อไม่ชอบถูกรบกวน

---

## 🔗 เอกสารอ้างอิง

- `07-automation/smart-reminder.md` — Smart reminder
- `07-automation/context-checkpoint.md` — Context checkpoint
- `07-automation/daily-wip-summary.md` — Daily summary

---

> **"Forgetful Mode = ไม่ลืมแน่นอน"** 🧠
