# Doing Projects

> Folder สำหรับเก็บ project ย่อยทั้งหมด ใช้ operational system ร่วมกันจาก Owner-OS-v2

---

## 📁 โครงสร้าง

```
Owner-OS-v2/
├── .rules/                       # Rules files (shared)
├── .windsurf/workflows/          # Workflows (shared)
├── checklists/                   # Checklists (shared)
├── 04-templates/                 # Templates (shared)
└── doing-projects/               # Folder นี้
    ├── .gitignore               # Ignore project-*/
    ├── create-project.sh        # Script สร้าง project
    ├── README.md                # ไฟล์นี้
    ├── project-a/               # Project ย่อย (git repo แยก)
    ├── project-b/               # Project ย่อย (git repo แยก)
    └── ...
```

---

## 🎯 หลักการ

1. **Operational System** → อยู่ที่ parent directory (`Owner-OS-v2/`)
2. **Project Code** → อยู่ใน `doing-projects/project-name/` (git repo แยก)
3. **ไม่ copy ไฟล์** → ทุก project ใช้ rules/workflows เดียวกันจาก parent
4. **Git ignore** → Project code ไม่ถูก track ใน `Owner-OS-v2/`
5. **อัพเดตง่าย** → แก้ rules/workflows ที่เดียว ใช้กับทุก project

---

## 🚀 วิธีใช้งาน

### สร้าง Project ใหม่

```bash
cd doing-projects
./create-project.sh my-project
```

จะสร้าง:
- `project-my-project/` - Folder ใหม่
- Git repo แยก
- `.windsurfrules` ที่อ้างอิงไป parent

### เริ่มทำงานใน Project

```bash
cd project-my-project
# เปิดใน IDE - AI จะอ่าน rules จาก parent directory อัตโนมัติ
```

### อัพเดต Rules/Workflows

แก้ไขไฟล์ใน parent directory:
- `../.rules/` - สำหรับ rules
- `../.windsurf/workflows/` - สำหรับ workflows
- `../checklists/` - สำหรับ checklists

ทุก project จะใช้ version ล่าสุดทันที

---

## 📝 Git Strategy

### Owner-OS-v2/ (Operational System)

```bash
cd ..
git add .
git commit -m "update workflow"
git push
```

### doing-projects/project-name/ (Project Code)

```bash
cd doing-projects/project-name
git add .
git commit -m "implement feature"
git push
```

---

## 💡 Tips

- **อัพเดต operational system** → commit ใน `Owner-OS-v2/`
- **อัพเดต project code** → commit ใน `doing-projects/project-name/`
- **ไม่ต้อง copy rules** → ทุก project ใช้ shared rules
- **rollback ง่าย** → operational system มี version control แยก

---

## 🎯 ประโยชน์

✅ Rules/workflows ไม่ขึ้น git ของ project ย่อย  
✅ อัพเดตครั้งเดียว ใช้กับทุก project  
✅ Project code สะอาด ไม่มีไฟล์ operational  
✅ Version control แยกชัดเจน  
✅ ไม่ต้อง copy ไฟล์ซ้ำ
