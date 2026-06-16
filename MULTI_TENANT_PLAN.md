# Multi-Tenant System Plan

## Business Model
- **Pricing:** รายปี (Yearly subscription)
- **Target:** ร้านทั่วไป (General stores)
- **Scale:** 3-4 ร้านในปีแรก
- **Customization:** Theme + Feature
- **Support:** Chat

## Architecture
**Shared Database** (Recommended for 3-4 stores)
- ✅ ง่ายต่อการ maintain
- ✅ ค่าใช้จ่ายต่ำ
- ✅ Performance ยังไม่เป็นปัญหา
- ✅ สามารถย้ายไป Database per Tenant ได้เมื่อ scale ขึ้น

---

## Deployment Strategy

### Current Situation
- **Jump-1:** E-commerce showcase website (no online payments)
- **POS:** Point of sale system for motorcycle repair shop
- **Traffic:** 10-30 customers/day (low traffic)
- **Target:** MVP launch, fast deployment
- **Region:** Thailand

### Recommended Deployment: Managed Services (Option 3 - Hybrid)

#### Architecture
```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                        │
│                      Vercel (Free)                         │
│                      99.9% uptime                           │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┴────────────┐
        ▼                         ▼
┌──────────────────┐    ┌──────────────────┐
│  Jump-1 API      │    │   POS API        │
│  Railway (Free)  │    │  Railway (Free)  │
│  512MB RAM       │    │  512MB RAM       │
└────────┬─────────┘    └────────┬─────────┘
         │                      │
         └──────────┬───────────┘
                    ▼
         ┌──────────────────────┐
│   Shared Database    │
│  Supabase (Free)    │
│  500MB DB           │
│  Auto-backup enabled │
└──────────────────────┘
```

#### Cost Analysis
- **MVP Stage:** $0/month (all free tiers)
- **Growth Stage (50-100 users/day):** ~$5-10/month (Railway upgrade)
- **Scale Stage (100-500 users/day):** ~$30-35/month (Railway $5 + Supabase $25)

#### Risk Mitigation
- **Downtime Risk:** 3/10 (low with mitigation)
  - Standby backend on Render
  - Uptime monitoring (UptimeRobot)
  - Auto-backup enabled
- **Data Loss Risk:** 2/10 (very low)
  - Daily database backups
  - Git version control
  - Data validation
- **Cost Creep Risk:** 2/10 (low)
  - Budget alerts
  - Usage monitoring
  - Predictable scaling

#### Migration to VPS 4GB (When Scale Increases)

**When to Migrate:**
- 100+ users/day
- 50+ stores
- Database > 500MB
- Need more control

**Migration Difficulty:** 6/10 (moderate)

**Migration Steps:**

1. **Prepare VPS Environment**
   ```bash
   # Install Node.js
   curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
   
   # Install PostgreSQL
   sudo apt update
   sudo apt install postgresql postgresql-contrib
   
   # Install Nginx
   sudo apt install nginx
   
   # Install PM2 (process manager)
   npm install -g pm2
   ```

2. **Setup Database**
   ```bash
   # Create database
   sudo -u postgres createdb jump1
   
   # Import data from Supabase
   pg_dump -h db.xxx.supabase.co -U postgres -d postgres > backup.sql
   psql -U postgres -d jump1 < backup.sql
   ```

3. **Deploy Backend**
   ```bash
   # Clone repository
   git clone <repo-url>
   cd jump-1/backend
   
   # Install dependencies
   npm install
   
   # Build
   npm run build
   
   # Run with PM2
   pm2 start npm --name "backend" -- start
   pm2 save
   pm2 startup
   ```

4. **Deploy Frontend**
   ```bash
   # Build for production
   npm run build
   
   # Serve with Nginx
   sudo cp -r dist/* /var/www/html
   sudo nginx -t
   sudo systemctl restart nginx
   ```

5. **Update DNS**
   - Point domain to VPS IP
   - Configure SSL with Let's Encrypt
   - Test deployment

6. **Monitor & Optimize**
   - Setup monitoring (PM2 monitoring)
   - Configure log rotation
   - Setup auto-backup scripts
   - Test failover

**Migration Timeline:** 1-2 days

**Rollback Plan:**
- Keep Railway/Render running during migration
- Switch DNS back if issues
- Database replication during migration
- Test thoroughly before DNS switch

**Data Migration:**
- ✅ Easy: Database export/import (pg_dump)
- ✅ Reliable: PostgreSQL to PostgreSQL
- ✅ Fast: 30-60 minutes for 500MB database
- ✅ Safe: Can rollback if issues

**Application Migration:**
- ✅ Easy: Same codebase, just different deployment
- ✅ Reliable: PM2 ensures process stays running
- ✅ Fast: 1-2 hours for full deployment
- ✅ Safe: Can rollback to Railway if issues

**Domain Migration:**
- ✅ Easy: DNS change (propagates in minutes)
- ✅ Reliable: DNS is standard protocol
- ✅ Fast: 5-10 minutes for DNS propagation
- ✅ Safe: Can switch back if issues

**Configuration Migration:**
- ✅ Easy: Environment variables
- ✅ Reliable: Same .env structure
- ✅ Fast: 10-20 minutes
- ✅ Safe: Can copy back from Railway

**Overall Migration Assessment:**
- **Difficulty:** 6/10 (moderate)
- **Time:** 1-2 days
- **Risk:** 3/10 (low with proper planning)
- **Rollback:** Easy (keep old services running)
- **Data Loss Risk:** Very low (backup everything first)

**Why Migration is Easy:**
1. Same technology stack (Node.js, PostgreSQL)
2. Same codebase (no rewriting needed)
3. Standard tools (pm2, nginx, postgres)
4. Well-documented migration paths
5. Can test thoroughly before switch
6. Can rollback quickly if issues

**Pre-Migration Checklist:**
- [ ] Backup database from Supabase
- [ ] Backup code from Git
- [ ] Test deployment on VPS locally
- [ ] Setup monitoring on VPS
- [ ] Prepare rollback plan
- [ ] Notify users of maintenance window
- [ ] Test rollback procedure

**Post-Migration Checklist:**
- [ ] Verify all services running
- [ ] Test database connectivity
- [ ] Test API endpoints
- [ ] Test frontend functionality
- [ ] Monitor performance
- [ ] Check logs for errors
- [ ] Verify backup scripts working
- [ ] Update documentation

**Cost Comparison:**
- **Managed Services (at scale):** ~$30-35/month
- **VPS 4GB:** ~$10-15/month
- **Savings:** ~$15-25/month
- **Trade-off:** More maintenance work

**When VPS 4GB is Better:**
- 100+ users/day
- 50+ stores
- Need more control
- Want to save costs
- Have DevOps skills/time

**When Managed Services are Better:**
- < 100 users/day
- < 50 stores
- Don't want to manage server
- Want fast deployment
- Want automatic scaling

---

## Phase 1: Foundation (Multi-tenant) - 2-3 สัปดาห์