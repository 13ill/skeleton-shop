# Smart Reminder

> AI เตือนอัตโนมัติ

---

## 🎯 วัตถุประสงค์

- เตือนงานค้าง
- เตือน blockers
- เตือนทบทวนบทเรียน
- ไม่ลืม

---

## 🔔 Reminder Types

### 1. WIP Reminder (งานค้าง)

**เมื่อไหร่:** เริ่ม session ใหม่

**AI แจ้ง:**
```
🔔 คุณมีงานค้าง 2 งาน:

1. TASK-001: ระบบ POS - Orders Module (60%)
   - Last updated: 2 วันที่แล้ว
   - Blocker: รอ Stripe API key

2. TASK-002: Bug fix - Login error (blocked)
   - Last updated: 3 วันที่แล้ว
   - Blocker: รอ backend team

ต้องการทำงานไหนต่อ?
```

### 2. Blocker Reminder

**เมื่อไหร่:** มี blocker นานเกิน 1 วัน

**AI แจ้ง:**
```
⚠️ Blocker Alert!

TASK-001 ถูก block มา 2 วันแล้ว
Blocker: รอ Stripe API key

ต้องการ:
A. Follow up กับ owner
B. ทำงานอื่นก่อน
C. Unblock เอง
```

### 3. Review Reminder (ทบทวนบทเรียน)

**เมื่อไหร่:** ทุกวันศุกร์ 17:00

**AI แจ้ง:**
```
📚 เวลาทบทวนบทเรียนสัปดาห์นี้!

สัปดาห์นี้คุณ:
- ทำงาน 3 tasks
- ตัดสินใจ 5 ครั้ง
- เรียนรู้ 2 บทเรียน

ต้องการทบทวนไหม?
```

### 4. Decision Log Reminder

**เมื่อไหร่:** ผ่าน Gate 5 แต่ยังไม่บันทึก decision

**AI แจ้ง:**
```
📝 คุณยังไม่ได้บันทึก Decision Log!

คุณเพิ่งตัดสินใจ: [Decision]

ต้องการให้ฉันบันทึกให้ไหม?
```

### 5. Test Reminder

**เมื่อไหร่:** เขียนโค้ดแล้วแต่ยังไม่มี tests

**AI แจ้ง:**
```
🧪 คุณยังไม่ได้เขียน tests!

ไฟล์ที่แก้:
- src/modules/orders/orders.service.ts

ต้องการเขียน tests ไหม? (TDD)
```

### 6. Daily Summary Reminder

**เมื่อไหร่:** เลิกงานประจำวัน (18:00)

**AI แจ้ง:**
```
🌆 เลิกงานแล้ว!

ต้องการสรุปงานวันนี้ไหม?
```

---

## 🤖 AI Script

```typescript
// WIP Reminder
async function wipReminder() {
  const wipTasks = await loadWIPTasks()
  
  if (wipTasks.length > 0) {
    console.log(`🔔 คุณมีงานค้าง ${wipTasks.length} งาน:\n`)
    
    wipTasks.forEach((task, index) => {
      const daysAgo = calculateDaysAgo(task.lastUpdated)
      console.log(`${index + 1}. ${task.name} (${task.progress}%)`)
      console.log(`   - Last updated: ${daysAgo}`)
      
      if (task.blockers.length > 0) {
        console.log(`   - Blocker: ${task.blockers[0]}`)
      }
      console.log('')
    })
    
    console.log('ต้องการทำงานไหนต่อ?')
  }
}

// Blocker Reminder
async function blockerReminder() {
  const blockedTasks = await loadBlockedTasks()
  
  blockedTasks.forEach(task => {
    const daysBlocked = calculateDaysAgo(task.blockedSince)
    
    if (daysBlocked > 1) {
      console.log('⚠️ Blocker Alert!\n')
      console.log(`${task.name} ถูก block มา ${daysBlocked} วันแล้ว`)
      console.log(`Blocker: ${task.blockers[0]}\n`)
      console.log('ต้องการ:')
      console.log('A. Follow up')
      console.log('B. ทำงานอื่นก่อน')
      console.log('C. Unblock เอง\n')
    }
  })
}

// Review Reminder
async function reviewReminder() {
  const today = new Date().getDay()
  const hour = new Date().getHours()
  
  // ทุกวันศุกร์ 17:00
  if (today === 5 && hour === 17) {
    const weeklyStats = await getWeeklyStats()
    
    console.log('📚 เวลาทบทวนบทเรียนสัปดาห์นี้!\n')
    console.log('สัปดาห์นี้คุณ:')
    console.log(`- ทำงาน ${weeklyStats.tasksCompleted} tasks`)
    console.log(`- ตัดสินใจ ${weeklyStats.decisionsมade} ครั้ง`)
    console.log(`- เรียนรู้ ${weeklyStats.lessonsLearned} บทเรียน\n`)
    console.log('ต้องการทบทวนไหม?')
  }
}

// Decision Log Reminder
async function decisionLogReminder() {
  if (currentGate === 'gate-5' && !hasDecisionLog()) {
    console.log('📝 คุณยังไม่ได้บันทึก Decision Log!\n')
    console.log(`คุณเพิ่งตัดสินใจ: ${currentDecision}\n`)
    console.log('ต้องการให้ฉันบันทึกให้ไหม?')
  }
}

// Test Reminder
async function testReminder() {
  const modifiedFiles = await getModifiedFiles()
  const filesWithoutTests = modifiedFiles.filter(f => !hasTests(f))
  
  if (filesWithoutTests.length > 0) {
    console.log('🧪 คุณยังไม่ได้เขียน tests!\n')
    console.log('ไฟล์ที่แก้:')
    filesWithoutTests.forEach(file => {
      console.log(`- ${file}`)
    })
    console.log('\nต้องการเขียน tests ไหม? (TDD)')
  }
}

// Daily Summary Reminder
async function dailySummaryReminder() {
  const hour = new Date().getHours()
  
  if (hour === 18) {
    console.log('🌆 เลิกงานแล้ว!\n')
    console.log('ต้องการสรุปงานวันนี้ไหม?')
  }
}
```

---

## 💡 Tips

### ตั้งค่า Reminder

- ✅ WIP Reminder: ทุกครั้งที่เริ่ม session
- ✅ Blocker Reminder: ทุกวัน 9:00
- ✅ Review Reminder: ทุกวันศุกร์ 17:00
- ✅ Daily Summary: ทุกวัน 18:00

### ปิด Reminder (ถ้ารบกวน)

```
"ปิด reminder [type]"
```

---

## 🔗 เอกสารอ้างอิง

- `07-automation/wip-tracker.md` — WIP tracker
- `07-automation/daily-wip-summary.md` — Daily summary

---

> **"Reminder ที่ดี = ไม่ลืม"**
