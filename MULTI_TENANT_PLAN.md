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

## Phase 1: Foundation (Multi-tenant) - 2-3 สัปดาห์

### Backend Files

```
backend/
├── prisma/
│   ├── schema.prisma                          # เพิ่ม Store model + foreign keys
│   └── migrations/
│       └── 2024xxxx_add_multi_tenant/         # Migration สำหรับ multi-tenant
│           └── migration.sql
├── src/
│   ├── middleware/
│   │   ├── tenantMiddleware.ts               # Middleware ตรวจสอบ store
│   │   └── authMiddleware.ts                  # แก้ auth รองรับ multi-tenant
│   ├── services/
│   │   ├── storeService.ts                    # Service จัดการ store
│   │   └── tenantService.ts                   # Service จัดการ tenant logic
│   ├── routes/
│   │   ├── storeRoutes.ts                     # Routes สำหรับ store CRUD
│   │   └── publicRoutes.ts                    # Public routes สำหรับ customer
│   └── index.ts                               # แก้ให้รองรับ multi-tenant
```

### Frontend Files

```
src/
├── app/
│   ├── context/
│   │   ├── StoreContext.tsx                   # Context สำหรับ store info
│   │   └── TenantContext.tsx                  # Context สำหรับ tenant logic
│   ├── components/
│   │   ├── StoreSelector.tsx                  # Component เลือก store (สำหรับ admin)
│   │   └── StoreBadge.tsx                     # Badge แสดง store name
│   ├── admin/
│   │   ├── StoreManagement.tsx                # หน้าจัดการ store (super admin)
│   │   ├── StoreForm.tsx                      # ฟอร์มสร้าง/แก้ store
│   │   └── StoreList.tsx                      # รายการ store ทั้งหมด
│   ├── config/
│   │   └── tenantConfig.ts                    # Config สำหรับ tenant detection
│   └── utils/
│       └── tenantHelper.ts                     # Helper functions สำหรับ tenant
```

### Database Schema Changes

```prisma
model Store {
  id          String   @id @default(cuid())
  name        String
  slug        String   @unique  // สำหรับ subdomain หรือ URL
  domain      String?  @unique  // custom domain
  plan        String   @default("free") // free, starter, professional, enterprise
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  users       User[]
  categories  Category[]
  products    Product[]
  socialLinks SocialLink[]
  siteSettings SiteSettings[]
  
  @@map("stores")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("admin")
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])
  // ...
}

model Product {
  id        String   @id
  name      String
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])
  // ...
}

model Category {
  id        String   @id @default(cuid())
  name      String
  slug      String
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])
  // ...
}

model SocialLink {
  id        String   @id @default(cuid())
  platform  String
  url       String
  storeId   String
  store     Store    @relation(fields: [storeId], references: [id])
  // ...
}

model SiteSettings {
  id          String   @id @default(cuid())
  brandName   String
  tagline     String?
  address     String?
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  // ...
}
```

### Key Features
- Multi-tenant auth system
- Store detection (subdomain or path-based)
- Tenant isolation in all API endpoints
- Store-specific data filtering

---

## Phase 2: Theme System - 1-2 สัปดาห์

### Backend Files

```
backend/
├── prisma/
│   ├── schema.prisma                          # เพิ่ม Theme model
│   └── migrations/
│       └── 2024xxxx_add_theme_system/         # Migration สำหรับ theme
│           └── migration.sql
├── src/
│   ├── routes/
│   │   └── themeRoutes.ts                     # Routes สำหรับ theme CRUD
│   ├── services/
│   │   └── themeService.ts                    # Service จัดการ theme
│   └── presets/
│       ├── modernTheme.ts                     # Preset theme: Modern
│       ├── classicTheme.ts                    # Preset theme: Classic
│       ├── luxuryTheme.ts                     # Preset theme: Luxury
│       └── minimalTheme.ts                    # Preset theme: Minimal
```

### Frontend Files

```
src/
├── app/
│   ├── context/
│   │   └── ThemeContext.tsx                   # Context สำหรับ theme
│   ├── components/
│   │   ├── theme/
│   │   │   ├── ThemeSelector.tsx              # Component เลือก theme
│   │   │   ├── ThemeCustomizer.tsx            # Component custom theme
│   │   │   ├── ColorPicker.tsx                # Component เลือกสี
│   │   │   ├── FontSelector.tsx                # Component เลือก font
│   │   │   └── ThemePreview.tsx               # Preview theme
│   │   └── styles/
│   │       ├── ThemeProvider.tsx              # Provider สำหรับ theme
│   │       └── themeVariables.ts              # CSS variables สำหรับ theme
│   ├── admin/
│   │   └── ThemeManager.tsx                   # หน้าจัดการ theme
│   └── themes/
│       ├── modern/
│       │   ├── colors.ts                      # Color palette
│       │   ├── fonts.ts                       # Font settings
│       │   └── components.tsx                 # Component styles
│       ├── classic/
│       │   ├── colors.ts
│       │   ├── fonts.ts
│       │   └── components.tsx
│       ├── luxury/
│       │   ├── colors.ts
│       │   ├── fonts.ts
│       │   └── components.tsx
│       └── minimal/
│           ├── colors.ts
│           ├── fonts.ts
│           └── components.tsx
```

### Database Schema Changes

```prisma
model Theme {
  id              String   @id @default(cuid())
  name            String   // modern, classic, luxury, minimal
  storeId         String
  store           Store    @relation(fields: [storeId], references: [id])
  
  // Customization
  primaryColor    String?
  secondaryColor  String?
  backgroundColor String?
  textColor       String?
  accentColor     String?
  
  headingFont     String?
  bodyFont        String?
  fontSize        Int?
  
  isActive        Boolean  @default(true)
  createdAt       DateTime @default(now())
  updatedAt       DateTime @updatedAt
  
  @@map("themes")
}

model Store {
  // ...
  themes          Theme[]
}
```

### Pre-built Themes

1. **Modern** - Clean, minimalist, bold colors
2. **Classic** - Traditional, elegant, gold accents
3. **Luxury** - Premium, sophisticated, dark theme
4. **Minimal** - Simple, white space, black & white

### Customization Options
- **Colors:** Primary, secondary, accent, background, text
- **Fonts:** Heading font, body font (Google Fonts)
- **Logo:** Upload custom logo
- **Layout:** Grid vs List, Sidebar navigation
- **Components:** Button styles, card styles, animations

---

## Phase 3: Package/Billing System - 2-3 สัปดาห์

### Backend Files

```
backend/
├── prisma/
│   ├── schema.prisma                          # เพิ่ม Package, Subscription model
│   └── migrations/
│       └── 2024xxxx_add_billing_system/       # Migration สำหรับ billing
│           └── migration.sql
├── src/
│   ├── routes/
│   │   ├── packageRoutes.ts                   # Routes สำหรับ package CRUD
│   │   ├── subscriptionRoutes.ts               # Routes สำหรับ subscription
│   │   └── paymentRoutes.ts                   # Routes สำหรับ payment
│   ├── services/
│   │   ├── packageService.ts                  # Service จัดการ package
│   │   ├── subscriptionService.ts             # Service จัดการ subscription
│   │   └── paymentService.ts                   # Service จัดการ payment
│   ├── middleware/
│   │   └── packageMiddleware.ts               # Middleware ตรวจสอบ package limits
│   └── utils/
│       ├── stripe.ts                          # Stripe integration
│       └── invoiceGenerator.ts                # Generate invoice
```

### Frontend Files

```
src/
├── app/
│   ├── admin/
│   │   ├── PackageManagement.tsx              # หน้าจัดการ package (super admin)
│   │   ├── PackageForm.tsx                    # ฟอร์มสร้าง/แก้ package
│   │   ├── SubscriptionManagement.tsx         # หน้าจัดการ subscription
│   │   ├── PaymentHistory.tsx                 # ประวัติการชำระเงิน
│   │   └── UpgradePackage.tsx                 # หน้า upgrade package
│   ├── components/
│   │   ├── billing/
│   │   │   ├── PackageCard.tsx                # Card แสดง package
│   │   │   ├── FeatureList.tsx                # List แสดง features
│   │   │   ├── PricingTable.tsx               # ตารางราคา
│   │   │   └── PaymentForm.tsx                # ฟอร์มชำระเงิน
│   │   └── limits/
│   │       ├── UsageIndicator.tsx             # แสดงการใช้งาน vs limit
│   │       └── LimitWarning.tsx              # Warning เมื่อใกล้ limit
│   └── context/
│       └── PackageContext.tsx                 # Context สำหรับ package info
```

### Database Schema Changes

```prisma
model Package {
  id          String   @id @default(cuid())
  name        String   // Free Trial, Starter, Professional, Enterprise
  price       Int      // ราคาต่อปี (บาท)
  duration    Int      @default(365) // จำนวนวัน
  
  // Feature limits
  maxProducts Int?
  maxUsers    Int?
  maxThemes   Int?
  customDomain Boolean  @default(false)
  apiAccess   Boolean  @default(false)
  
  features    Json     // Array of feature names
  
  isActive    Boolean  @default(true)
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("packages")
}

model Subscription {
  id          String   @id @default(cuid())
  storeId     String
  store       Store    @relation(fields: [storeId], references: [id])
  packageId   String
  package     Package  @relation(fields: [packageId], references: [id])
  
  startDate   DateTime
  endDate     DateTime
  status      String   // active, cancelled, expired, pending
  
  stripeCustomerId String?
  stripeSubscriptionId String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("subscriptions")
}

model Payment {
  id          String   @id @default(cuid())
  subscriptionId String
  subscription Subscription @relation(fields: [subscriptionId], references: [id])
  
  amount      Int
  currency    String   @default("THB")
  status      String   // pending, completed, failed, refunded
  
  stripePaymentIntentId String?
  
  createdAt   DateTime @default(now())
  updatedAt   DateTime @updatedAt
  
  @@map("payments")
}

model Store {
  // ...
  subscriptions Subscription[]
}

model Package {
  // ...
  subscriptions Subscription[]
  payments Payment[]
}
```

### Pricing Packages

**Free Trial (14 วัน)**
- 50 products
- 1 admin user
- Basic theme (1 theme)
- Basic features
- Chat support (limited)

**Starter - ฿5,000/ปี**
- 200 products
- 2 admin users
- 3 themes
- Basic analytics
- Priority chat support
- Custom logo

**Professional - ฿15,000/ปี**
- 1,000 products
- 5 admin users
- All themes
- Advanced analytics
- Custom domain
- Priority chat support
- Inventory management
- Export/Import data

**Enterprise - ฿50,000/ปี**
- Unlimited products
- Unlimited admin users
- Custom theme development
- White-label
- API access
- Dedicated chat support
- Custom integrations
- Priority feature requests

---

## Recommended Implementation Order

1. **Phase 2 (Theme System)** - ทำก่อนเพื่อให้หน้าเว็บสวยงาม
2. **Phase 1 (Foundation)** - แปลงเป็น multi-tenant
3. **Phase 3 (Package/Billing)** - จัดการ subscription

---

## Chat Support System

### Options:

**Option 1: Third-party (Recommended)**
- **Crisp** - Free tier ดี, easy setup
- **Intercom** - Professional, มี features ครบ
- **Tawk.to** - Free, basic features

**Option 2: Build Custom Chat**
- WebSocket + Database
- Real-time messaging
- File attachments

**Recommendation:** เริ่มจาก **Crisp** (free tier ดี) แล้วค่อยย้ายไป Intercom เมื่อ scale ขึ้น
