# Auto Session Start

> AI ทำอัตโนมัติเมื่อเริ่ม session

---

## 🎯 วัตถุประสงค์

- โหลด context อัตโนมัติ
- เช็คงานค้าง
- แจ้งเตือน
- พร้อมทำงาน

---

## 🔄 Workflow

### Step 1: Detect Session Start

AI detect ว่าเป็น session ใหม่:

```typescript
if (isNewSession()) {
  runAutoSessionStart()
}
```

### Step 2: Load Root Overview

โหลด context พื้นฐาน:

```
โหลด:
- MASTER-PROMPT.md
- 00-core/identity.md
- 00-core/principles.md
```

### Step 3: Check WIP

เช็คงานค้าง:

```typescript
const wipTasks = await loadWIPTasks()

if (wipTasks.length > 0) {
  showWIPSummary(wipTasks)
}
```

### Step 4: Show Summary

แสดงสรุป:

```
📊 สรุปงานค้าง:

1. TASK-001: ระบบ POS - Orders Module
   - Status: in_progress (60%)
   - Last updated: 2026-06-01 14:30
   - Next: Payment integration
   - Blocker: รอ Stripe API key

2. TASK-002: Bug fix - Login error
   - Status: blocked
   - Last updated: 2026-05-31 18:00
   - Blocker: รอ backend team แก้ API
```

### Step 5: Ask User

ถามว่าจะทำอะไร:

```
คุณต้องการ:

A. ทำงานเดิมต่อ (TASK-001)
B. เริ่มงานใหม่
C. ดูรายละเอียดงานค้าง
D. ทบทวนบทเรียนก่อน
```

### Step 6: Load Context

โหลด context ตามที่เลือก:

**ถ้าเลือก A (ทำงานเดิมต่อ):**
```
โหลด:
- Checkpoint ล่าสุด
- Architecture doc
- Module doc
- Files ที่กำลังแก้
```

**ถ้าเลือก B (เริ่มงานใหม่):**
```
โหลด:
- Gate 0 checklist
```

---

## 🤖 AI Script

```typescript
async function autoSessionStart() {
  // Step 1: Load root overview
  await loadRootOverview()
  
  // Step 2: Check WIP
  const wipTasks = await loadWIPTasks()
  
  // Step 3: Show summary
  if (wipTasks.length > 0) {
    console.log('📊 สรุปงานค้าง:\n')
    wipTasks.forEach((task, index) => {
      console.log(`${index + 1}. ${task.name}`)
      console.log(`   - Status: ${task.status} (${task.progress}%)`)
      console.log(`   - Last updated: ${task.lastUpdated}`)
      console.log(`   - Next: ${task.nextSteps[0]}`)
      if (task.blockers.length > 0) {
        console.log(`   - Blocker: ${task.blockers[0]}`)
      }
      console.log('')
    })
  } else {
    console.log('✅ ไม่มีงานค้าง\n')
  }
  
  // Step 4: Ask user
  console.log('คุณต้องการ:\n')
  console.log('A. ทำงานเดิมต่อ')
  console.log('B. เริ่มงานใหม่')
  console.log('C. ดูรายละเอียดงานค้าง')
  console.log('D. ทบทวนบทเรียนก่อน\n')
  
  const choice = await getUserInput()
  
  // Step 5: Load context
  switch (choice) {
    case 'A':
      await resumeTask(wipTasks[0])
      break
    case 'B':
      await startNewTask()
      break
    case 'C':
      await showWIPDetails(wipTasks)
      break
    case 'D':
      await reviewLessons()
      break
  }
}
```

---

## 💡 Tips

### สำหรับคนที่ลืมง่าย

- ✅ ใช้ Auto Session Start ทุกครั้ง
- ✅ ดูสรุปงานค้างก่อนเริ่มทำงาน
- ✅ ทบทวนบทเรียนสัปดาห์ละครั้ง

### สำหรับคนที่จำได้ดี

- ✅ Skip summary (กด B เลย)
- ✅ เริ่มงานใหม่ได้เลย

---

## 🔗 เอกสารอ้างอิง

- `00-core/session-management.md` — Session management
- `02-protocols/context-loading.md` — Context loading
- `07-automation/wip-tracker.md` — WIP tracking

---

> **"เริ่ม session ดี = ทำงานได้เร็ว"**
