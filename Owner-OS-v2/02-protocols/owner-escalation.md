# Owner Escalation Protocol

> งานบางอย่างต้อง escalate ให้ owner ตัดสินใจเอง

---

## 🚨 Business Critical Areas (บังคับ escalate)

งานที่เกี่ยวกับ:

### การเงิน (Financial)
- Payment (การชำระเงิน)
- Billing (การเรียกเก็บเงิน)
- Revenue (รายได้)
- Pricing (การตั้งราคา)
- Subscription (การสมัครสมาชิก)
- Refund (การคืนเงิน)

### ความปลอดภัย (Security)
- Authentication (การยืนยันตัวตน)
- Authorization (การอนุญาต)
- User Access Control (การควบคุมการเข้าถึง)
- Encryption (การเข้ารหัส)
- Security Vulnerability (ช่องโหว่ด้านความปลอดภัย)

### ข้อมูล (Data)
- Customer Data (ข้อมูลลูกค้า)
- Production Data (ข้อมูล production)
- Data Migration (การย้ายข้อมูล)
- Data Loss Risk (ความเสี่ยงสูญเสียข้อมูล)

### ธุรกิจ (Business Operations)
- Inventory (สินค้าคงคลัง)
- Order Processing (การประมวลผลออเดอร์)
- Compliance (การปฏิบัติตามกฎหมาย)

---

## 🏗️ System Critical Areas

- Architecture Changes
- Database Schema Changes
- Data Migration
- High-Risk Refactoring
- External Integrations
- Performance Optimization (ถ้ากระทบ user)
- Scalability Changes
- Infrastructure Changes
- Deployment Changes

---

## ⚠️ Operational Risk Areas

- Potential Data Loss
- Downtime Risk
- Rollback Complexity > High
- Monitoring Impact
- Incident Risk

---

## 🎯 เมื่อ trigger Owner Escalation

AI ต้องทำ:

1. **STOP implementation review**
2. **Switch to Owner Review Mode**
3. **ถาม 10 คำถาม**
4. **สร้าง Owner Decision Summary**
5. **รอ owner confirm**

---

> **"งานสำคัญต้อง owner ตัดสินใจเอง"**
