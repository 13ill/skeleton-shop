# Gate 2 — System Understanding: ทำความเข้าใจระบบ

## วัตถุประสงค์
ทำให้เข้าใจว่า **ระบบปัจจุบันเป็นอย่างไร** และ **ระบบใหม่ควรเป็นอย่างไร**
Gate นี้ป้องกันการออกแบบ "ลอยๆ" โดยไม่เข้าใจสภาพแวดล้อมจริง

> ปัญหาที่พบบ่อย: ออกแบบระบบใหม่โดยไม่เข้าใจระบบเดิม
> หรือเลือก tech stack ก่อนที่จะเข้าใจ requirements

==================================================

## คำถามที่ต้องถามตัวเอง

### 1. "Architecture ปัจจุบันเป็นอย่างไร?"
- **ทำไมต้องถาม**: ต้องรู้สิ่งที่มีอยู่ก่อน จะได้ออกแบบสิ่งใหม่ให้เข้ากัน
- **สิ่งที่ได้**: ภาพรวม architecture (สถาปัตยกรรม — โครงสร้างรวมของระบบว่าแต่ละส่วนเชื่อมต่อกันอย่างไร) ปัจจุบัน
- **สำหรับโปรเจกต์ใหม่**: ร่าง architecture เบื้องต้น — อย่างน้อยต้องมี high-level diagram (แผนภาพภาพรวม)
- **สำหรับโปรเจกต์เก่า**: โหลด architecture index, module map, dependency map ตามที่กำหนดใน Architecture Mode

### 2. "Components หลักมีอะไรบ้าง?"
- **ทำไมต้องถาม**: ต้องรู้ว่าระบบมี "ชิ้นส่วน" อะไร แต่ละชิ้นทำหน้าที่อะไร
- **สิ่งที่ได้**: รายชื่อ components (ส่วนประกอบ) + responsibility (หน้าที่) ของแต่ละตัว
- **คำอธิบาย**: Component คือส่วนย่อยของระบบที่ทำหน้าที่เฉพาะ เช่น Frontend, Backend API, Database, Message Queue, Cache
- **ตัวอย่าง**:
  - Frontend: Next.js → แสดงผลหน้าเว็บ
  - Backend: Express.js → จัดการ business logic + API
  - Database: PostgreSQL → เก็บข้อมูล
  - Cache: Redis → เก็บข้อมูลชั่วคราวเพื่อความเร็ว

### 3. "Data flow เป็นอย่างไร — ข้อมูลเดินทางจากไหนไปไหน?"
- **ทำไมต้องถาม**: ถ้าไม่เข้าใจ data flow จะพลาด edge cases (กรณีพิเศษ — สถานการณ์ที่ไม่ใช่ normal flow แต่เกิดขึ้นได้ในการใช้งานจริง)
- **สิ่งที่ได้**: Data flow diagram → เห็นว่าข้อมูลเดินทางผ่าน component ไหนบ้าง
- **ตัวอย่าง**: User กรอก form → Frontend ส่ง HTTP request → Backend validate → เก็บ DB → ส่ง response กลับ

### 4. "Tech stack ควรใช้อะไร — เลือกเพราะอะไร?"
- **ทำไมต้องถาม**: เลือก tech stack ที่ไม่เหมาะ → ปัญหาระยะยาว (performance, maintenance, hiring)
- **สิ่งที่ได้**: Tech stack + rationale (เหตุผล) ที่ชัดเจน
- **คำอธิบาย**: Tech stack (ชุดเทคโนโลยี) คือภาษา, framework, database, infrastructure ทั้งหมดที่ใช้ในโปรเจกต์
- **เกณฑ์เลือก**:
  - Team capability (ทีมใช้เป็นหรือเปล่า)
  - Community support (มีคนช่วยเยอะหรือเปล่า)
  - Maturity (เป็น technology ที่เสถียรแล้วหรือยัง)
  - Scale fitness (รองรับขนาดที่ต้องการได้ไหม)
  - Ecosystem (มี library / tool สนับสนุนเยอะไหม)

### 5. "External dependencies มีอะไรบ้าง?"
- **ทำไมต้องถาม**: ทุก external dependency (ระบบภายนอกที่ต้องพึ่งพา) คือความเสี่ยง — ถ้ามันล่มเราก็ล่ม
- **สิ่งที่ได้**: รายชื่อ dependencies + แผนรับมือถ้ามันไม่ทำงาน
- **ตัวอย่าง**: Payment gateway (Stripe), Email service (SendGrid), Cloud storage (S3), Authentication (Auth0)

### 6. "Non-functional requirements คืออะไร?"
- **ทำไมต้องถาม**: Performance, security, availability — สิ่งเหล่านี้กำหนด architecture
- **สิ่งที่ได้**: ข้อกำหนดที่ชัดเจน → ออกแบบให้ตรง
- **คำอธิบาย**: Non-functional requirements (NFRs — ความต้องการที่ไม่ใช่ feature) คือคุณสมบัติของระบบที่ไม่ใช่ "ทำอะไรได้" แต่เป็น "ทำได้ดีแค่ไหน"
- **ตัวอย่าง**:
  - Performance: response time ต้องไม่เกิน 200ms
  - Availability: uptime 99.9% (ระบบทำงาน 99.9% ของเวลา — หยุดได้ไม่เกิน 8.7 ชม./ปี)
  - Security: ข้อมูลส่วนบุคคลต้อง encrypt (เข้ารหัส)
  - Scalability: รองรับ concurrent users (ผู้ใช้พร้อมกัน) 1,000 คน

### 7. "Data model ควรเป็นอย่างไร?"
- **ทำไมต้องถาม**: Data model ที่ผิดจะ haunted (ตามหลอกหลอน) ไปตลอดอายุโปรเจกต์
- **สิ่งที่ได้**: โครงสร้างข้อมูลที่ตรงกับ business reality
- **คำอธิบาย**: Data model (โครงสร้างข้อมูล) คือการออกแบบว่า entity (สิ่งที่เราต้องเก็บข้อมูล เช่น user, order, product) มีอะไรบ้าง เชื่อมกันอย่างไร
- **ตัวอย่าง**: User → has many → Orders → has many → OrderItems → belongs to → Product

### 8. "Deployment environment เป็นอย่างไร?"
- **ทำไมต้องถาม**: dev/staging/production (สภาพแวดล้อมการ deploy) อาจต่างกัน ต้องออกแบบให้รองรับ
- **สิ่งที่ได้**: ความเข้าใจ infrastructure (โครงสร้างพื้นฐาน — servers, cloud, network ฯลฯ)
- **ตัวอย่าง**: Deploy บน AWS? VPS? Docker? Kubernetes? มี CI/CD (Continuous Integration / Continuous Deployment — ระบบ build + deploy อัตโนมัติ) หรือยัง?

==================================================

## มุมมอง Business Owner

- ต้นทุน infrastructure คิดเป็นเท่าไหร่ต่อเดือน?
- Tech stack ที่เลือกหาคนมาดูแลง่ายไหม? (hiring risk)
- ถ้าต้องเปลี่ยน vendor (ผู้ให้บริการ) ทำได้ง่ายหรือเปล่า? (vendor lock-in — การถูกล็อคอยู่กับผู้ให้บริการรายเดียว)
- ค่า license (ค่าลิขสิทธิ์) มีหรือไม่?
- Total cost of ownership (TCO — ต้นทุนรวมในการเป็นเจ้าของ ทั้ง dev + operation + maintenance) เป็นเท่าไหร่?

## มุมมอง Solution Architect

- Architecture pattern (รูปแบบสถาปัตยกรรม เช่น monolith, microservices, serverless) เหมาะกับ scale ที่คาดไว้ไหม?
- Separation of concerns (การแยกความรับผิดชอบ — แต่ละ component ทำแค่หน้าที่ของตัว) ดีพอไหม?
- มี single point of failure (จุดที่ถ้าพังจะพังทั้งระบบ) ตรงไหนบ้าง?
- Observability (ความสามารถในการตรวจสอบ — logging, monitoring, alerting) วางแผนอย่างไร?
- Data consistency (ความสอดคล้องของข้อมูล) จัดการอย่างไร ถ้ามีหลาย service?

==================================================

## Red Flags — สัญญาณว่ายังไม่ผ่าน Gate นี้

- [ ] ไม่มี architecture diagram แม้แต่แบบร่าง
- [ ] เลือก tech stack ก่อนเข้าใจ requirements
- [ ] ไม่รู้ data flow
- [ ] ไม่ระบุ external dependencies
- [ ] ไม่มี non-functional requirements
- [ ] ไม่มี data model
- [ ] ไม่รู้ deployment environment

## Output ที่ต้องได้ก่อนไปต่อ

- [ ] Architecture diagram (แม้เป็นแบบร่าง)
- [ ] รายชื่อ components + หน้าที่
- [ ] Data flow diagram
- [ ] Tech stack + เหตุผลที่เลือก
- [ ] External dependencies list
- [ ] Non-functional requirements
- [ ] Data model เบื้องต้น
- [ ] Deployment environment description
