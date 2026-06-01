# Tower Control Guide — ใช้ AI หลายตัวพร้อมกัน

> วิธีสั่งงาน AI หลายตัวแบบมืออาชีพ

---

## 🎯 Tower Control คืออะไร?

**Tower Control** = ระบบที่ AI ตัวหลัก (Meta-Tower) ควบคุมและสั่งงาน AI ตัวอื่นๆ (Specialist Agents)

**เหมือน:**
- CTO สั่งงาน Tech Leads
- Tech Lead สั่งงาน Developers
- Project Manager สั่งงาน Team Members

---

## 🏗️ สถาปัตยกรรม 3 ชั้น

```
┌─────────────────────────────────────────────┐
│   Tier 1: Meta-Tower (Strategic)           │
│   - คิด วิเคราะห์ ตัดสินใจ                  │
│   - รัน Gate 0-5                            │
│   - สร้าง execution plan                    │
│   - Review ผลงาน                            │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   Tier 2: Execution Tower (Tactical)       │
│   - รัน Gate 6-7                            │
│   - แบ่งงานเป็น tasks                       │
│   - Delegate ให้ Specialists                │
│   - รวม code + test                         │
└─────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────┐
│   Tier 3: Specialist Agents (Execution)    │
│   - Code Generator                          │
│   - Test Writer                             │
│   - Researcher                              │
│   - Reviewer                                │
└─────────────────────────────────────────────┘
```

---

## 🎮 Tier 1: Meta-Tower (คุณ + AI หลัก)

### บทบาท
- **Strategic Decision Maker**
- รัน Gate 0-5 (คิด วิเคราะห์ ตัดสินใจ)
- สร้าง execution plan
- Review ผลงานจาก Execution Tower
- รัน Gate 8-9 (Review + Learning)

### ห้ามทำ
- ❌ ห้ามเขียนโค้ด (ให้ Execution Tower ทำ)
- ❌ ห้ามข้าม Gate
- ❌ ห้ามเดา requirement

### Output ที่ส่งให้ Execution Tower

```json
{
  "project": "ระบบ POS",
  "architecture": {
    "modules": ["orders", "products", "payments", "reports"],
    "data_flow": "User → Frontend → API → Service → DB",
    "tech_stack": {
      "frontend": "Next.js 14",
      "backend": "Next.js API Routes",
      "database": "PostgreSQL + Prisma",
      "auth": "NextAuth.js"
    }
  },
  "tasks": [
    {
      "id": "T001",
      "description": "สร้าง database schema",
      "agent": "code-gen",
      "priority": 1,
      "dependencies": []
    },
    {
      "id": "T002",
      "description": "สร้าง API endpoints สำหรับ orders",
      "agent": "code-gen",
      "priority": 2,
      "dependencies": ["T001"]
    },
    {
      "id": "T003",
      "description": "เขียน tests สำหรับ orders API",
      "agent": "test-writer",
      "priority": 3,
      "dependencies": ["T002"]
    }
  ],
  "constraints": [
    "ต้องใช้ TypeScript",
    "ต้องมี tests ครอบคลุม 80%+",
    "ต้อง follow Prisma best practices"
  ],
  "success_criteria": [
    "API ทำงานได้ถูกต้อง",
    "Tests ผ่านทั้งหมด",
    "Code quality ผ่าน review"
  ]
}
```

---

## 🚀 Tier 2: Execution Tower (AI ลงมือทำ)

### บทบาท
- **Tactical Executor**
- รัน Gate 6-7 (วางแผน ลงมือทำ)
- แบ่งงานเป็น subtasks
- Delegate ให้ Specialist Agents
- รวม code จาก agents
- Test + Fix
- ส่งกลับไปให้ Meta-Tower review

### Input ที่ได้รับ
- Architecture design
- Task list พร้อม priority
- Constraints
- Success criteria

### Specialist Agents ที่มี

| Agent | ทำอะไร | ใช้เมื่อ |
|---|---|---|
| **code-gen** | เขียน code | สร้าง API, components, utils |
| **test-writer** | เขียน tests | Unit tests, integration tests |
| **researcher** | หาข้อมูล | Research best practices, libraries |
| **reviewer** | Review code | Code review, security audit |

---

## 🤖 Tier 3: Specialist Agents

### Code Generator Agent

**ทำอะไร:**
- เขียน boilerplate code
- สร้าง API endpoints
- สร้าง React components
- Generate types

**Input:**
```json
{
  "task": "สร้าง API endpoint สำหรับ create order",
  "spec": {
    "method": "POST",
    "path": "/api/orders",
    "input": {
      "customerId": "string",
      "items": "OrderItem[]",
      "total": "number"
    },
    "output": {
      "orderId": "string",
      "status": "string"
    }
  },
  "constraints": [
    "ใช้ Prisma",
    "ต้องมี validation",
    "ต้องมี error handling"
  ]
}
```

**Output:**
```typescript
// src/api/orders.ts
import { prisma } from '@/lib/prisma'
import { z } from 'zod'

const createOrderSchema = z.object({
  customerId: z.string(),
  items: z.array(z.object({
    productId: z.string(),
    quantity: z.number().min(1),
    price: z.number().min(0)
  })),
  total: z.number().min(0)
})

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const data = createOrderSchema.parse(body)
    
    const order = await prisma.order.create({
      data: {
        customerId: data.customerId,
        total: data.total,
        items: {
          create: data.items
        }
      }
    })
    
    return Response.json({
      orderId: order.id,
      status: 'created'
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      return Response.json({ error: 'Invalid input' }, { status: 400 })
    }
    return Response.json({ error: 'Internal error' }, { status: 500 })
  }
}
```

### Test Writer Agent

**ทำอะไร:**
- เขียน unit tests
- เขียน integration tests
- เขียน E2E tests

**Input:**
```json
{
  "task": "เขียน tests สำหรับ orders API",
  "code": "[code ที่ต้องทดสอบ]",
  "test_cases": [
    "สร้าง order สำเร็จ",
    "สร้าง order ล้มเหลว (invalid input)",
    "สร้าง order ล้มเหลว (customer ไม่มี)"
  ]
}
```

**Output:**
```typescript
// __tests__/api/orders.test.ts
import { POST } from '@/api/orders'

describe('POST /api/orders', () => {
  it('should create order successfully', async () => {
    const req = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'cust-1',
        items: [
          { productId: 'prod-1', quantity: 2, price: 100 }
        ],
        total: 200
      })
    })
    
    const res = await POST(req)
    const data = await res.json()
    
    expect(res.status).toBe(200)
    expect(data.orderId).toBeDefined()
    expect(data.status).toBe('created')
  })
  
  it('should fail with invalid input', async () => {
    const req = new Request('http://localhost/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        customerId: 'cust-1',
        items: [],
        total: -100
      })
    })
    
    const res = await POST(req)
    
    expect(res.status).toBe(400)
  })
})
```

---

## 🔄 Workflow จริง

### ตัวอย่าง: สร้างระบบ POS

```
User → Meta-Tower:
"ทำระบบ POS"

Meta-Tower (คุณ + AI หลัก):
[รัน Gate 0-5]
→ ได้ requirement ครบ
→ ได้ architecture design
→ สร้าง execution plan:
  {
    "tasks": [
      {"id": "T001", "desc": "สร้าง database schema", "agent": "code-gen"},
      {"id": "T002", "desc": "สร้าง API endpoints", "agent": "code-gen"},
      {"id": "T003", "desc": "เขียน tests", "agent": "test-writer"},
      {"id": "T004", "desc": "Review code", "agent": "reviewer"}
    ]
  }

Meta-Tower → Execution Tower:
[ส่ง execution plan]

Execution Tower:
[รัน Gate 6-7]
→ Delegate T001 ให้ code-gen agent
→ รอ T001 เสร็จ
→ Delegate T002 ให้ code-gen agent (รอ T001 เสร็จก่อน)
→ Delegate T003 ให้ test-writer agent (รอ T002 เสร็จก่อน)
→ Delegate T004 ให้ reviewer agent (รอ T003 เสร็จก่อน)
→ รวม code ทั้งหมด
→ Test + Fix

Execution Tower → Meta-Tower:
[ส่ง code + test results]

Meta-Tower:
[รัน Gate 8-9]
→ Review code quality
→ Review architecture compliance
→ เขียน decision log
→ เขียน lesson log
→ ส่งให้ User
```

---

## 🎯 Platform ที่รองรับ Tower Control

### Windsurf Cascade ⭐ (แนะนำ)

**ทำไมดี:**
- ✅ Agentic AI แท้
- ✅ มี parallel execution
- ✅ มี memory ดี
- ✅ สั่งงาน agents ได้

**วิธีใช้:**
```
[cascade-mode]

ฉันต้องการทำระบบ POS

ช่วย:
1. รัน Gate 0-5 (คุณทำ)
2. สร้าง execution plan
3. Delegate งานให้ specialist agents:
   - code-gen: เขียน code
   - test-writer: เขียน tests
   - reviewer: review code
4. รวมผลงาน
5. รัน Gate 8-9
```

### Claude via API

**ทำไมดี:**
- ✅ Reasoning ดีที่สุด
- ✅ Context window ใหญ่
- ✅ ไม่ผูกติด IDE

**ทำไมไม่ดี:**
- ❌ ต้องเขียน wrapper เอง
- ❌ ไม่มี file access โดยตรง

**วิธีใช้:**
- ใช้เป็น Meta-Tower (Strategic Decision)
- ส่งงานให้ Windsurf/Cursor ทำ

### Cursor Composer

**ทำไมดี:**
- ✅ Stable
- ✅ Multi-file editing ดี

**ทำไมไม่ดี:**
- ❌ ไม่ใช่ agentic แท้
- ❌ ต้องสั่งเอง

**วิธีใช้:**
- ใช้เป็น Execution Tower
- Meta-Tower ต้องเป็น Claude หรือ Windsurf

---

## 💡 Best Practices

### 1. Meta-Tower ต้องทำเอง

- ✅ Gate 0-5 (คิด วิเคราะห์ ตัดสินใจ)
- ✅ Review ผลงาน
- ✅ Gate 8-9 (Review + Learning)

### 2. Delegate งานที่ชัดเจน

- ✅ มี spec ชัดเจน
- ✅ มี constraints ชัดเจน
- ✅ มี success criteria ชัดเจน

### 3. Review ก่อนส่งให้ User

- ✅ Code quality
- ✅ Architecture compliance
- ✅ Tests coverage
- ✅ Security

### 4. บันทึกทุกอย่าง

- ✅ Decision log
- ✅ Lesson log
- ✅ Investigation log

---

## 🚨 ข้อควรระวัง

### ❌ อย่าทำ

1. **อย่า delegate Gate 0-5**
   - Meta-Tower ต้องทำเอง
   - ห้าม agent ตัดสินใจแทน

2. **อย่า trust agent 100%**
   - ต้อง review เสมอ
   - ต้อง test เสมอ

3. **อย่า delegate งานที่คลุมเครือ**
   - ต้องมี spec ชัดเจน
   - ต้องมี constraints ชัดเจน

4. **อย่าลืม log**
   - Decision log
   - Lesson log

---

## 📚 เอกสารอ้างอิง

- `08-tower-prompts/meta-tower-prompt.md` — Prompt สำหรับ Meta-Tower
- `08-tower-prompts/execution-tower-prompt.md` — Prompt สำหรับ Execution Tower
- `08-tower-prompts/specialist-agents.md` — Prompt สำหรับ Specialist Agents

---

> **"Tower Control = ทำงานเร็วขึ้น 10 เท่า โดยไม่ลดคุณภาพ"**
