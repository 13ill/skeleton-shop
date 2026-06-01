# Gate Selector — เลือก Mode อัตโนมัติ

> AI ต้องเลือก mode ที่เหมาะสมก่อนเริ่มทุกครั้ง

---

## 🎯 หลักการ

**AI ต้องประเมินอัตโนมัติว่างานนี้ควรใช้ mode ไหน**

ห้าม user เลือกเอง (ยกเว้น user บอกชัดเจน)

---

## 🚪 4 Modes

| Mode | Gates | เวลา | ใช้เมื่อ |
|---|---|---|---|
| **Full Mode** | 0-9 (10 gates) | 2-4 ชม. | โปรเจกต์ใหม่ / งานสำคัญ / งานซับซ้อน |
| **Quick Mode** | 0,1,4,7 (4 gates) | 30-60 นาที | Feature เล็ก / เคยทำแล้ว / Low risk |
| **Hotfix Mode** | 0,7 (2 gates) | 10-20 นาที | Bug ด่วน / Production issue |
| **Owner Mode** | 0-9 + review | 4-8 ชม. | Business Critical / Payment/Auth/Data |

---

## 🔍 Auto-Detection Logic

```python
# Pseudo-code สำหรับ AI

if งานเกี่ยวกับ_Business_Critical_Areas():
    return "Owner Mode"  # บังคับ
    
elif งานเป็น_Production_Bug() and กระทบ_User():
    return "Hotfix Mode"  # แต่ต้อง Full Mode ทีหลัง
    
elif งานเป็น_New_Project() or งานเป็น_Architecture_Change():
    return "Full Mode"
    
elif งานเป็น_Feature_ใหม่() and ไม่เคยทำ():
    return "Full Mode"
    
elif งานเป็น_Feature_เล็ก() and เคยทำแล้ว() and Low_Risk():
    return "Quick Mode"
    
else:
    ถาม_User_ให้เลือก()
```

---

## 🚨 Owner Mode (บังคับ)

### Business Critical Areas

งานที่เกี่ยวกับ:
- **Payment** (การชำระเงิน)
- **Billing** (การเรียกเก็บเงิน)
- **Revenue** (รายได้)
- **Pricing** (การตั้งราคา)
- **Subscription** (การสมัครสมาชิก)
- **Authentication** (การยืนยันตัวตน)
- **Authorization** (การอนุญาต)
- **User Access Control** (การควบคุมการเข้าถึง)
- **Inventory** (สินค้าคงคลัง)
- **Order Processing** (การประมวลผลออเดอร์)
- **Customer Data** (ข้อมูลลูกค้า)
- **Production Data** (ข้อมูล production)
- **Compliance** (การปฏิบัติตามกฎหมาย)
- **Security** (ความปลอดภัย)

### System Critical Areas

- Architecture Changes
- Database Schema Changes
- Data Migration
- High-Risk Refactoring
- External Integrations
- Performance Optimization (ถ้ากระทบ user)
- Scalability Changes
- Infrastructure Changes
- Deployment Changes

### Operational Risk Areas

- Potential Data Loss
- Downtime Risk
- Rollback Complexity > High
- Monitoring Impact
- Incident Risk

**→ ต้องใช้ Owner Mode บังคับ ไม่มีข้อยกเว้น**

---

## 🔥 Hotfix Mode

### ใช้เมื่อ

- Production bug ที่กระทบ user
- System down
- Data corruption (แต่ต้อง escalate)
- Security vulnerability (แต่ต้อง escalate)
- Critical performance issue

### เงื่อนไข

- ✅ ใช้ได้ชั่วคราว
- ⚠️ ต้องทำ Full Mode ทีหลัง (สร้าง proper solution)
- 📝 ต้อง log investigation + decision

### Gates

- **Gate 0:** Symptom (อาการคืออะไร?)
- **Gate 7:** Fix (แก้ยังไง? rollback ได้ไหม?)

---

## ⚡ Quick Mode

### ใช้เมื่อ

- Feature เล็ก (< 1 วัน)
- เคยทำแล้ว (มี pattern)
- Low risk (ไม่กระทบระบบอื่น)
- ไม่เกี่ยวกับ Business Critical

### เงื่อนไข

- ✅ ไม่เปลี่ยน architecture
- ✅ ไม่เปลี่ยน database schema
- ✅ ไม่กระทบ production data
- ✅ Rollback ง่าย

### Gates

- **Gate 0:** Task Intake
- **Gate 1:** Business Understanding
- **Gate 4:** Solution Design
- **Gate 7:** Execution

---

## 🎯 Full Mode

### ใช้เมื่อ

- โปรเจกต์ใหม่
- Feature ใหม่ที่ไม่เคยทำ
- งานซับซ้อน (> 1 วัน)
- มี dependency หลายตัว
- กระทบระบบอื่น
- เปลี่ยน architecture
- Medium-High risk

### Gates ทั้งหมด

0. Task Intake
1. Business Understanding
2. System Understanding
3. Risk Discovery
4. Solution Design
5. Decision
6. Planning
7. Execution
8. Review
8.5. Architecture Change Review
9. Learning & Coaching

---

## 📋 ตัวอย่างการเลือก

### ตัวอย่าง 1: "ทำระบบ POS"

```
AI วิเคราะห์:
- โปรเจกต์ใหม่ ✅
- ไม่เคยทำ ✅
- ซับซ้อน ✅
- เกี่ยวกับ Order Processing (Business Critical) ✅

→ เลือก: Owner Mode
```

### ตัวอย่าง 2: "เพิ่มปุ่ม export CSV ในหน้า reports"

```
AI วิเคราะห์:
- Feature เล็ก ✅
- เคยทำ export แล้ว ✅
- Low risk ✅
- ไม่กระทบระบบอื่น ✅
- ไม่เกี่ยวกับ Business Critical ✅

→ เลือก: Quick Mode
```

### ตัวอย่าง 3: "Bug: user ล็อกอินไม่ได้"

```
AI วิเคราะห์:
- Production bug ✅
- กระทบ user ✅
- ด่วน ✅
- แต่เกี่ยวกับ Authentication (Business Critical) ⚠️

→ เลือก: Hotfix Mode (แก้ด่วน)
→ แต่ต้อง escalate + ทำ Owner Mode ทีหลัง
```

### ตัวอย่าง 4: "เพิ่ม feature ส่วนลด"

```
AI วิเคราะห์:
- Feature ใหม่ ✅
- เกี่ยวกับ Pricing (Business Critical) ✅

→ เลือก: Owner Mode
```

### ตัวอย่าง 5: "แก้ typo ในหน้า about"

```
AI วิเคราะห์:
- งานเล็กมาก ✅
- Low risk ✅
- ไม่กระทบระบบ ✅

→ เลือก: Quick Mode
```

---

## 🎯 AI ต้องทำ

### ขั้นที่ 1: วิเคราะห์งาน

```
งาน: [ชื่องาน]

วิเคราะห์:
- ประเภท: [New Project / Feature / Bug / Refactor]
- ขนาด: [Small / Medium / Large]
- ความซับซ้อน: [Low / Medium / High]
- ความเสี่ยง: [Low / Medium / High]
- Business Critical: [Yes / No]
- เคยทำแล้ว: [Yes / No]
```

### ขั้นที่ 2: เลือก Mode

```
ตาม logic:
- ถ้า Business Critical → Owner Mode
- ถ้า Production Bug → Hotfix Mode (+ escalate ถ้า critical)
- ถ้า New Project → Full Mode
- ถ้า Feature เล็ก + เคยทำ + Low Risk → Quick Mode
- อื่นๆ → Full Mode (default)
```

### ขั้นที่ 3: แจ้ง User

```
🎯 งาน: [ชื่องาน]

📊 วิเคราะห์:
- ประเภท: [X]
- ขนาด: [X]
- ความเสี่ยง: [X]
- Business Critical: [X]

🚪 Mode ที่เลือก: [Mode Name]

เหตุผล:
- [เหตุผล 1]
- [เหตุผล 2]

Gates ที่จะผ่าน: [รายการ]
เวลาโดยประมาณ: [X] ชม.

พร้อมเริ่มไหม?
```

---

## ⚠️ กรณีพิเศษ

### User บอก "ใช้ Quick Mode"

```
AI ต้องเช็คก่อน:
- ถ้างานเป็น Business Critical → ปฏิเสธ แนะนำ Owner Mode
- ถ้างานมี High Risk → เตือน แนะนำ Full Mode
- ถ้าผ่านเงื่อนไข Quick Mode → ตกลง
```

### User บอก "ข้าม Gate"

```
AI ต้อง:
- ถามเหตุผล
- เตือนความเสี่ยง
- ถ้า Business Critical → ปฏิเสธ
- ถ้าไม่ critical → ให้ user confirm + log decision
```

---

## 🎯 เป้าหมาย

Gate Selector ที่ดีทำให้:

1. **ไม่เสียเวลา** — ไม่ทำ Full Mode กับงานเล็ก
2. **ไม่เสี่ยง** — ไม่ทำ Quick Mode กับงานสำคัญ
3. **สมดุล** — ใช้ mode ที่เหมาะสมกับงาน

---

> **"Mode ที่ถูก = งานเสร็จเร็ว ไม่เสี่ยง"**
