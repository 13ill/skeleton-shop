# Auto Phase Update

> AI อัปเดต phase progress อัตโนมัติ

---

## 🎯 วัตถุประสงค์

- อัปเดต phase progress อัตโนมัติ
- อัปเดต feature progress อัตโนมัติ
- อัปเดต PRD อัตโนมัติ
- อัปเดต Phase Tracker อัตโนมัติ
- ไม่ต้องอัปเดตเอง

---

## 🔄 Auto Update Triggers

### Trigger 1: เมื่อผ่าน Gate

```
เมื่อผ่าน Gate X:
1. คำนวณ feature progress (gate / 9 * 100)
2. อัปเดต feature progress ใน Phase Tracker
3. คำนวณ phase progress
4. อัปเดต phase progress ใน Phase Tracker
5. อัปเดต PRD
6. แจ้งเตือน: "✅ ผ่าน Gate X แล้ว! Progress: Y%"
```

**ตัวอย่าง:**
```
User ผ่าน Gate 7 (Execution)

AI ทำอัตโนมัติ:
1. Feature progress = 7/9 * 100 = 78%
2. อัปเดต Phase Tracker:
   - Feature 2: 60% → 78%
3. คำนวณ phase progress:
   - Feature 1: 100%
   - Feature 2: 78%
   - Feature 3: 0%
   - Phase 1: (100 + 78 + 0) / 3 = 59%
4. อัปเดต PRD
5. แจ้ง: "✅ ผ่าน Gate 7 แล้ว! Feature 2 progress: 78%"
```

---

### Trigger 2: เมื่อเสร็จ Feature (ผ่าน Gate 9)

```
เมื่อผ่าน Gate 9:
1. Mark feature as completed (100%)
2. อัปเดต Phase Tracker
3. คำนวณ phase progress
4. อัปเดต PRD
5. บันทึก metrics (time taken, variance)
6. แจ้ง: "🎉 Feature X เสร็จแล้ว! ใช้เวลา Y days"
```

**ตัวอย่าง:**
```
User ผ่าน Gate 9 สำหรับ Feature 1

AI ทำอัตโนมัติ:
1. Mark Feature 1 as completed
2. อัปเดต Phase Tracker:
   - Feature 1: 90% → 100% ✅
   - Completed: 2026-06-05
   - Time Taken: 4 days
   - Variance: -1 day (faster than estimated)
3. คำนวณ phase progress:
   - Phase 1: (100 + 60 + 0) / 3 = 53%
4. อัปเดต PRD
5. แจ้ง: "🎉 Feature 1 (Orders Module) เสร็จแล้ว! ใช้เวลา 4 days (เร็วกว่าประมาณการ 1 day)"
```

---

### Trigger 3: เมื่อเริ่ม Feature ใหม่ (เริ่ม Gate 0)

```
เมื่อเริ่ม Gate 0 สำหรับ feature ใหม่:
1. Mark feature as in progress
2. บันทึก start date
3. อัปเดต Phase Tracker
4. อัปเดต PRD
5. แจ้ง: "🟢 เริ่ม Feature X!"
```

**ตัวอย่าง:**
```
User เริ่ม Gate 0 สำหรับ Feature 2

AI ทำอัตโนมัติ:
1. Mark Feature 2 as in progress
2. Started: 2026-06-03
3. อัปเดต Phase Tracker:
   - Feature 2: 0% → 10% (Gate 0)
   - Status: ⏳ → 🟢 In Progress
4. อัปเดต PRD
5. แจ้ง: "🟢 เริ่ม Feature 2 (Payment Integration)!"
```

---

### Trigger 4: เมื่อเจอ Blocker

```
เมื่อ user บอกว่าเจอ blocker:
1. Mark feature as blocked
2. บันทึก blocker details
3. อัปเดต Phase Tracker
4. อัปเดต PRD
5. แจ้งเตือน owner (ถ้าจำเป็น)
6. แจ้ง: "⚠️ Feature X ถูก block!"
```

**ตัวอย่าง:**
```
User: "รอ Stripe API key จาก owner"

AI ทำอัตโนมัติ:
1. Mark Feature 2 as blocked
2. Blocker: "รอ Stripe API key จาก owner"
3. Impact: High
4. Since: 2026-06-05 14:00
5. อัปเดต Phase Tracker
6. อัปเดต PRD
7. แจ้ง: "⚠️ Feature 2 ถูก block! รอ Stripe API key"
```

---

### Trigger 5: เมื่อ Unblock

```
เมื่อ blocker ถูกแก้:
1. Mark feature as in progress
2. บันทึก resolution
3. คำนวณ blocked duration
4. อัปเดต Phase Tracker
5. อัปเดต PRD
6. แจ้ง: "✅ Feature X unblock แล้ว!"
```

**ตัวอย่าง:**
```
User: "ได้ Stripe API key แล้ว"

AI ทำอัตโนมัติ:
1. Mark Feature 2 as in progress
2. Resolved: 2026-06-05 16:00
3. Blocked Duration: 2 hours
4. อัปเดต Phase Tracker:
   - Blocker: Active → Resolved
5. อัปเดต PRD
6. แจ้ง: "✅ Feature 2 unblock แล้ว! ทำต่อได้เลย"
```

---

### Trigger 6: เมื่อเสร็จ Phase

```
เมื่อ phase progress = 100%:
1. Mark phase as completed
2. บันทึก completion date
3. คำนวณ metrics
4. อัปเดต Phase Tracker
5. อัปเดต PRD
6. แจ้ง: "🎉 Phase X เสร็จแล้ว!"
7. ถาม: "พร้อมเริ่ม Phase Y ไหม?"
```

**ตัวอย่าง:**
```
Phase 1 progress = 100%

AI ทำอัตโนมัติ:
1. Mark Phase 1 as completed
2. Completed: 2026-06-08
3. Time Taken: 8 days (estimated: 14 days)
4. Variance: -6 days (43% faster)
5. อัปเดต Phase Tracker
6. อัปเดต PRD
7. แจ้ง: "🎉 Phase 1 (MVP) เสร็จแล้ว! ใช้เวลา 8 days (เร็วกว่าประมาณการ 6 days)"
8. ถาม: "พร้อมเริ่ม Phase 2 (Enhancement) ไหม?"
```

---

### Trigger 7: Daily Summary (เลิกงานประจำวัน)

```
เวลา: 18:00 (หรือตามที่ตั้งค่า)

AI ทำอัตโนมัติ:
1. สรุปงานวันนี้
2. อัปเดต Phase Tracker (Daily Updates section)
3. อัปเดต PRD (Change Log section)
4. คำนวณ velocity
5. แสดงสรุป
```

**ตัวอย่าง:**
```
18:00 - เลิกงาน

AI ทำอัตโนมัติ:
1. สรุปงานวันนี้:
   - ✅ Completed Feature 1
   - 🟡 Feature 2 progress: 40% → 60%
   - ⚠️ Blocker: รอ Stripe API key
2. อัปเดต Phase Tracker
3. อัปเดต PRD
4. Velocity: 0.2 features/day
5. แสดงสรุป
```

---

## 🤖 AI Script

```typescript
// Auto update feature progress when passing gate
async function autoUpdateFeatureProgress(
  featureId: string,
  gate: number
) {
  const feature = await getFeature(featureId)
  
  // คำนวณ progress จาก gate
  const progress = Math.round((gate / 9) * 100)
  
  // อัปเดต feature
  await updateFeature(featureId, {
    currentGate: `gate-${gate}`,
    progress: progress,
    lastUpdated: new Date().toISOString()
  })
  
  // อัปเดต phase progress
  await autoUpdatePhaseProgress()
  
  // อัปเดต PRD
  await updatePRD()
  
  // แจ้งเตือน
  console.log(`✅ ผ่าน Gate ${gate} แล้ว! ${feature.name} progress: ${progress}%`)
}

// Auto update phase progress
async function autoUpdatePhaseProgress() {
  const currentPhase = await getCurrentPhase()
  const features = currentPhase.features
  
  // คำนวณ progress
  const totalFeatures = features.length
  const totalProgress = features.reduce((sum, f) => sum + f.progress, 0)
  const phaseProgress = Math.round(totalProgress / totalFeatures)
  
  // นับ features ที่เสร็จ
  const completedFeatures = features.filter(f => f.progress === 100).length
  
  // อัปเดต phase tracker
  await updatePhaseTracker({
    phase: currentPhase.name,
    progress: phaseProgress,
    completedFeatures: completedFeatures,
    totalFeatures: totalFeatures,
    lastUpdated: new Date().toISOString()
  })
  
  // อัปเดต PRD
  await updatePRD({
    phase: currentPhase.name,
    progress: phaseProgress
  })
  
  console.log(`✅ อัปเดต ${currentPhase.name} progress: ${phaseProgress}%`)
}

// Auto mark feature as completed
async function autoCompleteFeature(featureId: string) {
  const feature = await getFeature(featureId)
  const startDate = new Date(feature.startedAt)
  const endDate = new Date()
  const timeTaken = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24))
  const variance = timeTaken - feature.estimatedDays
  
  // อัปเดต feature
  await updateFeature(featureId, {
    status: 'completed',
    progress: 100,
    completedAt: endDate.toISOString(),
    timeTaken: timeTaken,
    variance: variance
  })
  
  // อัปเดต phase progress
  await autoUpdatePhaseProgress()
  
  // อัปเดต PRD
  await updatePRD()
  
  // แจ้งเตือน
  const varianceText = variance < 0 
    ? `เร็วกว่าประมาณการ ${Math.abs(variance)} days`
    : variance > 0
    ? `ช้ากว่าประมาณการ ${variance} days`
    : `ตรงตามประมาณการ`
  
  console.log(`🎉 ${feature.name} เสร็จแล้ว! ใช้เวลา ${timeTaken} days (${varianceText})`)
}

// Auto start feature
async function autoStartFeature(featureId: string) {
  const feature = await getFeature(featureId)
  
  // อัปเดต feature
  await updateFeature(featureId, {
    status: 'in_progress',
    progress: 10, // Gate 0 = 10%
    startedAt: new Date().toISOString()
  })
  
  // อัปเดต phase tracker
  await updatePhaseTracker()
  
  // อัปเดต PRD
  await updatePRD()
  
  // แจ้งเตือน
  console.log(`🟢 เริ่ม ${feature.name}!`)
}

// Auto mark as blocked
async function autoMarkBlocked(
  featureId: string,
  blocker: string,
  impact: 'high' | 'medium' | 'low'
) {
  const feature = await getFeature(featureId)
  
  // อัปเดต feature
  await updateFeature(featureId, {
    status: 'blocked',
    blockers: [
      {
        description: blocker,
        impact: impact,
        since: new Date().toISOString()
      }
    ]
  })
  
  // อัปเดต phase tracker
  await updatePhaseTracker()
  
  // อัปเดต PRD
  await updatePRD()
  
  // แจ้งเตือน
  console.log(`⚠️ ${feature.name} ถูก block! ${blocker}`)
  
  // แจ้ง owner ถ้า impact = high
  if (impact === 'high') {
    await notifyOwner({
      type: 'blocker',
      feature: feature.name,
      blocker: blocker
    })
  }
}

// Auto unblock
async function autoUnblock(featureId: string, resolution: string) {
  const feature = await getFeature(featureId)
  const blocker = feature.blockers[0]
  const blockedSince = new Date(blocker.since)
  const now = new Date()
  const duration = Math.ceil((now - blockedSince) / (1000 * 60 * 60))
  
  // อัปเดต feature
  await updateFeature(featureId, {
    status: 'in_progress',
    blockers: [
      {
        ...blocker,
        resolved: now.toISOString(),
        resolution: resolution,
        duration: `${duration} hours`
      }
    ]
  })
  
  // อัปเดต phase tracker
  await updatePhaseTracker()
  
  // อัปเดต PRD
  await updatePRD()
  
  // แจ้งเตือน
  console.log(`✅ ${feature.name} unblock แล้ว! ทำต่อได้เลย`)
}

// Daily summary
async function dailySummary() {
  const today = new Date().toISOString().split('T')[0]
  const summary = await generateDailySummary(today)
  
  // อัปเดต Phase Tracker (Daily Updates section)
  await updatePhaseTrackerDailyUpdates(summary)
  
  // อัปเดต PRD (Change Log section)
  await updatePRDChangeLog(summary)
  
  // คำนวณ velocity
  const velocity = await calculateVelocity()
  
  // แสดงสรุป
  console.log('\n📊 สรุปงานวันนี้:\n')
  console.log(`Date: ${today}\n`)
  
  if (summary.completed.length > 0) {
    console.log('✅ Completed:')
    summary.completed.forEach(item => {
      console.log(`- ${item}`)
    })
    console.log('')
  }
  
  if (summary.inProgress.length > 0) {
    console.log('🟡 In Progress:')
    summary.inProgress.forEach(item => {
      console.log(`- ${item}`)
    })
    console.log('')
  }
  
  if (summary.blockers.length > 0) {
    console.log('⚠️ Blockers:')
    summary.blockers.forEach(item => {
      console.log(`- ${item}`)
    })
    console.log('')
  }
  
  console.log(`Velocity: ${velocity} features/day\n`)
}
```

---

## 💡 Tips

### ให้ AI อัปเดตอัตโนมัติ

- ✅ ไม่ต้องอัปเดตเอง
- ✅ ไม่ลืม
- ✅ Real-time tracking

### เช็ค Phase Tracker ทุกวัน

- ✅ เห็นภาพรวม
- ✅ รู้ว่าอยู่ไหน
- ✅ วางแผนวันพรุ่งนี้

---

## 🔗 เอกสารอ้างอิง

- `04-templates/prd-template.md` — PRD template
- `04-templates/phase-tracker.md` — Phase tracker template
- `07-automation/daily-wip-summary.md` — Daily summary

---

> **"Auto Update = ไม่ต้องอัปเดตเอง"**
