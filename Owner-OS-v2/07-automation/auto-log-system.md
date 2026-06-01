# Auto Log System

> AI เขียน log อัตโนมัติ

---

## 🎯 วัตถุประสงค์

- บันทึก decision อัตโนมัติ
- บันทึก lesson อัตโนมัติ
- บันทึก investigation อัตโนมัติ
- ไม่ต้องเขียนเอง

---

## 📋 Auto Logging Rules

### 1. Decision Log (Gate 5)

**เมื่อไหร่:** เมื่อผ่าน Gate 5 (Decision)

**AI ทำอัตโนมัติ:**
```
1. สร้าง decision log
2. บันทึก:
   - Decision
   - Rationale
   - Tradeoffs
   - Accepted Risks
   - Alternatives
3. บันทึกลง logs/decisions/DEC-XXX.md
4. แจ้ง: "✅ บันทึก Decision Log แล้ว (DEC-XXX)"
```

**Template:**
```yaml
---
decision_id: DEC-XXX
date: YYYY-MM-DD
task: [ชื่องาน]
---

## Decision
[การตัดสินใจ]

## Rationale
[เหตุผล]

## Tradeoffs
[ข้อแลกเปลี่ยน]

## Accepted Risks
[ความเสี่ยงที่ยอมรับ]

## Alternatives
[ทางเลือกอื่น]
```

### 2. Lesson Log (Gate 9)

**เมื่อไหร่:** เมื่อผ่าน Gate 9 (Learning & Coaching)

**AI ทำอัตโนมัติ:**
```
1. สร้าง lesson log
2. บันทึก:
   - What I Learned
   - Why It Matters
   - Next Time
3. บันทึกลง logs/lessons/LES-XXX.md
4. แจ้ง: "✅ บันทึก Lesson Log แล้ว (LES-XXX)"
```

### 3. Investigation Log (เมื่อ Debug)

**เมื่อไหร่:** เมื่อเริ่ม debug / investigate

**AI ทำอัตโนมัติ:**
```
1. สร้าง investigation log
2. บันทึก:
   - Symptom
   - Investigation Steps
   - Root Cause
   - Solution
3. บันทึกลง logs/investigations/INV-XXX.md
4. แจ้ง: "✅ บันทึก Investigation Log แล้ว (INV-XXX)"
```

### 4. Checkpoint (เมื่อหยุดชั่วคราว)

**เมื่อไหร่:** เมื่อ user พิมพ์ "หยุดก่อน" หรือ "ไปทำอย่างอื่นก่อน"

**AI ทำอัตโนมัติ:**
```
1. สร้าง checkpoint
2. บันทึก:
   - Progress Summary
   - Current Status
   - Files Modified
   - Next Steps
   - Blockers
3. บันทึกลง logs/wip/TASK-XXX.md
4. แจ้ง: "✅ บันทึก Checkpoint แล้ว"
```

---

## 🤖 AI Script

```typescript
// Auto Decision Log
async function autoDecisionLog(decision: Decision) {
  const log = {
    decision_id: generateId('DEC'),
    date: new Date().toISOString().split('T')[0],
    task: currentTask.name,
    decision: decision.choice,
    rationale: decision.rationale,
    tradeoffs: decision.tradeoffs,
    acceptedRisks: decision.risks,
    alternatives: decision.alternatives
  }
  
  await saveLog('decisions', log)
  console.log(`✅ บันทึก Decision Log แล้ว (${log.decision_id})`)
}

// Auto Lesson Log
async function autoLessonLog(lesson: Lesson) {
  const log = {
    lesson_id: generateId('LES'),
    date: new Date().toISOString().split('T')[0],
    task: currentTask.name,
    category: lesson.category,
    whatILearned: lesson.learned,
    whyItMatters: lesson.matters,
    nextTime: lesson.nextTime
  }
  
  await saveLog('lessons', log)
  console.log(`✅ บันทึก Lesson Log แล้ว (${log.lesson_id})`)
}

// Auto Investigation Log
async function autoInvestigationLog(investigation: Investigation) {
  const log = {
    investigation_id: generateId('INV'),
    date: new Date().toISOString().split('T')[0],
    symptom: investigation.symptom,
    steps: investigation.steps,
    rootCause: investigation.rootCause,
    solution: investigation.solution
  }
  
  await saveLog('investigations', log)
  console.log(`✅ บันทึก Investigation Log แล้ว (${log.investigation_id})`)
}

// Auto Checkpoint
async function autoCheckpoint() {
  const checkpoint = {
    checkpoint_id: generateId('CP'),
    timestamp: new Date().toISOString(),
    task_id: currentTask.id,
    task_name: currentTask.name,
    status: currentTask.status,
    progress: currentTask.progress,
    filesModified: currentTask.filesModified,
    nextSteps: currentTask.nextSteps,
    blockers: currentTask.blockers
  }
  
  await saveCheckpoint(checkpoint)
  console.log('✅ บันทึก Checkpoint แล้ว')
}
```

---

## 💡 Tips

### ให้ AI บันทึกอัตโนมัติ

- ✅ ไม่ต้องเขียนเอง
- ✅ ไม่ลืม
- ✅ Format เหมือนกันทุกครั้ง

### Review Logs สัปดาห์ละครั้ง

- ✅ อ่าน decision logs
- ✅ อ่าน lesson logs
- ✅ เรียนรู้จากบทเรียน

---

## 🔗 เอกสารอ้างอิง

- `04-templates/decision-log.md` — Decision log template
- `04-templates/lesson-log.md` — Lesson log template
- `04-templates/investigation-log.md` — Investigation log template
- `04-templates/checkpoint-template.md` — Checkpoint template

---

> **"Log อัตโนมัติ = ไม่ลืมบันทึก"**
