# แผน Deployment — Hostatom Cloud VPS (SSD1 / 2GB)

เอกสารนี้เป็นแผนเตรียมการนำเว็บ (frontend React/Vite + backend Node/TypeScript + MySQL/MariaDB)
ขึ้น VPS ของ Hostatom โดยเน้น **ประหยัด + ปลอดภัย + ดูแลคนเดียวได้ไม่เหนื่อย**

> สถานะปัจจุบัน: มีร้านเดียว (single-tenant) — เริ่มเล็กก่อน เพิ่มทรัพยากรทีหลังได้

---

## 1. สเปคที่เลือก

| รายการ | ค่า |
|--------|-----|
| แพ็ค | Hostatom Cloud VPS **SSD1** |
| RAM | 2 GB |
| CPU | 1 vCore |
| Storage | 20 GB SSD |
| Network | 1 IP, 100 Mbps, Data Transfer ไม่จำกัด |
| ราคา | **290฿ / เดือน** |
| ลิงก์ | https://www.hostatom.com/cloud-vps |

**OS แนะนำ:** Ubuntu 22.04 LTS หรือ 24.04 LTS (รองรับยาว, เอกสารเยอะ, ดูแลง่าย)

---

## 2. ⚠️ ข้อจำกัดสำคัญของ 2GB (อ่านก่อน)

RAM 2GB ต้องแชร์ระหว่าง Node + MariaDB + Nginx/Caddy + ระบบปฏิบัติการ จึง **ตึง** ถ้าไม่วางแผน
หลักการสำคัญ 3 ข้อ:

1. **อย่า build บนเซิร์ฟเวอร์** — `vite build` กิน RAM เยอะ จะทำให้เครื่องค้าง
   → ให้ **build ที่เครื่องเรา** แล้วอัปโหลดเฉพาะไฟล์ผลลัพธ์ (`dist/`) ขึ้นไป
2. **ตั้ง Swap 2GB** — กันเครื่องดับเวลา RAM พีค (วิธีในข้อ 4.3)
3. **จูน MariaDB ให้ใช้ RAM น้อย** — ลด `innodb_buffer_pool_size` (ข้อ 4.5)

ด้วย 3 ข้อนี้ 2GB รองรับร้านเดียว + ทราฟฟิกระดับเล็ก-กลางได้สบาย

---

## 3. สถาปัตยกรรมบนเซิร์ฟเวอร์

```
                  อินเทอร์เน็ต
                       │
                  [ Caddy ]   ← reverse proxy + HTTPS อัตโนมัติ (Let's Encrypt)
                   /      \
        ไฟล์ static       /api/*
        (dist ของ React)   │
                      [ Node API ]  ← รันด้วย systemd หรือ PM2
                           │
                      [ MariaDB ]   ← bind เฉพาะ localhost (127.0.0.1)
                           │
                   /var/www/uploads  ← เก็บรูปสินค้า (ดิสก์ในเครื่อง)
```

**ทำไมใช้ Caddy แทน Nginx:** Caddy ต่อ HTTPS (SSL) ให้อัตโนมัติและต่ออายุเองตลอด
→ ลดงานดูแลของเราไปมาก (ไม่ต้องตั้ง certbot เอง) เหมาะกับคนทำงานคนเดียวที่สุด

### 3.1 🐳 Docker — ควรใช้ไหมบน 2GB?

**สรุป: 2GB ไม่เล็กเกินไปสำหรับ Docker** (daemon กินแค่ ~50–100MB) แต่มีเงื่อนไขและ trade-off

ข้อควรระวังบน 2GB:
1. **ห้าม build image บนเซิร์ฟเวอร์** — เปลือง RAM/ดิสก์มาก → build ที่เครื่องเรา/CI แล้ว push ขึ้น registry (เช่น GHCR/Docker Hub) หรือ `docker save/load`
2. **ดิสก์ 20GB เต็มง่าย** — layers/cache สะสม ต้อง `docker system prune -af` เป็นระยะ
3. ใช้ base image เล็ก เช่น `node:alpine`, `mariadb` official

Trade-off สำหรับคนทำงานคนเดียว:

| | Native (ค่าเริ่มต้นของแผนนี้) | Docker |
|---|---|---|
| ความง่าย/เบา ตอนเริ่ม | ✅ ง่ายกว่า เบากว่า | ต้องเรียนรู้เพิ่ม |
| RAM/ดิสก์ overhead | น้อยสุด | มีเล็กน้อย |
| ย้าย/ขยายทีหลัง | ตั้งใหม่ | ✅ ก๊อปไปรันที่ไหนก็ได้ |
| ทำ multi-tenant SaaS ทีหลัง | ยุ่งกว่า | ✅ ได้เปรียบมาก |
| reproducible | ❌ | ✅ |

**คำแนะนำ (ทางสายกลาง):** เขียน `Dockerfile` + `docker-compose.yml` **เตรียมไว้ตั้งแต่แรก**
แต่ช่วงแรก:
- ถ้าคุ้น Docker อยู่แล้ว → ใช้ Docker เลย (compose จัดการ API + MariaDB พร้อมกัน + ปูทาง multi-tenant)
- ถ้ายังไม่คุ้น → เริ่ม **native ก่อน** (เบากว่า) แล้วค่อยย้ายเข้า Docker ตอนขยับไป 4GB/หลายร้าน

ตัวอย่างโครง `docker-compose.yml` (เมื่อพร้อมใช้ Docker):
```yaml
services:
  api:
    image: ghcr.io/<user>/shop-api:latest   # build จากเครื่องเรา/CI แล้ว push
    restart: always
    env_file: .env
    depends_on: [db]
    volumes:
      - ./uploads:/app/uploads
  db:
    image: mariadb:11
    restart: always
    environment:
      MARIADB_DATABASE: shop
      MARIADB_USER: shop_app
      MARIADB_PASSWORD: ${DB_PASSWORD}
      MARIADB_ROOT_PASSWORD: ${DB_ROOT_PASSWORD}
    command: --innodb-buffer-pool-size=256M --max-connections=50
    volumes:
      - dbdata:/var/lib/mysql
volumes:
  dbdata:
```
> ใช้ Caddy เป็น reverse proxy หน้าสุดเหมือนเดิม (จะรันใน compose หรือ native ก็ได้)
> และยังคงต้องตั้ง Swap + จูน MariaDB เหมือนหัวข้อ 4 อยู่ดี

---

## 4. ขั้นตอนเตรียม VPS (ทำครั้งเดียวตอนเริ่ม)

### 4.1 สั่งซื้อ + เข้าเครื่องครั้งแรก
1. สั่งซื้อ SSD1, เลือก OS Ubuntu LTS
2. รับ IP + รหัสผ่าน root ทางอีเมล
3. ล็อกอินครั้งแรก: `ssh root@<IP>`

### 4.2 อัปเดตระบบ + สร้างผู้ใช้ใหม่ (ห้ามใช้ root ตรงๆ)
```bash
apt update && apt upgrade -y
adduser deploy
usermod -aG sudo deploy
```

### 4.3 ตั้ง Swap 2GB (สำคัญสำหรับ 2GB RAM)
```bash
fallocate -l 2G /swapfile
chmod 600 /swapfile
mkswap /swapfile && swapon /swapfile
echo '/swapfile none swap sw 0 0' >> /etc/fstab
```

### 4.4 ติดตั้ง Node.js (LTS) + MariaDB + Caddy
```bash
# Node.js LTS (ผ่าน NodeSource)
curl -fsSL https://deb.nodesource.com/setup_lts.x | sudo -E bash -
sudo apt install -y nodejs

# MariaDB
sudo apt install -y mariadb-server
sudo mysql_secure_installation   # ตั้งรหัส root, ลบ test db, ปิด remote root

# Caddy
sudo apt install -y debian-keyring debian-archive-keyring apt-transport-https curl
# (ตามคู่มือ caddyserver.com/docs/install สำหรับ apt repo)
```

### 4.5 จูน MariaDB ให้กิน RAM น้อย
แก้ไฟล์ `/etc/mysql/mariadb.conf.d/50-server.cnf` เพิ่ม/ปรับ:
```ini
[mysqld]
innodb_buffer_pool_size = 256M
max_connections = 50
bind-address = 127.0.0.1   # เปิดรับเฉพาะในเครื่อง ห้ามเปิดสู่ภายนอก
```

### 4.6 สร้าง database + user สำหรับแอป
```sql
CREATE DATABASE shop CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'shop_app'@'localhost' IDENTIFIED BY '<รหัสยาวสุ่ม>';
GRANT ALL PRIVILEGES ON shop.* TO 'shop_app'@'localhost';
FLUSH PRIVILEGES;
```
> ใช้ `utf8mb4` เพื่อรองรับภาษาไทย + อิโมจิ ครบ (กันปัญหา encoding ที่เคยเจอ)

---

## 5. 🔒 ความปลอดภัย (Security Checklist)

> ตอบคำถาม "ปลอดภัยมั้ย?": **ปลอดภัยได้ ถ้าทำตาม checklist นี้** VPS ที่ถูกแฮ็กส่วนใหญ่
> มาจาก SSH รหัสอ่อน + ไม่อัปเดต + เปิดพอร์ตเกินจำเป็น ซึ่งป้องกันได้ทั้งหมด

| # | มาตรการ | ทำไม | ภาระดูแล |
|---|---------|------|----------|
| 1 | **SSH key อย่างเดียว** ปิด login ด้วยรหัสผ่าน | กันการเดารหัส (brute force) | ตั้งครั้งเดียว |
| 2 | **ปิด root login** ทาง SSH | ลดเป้าโจมตี | ตั้งครั้งเดียว |
| 3 | **เปลี่ยนพอร์ต SSH** (เช่น 2222) | ลด bot สแกน | ตั้งครั้งเดียว |
| 4 | **Firewall (ufw)** เปิดเฉพาะ SSH/80/443 | ปิดช่องทางเข้าที่ไม่จำเป็น | ตั้งครั้งเดียว |
| 5 | **fail2ban** | แบน IP ที่พยายามเดารหัสอัตโนมัติ | ตั้งครั้งเดียว |
| 6 | **unattended-upgrades** | อัปเดตแพตช์ความปลอดภัย **อัตโนมัติ** | ตั้งครั้งเดียว |
| 7 | **MariaDB bind 127.0.0.1** | DB ห้ามเปิดสู่อินเทอร์เน็ต | ตั้งครั้งเดียว |
| 8 | **HTTPS** (Caddy auto) | เข้ารหัสข้อมูล | อัตโนมัติ |
| 9 | **เก็บ secret ใน `.env`** ไม่ commit ขึ้น git | กันรหัสหลุด | ทุกครั้งที่เพิ่ม config |
| 10 | **รหัส DB/แอดมิน ยาว+สุ่ม** | กันการเดา | ตั้งครั้งเดียว |

คำสั่งตั้งค่าหลัก:
```bash
# Firewall
sudo ufw allow 2222/tcp   # SSH (พอร์ตที่เปลี่ยน)
sudo ufw allow 80,443/tcp
sudo ufw enable

# fail2ban + auto updates
sudo apt install -y fail2ban unattended-upgrades
sudo dpkg-reconfigure -plow unattended-upgrades

# แก้ /etc/ssh/sshd_config:
#   PermitRootLogin no
#   PasswordAuthentication no
#   Port 2222
sudo systemctl restart ssh
```

**เสริม (ถ้าต้องการ):** Hostatom มี **Imunify360** ขายเสริม — ช่วยสแกนมัลแวร์/ป้องกันอัตโนมัติ
เหมาะถ้าไม่อยากดูแล security เองมาก (แต่ checklist ข้างบนก็เพียงพอแล้วสำหรับเริ่มต้น)

---

## 6. 💾 Backup & กู้คืน (สำคัญที่สุดสำหรับคนทำงานคนเดียว)

> ถ้ามีแค่ backup ที่ดี ต่อให้เครื่องพังหรือโดนแฮ็ก ก็กู้กลับมาได้ใน 1 ชม.

**สิ่งที่ต้อง backup:** (1) database (2) โฟลเดอร์รูป `uploads/` (3) ไฟล์ `.env`

แผน backup อัตโนมัติ (cron รายวัน):
```bash
# /etc/cron.daily/backup-shop  (ทำให้ executable)
mysqldump -u shop_app -p'<รหัส>' shop | gzip > /backup/db-$(date +%F).sql.gz
tar czf /backup/uploads-$(date +%F).tar.gz /var/www/uploads
find /backup -mtime +14 -delete   # เก็บย้อนหลัง 14 วัน
```

**สำคัญ:** อย่าเก็บ backup ไว้ในเครื่องเดียวอย่างเดียว — ส่งออกไปที่อื่นด้วย เช่น
- `rclone` ไป Google Drive / object storage (ฟรี-ถูก)
- หรือ Hostatom มีบริการ Backup/Disaster Recovery เสริม

---

## 7. 📊 Monitoring (รู้ก่อนเครื่องล่ม)

| เครื่องมือ | ใช้ทำอะไร | ราคา |
|-----------|-----------|------|
| **UptimeRobot** | เตือนทางอีเมล/LINE เมื่อเว็บล่ม | ฟรี |
| `htop` / `df -h` | เช็ก RAM/CPU/ดิสก์ ด้วยตัวเอง | ฟรี |
| Caddy/ระบบ logs | ดู error เวลามีปัญหา | ฟรี |

ตั้ง UptimeRobot ให้ ping เว็บทุก 5 นาที — ถ้าล่มจะได้รู้ทันทีไม่ต้องเฝ้าเอง

---

## 8. การ deploy แอป (รอบปกติ)

เพราะ 2GB build บนเซิร์ฟไม่ไหว → ใช้วิธี **build ที่เครื่องเรา แล้วส่งขึ้น**

```bash
# ที่เครื่องเรา
npm run build                      # ได้โฟลเดอร์ dist/
rsync -avz dist/ deploy@<IP>:/var/www/shop/    # ส่ง frontend
rsync -avz backend/ deploy@<IP>:/var/www/api/  # ส่ง backend (ถ้ามี node_modules ให้ npm ci บนเซิร์ฟ)

# ที่เซิร์ฟเวอร์
cd /var/www/api && npm ci --omit=dev
npx prisma migrate deploy          # อัปเดต schema database
sudo systemctl restart shop-api    # รีสตาร์ท Node
```

> ภายหลังถ้าอยากสบายขึ้น ตั้ง **GitHub Actions** ให้ deploy อัตโนมัติเมื่อ push ได้

### 8.1 Rollback (ถ้า deploy แล้วพัง)
- เก็บโฟลเดอร์เวอร์ชันเก่าไว้ก่อนทับ เช่น `mv /var/www/shop /var/www/shop.bak`
  → ถ้าพังให้ย้ายกลับ แล้ว `systemctl restart shop-api`
- **DB migration**: Prisma ไม่ rollback อัตโนมัติ → ก่อน migrate ทุกครั้งให้ backup DB ก่อน (ข้อ 6)
  ถ้าพังให้กู้ DB จาก backup ล่าสุด
- กฎง่ายๆ: **backup ก่อน deploy เสมอ** โดยเฉพาะเมื่อมีการเปลี่ยน schema

### 8.2 ขั้นตอนชี้โดเมน (DNS)
1. จดโดเมน (ที่ Hostatom หรือที่ไหนก็ได้)
2. ตั้ง A record: `yourdomain.com` → `<IP ของ VPS>`
3. (เผื่อ SaaS อนาคต) ตั้ง wildcard: `*.yourdomain.com` → `<IP>`
4. รอ DNS propagate (ไม่กี่นาที–ชม.) แล้ว Caddy จะออก HTTPS ให้อัตโนมัติ

---

## 9. 💵 ค่าใช้จ่ายรวมโดยประมาณ

| รายการ | ราคา |
|--------|------|
| VPS SSD1 (2GB) | 290฿/เดือน |
| โดเมน (.com) | ~350–500฿/ปี (~30–40฿/เดือน) |
| HTTPS (Let's Encrypt ผ่าน Caddy) | ฟรี |
| Monitoring (UptimeRobot) | ฟรี |
| Backup ไป Google Drive | ฟรี (โควตาฟรี) |
| **รวม** | **~320–330฿/เดือน** |

---

## 10. 🛠️ ภาระการดูแล — "เหนื่อยมั้ย ถ้าทำคนเดียว?"

**คำตอบตรงๆ:** ตอนตั้งครั้งแรกใช้เวลา ~ครึ่งวัน–1 วัน หลังจากนั้น **เบามาก** ถ้าทำ automation ตามแผนนี้

| งาน | ความถี่ | เวลา | อัตโนมัติได้ไหม |
|-----|---------|------|----------------|
| อัปเดตความปลอดภัย OS | – | – | ✅ อัตโนมัติ (unattended-upgrades) |
| ต่ออายุ HTTPS | – | – | ✅ อัตโนมัติ (Caddy) |
| Backup | รายวัน | – | ✅ อัตโนมัติ (cron) |
| เฝ้าดูเว็บล่ม | – | – | ✅ อัตโนมัติ (UptimeRobot) |
| เช็กสุขภาพเครื่อง (RAM/ดิสก์) | เดือนละครั้ง | ~10 นาที | กึ่งอัตโนมัติ |
| Deploy เวอร์ชันใหม่ | ตามที่แก้โค้ด | ~5 นาที | ตั้ง CI/CD ได้ |
| รีบูต/อัปเกรด kernel | นานๆ ครั้ง | ~10 นาที | manual |

**สรุป:** หลังตั้งเสร็จ เฉลี่ย **~30 นาที/เดือน** ถือว่าไหวสบายสำหรับคนเดียว
จุดที่ต้องใส่ใจจริงๆ มีแค่ 2 อย่าง: **(1) backup ต้องเวิร์กจริง** (ทดสอบกู้คืนสักครั้ง)
และ **(2) ทำ security checklist ให้ครบ**

### ถ้าไม่อยากดูแล server เองเลย (ทางเลือกสำรอง)
ถ้ารู้สึกว่าดูแล Linux เองไม่ไหว มีทางเลือกที่ "เกือบไม่ต้องดูแล server":
- **PaaS** เช่น Railway / Render / Fly.io — push โค้ดแล้ว deploy ให้, มี managed MySQL
  → ข้อดี: ไม่ต้องดูแล OS/security/backup เอง | ข้อเสีย: แพงกว่าเมื่อโตขึ้น, จ่ายเป็น USD
- เหมาะถ้าอยากโฟกัสที่โค้ดล้วนๆ ช่วงแรก แล้วค่อยย้ายมา VPS ตอนคุมต้นทุน

---

## 11. 📈 แผนขยายในอนาคต (เมื่อลูกค้าเยอะขึ้น)

1. **เพิ่ม RAM/CPU** — Hostatom อัปเกรดแพ็คได้ (SSD2 4GB / SSD3 8GB) ข้อมูลอยู่ครบ
2. **แยก database ออกเครื่องต่างหาก** เมื่อร้านเยอะ
3. **ทำ wildcard subdomain** (`*.yoursite.com`) สำหรับโหมด SaaS หลายร้าน
4. **ย้ายรูปไป Object Storage (S3)** เมื่อรูปเยอะจนดิสก์ 20GB ไม่พอ
5. พิจารณา **Coolify** (self-hosted PaaS) เมื่อ RAM ≥ 4GB เพื่อจัดการ deploy ง่ายขึ้น

---

## ✅ Checklist เริ่มงาน (ลำดับลงมือ)
- [ ] สั่งซื้อ VPS SSD1 + เลือก Ubuntu LTS
- [ ] สร้าง user `deploy`, ตั้ง SSH key, ปิด root/password login, เปลี่ยนพอร์ต SSH
- [ ] ตั้ง Swap 2GB + ufw + fail2ban + unattended-upgrades
- [ ] ติดตั้ง Node LTS + MariaDB (จูน RAM) + Caddy
- [ ] สร้าง database `shop` (utf8mb4) + user
- [ ] ตั้ง cron backup + ส่งออกนอกเครื่อง (rclone)
- [ ] ตั้ง UptimeRobot
- [ ] จดโดเมน + ชี้ DNS มาที่ IP
- [ ] Deploy แอปรอบแรก + ทดสอบกู้คืน backup 1 ครั้ง
