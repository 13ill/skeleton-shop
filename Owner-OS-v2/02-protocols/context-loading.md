# Context Loading Protocol

> โหลด context อย่างมีประสิทธิภาพ ประหยัด token

---

## 🎯 วัตถุประสงค์

- โหลดแค่ที่จำเป็น
- ประหยัด context window
- โหลดเร็ว
- โหลดถูกต้อง

---

## 📊 Context Loading Levels

### Level 0: Root Overview (ทุก session)

**โหลดเสมอ:**
- `MASTER-PROMPT.md` — Core framework
- `00-core/identity.md` — ฉันคือใคร
- `00-core/principles.md` — 10 หลักคิด

**ขนาด:** ~5,000 tokens

**เมื่อไหร่:** ทุกครั้งที่เริ่ม session

### Level 1: Module Level (เมื่อทำงานใน module)

**โหลดเพิ่ม:**
- `docs/architecture.md` — Architecture overview
- `docs/modules/[module].md` — Module ที่กำลังทำ

**ขนาด:** ~3,000 tokens

**เมื่อไหร่:** เมื่อเริ่มทำงานใน module ใหม่

### Level 2: Flow Level (เมื่อต้อง trace)

**โหลดเพิ่ม:**
- `docs/flows/[flow].md` — Data flow diagram
- Related modules

**ขนาด:** ~5,000 tokens

**เมื่อไหร่:** เมื่อต้อง trace data flow

### Level 3: File Level (เมื่อต้องเจาะลึก)

**โหลดเพิ่ม:**
- Source files ที่เกี่ยวข้อง
- Tests

**ขนาด:** ~10,000 tokens

**เมื่อไหร่:** เมื่อต้องอ่าน/แก้โค้ด

---

## 🔄 Smart Context Loading

### สถานการณ์ 1: รับงานใหม่

```
โหลด:
- Level 0 (Root Overview)
- Gate 0 checklist
```

**ไม่ต้องโหลด:**
- Architecture docs (ยังไม่รู้ว่าจะทำอะไร)
- Source code (ยังไม่ถึงเวลา)

### สถานการณ์ 2: ออกแบบ Architecture

```
โหลด:
- Level 0 (Root Overview)
- Level 1 (Module Level)
- Gate 4 checklist
```

**ไม่ต้องโหลด:**
- Source code (ยังไม่เขียน)
- Tests (ยังไม่มี)

### สถานการณ์ 3: เขียนโค้ด

```
โหลด:
- Level 0 (Root Overview)
- Level 1 (Module Level)
- Level 3 (File Level)
- Gate 7 checklist
```

### สถานการณ์ 4: Debug

```
โหลด:
- Level 0 (Root Overview)
- Level 2 (Flow Level)
- Level 3 (File Level)
- Investigation log
```

---

## 💡 Context Loading Best Practices

### 1. โหลดแบบ Lazy

❌ **ไม่ดี — โหลดทุกอย่าง:**
```
โหลด:
- MASTER-PROMPT.md
- ทุก gate checklists
- ทุก architecture docs
- ทุก source files
```

✅ **ดี — โหลดแค่ที่ต้องการ:**
```
โหลด:
- MASTER-PROMPT.md
- Gate 0 checklist (เพราะกำลังรับงาน)
```

### 2. โหลดตาม Context

**กำลังทำอะไร:**
- รับงาน → Level 0 + Gate 0
- ออกแบบ → Level 0 + Level 1 + Gate 4
- เขียนโค้ด → Level 0 + Level 1 + Level 3 + Gate 7
- Debug → Level 0 + Level 2 + Level 3

### 3. Cache Context

**ถ้าทำงานใน module เดิม:**
- ไม่ต้องโหลด module docs ใหม่
- ใช้ context ที่มีอยู่

**ถ้าเปลี่ยน module:**
- โหลด module docs ใหม่

---

## 🎯 Smart Context Reload

### ตามระยะเวลาที่หยุด

**< 2 ชั่วโมง:**
```
โหลด:
- Checkpoint ล่าสุด
- ไฟล์ที่กำลังแก้
```

**2 ชม - 1 วัน:**
```
โหลด:
- Checkpoint ล่าสุด
- Architecture doc
- Module doc
```

**> 1 วัน:**
```
โหลด:
- Checkpoint ล่าสุด
- Architecture doc
- Module doc
- Decision logs
- Lesson logs
```

**> 3 วัน:**
```
โหลดเต็ม:
- Root Overview
- Architecture doc
- Module doc
- All logs
- WIP summary
```

---

## 📊 Context Window Management

### ติดตาม Token Usage

```
Available: 200,000 tokens
Used: 15,000 tokens
Remaining: 185,000 tokens
```

### เมื่อใกล้เต็ม

1. **ลบ context ที่ไม่ใช้แล้ว**
   - Old conversation
   - Unused docs

2. **สรุป context**
   - สรุป conversation เป็น summary
   - เก็บแค่ key points

3. **เริ่ม session ใหม่**
   - บันทึก checkpoint
   - เริ่ม session ใหม่
   - โหลด checkpoint

---

## 🔗 เอกสารอ้างอิง

- `00-core/session-management.md` — Session management
- `02-protocols/smart-context-reload.md` — Smart reload
- `07-automation/context-checkpoint.md` — Auto checkpoint

---

> **"โหลดแค่ที่ต้องการ = ประหยัด token"**
