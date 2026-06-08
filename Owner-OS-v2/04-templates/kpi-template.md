# KPI Template — เขียนเป้าหมายเป็น KPI ที่วัดผลได้

> "ถ้าวัดไม่ได้ ก็ปรับปรุงไม่ได้"

---

## 🎯 ทำไมต้องมี KPI?

- เป้าหมายคลุมเครือ = ไม่รู้ว่าสำเร็จหรือไม่
- KPI วัดได้ = รู้ชัดว่าต้องทำอะไร และสำเร็จเมื่อไหร่

```
❌ เป้าหมายที่วัดไม่ได้:
- "ทำให้ระบบเร็วขึ้น"
- "ทำให้ลูกค้าพอใจ"
- "เพิ่มยอดขาย"

✅ KPI ที่วัดได้:
- "ลด response time จาก 3s → < 500ms"
- "เพิ่ม NPS จาก 30 → 50 ภายใน 3 เดือน"
- "เพิ่มยอดขาย 20% ภายใน Q2"
```

---

## 📐 KPI ที่ดีต้องเป็น SMART

| ตัวอักษร | ความหมาย | คำถาม |
|---|---|---|
| **S** - Specific | เฉพาะเจาะจง | วัดอะไรชัดเจน? |
| **M** - Measurable | วัดได้ | วัดด้วยตัวเลขอะไร? |
| **A** - Achievable | ทำได้จริง | เป็นไปได้ไหม? |
| **R** - Relevant | เกี่ยวข้อง | ตรงกับ business goal ไหม? |
| **T** - Time-bound | มีกรอบเวลา | ภายในเมื่อไหร่? |

```
ตัวอย่าง SMART KPI:
"เพิ่ม conversion rate ของหน้า checkout (Specific)
จาก 2% เป็น 5% (Measurable)
โดยแก้ปัญหา UX (Achievable)
เพื่อเพิ่มยอดขาย (Relevant)
ภายใน 2 เดือน (Time-bound)"
```

---

## 📋 KPI Template

```markdown
# KPI: [ชื่องาน/โปรเจกต์]

Created: YYYY-MM-DD
Owner: [ชื่อ]

---

## 🎯 Business Goal
[เป้าหมายทางธุรกิจที่ KPI นี้รับใช้]

---

## 📊 KPIs

### KPI 1: [ชื่อ metric]

- **Metric:** [วัดอะไร]
- **Baseline (ปัจจุบัน):** [ค่าตอนนี้]
- **Target (เป้าหมาย):** [ค่าที่ต้องการ]
- **Deadline:** [ภายในเมื่อไหร่]
- **วิธีวัด:** [วัดยังไง / เครื่องมืออะไร]
- **ความถี่:** [วัดบ่อยแค่ไหน - รายวัน/สัปดาห์/เดือน]

### KPI 2: [ชื่อ metric]
[...]

---

## 🚦 Leading vs Lagging Indicators

**Leading (ตัวชี้นำ - คาดการณ์อนาคต):**
- [เช่น จำนวน demo ที่จอง]

**Lagging (ตัวชี้ตาม - วัดผลที่เกิดแล้ว):**
- [เช่น ยอดขายจริง]

---

## 📈 Tracking

| วันที่ | KPI 1 | KPI 2 | หมายเหตุ |
|---|---|---|---|
| YYYY-MM-DD | [ค่า] | [ค่า] | [note] |
```

---

## 🎯 ตัวอย่าง KPI ตามประเภทงาน

### Performance (ประสิทธิภาพ)

| Metric | Baseline | Target |
|---|---|---|
| Response time | 3s | < 500ms |
| Page load | 8s | < 2s |
| Uptime | 98% | > 99.9% |
| Error rate | 5% | < 0.1% |

### Business (ธุรกิจ)

| Metric | Baseline | Target |
|---|---|---|
| Conversion rate | 2% | 5% |
| Revenue | 100k/mo | 150k/mo |
| Cart abandonment | 70% | 40% |
| Customer acquisition cost | 500฿ | 300฿ |

### Customer (ลูกค้า)

| Metric | Baseline | Target |
|---|---|---|
| NPS | 30 | 50 |
| Retention rate | 60% | 80% |
| Churn rate | 10% | 5% |
| Support tickets | 100/wk | 50/wk |

### Operation (การดำเนินงาน)

| Metric | Baseline | Target |
|---|---|---|
| เวลาทำงานพนักงาน | 8 ชม./วัน | 6 ชม./วัน |
| งานที่ทำอัตโนมัติ | 20% | 60% |
| Lead time | 5 วัน | 2 วัน |

---

## ⚠️ ข้อควรระวัง

### อย่าวัดสิ่งที่วัดง่ายแต่ไม่สำคัญ

```
❌ Vanity Metrics (ตัวเลขสวยแต่ไร้ความหมาย):
- จำนวน page views (แต่ไม่มีใครซื้อ)
- จำนวน downloads (แต่ไม่มีใครใช้)

✅ Actionable Metrics (วัดแล้วทำอะไรต่อได้):
- conversion rate
- retention rate
- revenue per user
```

### อย่ามี KPI เยอะเกินไป

- โฟกัส 1-3 KPI หลักต่องาน
- มากเกินไป = ไม่รู้ว่าอันไหนสำคัญ

---

## ✅ KPI Checklist

- [ ] KPI เป็น SMART (Specific, Measurable, Achievable, Relevant, Time-bound)
- [ ] มี baseline (ค่าปัจจุบัน)
- [ ] มี target (ค่าเป้าหมาย)
- [ ] มี deadline
- [ ] รู้วิธีวัด + เครื่องมือ
- [ ] เป็น actionable metric ไม่ใช่ vanity metric
- [ ] มีไม่เกิน 1-3 KPI หลัก
- [ ] ตรงกับ business goal

---

## 🔗 เอกสารอ้างอิง

- `02-protocols/4w-framework.md` — WHAT (success criteria)
- `06-references/business-impact-analysis.md` — Business impact
- `01-gates/full-mode/gate-1-business-understanding.md` — Gate 1 (KPI output)
- `00-core/principles.md` — Principle #10 Measurable

---

> **"เป้าหมายที่ไม่มีตัวเลข = ความฝัน ไม่ใช่แผน"**
