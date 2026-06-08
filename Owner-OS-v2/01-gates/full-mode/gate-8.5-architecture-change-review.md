# Gate 8.5 — Architecture Change Review (ทบทวนการเปลี่ยนแปลง Architecture)

> มีอะไรเปลี่ยนจาก architecture เดิม?

---

## 🎯 วัตถุประสงค์

1. ตรวจสอบการเปลี่ยนแปลง architecture
2. อัปเดต architecture docs
3. อัปเดต dependency map
4. อัปเดต module map

---

## ❓ คำถามที่ต้องถาม

### 1. "มีอะไรเปลี่ยนจาก architecture เดิม?"
- Module ใหม่?
- Dependency ใหม่?
- Data flow เปลี่ยน?

### 2. "Architecture docs มีและอัปเดตหรือยัง?"
- `docs/architecture.md` — **ถ้ายังไม่มีให้สร้าง (CREATE)** จาก `04-templates/architecture-doc.md`
- `docs/modules/[module].md` — **ถ้ายังไม่มีให้สร้าง (CREATE)** จาก `04-templates/module-doc.md`
- ถ้ามีแล้ว → อัปเดต (UPDATE)

### 3. "Dependency map อัปเดตหรือยัง?"
- Module ไหนพึ่งพาอะไร?

---

## ✅ Output

- Architecture Change Log
- Updated Architecture Docs
- Updated Dependency Map
- Updated Module Map

---

## 📋 Checklist

- [ ] ระบุการเปลี่ยนแปลง architecture
- [ ] **สร้าง architecture docs (ถ้ายังไม่มี) หรืออัปเดต (ถ้ามีแล้ว)**
- [ ] **สร้าง/อัปเดต module docs ต่อ module**
- [ ] อัปเดต dependency map
- [ ] อัปเดต module map

---

> **"Architecture เปลี่ยน = ต้องสร้าง/อัปเดต docs (ไม่มี→สร้าง, มี→อัปเดต)"**
