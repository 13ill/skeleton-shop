# Context Checkpoint

> AI บันทึก checkpoint อัตโนมัติ

---

## 🎯 วัตถุประสงค์

- บันทึก context อัตโนมัติ
- ไม่ต้องบอก AI
- ไม่ลืมบันทึก

---

## 🔄 Auto Checkpoint Triggers

### Trigger 1: User พิมพ์คำสั่ง

```
User พิมพ์:
- "หยุดก่อน"
- "ไปทำอย่างอื่นก่อน"
- "Pause"
- "บันทึก checkpoint"
```

**AI ทำ:**
```
1. สร้าง checkpoint
2. บันทึกลง logs/wip/TASK-XXX.md
3. แจ้ง: "✅ บันทึก Checkpoint แล้ว"
```

### Trigger 2: เลิกงานประจำวัน

```
เวลา: 18:00 (หรือตามที่ตั้งค่า)
```

**AI ทำ:**
```
1. แจ้งเตือน: "🔔 เลิกงานแล้ว ต้องการบันทึก checkpoint ไหม?"
2. ถ้า user ตอบ "ใช่":
   - สร้าง checkpoint
   - สรุปงานวันนี้
   - แจ้ง: "✅ บันทึกแล้ว พรุ่งนี้เจอกัน!"
```

### Trigger 3: ทุกๆ 2 ชั่วโมง

```
เวลา: ทุกๆ 2 ชั่วโมง
```

**AI ทำ:**
```
1. เช็คว่ามีการเปลี่ยนแปลงไหม
2. ถ้ามี:
   - บันทึก checkpoint แบบเงียบๆ
   - ไม่แจ้งเตือน (ไม่รบกวน)
```

### Trigger 4: ก่อนเปลี่ยนงาน

```
User พิมพ์:
- "ทำงานอื่นก่อน"
- "เปลี่ยนไปทำ [งานอื่น]"
```

**AI ทำ:**
```
1. บันทึก checkpoint งานปัจจุบัน
2. แจ้ง: "✅ บันทึก checkpoint แล้ว"
3. เปลี่ยนไปทำงานใหม่
```

---

## 🤖 AI Script

```typescript
// Auto checkpoint on pause
async function onPause() {
  const checkpoint = await createCheckpoint()
  await saveCheckpoint(checkpoint)
  console.log('✅ บันทึก Checkpoint แล้ว')
}

// Auto checkpoint at end of day
async function onEndOfDay() {
  console.log('🔔 เลิกงานแล้ว ต้องการบันทึก checkpoint ไหม? (Y/n)')
  
  const answer = await getUserInput()
  
  if (answer !== 'n') {
    const checkpoint = await createCheckpoint()
    await saveCheckpoint(checkpoint)
    
    // สรุปงานวันนี้
    const summary = await createDailySummary()
    console.log('\n📊 สรุปงานวันนี้:\n')
    console.log(summary)
    console.log('\n✅ บันทึกแล้ว พรุ่งนี้เจอกัน! 👋')
  }
}

// Auto checkpoint every 2 hours
async function autoCheckpointTimer() {
  setInterval(async () => {
    if (hasChanges()) {
      const checkpoint = await createCheckpoint()
      await saveCheckpoint(checkpoint)
      // บันทึกแบบเงียบๆ ไม่แจ้งเตือน
    }
  }, 2 * 60 * 60 * 1000) // 2 hours
}

// Auto checkpoint before switching tasks
async function onSwitchTask(newTaskId: string) {
  // บันทึก checkpoint งานปัจจุบัน
  const checkpoint = await createCheckpoint()
  await saveCheckpoint(checkpoint)
  console.log('✅ บันทึก checkpoint แล้ว')
  
  // เปลี่ยนไปทำงานใหม่
  await switchToTask(newTaskId)
}

// Create checkpoint
async function createCheckpoint(): Promise<Checkpoint> {
  return {
    checkpoint_id: generateId('CP'),
    timestamp: new Date().toISOString(),
    task_id: currentTask.id,
    task_name: currentTask.name,
    status: currentTask.status,
    priority: currentTask.priority,
    gate_mode: currentTask.gateMode,
    current_gate: currentTask.currentGate,
    progress: currentTask.progress,
    progress_details: currentTask.progressDetails,
    files_modified: currentTask.filesModified,
    important_context: currentTask.importantContext,
    next_steps: currentTask.nextSteps,
    blockers: currentTask.blockers,
    estimated_time: currentTask.estimatedTime
  }
}
```

---

## 💡 Tips

### ให้ AI บันทึกอัตโนมัติ

- ✅ ไม่ต้องบอก AI
- ✅ ไม่ลืมบันทึก
- ✅ บันทึกทุกๆ 2 ชั่วโมง

### เช็ค Checkpoint สัปดาห์ละครั้ง

- ✅ ดูว่ามีงานค้างไหม
- ✅ ลบ checkpoint เก่าๆ

---

## 🔗 เอกสารอ้างอิง

- `04-templates/checkpoint-template.md` — Checkpoint template
- `07-automation/wip-tracker.md` — WIP tracker
- `07-automation/daily-wip-summary.md` — Daily WIP summary

---

> **"Checkpoint อัตโนมัติ = ไม่ลืมบันทึก"**
