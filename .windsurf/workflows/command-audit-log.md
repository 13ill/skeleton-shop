---
description: บันทึกทุกคำสั่งที่ผู้ใช้สั่ง + ความเข้าใจของ AI + Gap Analysis เพื่อปรับปรุงการสื่อสาร
---

# Command Audit Log — บันทึกและวิเคราะห์คำสั่ง

## วัตถุประสงค์

บันทึกทุกคำสั่งที่ผู้ใช้สั่ง AI ในแต่ละ session พร้อมแนบว่า AI เข้าใจอย่างไร เพื่อ:
- ศึกษาการสื่อสารระหว่างคนกับ AI
- ปรับแก้ภาษาให้คุยเป็นภาษาเดียวกัน
- สร้าง compact context ให้ AI เข้าใจภาษาคนมากขึ้นในครั้งถัดไป
- ย้อนศึกษาจุดที่เข้าใจผิดหรือตีความต่าง

## วิธีเรียกใช้

**ไม่ต้องสั่ง** — Always-on mode เปิดอัตโนมัติทุก session

AI จะเริ่มบันทึกทันทีเมื่อรับคำสั่งแรกของ session โดยไม่ต้องพิมพ์ `/command-audit-log` หรือสั่งอะไรเพิ่ม

ถ้าต้องการปิดชั่วคราว สั่ง: "ปิดบันทึกคำสั่ง"
ถ้าต้องการเปิดใหม่ สั่ง: "เปิดบันทึกคำสั่ง"

## โหมดการทำงาน

### Always-on (ค่าเริ่มต้น — บันทึกถาวร)

AI บันทึกอัตโนมัติทุก session โดยไม่ต้องสั่ง:
1. สร้างไฟล์ session log ทันทีเมื่อรับคำสั่งแรก
2. บันทึกทุกคำสั่งที่ผู้ใช้สั่ง โดยอัตโนมัติ
3. บันทึกความเข้าใจ การตีความ คำถามที่ถามกลับ และผลลัพธ์
4. ทำ Gap Analysis ทุก entry
5. สร้าง compact context summary ท้าย session

### การจบ session

เมื่อผู้ใช้สั่ง "จบ session" "สรุป session" หรือ session จบโดยธรรมชาติ AI จะ:
1. สรุปจำนวนคำสั่งทั้งหมด
2. วิเคราะห์ pattern ของ gap ที่พบบ่อย
3. สร้าง compact context สำหรับ AI ใช้ใน session ถัดไป
4. รวบรวมคำศัพท์ที่ทำให้สับสน พร้อมคำอธิบายที่ถูกต้อง
5. บันทึกลง compact context registry

## โครงสร้างไฟล์

### Core (ที่ `$OWNER_OS_PATH`)

```
$OWNER_OS_PATH/logs/command-audit/
  projects/
    [project-name]/sessions/            ← compact context ที่ push มาจากแต่ละโปรเจกต์
  compact-context/
    monthly-[YYYY-MM].md                 ← กลั่นจากทุกโปรเจกต์ในเดือนนั้น
    quarterly-[YYYY-QN].md               ← กลั่นจาก 3 เดือน
  registry/
    vocabulary.md                        ← คำศัพท์รวมจากทุกโปรเจกต์
  archive/
    (เก่ากว่า 1 ไตรมาส)
```

### Project (ในแต่ละโปรเจกต์)

```
[project-root]/logs/command-audit/
  sessions/
    session-[YYYY-MM-DD]-[HHmm].md      ← log แต่ละ session
  registry/
    vocabulary.md                        ← เฉพาะโปรเจกต์นี้
```

## ขั้นตอนการทำงาน

### ขั้นตอนที่ 1: Roll-forward + โหลด Core Context (Always-on)

เมื่อรับคำสั่งแรกของ session:

**1a. Roll-forward (เช็ค session เก่าที่ลืมปิด)**
1. สแกน `[project]/logs/command-audit/sessions/` หาไฟล์ล่าสุด
2. เช็คว่าไฟล์นั้นมี section "Compact Context" แล้วหรือไม่
3. ถ้ายังไม่มี → session เดิมลืมปิด:
   - อ่าน entries ทั้งหมดในไฟล์เก่า
   - สร้าง compact context จาก entries นั้น
   - **Push** ไป `$OWNER_OS_PATH/logs/command-audit/projects/[project-name]/sessions/`
   - อัปเดต Core Vocabulary
   - แจ้งผู้ใช้: "พบ session เก่าที่ยังไม่ปิด ปิดให้แล้ว"
4. ถ้าไม่มีไฟล์เก่า หรือปิดแล้ว → ข้ามไปขั้นตอนถัดไป

**1b. โหลด Core Context**
1. โหลด Core Quarterly ล่าสุดจาก `$OWNER_OS_PATH/logs/command-audit/compact-context/`
2. โหลด Core Monthly ล่าสุดจาก `$OWNER_OS_PATH/logs/command-audit/compact-context/`
3. โหลด Core Vocabulary จาก `$OWNER_OS_PATH/logs/command-audit/registry/vocabulary.md`
4. โหลด Project Vocabulary จาก `[project]/logs/command-audit/registry/vocabulary.md`
5. **เช็ค aggregation ค้าง:**
   - ดูว่าเดือนที่แล้วมี Core Monthly ไหม
   - ถ้าไม่มี → อ่าน compact context จาก `$OWNER_OS_PATH/logs/command-audit/projects/*/sessions/` ของเดือนนั้น → กลั่น → สร้าง Core Monthly
   - ถ้าครบ 3 เดือน → กลั่นเป็น Core Quarterly → archive เดือนเก่า
6. แจ้งผู้ใช้สั้น ๆ ว่าอ่าน context แล้ว

### ขั้นตอนที่ 2: เปิด Session Log

1. สร้างไฟล์ `[project]/logs/command-audit/sessions/session-[วันที่]-[เวลา].md`
2. ใช้ template จาก `$OWNER_OS_PATH/04-templates/command-audit-log-template.md`
3. กรอก session metadata (วันที่, เวลา, โปรเจกต์, AI agent)
4. เริ่ม Task Cluster A โดยอัตโนมัติ

### ขั้นตอนที่ 3: จัดกลุ่มคำสั่งเป็น Task Cluster

โครงสร้าง 3 ระดับ: **Entry → Task Cluster → Session**

- **Entry** = คำสั่งเดียวที่ผู้ใช้สั่ง
- **Task Cluster** = ชุดคำสั่งที่เกี่ยวข้องกัน (แก้แล้วแก้อีก, สั่งเพิ่ม, คนละขั้วแต่อยู่ใน task เดียวกัน)
- **Session** = ทั้ง session ที่อาจมีหลาย cluster

#### วิธีตัดสินใจว่าคำสั่งอยู่ cluster ไหน

แต่ละ entry ต้องระบุ **Relation to Previous**:

| ความสัมพันธ์ | ความหมาย | การจัด cluster |
|-------------|---------|---------------|
| **Iteration** | ปรับแก้จากคำสั่งก่อนหน้า | อยู่ cluster เดิม |
| **Correction** | แก้ที่ AI เข้าใจผิด | อยู่ cluster เดิม |
| **Addition** | เพิ่มรายละเอียด/ขอบเขต | อยู่ cluster เดิม |
| **Pivot** | เปลี่ยนทิศทางกลางทาง | cluster ใหม่ |
| **Unrelated** | ไม่เกี่ยวกับคำสั่งก่อนหน้า | cluster ใหม่ |

#### ประเภท Task Cluster

| Type | ความหมาย |
|------|---------|
| **Initial** | เริ่ม task ใหม่ |
| **Iteration** | แก้/ปรับ/เพิ่มจากคำสั่งก่อนหน้า |
| **Pivot** | เปลี่ยนทิศทางกลางทาง |
| **Parallel** | ทำงานคนละขั้วแต่อยู่ใน task เดียวกัน |

### ขั้นตอนที่ 4: บันทึกทุกคำสั่ง (Auto-log) + Auto-checkpoint

สำหรับทุกคำสั่งที่ผู้ใช้สั่ง บันทึก:

| ฟิลด์ | รายละเอียด |
|------|-----------|
| **Entry #** | ลำดับคำสั่งใน session |
| **Timestamp** | เวลาที่รับคำสั่ง |
| **Relation to Previous** | Iteration / Correction / Addition / Pivot / Unrelated |
| **Raw Command** | ข้อความที่ผู้ใช้พิมพ์เป๊ะ ๆ |
| **AI Interpretation** | AI เข้าใจว่าผู้ใช้ต้องการอะไร |
| **Reasoning/Assumptions** | การตีความ สมมติฐานที่ใช้ |
| **Clarifying Questions** | คำถามที่ถามกลับ (ถ้ามี) |
| **Action Taken** | สิ่งที่ AI ทำจริง |
| **Result/Output** | ผลลัพธ์ที่ได้ |
| **User Notes** | ช่องว่างให้ผู้ใช้แก้/เพิ่ม/อธิบาย |
| **Gap Analysis** | วิเคราะห์ช่องว่างความเข้าใจ |

**Auto-checkpoint (ทุก 20 entries):**
เมื่อ session log มี entries ครบ 20, 40, 60... → สร้าง **mini compact context** แนบท้าย session log:
- สรุป entries ในชุดนั้นสั้น ๆ
- เก็บ pattern และ gap ที่พบ
- ไม่ใช่ final compact context แต่เป็น checkpoint กันข้อมูลหาย
- เมื่อจบ session จริง ๆ → รวม mini compact context ทั้งหมดเป็น final

### ขั้นตอนที่ 5: Gap Analysis (ทุก entry)

วิเคราะห์:

```
Gap Analysis:
  User Intent:     สิ่งที่ผู้ใช้หมายถึงจริง ๆ
  AI Understanding: สิ่งที่ AI เข้าใจ
  Gap:             ส่วนต่างระหว่างสองสิ่ง
  Improvement:     ครั้งถัดไปควรสื่อสารอย่างไรให้ชัดขึ้น
  Vocabulary:      คำศัพท์ที่ทำให้สับสน + ความหมายที่ถูกต้อง
```

### ขั้นตอนที่ 6: Conversation Analysis & Recommendations

เมื่อจบ session ก่อนสร้าง compact context ให้วิเคราะห์:

1. **Flow ของการสนทนา** — สรุปว่าการสนทนาเป็นอย่างไรทั้ง session
2. **จุดที่สื่อสารได้ดี** — คำสั่งแบบไหนที่ AI เข้าใจได้ทันที
3. **จุดที่สื่อสารไม่ตรงกัน** — คำสั่งแบบไหนที่เกิด gap
4. **คำแนะนำสำหรับผู้ใช้** — จะสั่งงานให้ชัดขึ้นอย่างไร พร้อมตัวอย่าง before/after
5. **คำแนะนำสำหรับ AI** — จะเข้าใจผู้ใช้ดีขึ้นอย่างไร พร้อมเหตุผล
6. **Score การสื่อสาร** — คะแนน 4 มิติ (ชัดเจน, ตรงกัน, ประสิทธิภาพ, context เพียงพอ) รวม /20

### ขั้นตอนที่ 7: สรุปท้าย Session + Push ไป Core

เมื่อจบ session (ผู้ใช้บอก "จบ session" หรือ AI ตรวจพบว่า context ใกล้เต็ม) สร้าง:

1. **Cluster Summary** (ทุก cluster)
   - ภาพรวม cluster นี้ทำอะไร
   - จำนวนคำสั่งใน cluster
   - Evolution ของคำสั่ง (เริ่มกว้าง → แก้จุดเจาะจง → เปลี่ยนทิศ)
   - Gap ที่พบใน cluster
   - คำแนะนำเฉพาะ cluster (เช่น "ถ้าระบุ scope ตั้งแต่แรก จะลดเหลือ 1 รอบ")

2. **Session Analysis** (รวมทุก cluster)
   - จำนวน Task Cluster ทั้งหมด
   - จำนวนคำสั่งทั้งหมด
   - ความสัมพันธ์ระหว่าง cluster (เช่น "A สร้าง, B ปรับ, C ทำอย่างอื่น")
   - Cluster ที่มี gap มากสุด / สื่อสารดีสุด
   - Pattern ของ gap ที่พบบ่อย

3. **Compact Context** (สำหรับ AI session ถัดไป)
   - บทเรียนสั้น ๆ ที่ AI ควรจำ
   - คำศัพท์ที่ปรับปรุงแล้ว
   - แนวโน้มการสั่งงานของผู้ใช้
   - สิ่งที่ผู้ใช้ไม่ชอบ / สิ่งที่ผู้ใช้ต้องการ

4. **Vocabulary Update**
   - อัปเดต Project Vocabulary: `[project]/logs/command-audit/registry/vocabulary.md`
   - อัปเดต Core Vocabulary: `$OWNER_OS_PATH/logs/command-audit/registry/vocabulary.md`

5. **Push ไป Core**
   - คัดลอก compact context ไป `$OWNER_OS_PATH/logs/command-audit/projects/[project-name]/sessions/session-[วันที่]-[เวลา].md`
   - Core รู้เรื่อง session นี้ทันที ไม่ต้องรอเข้าโปรเจกต์อีก

### ขั้นตอนที่ 8: Aggregation + Distillation (เกิดตอนเริ่ม session ใหม่)

เมื่อเริ่ม session ใหม่ในโปรเจกต์ใด และพบว่ามีเดือนที่ยังไม่ถูก aggregate:

1. **Core Monthly Aggregation**
   - อ่าน compact context จาก `$OWNER_OS_PATH/logs/command-audit/projects/*/sessions/` ของเดือนเป้าหมาย
   - กลั่นตาม Distillation Rules (เก็บ pattern ซ้ำ, ทิ้งรายละเอียดเฉพาะ session)
   - ใช้ template จาก `$OWNER_OS_PATH/04-templates/core-monthly-template.md`
   - เก็บที่ `$OWNER_OS_PATH/logs/command-audit/compact-context/monthly-[YYYY-MM].md`

2. **Core Quarterly Distillation** (เมื่อครบ 3 Monthly)
   - กลั่น 3 Core Monthly เป็น 1 Core Quarterly
   - ใช้ template จาก `$OWNER_OS_PATH/04-templates/core-quarterly-template.md`
   - เก็บที่ `$OWNER_OS_PATH/logs/command-audit/compact-context/quarterly-[YYYY-QN].md`
   - ย้าย Monthly เก่าไป `archive/`

3. **ถ้าค้างหลายเดือน** — ทำทีละเดือนไล่จากเก่าไปใหม่

## กฎการบันทึก

1. **บันทึก raw command เป๊ะ ๆ** — ไม่แก้ ไม่สรุป ไม่ตัดทอน
2. **บันทึกความเข้าใจตามที่เกิดขึ้นจริง** — ไม่ย้อนแก้
3. **Gap Analysis ต้องตรงไปตรงมา** — ไม่ปกป้อง ไม่โทษ
4. **User Notes เป็นช่องว่าง** — ผู้ใช้แก้เอง ไม่ใช่ AI เติม
5. **Compact Context ต้องสั้นและใช้ได้จริง** — ไม่เกิน 1 หน้าต่อ session

## การใช้ Core Context ใน Session ถัดไป

เมื่อเริ่ม session ใหม่ AI โหลด (ไม่เกิน 2-3 หน้า):
1. **Core Quarterly ล่าสุด** — บทเรียนระดับสูง (1 หน้า)
2. **Core Monthly ล่าสุด** — เฉพาะเดือนนี้ (1 หน้า)
3. **Core Vocabulary** — คำศัพท์รวม
4. **Project Vocabulary** — เฉพาะโปรเจกต์นี้
5. ปรับการสื่อสารตามบทเรียน
6. แจ้งผู้ใช้สั้น ๆ ว่าอ่าน context แล้ว
