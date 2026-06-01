# Similar Project Research Protocol

> เรียนรู้จากโปรเจกต์อื่น ไม่ต้องผิดเอง

---

## 🎯 วัตถุประสงค์

- เรียนรู้จาก best practices
- หลีกเลี่ยง common mistakes
- ประหยัดเวลา
- ตัดสินใจได้ดีขึ้น

---

## 📋 Research Checklist

### 1. หาโปรเจกต์ที่คล้ายกัน

**ที่ไหน:**
- GitHub (open-source)
- Product Hunt
- Stack Overflow
- Reddit
- HackerNews

**หาอะไร:**
- โปรเจกต์ที่มีชื่อเสียง
- Star/Fork เยอะ
- Active maintenance
- Good documentation

**ตัวอย่าง:**
```
งาน: ทำระบบ POS

หา:
- Shopify POS (commercial)
- Square POS (commercial)
- Odoo POS (open-source)
- ERPNext POS (open-source)
```

### 2. วิเคราะห์ Tech Stack

**ดูว่าพวกเขาเลือกอะไร:**
- Frontend framework
- Backend framework
- Database
- Infrastructure
- Third-party services

**ตัวอย่าง:**
```
Shopify POS:
- Frontend: React Native
- Backend: Ruby on Rails
- Database: MySQL + Redis
- Infrastructure: AWS
- Payment: Stripe
```

### 3. ทำไมเลือกตัวนี้?

**หาเหตุผล:**
- Blog posts
- Tech talks
- Documentation
- GitHub discussions

**ตัวอย่าง:**
```
ทำไม Shopify เลือก React Native?
- Cross-platform (iOS + Android)
- Fast development
- Large community
- Good performance
```

### 4. เจอปัญหาอะไรหลังจากเลือก?

**หาปัญหา:**
- GitHub issues
- Stack Overflow
- Reddit discussions
- Blog posts (retrospective)

**ตัวอย่าง:**
```
ปัญหาที่เจอกับ React Native:
- Performance issues (large lists)
- Native module integration
- Debugging ยาก
- Upgrade ยาก
```

### 5. Community Sentiment

**ดูว่าคนอื่นคิดยังไง:**
- Reddit
- HackerNews
- Twitter/X
- Dev.to

**ตัวอย่าง:**
```
React Native sentiment:
- 👍 ดี: Fast development, Cross-platform
- 👎 ไม่ดี: Performance, Debugging
- 🤔 ขึ้นอยู่กับ: Use case
```

---

## 🎯 Research Template

### โปรเจกต์: [ชื่อโปรเจกต์]

**URL:** [GitHub/Website]

**Tech Stack:**
- Frontend: [...]
- Backend: [...]
- Database: [...]
- Infrastructure: [...]

**ทำไมเลือก:**
- [เหตุผล 1]
- [เหตุผล 2]
- [เหตุผล 3]

**ปัญหาที่เจอ:**
- [ปัญหา 1]
- [ปัญหา 2]
- [ปัญหา 3]

**Community Sentiment:**
- 👍 ดี: [...]
- 👎 ไม่ดี: [...]
- 🤔 ขึ้นอยู่กับ: [...]

**Lessons Learned:**
- [บทเรียน 1]
- [บทเรียน 2]
- [บทเรียน 3]

---

## 💡 Best Practices

### 1. หาอย่างน้อย 3 โปรเจกต์

❌ **ไม่ดี — หาแค่ 1:**
```
หา Shopify POS อย่างเดียว
```

✅ **ดี — หา 3+:**
```
หา:
- Shopify POS
- Square POS
- Odoo POS
- ERPNext POS
```

### 2. ดูทั้ง Commercial และ Open-source

**Commercial:**
- ✅ Production-ready
- ✅ Best practices
- ❌ ไม่เห็น code

**Open-source:**
- ✅ เห็น code
- ✅ เห็น issues
- ❌ อาจไม่ production-ready

### 3. ดูทั้ง Success และ Failure

**Success stories:**
- เรียนรู้ best practices

**Failure stories:**
- เรียนรู้ mistakes
- หลีกเลี่ยงปัญหา

### 4. ถามคนที่เคยทำ

**ที่ไหน:**
- Reddit
- Discord
- Slack communities
- Twitter/X

**ถามอะไร:**
- "เคยทำระบบ POS ไหม?"
- "ใช้ tech stack อะไร?"
- "เจอปัญหาอะไรบ้าง?"
- "ถ้าทำใหม่จะเปลี่ยนอะไร?"

---

## 🚨 ข้อควรระวัง

### ❌ อย่าทำ

1. **อย่าเชื่อ 100%**
   - Context ต่างกัน
   - Use case ต่างกัน

2. **อย่าลอกทุกอย่าง**
   - เข้าใจเหตุผลก่อน
   - ปรับให้เหมาะกับ context

3. **อย่าใช้เวลามากเกินไป**
   - Research 1-2 วันพอ
   - ไม่ใช่ 1-2 สัปดาห์

### ✅ ควรทำ

1. **เข้าใจ context**
   - โปรเจกต์นั้นทำไปเพื่ออะไร?
   - Scale เท่าไหร่?
   - Team ขนาดเท่าไหร่?

2. **เข้าใจ tradeoffs**
   - ทำไมเลือกตัวนี้?
   - ข้อดี/ข้อเสีย?

3. **ปรับให้เหมาะกับ context ของเรา**
   - Context เราต่างยังไง?
   - ต้องปรับอะไรบ้าง?

---

## 🎓 ตัวอย่าง: ระบบ POS

### Research Summary

**โปรเจกต์ที่ศึกษา:**
1. Shopify POS (Commercial)
2. Square POS (Commercial)
3. Odoo POS (Open-source)

**Tech Stack ที่นิยม:**
- Frontend: React / React Native
- Backend: Node.js / Python / Ruby
- Database: PostgreSQL / MySQL
- Payment: Stripe / Square

**Lessons Learned:**
- ✅ ใช้ PostgreSQL (ACID สำคัญ)
- ✅ ใช้ React (ecosystem ใหญ่)
- ✅ ใช้ Stripe (payment gateway ที่ดี)
- ❌ อย่าใช้ MongoDB (ข้อมูลมี relation)
- ❌ อย่า build payment gateway เอง (ซับซ้อน)

**Decision:**
- Frontend: Next.js (React + SSR)
- Backend: Next.js API Routes
- Database: PostgreSQL + Prisma
- Payment: Stripe

**Rationale:**
- Next.js: Full-stack framework, SEO-friendly
- PostgreSQL: ACID, Relational
- Prisma: Type-safe ORM
- Stripe: Best payment gateway

---

## 🔗 เอกสารอ้างอิง

- `01-gates/full-mode/gate-4-solution-design.md` — Solution design
- `04-templates/decision-log.md` — Decision log template

---

> **"เรียนรู้จากคนอื่น = ไม่ต้องผิดเอง"**
