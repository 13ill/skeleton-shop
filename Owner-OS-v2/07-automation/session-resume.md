# Session Resume

> AI ช่วยกลับมาทำงานต่อ

---

## 🎯 วัตถุประสงค์

- โหลด checkpoint อัตโนมัติ
- สรุปสถานะ
- พร้อมทำต่อ

---

## 🔄 Workflow

### Step 1: Detect Resume

AI detect ว่า user ต้องการทำงานต่อ:

```
User พิมพ์:
- "กลับมาทำงานต่อ"
- "ทำงานเดิมต่อ"
- "Resume"
```

### Step 2: Load Checkpoint

โหลด checkpoint ล่าสุด:

```typescript
const checkpoint = await loadLatestCheckpoint(taskId)
```

### Step 3: Calculate Time Gap

คำนวณว่าหยุดไปนานแค่ไหน:

```typescript
const timeGap = Date.now() - checkpoint.timestamp
const hours = timeGap / (1000 * 60 * 60)
```

### Step 4: Smart Context Reload

โหลด context ตามเวลาที่หยุด:

```typescript
if (hours < 2) {
  // Quick Resume
  await loadMinimalContext(checkpoint)
} else if (hours < 24) {
  // Standard Resume
  await loadStandardContext(checkpoint)
} else if (hours < 72) {
  // Full Resume
  await loadFullContext(checkpoint)
} else {
  // Deep Resume
  await loadDeepContext(checkpoint)
}
```

### Step 5: Show Summary

แสดงสรุปสถานะ:

```
📊 สรุปสถานะ:

**งาน:** ระบบ POS - Orders Module
**สถานะ:** in_progress (60%)
**หยุดไปเมื่อ:** 2026-06-01 14:30 (2 ชั่วโมงที่แล้ว)

**ความคืบหน้า:**
- ✅ Orders Service — 80%
- ✅ Orders Repository — 100%
- ⏳ Payment Integration — 0%
- ⏳ Tests — 0%

**ขั้นตอนถัดไป:**
1. แก้ Prisma schema
2. รอ Stripe API key
3. Integrate Stripe payment

**Blocker:**
- รอ Stripe API key จาก owner (ETA: วันนี้ 16:00)

**ไฟล์ที่กำลังแก้:**
- src/modules/orders/orders.service.ts
- src/modules/orders/orders.repository.ts
```

### Step 6: Ask User

ถามว่าพร้อมทำต่อไหม:

```
พร้อมทำต่อไหม?

A. ใช่ ทำต่อเลย
B. ดูรายละเอียดก่อน
C. เปลี่ยนไปทำงานอื่น
```

### Step 7: Resume

ถ้าเลือก A:

```
✅ พร้อมทำต่อแล้ว!

ขั้นตอนถัดไป: แก้ Prisma schema

ต้องการให้ฉันช่วยอะไร?
```

---

## 🤖 AI Script

```typescript
async function sessionResume(taskId: string) {
  // Step 1: Load checkpoint
  const checkpoint = await loadLatestCheckpoint(taskId)
  
  if (!checkpoint) {
    console.log('❌ ไม่พบ checkpoint')
    return
  }
  
  // Step 2: Calculate time gap
  const timeGap = Date.now() - new Date(checkpoint.timestamp).getTime()
  const hours = timeGap / (1000 * 60 * 60)
  
  // Step 3: Smart context reload
  if (hours < 2) {
    await loadMinimalContext(checkpoint)
  } else if (hours < 24) {
    await loadStandardContext(checkpoint)
  } else if (hours < 72) {
    await loadFullContext(checkpoint)
  } else {
    await loadDeepContext(checkpoint)
  }
  
  // Step 4: Show summary
  console.log('📊 สรุปสถานะ:\n')
  console.log(`**งาน:** ${checkpoint.task_name}`)
  console.log(`**สถานะ:** ${checkpoint.status} (${checkpoint.progress}%)`)
  console.log(`**หยุดไปเมื่อ:** ${checkpoint.timestamp} (${formatTimeGap(hours)})`)
  console.log('')
  
  console.log('**ความคืบหน้า:**')
  checkpoint.progress_details.forEach(item => {
    const icon = item.done ? '✅' : '⏳'
    console.log(`${icon} ${item.name} — ${item.progress}%`)
  })
  console.log('')
  
  console.log('**ขั้นตอนถัดไป:**')
  checkpoint.next_steps.forEach((step, index) => {
    console.log(`${index + 1}. ${step}`)
  })
  console.log('')
  
  if (checkpoint.blockers.length > 0) {
    console.log('**Blocker:**')
    checkpoint.blockers.forEach(blocker => {
      console.log(`- ${blocker}`)
    })
    console.log('')
  }
  
  console.log('**ไฟล์ที่กำลังแก้:**')
  checkpoint.files_modified.forEach(file => {
    console.log(`- ${file}`)
  })
  console.log('')
  
  // Step 5: Ask user
  console.log('พร้อมทำต่อไหม?\n')
  console.log('A. ใช่ ทำต่อเลย')
  console.log('B. ดูรายละเอียดก่อน')
  console.log('C. เปลี่ยนไปทำงานอื่น\n')
  
  const choice = await getUserInput()
  
  if (choice === 'A') {
    console.log('✅ พร้อมทำต่อแล้ว!\n')
    console.log(`ขั้นตอนถัดไป: ${checkpoint.next_steps[0]}\n`)
    console.log('ต้องการให้ฉันช่วยอะไร?')
  }
}

function formatTimeGap(hours: number): string {
  if (hours < 1) {
    return `${Math.round(hours * 60)} นาทีที่แล้ว`
  } else if (hours < 24) {
    return `${Math.round(hours)} ชั่วโมงที่แล้ว`
  } else {
    return `${Math.round(hours / 24)} วันที่แล้ว`
  }
}
```

---

## 💡 Tips

### สำหรับคนที่ลืมง่าย

- ✅ ใช้ Session Resume ทุกครั้ง
- ✅ อ่านสรุปสถานะก่อนทำต่อ
- ✅ เช็ค blockers

### สำหรับคนที่จำได้ดี

- ✅ กด A เลย (ทำต่อเลย)

---

## 🔗 เอกสารอ้างอิง

- `00-core/session-management.md` — Session management
- `02-protocols/smart-context-reload.md` — Smart context reload
- `04-templates/checkpoint-template.md` — Checkpoint template

---

> **"Resume ดี = ทำต่อได้เลย"**
