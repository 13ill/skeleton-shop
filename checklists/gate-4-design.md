# Gate 4 — Solution Design: ออกแบบ Solution

## วัตถุประสงค์
ออกแบบ **ทางเลือกอย่างน้อย 2-3 ทาง** พร้อมวิเคราะห์ tradeoff (การแลกเปลี่ยน) ของแต่ละทาง
Gate นี้ป้องกันการ "เลือกทางแรกที่นึกออก" โดยไม่พิจารณาทางอื่น

> ปัญหาที่พบบ่อย: นึกออกทางเดียวแล้วทำเลย ไม่ได้เปรียบเทียบ
> ผลคือได้ solution ที่ "ทำได้" แต่อาจไม่ใช่ "ทางที่ดีที่สุด"

==================================================

## คำถามที่ต้องถามตัวเอง

### 1. "มีทางเลือกกี่ทาง — ลิสต์ออกมาทั้งหมดได้ไหม?"
- **ทำไมต้องถาม**: ถ้ามีทางเดียว = ไม่ได้คิด → อาจพลาดทางที่ดีกว่า
- **สิ่งที่ได้**: รายการทางเลือกที่ครบถ้วน → ตัดสินใจได้ดีขึ้น
- **ตัวอย่าง**: ต้องทำ search feature:
  - ทาง A: SQL LIKE query → ง่าย แต่ช้าเมื่อข้อมูลเยอะ
  - ทาง B: Full-text search ใน database → ดีขึ้น แต่มีข้อจำกัด
  - ทาง C: Elasticsearch → เร็วมาก แต่ต้องดูแล infrastructure เพิ่ม

### 2. "แต่ละทางมี tradeoff อะไร?"
- **ทำไมต้องถาม**: ไม่มี solution ที่สมบูรณ์แบบ ทุกทางมีข้อดี-ข้อเสีย ต้องรู้ก่อนเลือก
- **สิ่งที่ได้**: Tradeoff analysis (การวิเคราะห์การแลกเปลี่ยน) ที่ชัดเจน
- **มิติที่ต้องเปรียบเทียบ**:
  - Complexity (ความซับซ้อน): ทำยากแค่ไหน
  - Cost (ต้นทุน): ใช้เงิน/เวลาเท่าไหร่
  - Performance (ประสิทธิภาพ): เร็ว/ช้าแค่ไหน
  - Scalability (การรองรับการเติบโต): รับ load เพิ่มได้ไหม
  - Maintainability (ความง่ายในการดูแล): แก้ไขง่ายไหม
  - Time to implement (เวลาในการทำ): ใช้เวลานานแค่ไหน
  - Risk (ความเสี่ยง): อาจเกิดปัญหาอะไร

### 3. "Data model ควรเป็นอย่างไร?"
- **ทำไมต้องถาม**: Data model กำหนดทุกอย่าง — ถ้า model ผิด ระบบทั้งหมดจะมีปัญหา
- **สิ่งที่ได้**: โครงสร้างข้อมูลที่ตรงกับ business reality
- **ต้องคิดเรื่อง**:
  - Entities (สิ่งที่ต้องเก็บ): มีอะไรบ้าง
  - Relationships (ความสัมพันธ์): เชื่อมกันอย่างไร (1:1, 1:N, N:N)
  - Attributes (คุณสมบัติ): แต่ละ entity มี field อะไรบ้าง
  - Constraints (ข้อจำกัด): อะไรที่ห้าม null, ต้อง unique
  - Indexes (ดัชนี): query อะไรที่ต้องเร็ว

### 4. "API design เป็นอย่างไร?"
- **ทำไมต้องถาม**: API คือ "สัญญา" ระหว่าง frontend กับ backend — เปลี่ยนทีหลังยาก
- **สิ่งที่ได้**: API contract (สัญญา API — ข้อตกลงว่า API รับ/ส่งข้อมูลรูปแบบไหน) ที่ชัดเจน
- **คำอธิบาย**: API (Application Programming Interface) คือช่องทางที่ระบบต่างๆ ใช้สื่อสารกัน เช่น frontend เรียก backend เพื่อดึงข้อมูล
- **ต้องคิดเรื่อง**:
  - Endpoints (จุดเรียกใช้): มี URL อะไรบ้าง
  - Methods: GET/POST/PUT/DELETE
  - Request/Response format: ส่ง/รับข้อมูลรูปแบบไหน
  - Error handling: ถ้าผิดพลาดตอบอะไร
  - Versioning (การจัดเวอร์ชัน): ถ้าต้องเปลี่ยน API ทำอย่างไรไม่ให้ client เก่าพัง

### 5. "Downstream impact มีอะไรบ้าง?"
- **ทำไมต้องถาม**: การเปลี่ยนแปลงส่วนหนึ่งอาจกระทบส่วนอื่นที่ไม่ได้คิดถึง
- **สิ่งที่ได้**: รายการระบบ/feature ที่อาจได้รับผลกระทบ
- **คำอธิบาย**: Downstream impact (ผลกระทบต่อระบบที่อยู่ถัดไป) คือผลที่เกิดขึ้นกับระบบอื่นที่พึ่งพาข้อมูลหรือ API จากระบบที่เรากำลังแก้
- **ตัวอย่าง**: เปลี่ยน data model ของ User → กระทบ Order system, Payment system, Notification system

### 6. "Backward compatible หรือไม่?"
- **ทำไมต้องถาม**: ถ้าไม่ compatible กับของเดิม → client/user เก่าอาจพัง
- **สิ่งที่ได้**: แผนการ migration (การย้ายข้อมูล/ระบบ) ถ้าไม่ compatible
- **คำอธิบาย**: Backward compatible (เข้ากันได้กับเวอร์ชันเก่า) คือการที่ระบบใหม่ยังทำงานร่วมกับ client/ข้อมูลเก่าได้
- **ตัวอย่าง**: เปลี่ยน API response format → mobile app เก่าที่ยัง update ไม่ได้จะพัง

### 7. "มี technical debt ที่ต้องจ่ายหรือไม่?"
- **ทำไมต้องถาม**: บาง solution สร้าง technical debt (หนี้ทางเทคนิค — สิ่งที่รู้ว่าต้องกลับมาแก้ทีหลัง แลกกับการทำเสร็จเร็วตอนนี้) ต้องรู้ตัวก่อน
- **สิ่งที่ได้**: รายการ technical debt + แผนจ่ายคืน
- **ตัวอย่าง**: เลือก hardcode config → เสร็จเร็ว แต่ต้องกลับมาทำ config management ทีหลัง

### 8. "ถ้าโปรเจกต์โตขึ้น 10x design นี้ยังใช้ได้ไหม?"
- **ทำไมต้องถาม**: ออกแบบแค่สำหรับวันนี้ → พรุ่งนี้ต้องทำใหม่
- **สิ่งที่ได้**: ความมั่นใจว่า design รองรับการเติบโต
- **ตัวอย่าง**: ใช้ SQLite สำหรับ 50 users ดี แต่ 5,000 users อาจต้อง PostgreSQL

==================================================

## มุมมอง Business Owner

- ทางเลือกไหนถูกที่สุด? (cost-effective)
- ทางเลือกไหนเร็วที่สุด? (time to market)
- ทางเลือกไหนเสี่ยงน้อยที่สุด?
- ทางเลือกไหนรองรับการเปลี่ยนแปลงธุรกิจได้ดีที่สุด? (business agility — ความคล่องตัวทางธุรกิจ)
- ทางเลือกไหนให้ ROI (Return on Investment — ผลตอบแทนจากการลงทุน) ดีที่สุด?

## มุมมอง Solution Architect

- Design นี้ follow SOLID principles (หลักการออกแบบ 5 ข้อ: Single Responsibility, Open/Closed, Liskov Substitution, Interface Segregation, Dependency Inversion) หรือไม่?
- Coupling (การเชื่อมต่อระหว่าง components) สูงเกินไปไหม?
- Cohesion (ความเกี่ยวข้องกันของสิ่งที่อยู่ใน component เดียว) ดีพอไหม?
- มี abstraction layer (ชั้นนามธรรม — ชั้นที่ซ่อนรายละเอียดการทำงาน ให้ใช้งานง่าย) ตรงที่ควรมีไหม?
- Design นี้ testable (ทดสอบได้ง่าย) ไหม?
- มี separation between business logic กับ infrastructure (แยกส่วน business logic ออกจาก infrastructure) ไหม?

==================================================

## Red Flags — สัญญาณว่ายังไม่ผ่าน Gate นี้

- [ ] มีทางเลือกเดียว → ไม่ได้คิดทางอื่น
- [ ] ไม่มี tradeoff analysis
- [ ] ไม่มี data model
- [ ] ไม่มี API design (ถ้าต้องมี API)
- [ ] ไม่ได้คิดเรื่อง downstream impact
- [ ] ไม่ได้คิดเรื่อง backward compatibility
- [ ] ออกแบบ data model ก่อนเข้าใจ business requirements
- [ ] Design ไม่รองรับ scale ที่คาดไว้

## Output ที่ต้องได้ก่อนไปต่อ

- [ ] ทางเลือกอย่างน้อย 2 ทาง
- [ ] Tradeoff analysis ของแต่ละทาง
- [ ] Data model
- [ ] API design (ถ้ามี API)
- [ ] Downstream impact analysis
- [ ] Backward compatibility assessment
- [ ] Technical debt inventory (ถ้ามี)
- [ ] Scale assessment (design รองรับ 10x ได้ไหม)
