# StockFlow MVP – Multi-Tenant SaaS Inventory Management System

> Built for the **Wexa AI Software Developer Intern Technical Assessment** (Phase 1 – 6-Hour MVP PRD).

StockFlow is a production-grade, multi-tenant inventory management system designed for businesses, e-commerce sellers, and warehouse operators. It provides real-time stock control, automated low-stock alerting, inline adjustments (+/- units), SKU management, and strict organization-level data isolation.

---

## 🚀 Public Repository & Live Demo
- **GitHub Repository**: [https://github.com/Manikanth8910/stockflow-mvp](https://github.com/Manikanth8910/stockflow-mvp)
- **Demo User Account**:
  - **Email**: `demo@stockflow.io`
  - **Password**: `password123`
  - *(Or click the **"⚡ Quick Fill Demo Account"** button on the Login page)*

---

## 📋 Features Implemented

### 1. Authentication & Multi-Tenancy (PRD FR-1, FR-2)
- **Signup & Organization Creation**: Users register with Email, Password, Confirm Password, and Organization Name. The organization is created automatically and linked to the user.
- **Secure Password Hashing**: Passwords hashed using `bcrypt` (10 salt rounds).
- **JWT Session Auth**: Cryptographically signed JSON Web Tokens stored in secure, HTTP-only cookies (`stockflow_token`).
- **Route Protection**: Next.js edge middleware protects `/dashboard`, `/products`, `/settings`, and internal APIs, redirecting unauthenticated requests to `/login`.
- **Tenant Isolation**: Every database query is scoped by `organizationId`. A composite unique constraint `@@unique([organizationId, sku])` allows different tenants to have the same SKU code without collision.

### 2. Product Catalog Management (PRD FR-3, FR-4)
- **Full CRUD Support**: Create, Read, Update, and Delete products with immediate database synchronization.
- **Dedicated Pages & Modals**:
  - `/products`: Interactive table with search (Name/SKU) and segmented status filters (`All`, `Low Stock`, `Healthy`).
  - `/products/new`: Dedicated product creation page.
  - `/products/[id]`: Dedicated product detail view with pricing, profit margin calculations, and stock statistics.
  - `/products/[id]/edit`: Dedicated product editing page.
- **Delete Confirmation**: Safe confirmation dialogs prevent accidental data loss.

### 3. Smart Stock Updates & Audit Tracking (PRD FR-5)
- **Inline Stock Adjustments**: Fast "+/- N units" adjustments from both the table and detail views.
- **Guarded Quantities**: Strictly prevents stock from dipping below zero.
- **Audit Logging**: Logs every stock delta with notes, previous quantity, new quantity, timestamp, and `lastUpdatedBy`.

### 4. Real-Time Dashboard (PRD FR-6)
- **KPI Metrics**:
  - Total Products count
  - Total Stock Units on hand
  - Low Stock Items count
  - Estimated Total Inventory Valuation ($)
- **Low Stock Early Warning Table**: Automatically surfaces items where `Quantity on Hand <= Low Stock Threshold` (or falls back to organization default).
- **Quick Action**: 1-click stock adjustment directly from the dashboard alert table.

### 5. Global Settings & Fallback Thresholds (PRD FR-7)
- **Organization Preferences**: Configure Organization Name and Default Low Stock Threshold (default: 5 units).
- **Dynamic Threshold Fallback**: Products without an individual threshold inherit the organization default dynamically.
- **Sample Catalog Loader**: 1-click button to populate sample products for evaluation.

---

## 🏗 Architecture & Technology Choices

- **Full-Stack Framework**: Next.js 14 (App Router, Server Actions, Route Handlers). Provides clean co-location of REST endpoints and server-rendered UI with minimal latency.
- **Language**: TypeScript throughout (strict typing on both client and server).
- **Database & ORM**: SQLite via Prisma ORM for zero-friction local execution and evaluation; schema is fully PostgreSQL-compatible.
- **Styling**: Tailwind CSS with an enterprise-grade dark SaaS palette (neutral slate, subtle emerald/teal accents, high contrast typography).
- **Icons**: Lucide React.
- **Testing**: Vitest with unit, validation, and multi-tenant isolation suites.

---

## 🗄 Database Models (Prisma)

```prisma
model Organization {
  id                        String               @id @default(cuid())
  name                      String
  defaultLowStockThreshold  Int                  @default(5)
  createdAt                 DateTime             @default(now())
  updatedAt                 DateTime             @updatedAt
  users                     User[]
  products                  Product[]
  stockAdjustmentLogs       StockAdjustmentLog[]
}

model User {
  id             String       @id @default(cuid())
  email          String       @unique
  passwordHash   String
  name           String?
  organizationId String
  organization   Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  createdAt      DateTime     @default(now())
  updatedAt      DateTime     @updatedAt

  @@index([organizationId])
}

model Product {
  id                 String               @id @default(cuid())
  organizationId     String
  organization       Organization         @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  name               String
  sku                String
  description        String?
  quantityOnHand     Int                  @default(0)
  costPrice          Float?
  sellingPrice       Float?
  lowStockThreshold  Int?
  lastUpdatedBy      String?
  createdAt          DateTime             @default(now())
  updatedAt          DateTime             @updatedAt
  stockAdjustmentLogs StockAdjustmentLog[]

  @@unique([organizationId, sku])
  @@index([organizationId])
  @@index([organizationId, name])
}

model StockAdjustmentLog {
  id               String       @id @default(cuid())
  organizationId   String
  organization     Organization @relation(fields: [organizationId], references: [id], onDelete: Cascade)
  productId        String
  product          Product      @relation(fields: [productId], references: [id], onDelete: Cascade)
  quantityChange   Int
  previousQuantity Int
  newQuantity      Int
  note             String?
  adjustedBy       String?
  createdAt        DateTime     @default(now())

  @@index([organizationId])
  @@index([productId])
}
```

---

## 🔌 API Endpoints Reference

### Authentication
- `POST /api/auth/register` (or `/api/auth/signup`): Register new user and auto-create organization.
- `POST /api/auth/login`: Authenticate with email/password; returns JWT in HTTP-only cookie.
- `GET /api/auth/me`: Retrieve current session user and active organization details.
- `POST /api/auth/logout`: Invalidate session cookie.

### Products
- `GET /api/products`: Retrieve all products scoped to user's organization (supports `?search=` and `?filter=`).
- `POST /api/products`: Create a new product with organization scoping and duplicate SKU checks.
- `GET /api/products/:id`: Retrieve single product with threshold status.
- `PUT /api/products/:id`: Update product fields, re-verify SKU uniqueness, and log quantity shifts.
- `DELETE /api/products/:id`: Delete product scoped to tenant.
- `POST /api/products/:id/adjust-stock`: Apply `+/- N units` change with note and audit log.

### Dashboard
- `GET /api/dashboard`: Aggregated dashboard metrics and low stock product list.
- `GET /api/dashboard/stats`: KPI metrics summary (`totalProducts`, `totalUnitsInStock`, `lowStockProductsCount`, `totalValuation`).
- `GET /api/dashboard/low-stock`: Filtered list of products currently at or below low stock threshold.

### Settings & Utilities
- `GET /api/settings`: Retrieve organization settings (Default Low Stock Threshold, Organization Name).
- `PUT /api/settings`: Update organization settings.
- `POST /api/seed`: Seed sample demo catalog into the active organization.

---

## 🧪 Automated Testing

Run the test suite anytime:
```bash
npm test
```

### Test Coverage Highlights:
- **`tests/auth-validation.test.ts`**: Password hashing, email syntax validation, password length, organization name checks.
- **`tests/inventory-logic.test.ts`**: Custom threshold vs org fallback threshold, zero-stock out-of-stock detection, stock delta validation, valuation aggregation.
- **`tests/product-validation.test.ts`**: Required fields validation, SKU uppercase normalization, search filtering, dynamic statistic updates.
- **`tests/multi-tenant.test.ts`**: Strict organization isolation, cross-tenant leak prevention, and independent SKU uniqueness across tenants.

---

## 💻 Local Setup & Development

### 1. Prerequisites
- Node.js 18+ (tested on Node 20 & 24)
- npm or pnpm

### 2. Installation
```bash
git clone https://github.com/Manikanth8910/stockflow-mvp.git
cd stockflow-mvp
npm install
```

### 3. Database Initialization & Seeding
```bash
npx prisma db push
npm run db:seed
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 5. Production Build
```bash
npm run build
npm start
```

---

## 🚢 Deployment Guide (Docker & Cloud)

### Option 1: Docker
```bash
docker build -t stockflow-mvp .
docker run -p 3000:3000 -e JWT_SECRET="your-jwt-secret" stockflow-mvp
```

### Option 2: Render.com (Blueprint included)
1. In Render Dashboard, click **New + > Web Service**.
2. Connect `https://github.com/Manikanth8910/stockflow-mvp`.
3. The repo includes [`render.yaml`](./render.yaml) which automatically configures build and start commands.
