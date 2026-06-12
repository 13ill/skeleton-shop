#!/bin/bash

# Script สร้าง project ใหม่ที่ใช้ shared operational system
# ใช้ rules/workflows จาก parent directory (Owner-OS-v2)

PROJECT_NAME=$1

if [ -z "$PROJECT_NAME" ]; then
    echo "❌ กรุณาระบุชื่อ project"
    echo "Usage: ./create-project.sh <project-name>"
    exit 1
fi

PROJECT_DIR="project-$PROJECT_NAME"

# ตรวจสอบว่ามี project นี้อยู่แล้วหรือไม่
if [ -d "$PROJECT_DIR" ]; then
    echo "❌ Project '$PROJECT_NAME' มีอยู่แล้ว"
    exit 1
fi

# สร้าง directory
mkdir -p "$PROJECT_DIR"
cd "$PROJECT_DIR"

# Init git repo
git init

# สร้าง .windsurfrules ที่อ้างอิงไป parent
echo "../.rules/.windsurfrules" > .windsurfrules

# สร้าง README
cat > README.md << EOF
# $PROJECT_NAME

> Project นี้ใช้ operational system จาก Owner-OS-v2

## Operational System

- Rules: \`../.rules/\`
- Workflows: \`../.windsurf/workflows/\`
- Checklists: \`../checklists/\`
- Templates: \`../04-templates/\`

## เริ่มต้น

1. เปิด project ใน IDE
2. AI จะอ่าน rules จาก parent directory อัตโนมัติ
3. เริ่มทำงานตาม workflow
EOF

echo "✅ สร้าง project '$PROJECT_NAME' สำเร็จ"
echo "📁 Location: $PROJECT_DIR"
echo "🚀 เริ่มต้น: cd $PROJECT_DIR"
