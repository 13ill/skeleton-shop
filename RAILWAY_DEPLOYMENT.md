# Railway Deployment Guide - Jump-1 Backend

## 📋 Prerequisites

- Railway account (https://railway.app)
- GitHub account
- Supabase project with database
- Jump-1 backend code ready

---

## 🚀 Step 1: Setup Railway Account

1. Go to https://railway.app
2. Sign up for free account
3. Connect GitHub account
4. Get $5 credits (30-day free trial)

---

## 🚀 Step 2: Prepare Repository

### 2.1: Ensure backend is ready

```bash
cd backend

# Build locally to verify
npm run build

# Test locally
npm start
```

### 2.2: Push to GitHub

```bash
git add .
git commit -m "Prepare for Railway deployment"
git push origin main
```

---

## 🚀 Step 3: Deploy to Railway

### 3.1: Create New Project

1. Go to Railway dashboard
2. Click "New Project" → "Deploy from GitHub repo"
3. Select your Jump-1 repository
4. Select branch (main or deployment-plan)

### 3.2: Configure Build Settings

Railway will auto-detect Node.js project. Verify:

**Build Command:** `npm run build`
**Start Command:** `npm start`

### 3.3: Configure Environment Variables

Add these variables in Railway dashboard:

```env
DATABASE_URL=postgresql://postgres:0147@db.nnhohnfjmzarkopoebqr.supabase.co:5432/postgres
NODE_ENV=production
PORT=3001
```

**Important:** Use Supabase connection string for production (not local PostgreSQL)

### 3.4: Deploy

1. Click "Deploy"
2. Wait for build (2-3 minutes)
3. Monitor logs for any errors

---

## 🚀 Step 4: Verify Deployment

### 4.1: Get Deployment URL

After successful deployment, Railway will provide:
- Backend URL: `https://jump1-backend-production.up.railway.app`
- Health check: `https://jump1-backend-production.up.railway.app/health`

### 4.2: Test Endpoints

```bash
# Health check
curl https://jump1-backend-production.up.railway.app/health

# Products endpoint
curl https://jump1-backend-production.up.railway.app/products
```

Expected response:
```json
{
  "status": "healthy",
  "database": "connected",
  "timestamp": "2026-06-17T..."
}
```

---

## 🚀 Step 5: Update Frontend

### 5.1: Update API URL

In frontend code, update API base URL:

**Development:**
```typescript
const API_URL = 'http://localhost:3001';
```

**Production:**
```typescript
const API_URL = 'https://jump1-backend-production.up.railway.app';
```

### 5.2: Deploy Frontend to Vercel

See frontend deployment guide for details.

---

## 🔧 Troubleshooting

### Build Fails

**Issue:** Build command fails
**Solution:** 
- Check `package.json` scripts
- Ensure `npm run build` works locally
- Check TypeScript errors

### Database Connection Fails

**Issue:** Cannot connect to Supabase
**Solution:**
- Verify `DATABASE_URL` is correct
- Check Supabase project is active
- Ensure Supabase allows Railway IP addresses

### Health Check Fails

**Issue:** Health check returns unhealthy
**Solution:**
- Check database connection
- Verify Prisma client is generated
- Check logs for errors

---

## 💰 Cost

- **Free Tier:** $1/month credit
- **After 30 days:** $1/month (if usage < $1)
- **Overage:** Pay for actual usage

---

## 📊 Monitoring

Railway provides:
- Real-time logs
- Metrics (CPU, RAM, Network)
- Error tracking
- Uptime monitoring

---

## 🔄 Updates

To update after deployment:

```bash
git add .
git commit -m "Update backend"
git push origin main
```

Railway will auto-deploy on push.

---

## 🎯 Next Steps

1. ✅ Deploy backend to Railway
2. ⏳ Deploy frontend to Vercel
3. ⏳ Configure custom domain (optional)
4. ⏳ Set up monitoring (UptimeRobot)
