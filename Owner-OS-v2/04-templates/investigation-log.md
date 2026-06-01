# Investigation Log Template

> บันทึกการสืบค้นปัญหา

---

## 📝 Template

```yaml
---
investigation_id: INV-XXX
date: YYYY-MM-DD
symptom: [อาการที่พบ]
priority: [High / Medium / Low]
status: [Investigating / Root Cause Found / Resolved]
---

## Symptom (อาการ)

[อาการที่พบ - อธิบายให้ชัดเจน]

## Impact (ผลกระทบ)

[กระทบอะไรบ้าง]
- User: [กระทบ user ไหม]
- Business: [กระทบธุรกิจไหม]
- System: [กระทบระบบอื่นไหม]

## Reproduce Steps (ขั้นตอนทำซ้ำ)

1. [ขั้นตอนที่ 1]
2. [ขั้นตอนที่ 2]
3. [ขั้นตอนที่ 3]

**Expected:** [ผลลัพธ์ที่คาดหวัง]
**Actual:** [ผลลัพธ์ที่เกิดขึ้นจริง]

## Investigation Steps (ขั้นตอนการสืบค้น)

### Step 1: [ชื่อขั้นตอน]
- **ทำอะไร:** [...]
- **พบอะไร:** [...]
- **สรุป:** [...]

### Step 2: [ชื่อขั้นตอน]
- **ทำอะไร:** [...]
- **พบอะไร:** [...]
- **สรุป:** [...]

## Root Cause (สาเหตุที่แท้จริง)

[สาเหตุที่แท้จริงคืออะไร]

## Why It Happened (ทำไมถึงเกิด)

[วิเคราะห์ว่าทำไมถึงเกิด]

## Solution (วิธีแก้)

[วิธีแก้ปัญหา]

## Prevention (การป้องกัน)

[จะป้องกันยังไงครั้งหน้า]

## Related Issues

[ถ้ามี issues ที่เกี่ยวข้อง]

## Tags

[tags สำหรับค้นหา]
```

---

## 🎯 ตัวอย่าง

### Investigation 1: Payment Failed

```yaml
---
investigation_id: INV-001
date: 2026-06-01
symptom: Payment failed with error "Invalid card"
priority: High
status: Resolved
---

## Symptom

User ไม่สามารถชำระเงินได้ แสดง error "Invalid card"
แม้ว่าบัตรถูกต้อง

## Impact

- User: ไม่สามารถซื้อสินค้าได้
- Business: สูญเสียรายได้
- System: Payment gateway ไม่ทำงาน

## Reproduce Steps

1. เข้าหน้า checkout
2. กรอกข้อมูลบัตร (4242 4242 4242 4242)
3. กด "Pay"
4. แสดง error "Invalid card"

**Expected:** Payment สำเร็จ
**Actual:** แสดง error "Invalid card"

## Investigation Steps

### Step 1: เช็ค Stripe Dashboard
- **ทำอะไร:** เข้า Stripe Dashboard ดู logs
- **พบอะไร:** ไม่มี request เข้ามาเลย
- **สรุป:** Request ไม่ถึง Stripe

### Step 2: เช็ค Network Tab
- **ทำอะไร:** เปิด Chrome DevTools ดู Network
- **พบอะไร:** Request ถูก block โดย CORS
- **สรุป:** CORS configuration ผิด

### Step 3: เช็ค Backend CORS Config
- **ทำอะไร:** ดู CORS configuration ใน backend
- **พบอะไร:** ไม่ได้ whitelist domain ของ frontend
- **สรุป:** ต้องเพิ่ม domain ใน whitelist

## Root Cause

CORS configuration ไม่ได้ whitelist domain ของ frontend

## Why It Happened

Deploy frontend ไปที่ domain ใหม่ แต่ลืมอัปเดต CORS config

## Solution

เพิ่ม domain ใน CORS whitelist:

```typescript
const corsOptions = {
  origin: [
    'https://old-domain.com',
    'https://new-domain.com' // เพิ่มบรรทัดนี้
  ]
}
```

## Prevention

- เพิ่ม CORS config ใน environment variables
- เพิ่ม checklist: "อัปเดต CORS config เมื่อ deploy domain ใหม่"
- เพิ่ม monitoring: alert เมื่อมี CORS errors

## Related Issues

ไม่มี

## Tags

#payment #cors #production-bug #high-priority
```

---

## 💡 Tips

### เมื่อไหร่ควรเขียน Investigation Log

- ✅ เมื่อเจอ bug ที่ซับซ้อน
- ✅ เมื่อต้องสืบค้นนาน
- ✅ เมื่อหา root cause ได้
- ✅ เมื่ออยากให้คนอื่นเรียนรู้

### Investigation Best Practices

1. **บันทึกทุกขั้นตอน**
   - ทำอะไร
   - พบอะไร
   - สรุปอะไร

2. **หา root cause**
   - อย่าแก้แค่อาการ
   - หาสาเหตุที่แท้จริง

3. **วางแผนป้องกัน**
   - จะป้องกันยังไงครั้งหน้า
   - เพิ่ม tests
   - เพิ่ม monitoring

---

> **"สืบค้นให้ถึง root cause = แก้ได้ถาวร"**
