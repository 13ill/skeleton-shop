# Progress Update Workflow — อัปเดตความคืบหน้า (ยืดหยุ่นไฟล์เป้าหมาย)

> อัปเดตความคืบหน้าหลังทำงาน + อัปเดต architecture/flow หลังผ่าน — รองรับหลายไฟล์เป้าหมาย

---

## 🎯 วัตถุประสงค์

- อัปเดตความคืบหน้าอัตโนมัติหลังแก้โค้ด/ทำงานเสร็จ
- อัปเดต architecture / flow หลังบอกว่า "ผ่านแล้ว" หรือ "ไปต่อ"
- รองรับไฟล์เป้าหมายหลายแบบ (Phase Tracker / SOW / README / custom)
- ใช้รูปแบบเดียวกันเพื่อความสอดคล้อง

**ต่างจาก `auto-phase-update.md` ยังไง?**
- `auto-phase-update.md` — เจาะจง PRD + Phase Tracker, อัปเดตตาม gate อัตโนมัติ
- `progress-update-workflow.md` (ไฟล์นี้) — ยืดหยุ่น เลือกไฟล์เป้าหมายได้, เรียกด้วยคำสั่ง/slash command

---

## 🎯 เลือกไฟล์เป้าหมาย (Target File)

AI ต้องเลือกไฟล์เป้าหมายตามลำดับนี้:

```
1. ถ้ามี Phase Tracker (04-templates/phase-tracker.md หรือ docs/phase-tracker.md)
   → อัปเดตลง Phase Tracker (เคสหลัก ⭐)

2. ถ้ามี SOW (docs/SOW-[project].md)
   → อัปเดตลง SOW section ความคืบหน้า

3. ถ้ามี README ที่มี section Progress
   → อัปเดตลง README

4. ถ้า user กำหนดไฟล์เอง
   → อัปเดตลงไฟล์/section ที่กำหนด

5. ถ้าไม่มีเลย
   → ถาม user ว่าจะให้อัปเดตที่ไหน
```

---

## 🔄 Trigger

### Trigger 1: หลังแก้โค้ด/ทำงานเสร็จ

```
User: "อัปเดตความคืบหน้า" หรือ /update-progress

AI ทำ:
1. ระบุไฟล์เป้าหมาย
2. สรุปสิ่งที่ทำ
3. เขียนลงไฟล์เป้าหมายตามรูปแบบ
4. แจ้ง: "✅ อัปเดตความคืบหน้าแล้ว"
```

### Trigger 2: หลังบอกว่า "ผ่านแล้ว" / "ไปต่อ"

```
User: "ผ่านแล้ว" หรือ "ไปต่อ"

AI ทำ:
1. อัปเดต architecture doc (ถ้ามีการเปลี่ยนแปลง module/flow)
2. อัปเดต dependency map / flow
3. อัปเดตความคืบหน้าในไฟล์เป้าหมาย
4. แจ้ง: "✅ อัปเดต architecture + ความคืบหน้าแล้ว"
```

---

## 📝 รูปแบบการอัปเดต (Format)

### สำหรับการแก้ไขโค้ด
```
- ✅ [รายละเอียดสิ่งที่แก้ไข]
```

### สำหรับการทดสอบ
```
- ✅ [รายละเอียดสิ่งที่ทดสอบ]
```

### สำหรับปัญหาที่พบและแก้ไข
```
**ปัญหาที่พบและแก้ไข:**
- **[ชื่อปัญหา]**: [รายละเอียด] → [วิธีแก้]
```

---

## 🎯 เคสตามไฟล์เป้าหมาย

### เคส 1: Phase Tracker ⭐ (เคสหลัก)

อัปเดตลง `04-templates/phase-tracker.md` (หรือ `docs/phase-tracker.md`)

```
อัปเดต section "Daily Updates":

### 2026-06-04
- ✅ สร้าง Orders API (CRUD)
- ✅ เขียน tests 12 cases (ผ่านหมด)

**ปัญหาที่พบและแก้ไข:**
- **Stock validation race condition**: stock ติดลบเมื่อสั่งพร้อมกัน → ใช้ DB transaction lock

อัปเดต feature progress:
- Feature 1 (Orders): 60% → 78% (ผ่าน Gate 7)
```

### เคส 2: SOW

อัปเดตลง `docs/SOW-[project-name].md` section ความคืบหน้ารายวัน

```
## ความคืบหน้ารายวัน

### 2026-06-04
- ✅ [รายละเอียด]
```

### เคส 3: README

อัปเดตลง `README.md` section Progress

```
## Progress

- ✅ [รายละเอียด]
```

### เคส 4: ไฟล์ custom

อัปเดตลงไฟล์/section ที่ user กำหนด ตามรูปแบบเดียวกัน

---

## 🏗️ อัปเดต Architecture / Flow

เมื่อ user บอก "ผ่านแล้ว" / "ไปต่อ" และมีการเปลี่ยนแปลง architecture:

```
1. เช็คว่ามี architecture doc หรือยัง
   - ถ้ายังไม่มี → สร้างจาก 04-templates/architecture-doc.md
   - ถ้ามีแล้ว → อัปเดต

2. เช็คว่ามี module doc หรือยัง (ต่อ module)
   - ถ้ายังไม่มี → สร้างจาก 04-templates/module-doc.md
   - ถ้ามีแล้ว → อัปเดต

3. อัปเดต:
   - Module ใหม่ที่เพิ่ม
   - Dependency ที่เปลี่ยน
   - Data flow ที่เปลี่ยน
```

**หมายเหตุ:** การ "สร้างครั้งแรก" สำคัญมาก — ดู `01-gates/full-mode/gate-6-planning.md` (สร้าง architecture/module doc ตอนวางแผน)

---

## 🤖 AI Script

```typescript
// Update progress
async function updateProgress(detail?: string) {
  // 1. เลือกไฟล์เป้าหมาย
  const target = await resolveTargetFile()
  // priority: phase-tracker > SOW > README > custom > ask

  if (!target) {
    return askUser('จะให้อัปเดตความคืบหน้าที่ไฟล์ไหน?')
  }

  // 2. สรุปงานที่ทำ
  const summary = await summarizeRecentWork()

  // 3. เขียนลงไฟล์ตามรูปแบบ
  await appendProgress(target, {
    date: today(),
    done: summary.done,           // ✅ [รายละเอียด]
    issues: summary.issuesFixed,  // ปัญหาที่พบและแก้ไข
  })

  // 4. ถ้าเป็น phase-tracker → อัปเดต feature progress ด้วย
  if (target.type === 'phase-tracker') {
    await updateFeatureProgress()
  }

  console.log(`✅ อัปเดตความคืบหน้าแล้ว (${target.path})`)
}

// Update architecture after "ผ่านแล้ว"
async function updateArchitectureOnApprove() {
  // สร้างถ้ายังไม่มี (CREATE), อัปเดตถ้ามี (UPDATE)
  await ensureArchitectureDoc()  // 04-templates/architecture-doc.md
  await ensureModuleDocs()       // 04-templates/module-doc.md ต่อ module

  await updateDependencyMap()
  await updateDataFlow()

  console.log('✅ อัปเดต architecture + flow แล้ว')
}
```

---

## 💡 Tips

- ตั้งไฟล์เป้าหมายให้ชัดตั้งแต่เริ่มโปรเจกต์ (แนะนำ Phase Tracker)
- ใช้รูปแบบเดียวกันทุกครั้งเพื่อให้ track ง่าย
- อัปเดต architecture ทุกครั้งที่ module/flow เปลี่ยน — อย่ารอจนจบ

---

## 🔗 เอกสารอ้างอิง

- `07-automation/auto-phase-update.md` — อัปเดต PRD/Phase อัตโนมัติตาม gate
- `04-templates/phase-tracker.md` — ไฟล์เป้าหมายหลัก
- `04-templates/progress-update-setup-prompt.md` — prompt deploy ไป project อื่น
- `04-templates/architecture-doc.md` / `module-doc.md` — templates architecture
- `01-gates/full-mode/gate-6-planning.md` — สร้าง architecture doc ครั้งแรก
- `.windsurf/workflows/update-progress.md` — slash command

---

> **"อัปเดตทุกครั้งที่ทำ = ไม่หลงทาง กลับมาทำต่อได้ง่าย"**
