# Daily WIP Summary

> AI สรุปงานค้างประจำวัน

---

## 🎯 วัตถุประสงค์

- สรุปงานค้างทุกวัน
- เห็นภาพรวม
- วางแผนวันพรุ่งนี้

---

## 🔄 Workflow

### Trigger: เลิกงานประจำวัน

```
เวลา: 18:00 (หรือตามที่ตั้งค่า)
```

**AI ทำ:**
```
1. รวบรวมงานค้างทั้งหมด
2. สรุปความคืบหน้า
3. สร้าง daily summary
4. บันทึกลง logs/daily-summaries/YYYY-MM-DD.md
5. แสดงสรุป
```

---

## 📊 Daily Summary Format

```markdown
# Daily WIP Summary — YYYY-MM-DD

Generated: YYYY-MM-DD HH:MM:SS

---

## 📊 Overview

**Total Tasks:** X
**In Progress:** Y
**Blocked:** Z
**Completed Today:** W

---

## 🎯 Tasks

### Task 1: [Task Name]

**Status:** in_progress (60%)
**Priority:** high
**Gate:** gate-7
**Last Updated:** YYYY-MM-DD HH:MM

**Progress:**
- ✅ Subtask 1 — Done
- ⏳ Subtask 2 — In progress (50%)
- ⏳ Subtask 3 — Not started

**Next Steps:**
1. [Step 1]
2. [Step 2]

**Blockers:**
- [Blocker 1]

**Estimated Time to Complete:** X hours

---

### Task 2: [Task Name]

[...]

---

## ✅ Completed Today

- [Task A] — Completed at HH:MM
- [Task B] — Completed at HH:MM

---

## 🚨 Blockers

- Task 1: [Blocker]
- Task 2: [Blocker]

---

## 📅 Plan for Tomorrow

**Priority Tasks:**
1. [Task 1] — [What to do]
2. [Task 2] — [What to do]

**Goals:**
- [ ] Complete Task 1
- [ ] Unblock Task 2
- [ ] Start Task 3

---

## 📈 Progress

**Yesterday:** X tasks in progress
**Today:** Y tasks in progress
**Change:** +/- Z tasks

---

## 💡 Notes

[บันทึกอื่นๆ]
```

---

## 🤖 AI Script

```typescript
async function generateDailyWIPSummary() {
  // Load all WIP tasks
  const wipTasks = await loadWIPTasks()
  
  // Load completed tasks today
  const completedToday = await loadCompletedTasksToday()
  
  // Generate summary
  const summary = {
    date: new Date().toISOString().split('T')[0],
    timestamp: new Date().toISOString(),
    overview: {
      totalTasks: wipTasks.length,
      inProgress: wipTasks.filter(t => t.status === 'in_progress').length,
      blocked: wipTasks.filter(t => t.status === 'blocked').length,
      completedToday: completedToday.length
    },
    tasks: wipTasks.map(task => ({
      name: task.name,
      status: task.status,
      progress: task.progress,
      priority: task.priority,
      gate: task.currentGate,
      lastUpdated: task.lastUpdated,
      progressDetails: task.progressDetails,
      nextSteps: task.nextSteps,
      blockers: task.blockers,
      estimatedTime: task.estimatedTime
    })),
    completedToday: completedToday.map(task => ({
      name: task.name,
      completedAt: task.completedAt
    })),
    blockers: wipTasks
      .filter(t => t.blockers.length > 0)
      .map(t => ({
        task: t.name,
        blockers: t.blockers
      })),
    planForTomorrow: generatePlanForTomorrow(wipTasks)
  }
  
  // Save summary
  await saveDailySummary(summary)
  
  // Display summary
  displayDailySummary(summary)
}

function displayDailySummary(summary: DailySummary) {
  console.log(`\n# Daily WIP Summary — ${summary.date}\n`)
  console.log('---\n')
  
  console.log('## 📊 Overview\n')
  console.log(`**Total Tasks:** ${summary.overview.totalTasks}`)
  console.log(`**In Progress:** ${summary.overview.inProgress}`)
  console.log(`**Blocked:** ${summary.overview.blocked}`)
  console.log(`**Completed Today:** ${summary.overview.completedToday}\n`)
  
  console.log('## 🎯 Tasks\n')
  summary.tasks.forEach((task, index) => {
    console.log(`### Task ${index + 1}: ${task.name}\n`)
    console.log(`**Status:** ${task.status} (${task.progress}%)`)
    console.log(`**Priority:** ${task.priority}`)
    console.log(`**Gate:** ${task.gate}`)
    console.log(`**Last Updated:** ${task.lastUpdated}\n`)
    
    if (task.nextSteps.length > 0) {
      console.log('**Next Steps:**')
      task.nextSteps.forEach((step, i) => {
        console.log(`${i + 1}. ${step}`)
      })
      console.log('')
    }
    
    if (task.blockers.length > 0) {
      console.log('**Blockers:**')
      task.blockers.forEach(blocker => {
        console.log(`- ${blocker}`)
      })
      console.log('')
    }
  })
  
  if (summary.completedToday.length > 0) {
    console.log('## ✅ Completed Today\n')
    summary.completedToday.forEach(task => {
      console.log(`- ${task.name} — Completed at ${task.completedAt}`)
    })
    console.log('')
  }
  
  if (summary.blockers.length > 0) {
    console.log('## 🚨 Blockers\n')
    summary.blockers.forEach(item => {
      console.log(`- ${item.task}: ${item.blockers.join(', ')}`)
    })
    console.log('')
  }
  
  console.log('## 📅 Plan for Tomorrow\n')
  console.log('**Priority Tasks:**')
  summary.planForTomorrow.forEach((task, index) => {
    console.log(`${index + 1}. ${task}`)
  })
  console.log('')
}
```

---

## 💡 Tips

### ดู Daily Summary ทุกวัน

- ✅ เห็นภาพรวมงานค้าง
- ✅ วางแผนวันพรุ่งนี้
- ✅ เช็ค blockers

### Export เป็น PDF

- ✅ ส่งให้ทีม
- ✅ ส่งให้ manager
- ✅ เก็บเป็น record

---

## 🔗 เอกสารอ้างอิง

- `07-automation/wip-tracker.md` — WIP tracker
- `07-automation/context-checkpoint.md` — Context checkpoint

---

> **"สรุปทุกวัน = เห็นภาพรวม"**
