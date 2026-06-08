# Business Impact Analysis — มอง Business Impact มากกว่า Technical Detail

> "Owner คิดถึงผลกระทบทางธุรกิจ ไม่ใช่แค่ความสวยงามของโค้ด"

---

## 🎯 ทำไมต้องมอง Business Impact?

**กับดักของ Developer:** ติดอยู่กับ technical detail จนลืมว่าทำไปทำไม

```
❌ Technical-First (Dev Mindset):
"ใช้ microservices ดีกว่า เพราะ scale ได้ดี clean architecture"
→ แต่ลูกค้ามี user แค่ 100 คน ไม่ต้อง scale เลย
→ เสียเวลา 2 เดือนทำสิ่งที่ไม่จำเป็น

✅ Business-First (Owner Mindset):
"user แค่ 100 คน ใช้ monolith ง่ายๆ ก็พอ
ประหยัดเวลา 2 เดือน เอาไปทำ feature ที่ขายได้"
→ ออก product เร็วกว่า มีรายได้เร็วกว่า
```

---

## ⚖️ Business Impact vs Technical Detail

| มิติ | Technical Detail (Dev) | Business Impact (Owner) |
|---|---|---|
| **โฟกัส** | โค้ดสวย, architecture | รายได้, ลูกค้า, ROI |
| **คำถาม** | "ทำยังไงให้ดีที่สุด?" | "คุ้มค่าที่สุดไหม?" |
| **วัดผล** | Code coverage, performance | Revenue, retention, cost |
| **ตัดสินใจ** | Best practice | Best for business |
| **เวลา** | Perfect solution | Good enough, ship fast |

**หมายเหตุ:** ไม่ได้แปลว่า technical ไม่สำคัญ แต่ต้อง**เริ่มจาก business** แล้วใช้ technical รับใช้ business

---

## 📊 มิติของ Business Impact

### 1. 💰 Revenue Impact (ผลต่อรายได้)

- เพิ่มยอดขายได้เท่าไหร่?
- ป้องกันการเสียยอดได้เท่าไหร่?
- เพิ่ม conversion rate กี่ %?

```
ตัวอย่าง:
"แก้หน้า checkout ให้เร็วขึ้น → ลด cart abandonment 30% → +20,000 บาท/เดือน"
```

### 2. 💸 Cost Impact (ผลต่อต้นทุน)

- ประหยัดเวลาพนักงานเท่าไหร่?
- ลดต้นทุน operation เท่าไหร่?
- ลดค่า server/service เท่าไหร่?

```
ตัวอย่าง:
"ทำ auto-reply LINE → ประหยัดเวลาพนักงาน 2 ชม./วัน → 12,000 บาท/เดือน"
```

### 3. 😊 Customer Impact (ผลต่อลูกค้า)

- ลูกค้าพอใจขึ้นไหม? (NPS, rating)
- ลด churn rate ไหม?
- เพิ่ม retention ไหม?

```
ตัวอย่าง:
"เพิ่มระบบ tracking order → ลดการโทรถาม 50% → ลูกค้าพอใจขึ้น"
```

### 4. ⚠️ Risk Impact (ผลต่อความเสี่ยง)

- ลดความเสี่ยงอะไร?
- ป้องกันความเสียหายเท่าไหร่?
- compliance / legal?

```
ตัวอย่าง:
"เพิ่มระบบ backup → ป้องกันข้อมูลหาย → ป้องกันความเสียหาย 500,000 บาท"
```

### 5. 🚀 Strategic Impact (ผลเชิงกลยุทธ์)

- ได้เปรียบคู่แข่งไหม?
- เปิดโอกาสใหม่ไหม?
- สร้าง competitive moat ไหม?

```
ตัวอย่าง:
"เป็นเจ้าแรกที่มีระบบสั่งล่วงหน้า → ได้เปรียบคู่แข่ง → ครองตลาด"
```

---

## 🧮 วิธีคำนวณ ROI

```
ROI = (ผลตอบแทน - ต้นทุน) / ต้นทุน × 100%

ตัวอย่าง:
งาน: ทำระบบแจ้งเตือนสต็อก
- ต้นทุน: 3 วันทำงาน = ~15,000 บาท
- ผลตอบแทน: ประหยัด/เพิ่มยอด 50,000 บาท/เดือน = 600,000 บาท/ปี
- ROI = (600,000 - 15,000) / 15,000 × 100% = 3,900%

สรุป: คุ้มมาก ทำเลย!
```

---

## 🎯 Decision Framework: ควรทำไหม?

ใช้ matrix นี้ตัดสินใจ:

```
                 Business Impact สูง    Business Impact ต่ำ
              ┌─────────────────────┬─────────────────────┐
ทำง่าย/เร็ว    │   ✅ ทำเลย (Quick Win) │  🟡 ทำถ้าว่าง         │
              ├─────────────────────┼─────────────────────┤
ทำยาก/นาน     │   🟠 วางแผนทำ (Project)│  ❌ อย่าทำ (Money Pit) │
              └─────────────────────┴─────────────────────┘
```

**ลำดับความสำคัญ:**
1. ✅ Quick Win (impact สูง + ง่าย) → ทำก่อนเลย
2. 🟠 Project (impact สูง + ยาก) → วางแผนทำ
3. 🟡 Fill-in (impact ต่ำ + ง่าย) → ทำเมื่อว่าง
4. ❌ Money Pit (impact ต่ำ + ยาก) → อย่าทำ

---

## 📝 Business Impact Statement Template

```
งาน: [ชื่องาน]

Business Impact:
- 💰 Revenue: [+X บาท/เดือน หรือ ป้องกันเสีย X บาท]
- 💸 Cost: [ประหยัด X บาท/เดือน]
- 😊 Customer: [NPS +X, retention +X%]
- ⚠️ Risk: [ลดความเสี่ยง X]
- 🚀 Strategic: [ได้เปรียบ X]

ต้นทุน: [X วัน = X บาท]
ROI: [X%]
Quadrant: [Quick Win / Project / Fill-in / Money Pit]

สรุป: [ควรทำ / ไม่ควรทำ / ทำทีหลัง] เพราะ [เหตุผล]
```

---

## ✅ Business Impact Checklist

- [ ] ประเมิน revenue impact แล้ว
- [ ] ประเมิน cost impact แล้ว
- [ ] ประเมิน customer impact แล้ว
- [ ] ประเมิน risk impact แล้ว
- [ ] คำนวณ ROI แล้ว
- [ ] จัด quadrant แล้ว (Quick Win / Project / Fill-in / Money Pit)
- [ ] ตัดสินใจบนพื้นฐาน business ไม่ใช่แค่ technical

---

## 🔗 เอกสารอ้างอิง

- `02-protocols/4w-framework.md` — WHY (business value)
- `06-references/problem-definition.md` — นิยามปัญหา
- `04-templates/kpi-template.md` — กำหนด KPI
- `00-core/principles.md` — Principle #9 Owner Mindset, #12 Business Impact First

---

> **"โค้ดที่สมบูรณ์แบบแต่ไม่สร้าง value = โค้ดที่ล้มเหลวทางธุรกิจ"**
