# Phase 1: Database Migration - Jump-1

## 📋 Supabase Setup Instructions

### Step 1.1: Setup Supabase Account

**Action Required:**
1. Go to https://supabase.com
2. Sign up for free account
3. Create new project
4. Wait for project setup (2-3 minutes)

**Configuration:**
- **Project Name:** jump1-pos
- **Database Password:** Generate strong password
- **Region:** Singapore (closest to Thailand)
- **Database Name:** postgres

**Save Credentials:**
- **Project URL:** https://xxx.supabase.co
- **Anon Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
- **Service Role Key:** eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

**Time:** 5-10 minutes

---

## 🔍 Conflicts with POS Project

### Database Sharing Strategy

**Option 1: Shared Database (Recommended for MVP)**
- Both Jump-1 and POS use same Supabase project
- Use table prefixes or separate schemas
- Lower cost (1 Supabase project)
- Easier management

**Option 2: Separate Databases**
- Jump-1 uses one Supabase project
- POS uses another Supabase project
- Higher cost (2 Supabase projects)
- Better isolation

**Current Decision:** Shared Database (Option 1)

**Rationale:**
- Cost-effective for MVP
- Easier to manage
- Can separate later if needed
- Both projects are low traffic

---

## 📋 Shared Database Schema Strategy

### Table Naming Convention

**Jump-1 Tables:**
- `jump1_products`
- `jump1_categories`
- `jump1_social_links`
- `jump1_site_settings`

**POS Tables:**
- `pos_orders`
- `pos_customers`
- `pos_inventory`
- `pos_products` (if shared with Jump-1)

**Shared Tables:**
- `users` (if both systems use same auth)
- `stores` (for multi-tenant)

---

## 🔧 Prisma Schema Updates

### Current Jump-1 Schema
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

### Updated Jump-1 Schema
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

---

## 📝 Environment Variables

### Current .env
```env
DATABASE_URL="file:./dev.db"
```

### Updated .env
```env
DATABASE_URL="postgresql://postgres.xxx:[YOUR-PASSWORD]@db.xxx.supabase.co:5432/postgres"
```

---

## ⚠️ Potential Conflicts

### 1. Table Name Conflicts
**Issue:** Both projects might have `products` table
**Solution:** Use table prefixes or separate schemas
**Status:** Need to decide on naming convention

### 2. Database Connection Conflicts
**Issue:** Both projects connect to same database
**Solution:** Use connection pooling, separate schemas
**Status:** Managed by Supabase automatically

### 3. Migration Conflicts
**Issue:** Both projects run migrations on same database
**Solution:** Coordinate migrations, use separate migration files
**Status:** Need migration coordination plan

### 4. Data Conflicts
**Issue:** Both projects might access same data
**Solution:** Row-level security, separate tables
**Status:** Need to implement RLS

---

## 🎯 Next Steps

1. **Setup Supabase account** (manual action required)
2. **Update Prisma schema** (automated)
3. **Install PostgreSQL client** (manual action required)
4. **Export SQLite data** (automated)
5. **Import to PostgreSQL** (automated)
6. **Verify migration** (automated)

---

## 📞 Notes

- **Supabase Region:** Singapore (best for Thailand)
- **Database Name:** postgres (default)
- **Shared Database:** Both projects use same Supabase project
- **Cost:** Free tier (500MB DB, 1GB storage)
- **Backup:** Enable auto-backup daily

---

**Phase 1 Status:** In Progress
**Last Updated:** 2025-01-16
