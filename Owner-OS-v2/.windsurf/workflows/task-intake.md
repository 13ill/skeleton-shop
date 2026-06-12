---
description: รับงานใหม่และแตกงานตาม Full Ownership Framework (FOF)
---

# /task-intake - รับงานใหม่ตาม FOF Framework

เมื่อได้รับคำสั่งนี้ ให้ทำตามขั้นตอนต่อไปนี้เพื่อแตกงานตาม Full Ownership Framework (FOF):

## ขั้นตอนที่ 1: รับข้อมูลพื้นฐาน
ถามคำถามต่อไปนี้ (ถ้ายังไม่มีข้อมูล):
- **Task:** งานนี้คืออะไร?
- **Requirement:** ต้องการให้ทำอะไร?
- **Context:** มี context อะไรให้? (หรือ copy ข้อความจาก CTO มาตรงๆ)

## ขั้นตอนที่ 1.5: AI Model Selection
ถามคำถามเพื่อเลือก AI Model ที่เหมาะสม:
1. งานนี้ใหญ่แค่ไหน? (เล็ก/กลาง/ใหญ่)
2. ซับซ้อนแค่ไหน? (ง่าย/ปานกลาง/ซับซ้อน)
3. ด่วนแค่ไหน? (ด่วนมาก/ด่วน/ไม่ด่วน)
4. สำคัญแค่ไหนต่อธุรกิจ? (Critical/Important/Normal)

**AI เลือก Mode และ Model ตามคำตอบ** (หรือ user สามารถ override)

## ขั้นตอนที่ 2: ระบุประเภทและขนาดงาน
วิเคราะห์และระบุ:
- **ประเภทงาน:** Main Project / Sub Project / Investigation Case
- **ขนาดงาน:** เล็ก (1 วัน) / กลาง (3-7 วัน) / ใหญ่ (2-4 สัปดาห์)
- **ระดับการคิดที่ต้องใช้:** Task Executor / Problem Solver / System Thinker / Solution Owner / Business Systems Thinker

## ขั้นตอนที่ 3: เลือก Template ตามขนาดงาน
เลือก template ตามขนาดงานที่ระบุ:

### งานเล็ก (Small Task) - ใช้สเตจ 0, 3, 5, 10, 11
```
Stage 0: Request Intake
- งานนี้คืออะไร?

Stage 3: System Analysis
- ระบบไหนเกี่ยวข้อง?

Stage 5: Investigation & Root Cause
- ปัญหาคืออะไร?
- สาเหตุคืออะไร?

Stage 10: Execution Planning
- จะทำอย่างไร?

Stage 11: Outcome Review
- สำเร็จไหม?
```

### งานกลาง (Medium Task) - ใช้สเตจ 0-2, 3-5, 7, 10-11
```
Stage 0: Request Intake
- งานนี้คืออะไร?

Stage 1: Business Context Review
- ทำไมต้องทำ?
- Business value คืออะไร?

Stage 2: Stakeholder Analysis
- ใครคือ stakeholders?

Stage 3: System Analysis
- ระบบไหนเกี่ยวข้อง?
- Component ไหนจะถูกกระทบ?

Stage 4: State & Workflow Analysis
- Flow ปัจจุบันเป็นอย่างไร?

Stage 5: Investigation & Root Cause
- ปัญหาคืออะไร?
- สาเหตุคืออะไร?

Stage 7: Solution Evaluation
- มี solution อะไรบ้าง?
- Solution ไหนดีที่สุด?

Stage 10: Execution Planning
- จะทำอย่างไร?
- Timeline?

Stage 11: Outcome Review
- สำเร็จไหม?
- มีอะไรเรียนรู้บ้าง?
```

### งานใหญ่ (Large Task) - ใช้ทุก 13 สเตจ
```
Stage 0: Request Intake
- งานนี้คืออะไร?

Stage 1: Business Context Review
- ทำไมต้องทำ?
- Business value คืออะไร?
- Impact ต่อ business?

Stage 2: Stakeholder Analysis
- ใครคือ stakeholders?
- แต่ละคนต้องการอะไร?

Stage 3: System Analysis
- ระบบไหนเกี่ยวข้อง?
- Component ไหนจะถูกกระทบ?
- Dependency อะไรบ้าง?

Stage 4: State & Workflow Analysis
- Flow ปัจจุบันเป็นอย่างไร?
- State ปัจจุบันเป็นอย่างไร?

Stage 5: Investigation & Root Cause
- ปัญหาคืออะไร?
- สาเหตุคืออะไร?
- Evidence อะไรบ้าง?

Stage 6: Risk Analysis
- ความเสี่ยงอะไรบ้าง? (technical/operational/business/strategic)
- จะ mitigate อย่างไร?

Stage 7: Solution Evaluation
- มี solution อะไรบ้าง?
- Pros/cons ของแต่ละ solution?
- Solution ไหนดีที่สุด?

Stage 8: Economic Thinking
- Cost คืออะไร?
- Benefit คืออะไร?
- ROI เท่าไหร่?

Stage 9: Decision Alignment
- ตัดสินใจอะไร?
- ตรงกับเป้าหมายไหม?
- Stakeholders เห็นด้วยไหม?

Stage 10: Execution Planning
- จะทำอย่างไร?
- Timeline?
- Resource allocation?
- Testing plan?

Stage 11: Outcome Review
- สำเร็จไหม?
- ตรงตามเป้าหมายไหม?
- มีอะไรเรียนรู้บ้าง?

Stage 12: Continuous Improvement
- สามารถปรับปรุงอะไรได้อีก?
- จะทำอย่างไร?
```

## ขั้นตอนที่ 4: ถามคำถามตามลำดับความสำคัญ
เริ่มจาก Stage 0 และไปเรื่อยๆ ตาม template ที่เลือก โดย:
- ถามคำถามทีละข้อ
- รอคำตอบจาก user
- ถ้า user ตอบแล้ว ให้บันทึกและถามคำถามถัดไป
- ทำจนครบทุกสเตจใน template

## ขั้นตอนที่ 5: สรุปผล
หลังจากครบทุกสเตจ ให้สรุป:
- **ประเภทงาน:** Main Project / Sub Project / Investigation Case
- **ระดับการคิด:** [ระดับที่ใช้]
- **สเตจที่ใช้:** [รายการสเตจ]
- **นับเป็น KPI 90 วัน:** ใช่ / ไม่ใช่
- **KPI สะสม:** งานหลัก [X/1], งานย่อย [X/4], งานแก้ไขปัญหา [X/10]

## ขั้นตอนที่ 6: เริ่มทำงาน
หลังจากสรุปแล้ว ให้เริ่มทำงานตามสเตจที่กำหนด

---

## ตัวอย่างการใช้งาน

User: /task-intake
AI: รับงานใหม่ตาม FOF Framework ครับ

**ขั้นตอนที่ 1: รับข้อมูลพื้นฐาน**
- **Task:** งานนี้คืออะไร?
- **Requirement:** ต้องการให้ทำอะไร?
- **Context:** มี context อะไรให้?

User: Task: แก้ปัญหา savebook ช้า, Requirement: ลดเวลาจาก 5+ นาที เหลือ < 1 นาที, Context: User ร้องเรียนว่า savebook ช้ามาก

AI: ได้รับข้อมูลครบแล้ว

**ขั้นตอนที่ 2: ระบุประเภทและขนาดงาน**
- **ประเภทงาน:** Investigation Case (งานแก้ไขปัญหา)
- **ขนาดงาน:** กลาง (3-7 วัน)
- **ระดับการคิดที่ต้องใช้:** System Thinker

**ขั้นตอนที่ 3: เลือก Template**
ใช้ Template งานกลาง (สเตจ 0-2, 3-5, 7, 10-11)

**ขั้นตอนที่ 4: ถามคำถามตามลำดับความสำคัญ**

Stage 0: Request Intake
- งานนี้คืออะไร?

User: งานนี้คือการแก้ปัญหา performance ของ savebook

AI: บันทึกแล้ว

Stage 1: Business Context Review
- ทำไมต้องทำ?

User: เพราะ user ร้องเรียนว่าช้ามาก ทำให้ไม่สามารถใช้งานได้

AI: บันทึกแล้ว

... (ทำเช่นนี้จนครบทุกสเตจ)

**ขั้นตอนที่ 5: สรุปผล**
- **ประเภทงาน:** Investigation Case
- **ระดับการคิด:** System Thinker
- **สเตจที่ใช้:** 0, 1, 2, 3, 4, 5, 7, 10, 11
- **นับเป็น KPI 90 วัน:** ใช่
- **KPI สะสม:** งานหลัก [0/1], งานย่อย [0/4], งานแก้ไขปัญหา [1/10]

**ขั้นตอนที่ 6: เริ่มทำงาน**
เริ่มทำงานตามสเตจที่กำหนดครับ
