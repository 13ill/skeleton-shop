# Full Ownership Framework (FOF)

## Overview
Framework สำหรับการทำงานแบบ Full Ownership เพื่อพัฒนาจาก Task Executor ไปสู่ Business Systems Thinker ภายใน 90 วัน

---

## KPI 90 วัน

### เป้าหมายรวม
- **งานหลัก (Main Project)**: 1 งาน
- **งานย่อย (Sub Project)**: 4 งาน
- **งานแก้ไขปัญหา (Investigation Case)**: 10 งาน

### เกณฑ์การนับงาน

#### งานหลัก (Main Project) - 1 งาน
**คุณสมบัติ:**
- มีความซับซ้อนสูง (High Complexity)
- มี impact ต่อ business หลัก
- ต้องใช้เวลา 2-4 สัปดาห์
- ต้องใช้ FOF ทุก 13 สเตจ
- ต้องทำในระดับ Business Systems Thinker

**ตัวอย่าง:**
- ปรับปรุง architecture ระบบหลัก
- Implement feature ใหม่ที่มี impact สูง
- Migration ระบบใหญ่

#### งานย่อย (Sub Project) - 4 งาน
**คุณสมบัติ:**
- มีความซับซ้อนปานกลาง (Medium Complexity)
- เป็นส่วนหนึ่งของงานหลัก หรือมี impact ปานกลาง
- ต้องใช้เวลา 3-7 วัน
- ต้องใช้ FOF สเตจ 0-2, 3-5, 7, 10-11
- ต้องทำในระดับ Solution Owner ขึ้นไป

**ตัวอย่าง:**
- Implement feature ย่อย
- ปรับปรุง module หนึ่ง
- Optimize performance ส่วนหนึ่ง

#### งานแก้ไขปัญหา (Investigation Case) - 10 งาน
**คุณสมบัติ:**
- มีความซับซ้อนต่ำ-ปานกลาง (Low-Medium Complexity)
- เป็นการแก้ bug หรือปัญหาเฉพาะจุด
- ต้องใช้เวลา 1-3 วัน
- ต้องใช้ FOF สเตจ 0, 3, 5, 10, 11
- ต้องทำในระดับ System Thinker ขึ้นไป

**ตัวอย่าง:**
- แก้ bug ที่ซับซ้อน
- Debug ปัญหา performance
- แก้ปัญหา integration

### เกณฑ์การประเมินผ่าน/ไม่ผ่าน
- **ผ่าน**: ทำงานครบตามเกณฑ์ของแต่ละประเภท และใช้ระดับการคิดตามที่กำหนด
- **ไม่ผ่าน**: ทำงานไม่ครบสเตจ หรือใช้ระดับการคิดต่ำกว่าที่กำหนด

---

## ระดับการคิด (Thinking Levels)

### Level 1: Task Executor
**คำนิยาม:** ทำงานตามคำสั่ง ไม่ถามทำไม

**Checklist:**
- [ ] ทำงานตาม requirement ที่ให้มา
- [ ] ส่งงานตรงเวลา
- [ ] ทำตามคำสั่งโดยไม่ตั้งคำถาม

**ไม่ควรทำ:**
- ไม่ถาม context หรือเหตุผล
- ไม่คิดถึง impact ต่อส่วนอื่น
- ไม่เสนอทางเลือกอื่น

**เหมาะกับ:** งานเล็กๆ ง่ายๆ ที่ชัดเจน

---

### Level 2: Problem Solver
**คำนิยาม:** หาสาเหตุ แก้ปัญหา คิดวิธีแก้

**Checklist:**
- [ ] วิเคราะห์ปัญหาที่เกิดขึ้น
- [ ] หาสาเหตุของปัญหา (Root Cause)
- [ ] คิดวิธีแก้ปัญหาอย่างน้อย 1 วิธี
- [ ] ทดสอบวิธีแก้ปัญหา
- [ ] ยืนยันว่าปัญหาหายไป

**ควรทำ:**
- ถามว่าทำไมต้องทำแบบนี้
- คิดถึง edge cases
- ทดสอบก่อนส่งงาน

**เหมาะกับ:** งานแก้ไขปัญหา (Investigation Case)

---

### Level 3: System Thinker
**คำนิยาม:** คิดถึง impact ต่อระบบอื่น เชื่อมโยงระหว่างส่วนต่างๆ

**Checklist:**
- [ ] วิเคราะห์ระบบที่เกี่ยวข้องทั้งหมด
- [ ] คิดถึง impact ต่อ module อื่น
- [ ] คิดถึง impact ต่อ database
- [ ] คิดถึง impact ต่อ API อื่นๆ
- [ ] ทดสอบ integration กับระบบอื่น
- [ ] คิดถึง backward compatibility

**ควรทำ:**
- ดู flow ของระบบทั้งหมด
- คิดถึง side effects
- ทดสอบกับระบบที่เกี่ยวข้อง

**เหมาะกับ:** งานแก้ไขปัญหาที่ซับซ้อน, งานย่อย

---

### Level 4: Solution Owner
**คำนิยาม:** เลือก solution ที่ดีที่สุด เปรียบเทียบ tradeoffs คิดถึง long-term

**Checklist:**
- [ ] เสนอ solution หลายตัวเลือก (อย่างน้อย 2-3 ตัวเลือก)
- [ ] เปรียบเทียบ pros/cons ของแต่ละตัวเลือก
- [ ] ประเมิน tradeoffs (performance, maintainability, complexity)
- [ ] เลือก solution ที่เหมาะสมที่สุดพร้อมเหตุผล
- [ ] คิดถึง long-term impact
- [ ] คิดถึง maintenance cost

**ควรทำ:**
- ไม่เลือก solution แรกที่คิดได้
- คิดถึง scalability
- คิดถึง technical debt

**เหมาะกับ:** งานย่อย, งานหลัก

---

### Level 5: Business Systems Thinker
**คำนิยาม:** คิดเชื่อมระหว่างระบบและธุรกิจ คิดถึง ROI, cost, benefit

**Checklist:**
- [ ] วิเคราะห์ business context ที่ชัดเจน
- [ ] ระบุ stakeholders ทั้งหมด
- [ ] คิดถึง business value ของงาน
- [ ] ประเมิน cost/benefit
- [ ] คิดถึง ROI
- [ ] ประเมินความเสี่ยงทางธุรกิจ
- [ ] คิดถึง strategic alignment
- [ ] วางแผน deployment ที่เหมาะสม
- [ ] คิดถึง monitoring และ measurement

**ควรทำ:**
- ถามว่า business ต้องการอะไร
- คิดถึง time-to-market
- คิดถึง user experience
- คิดถึง competitive advantage

**เหมาะกับ:** งานหลัก (Main Project)

---

## FOF Stages (13 สเตจ)

### Stage 0: Request Intake
**วัตถุประสงค์:** รับคำสั่งงานและทำความเข้าใจเบื้องต้น

**Deliverable:**
- Task summary
- Initial requirement
- Context ที่มี

**คำถามหลัก:**
- งานนี้คืออะไร?
- ต้องการให้ทำอะไร?
- มี context อะไรให้?

---

### Stage 1: Business Context Review
**วัตถุประสงค์:** ทำความเข้าใจบริบทธุรกิจ

**Deliverable:**
- Business context document
- Business value ของงาน
- Impact ต่อ business

**คำถามหลัก:**
- ทำไมต้องทำงานนี้?
- Business ต้องการอะไร?
- มีความสำคัญต่อ business แค่ไหน?
- มี deadline หรือไม่?

---

### Stage 2: Stakeholder Analysis
**วัตถุประสงค์:** วิเคราะห์ผู้มีส่วนได้ส่วนเสีย

**Deliverable:**
- Stakeholder list
- ความต้องการของแต่ละ stakeholder
- Communication plan

**คำถามหลัก:**
- ใครคือ stakeholders?
- แต่ละคนต้องการอะไร?
- ต้อง communicate กับใครบ้าง?

---

### Stage 3: System Analysis
**วัตถุประสงค์:** วิเคราะห์ระบบที่เกี่ยวข้อง

**Deliverable:**
- System architecture diagram
- Component list
- Dependency map

**คำถามหลัก:**
- ระบบไหนเกี่ยวข้องบ้าง?
- Component ไหนที่จะถูกกระทบ?
- มี dependency อะไรบ้าง?

---

### Stage 4: State & Workflow Analysis
**วัตถุประสงค์:** วิเคราะห์สถานะและ workflow ปัจจุบัน

**Deliverable:**
- Current workflow diagram
- State diagram
- Data flow diagram

**คำถามหลัก:**
- Flow ปัจจุบันเป็นอย่างไร?
- State ปัจจุบันเป็นอย่างไร?
- Data ไหลอย่างไร?

---

### Stage 5: Investigation & Root Cause
**วัตถุประสงค์:** สืบหาสาเหตุของปัญหา

**Deliverable:**
- Root cause analysis
- Evidence และ data
- Hypothesis และ validation

**คำถามหลัก:**
- ปัญหาคืออะไร?
- สาเหตุคืออะไร?
- มี evidence อะไรบ้าง?
- มี hypothesis อะไรบ้าง?

---

### Stage 6: Risk Analysis
**วัตถุประสงค์:** ประเมินความเสี่ยง

**Deliverable:**
- Risk matrix
- Mitigation plan
- Contingency plan

**คำถามหลัก:**
- มีความเสี่ยงอะไรบ้าง? (technical/operational/business/strategic)
- โอกาสเกิดเท่าไหร่?
- Impact เท่าไหร่?
- จะ mitigate อย่างไร?

---

### Stage 7: Solution Evaluation
**วัตถุประสงค์:** เปรียบเทียบ solution หลายตัวเลือก

**Deliverable:**
- Solution comparison table
- Pros/cons ของแต่ละ solution
- Recommendation

**คำถามหลัก:**
- มี solution อะไรบ้าง?
- แต่ละ solution มี pros/cons อะไร?
- Tradeoffs คืออะไร?
- Solution ไหนดีที่สุด?

---

### Stage 8: Economic Thinking
**วัตถุประสงค์:** คิดเรื่อง cost/benefit/ROI

**Deliverable:**
- Cost analysis
- Benefit analysis
- ROI calculation

**คำถามหลัก:**
- Cost คืออะไร? (development, maintenance, opportunity)
- Benefit คืออะไร? (time, money, quality)
- ROI เท่าไหร่?
- คุ้มไหม?

---

### Stage 9: Decision Alignment
**วัตถุประสงค์:** จัดทำให้ตัดสินใจตรงกับเป้าหมาย

**Deliverable:**
- Decision document
- Alignment check
- Approval จาก stakeholders

**คำถามหลัก:**
- ตัดสินใจอะไร?
- ตรงกับเป้าหมายไหม?
- Stakeholders เห็นด้วยไหม?

---

### Stage 10: Execution Planning
**วัตถุประสงค์:** วางแผนการดำเนินการ

**Deliverable:**
- Implementation plan
- Timeline
- Resource allocation
- Testing plan

**คำถามหลัก:**
- จะทำอย่างไร?
- ใช้เวลาเท่าไหร่?
- ต้องการ resource อะไร?
- จะทดสอบอย่างไร?

---

### Stage 11: Outcome Review
**วัตถุประสงค์:** รีวิวผลลัพธ์

**Deliverable:**
- Result summary
- Success criteria check
- Lessons learned

**คำถามหลัก:**
- สำเร็จไหม?
- ตรงตามเป้าหมายไหม?
- มีอะไรเรียนรู้บ้าง?

---

### Stage 12: Continuous Improvement
**วัตถุประสงค์:** ปรับปรุงอย่างต่อเนื่อง

**Deliverable:**
- Improvement plan
- Action items
- Follow-up schedule

**คำถามหลัก:**
- สามารถปรับปรุงอะไรได้อีก?
- จะทำอย่างไร?
- จะ follow-up อย่างไร?

---

## Template งานตามขนาด

### Template งานเล็ก (Small Task)
**ใช้สเตจ:** 0, 3, 5, 10, 11
**ระดับการคิด:** Problem Solver
**เวลา:** 1 วัน

```
Task:
Requirement:
Context:

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

---

### Template งานกลาง (Medium Task)
**ใช้สเตจ:** 0-2, 3-5, 7, 10-11
**ระดับการคิด:** System Thinker / Solution Owner
**เวลา:** 3-7 วัน

```
Task:
Requirement:
Context:

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

---

### Template งานใหญ่ (Large Task)
**ใช้สเตจ:** ทุก 13 สเตจ
**ระดับการคิด:** Business Systems Thinker
**เวลา:** 2-4 สัปดาห์

```
Task:
Requirement:
Context:

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

---

## วิธีใช้งาน

### เมื่อได้รับงานใหม่:
1. ระบุประเภทงาน (Main/Sub/Investigation)
2. เลือก template ตามขนาดงาน
3. ระบุระดับการคิดที่ต้องใช้
4. ทำตามสเตจที่กำหนด
5. บันทึกผลลัพธ์

### เมื่อส่งงาน:
1. รีวิวว่าทำครบสเตจที่กำหนดหรือไม่
2. ประเมินว่าใช้ระดับการคิดตามที่กำหนดหรือไม่
3. บันทึกว่านับเป็น KPI 90 วันหรือไม่
4. ประเมินว่าผ่าน KPI สัปดาห์และ KPI สะสม 90 วันหรือยัง

---

## Tracking KPI 90 วัน

### รูปแบบการบันทึก:
```
งานที่: [X]
ประเภท: [Main/Sub/Investigation]
ระดับการคิด: [Task Executor/Problem Solver/System Thinker/Solution Owner/Business Systems Thinker]
สเตจที่ใช้: [0, 1, 2, ...]
สถานะ: [ผ่าน/ไม่ผ่าน]
หมายเหตุ:
```

### สรุปสะสม:
- งานหลัก: [0/1]
- งานย่อย: [0/4]
- งานแก้ไขปัญหา: [0/10]
- ระดับการคิดเฉลี่ย: [Level X]

---

## ตัวอย่างการใช้งาน

### ตัวอย่าง 1: งานแก้ไขปัญหา (Investigation Case)
```
Task: แก้ปัญหา savebook ช้า
Requirement: ลดเวลาจาก 5+ นาที เหลือ < 1 นาที
Context: User ร้องเรียนว่า savebook ช้ามาก

Stage 0: Request Intake
- งานนี้คือการแก้ปัญหา performance ของ savebook

Stage 3: System Analysis
- ระบบที่เกี่ยวข้อง: savebook, queue system, database

Stage 5: Investigation & Root Cause
- ปัญหา: insertBookFileLogic ช้า (5+ นาที)
- สาเหตุ: file I/O ทุก company (732 operations), database query ทุก company (732 queries)

Stage 10: Execution Planning
- ลบ updateTrackingFile ทุก company
- แก้ updateTrackingFinal เขียน results ทั้งหมดในครั้งเดียว

Stage 11: Outcome Review
- สำเร็จ: ลด file I/O จาก 732 → 2 operations
- เรียนรู้: ควร batch operations แทน loop ทุก company

ประเภท: Investigation Case
ระดับการคิด: System Thinker
สเตจที่ใช้: 0, 3, 5, 10, 11
สถานะ: ผ่าน
```

---

## Notes
- Framework นี้เป็นแนวทาง สามารถปรับตามความเหมาะสม
- เน้นการพัฒนาจาก Task Executor → Business Systems Thinker
- ทุกงานควรเป็นการฝึกตามแผน 90 วัน
- ไม่ใช่แค่การปิด task แต่เป็นการพัฒนา skill
