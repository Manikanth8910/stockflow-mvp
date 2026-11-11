# StockFlow MVP – SaaS Inventory Management System

> Built for the **Wexa AI Software Developer Intern Technical Assessment** (6-Hour MVP Build).

StockFlow is a streamlined, multi-tenant inventory management system designed for small sellers, warehouses, and internal teams. It enables real-time catalog management, automatic low-stock alerting, instant inline stock adjustments, and organization-scoped data isolation without bloat.

---

## 🚀 Live Demo & Quick Credentials

- **Repository**: [https://github.com/Manikanth8910/stockflow-mvp](https://github.com/Manikanth8910/stockflow-mvp)
- **Demo User Account**:
  - **Email**: `demo@stockflow.io`
  - **Password**: `password123`
  - *(Or click the **"⚡ Quick Fill Demo Account"** button on the Login page)*

---

## 📋 Features Mapped to PRD Specifications

| PRD Section | Feature | Implementation Details |
| :--- | :--- | :--- |
| **FR-1** | **Signup & Login** | Email & password auth, bcrypt hashing, JWT session stored in HTTP-only secure cookie, input validation. |
| **FR-2** | **Organization Context** | Every signup auto-creates an Organization entity. All products, inventory, logs, and settings are strictly scoped by `organizationId`. Multi-tenant isolation guaranteed. |
| **FR-3** | **Product Model** | Models `id`, `organizationId`, `name`, `sku` (unique per org), `description`, `quantityOnHand`, `costPrice`, `sellingPrice`, `lowStockThreshold`, `lastUpdatedBy`, `createdAt`, `updatedAt`. |
| **FR-4** | **Product CRUD** | Interactive table with search by Name/SKU, filter tabs (All, Low Stock, Healthy), Create Modal, Edit Modal, and Delete with confirmation dialog. |
| **FR-5** | **Simple Stock Updates** | Direct edits in form OR quick inline modal control entering `+/- N units` with optional note, audit logging, and `lastUpdatedBy` timestamp. |
| **FR-6** | **Dashboard Overview** | Real-time KPI summary cards (Total Products, Total Stock Units, Low Stock Count, Total Valuation). Dedicated Low Stock table displaying products where `Quantity <= Threshold`. |
| **FR-7** | **Global Settings** | Organization settings page configuring the Default Low Stock Threshold (default: 5) used as fallback for products without an explicit threshold. |

---

## 🛠 Tech Stack

- **Framework**: [Next.js 14](https://nextjs.org/) (App Router, Server Actions, Route Handlers)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Database & ORM**: [Prisma ORM](https://www.prisma.io/) with SQLite (zero-config, portable) / compatible with PostgreSQL
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Authentication**: JWT (`jsonwebtoken`) + `bcryptjs` + HTTP-Only Cookies
- **Testing**: [Vitest](https://vitest.dev/) (Unit & Multi-tenant isolation test suites)

---

## ⚙️ Quick Start (Local Setup)

### 1. Clone the repository
```bash
git clone https://github.com/Manikanth8910/stockflow-mvp.git
cd stockflow-mvp
```

### 2. Install dependencies
```bash
npm install
```

### 3. Initialize & Seed the Database
```bash
npx prisma db push
npm run db:seed
```
This creates the SQLite database and populates sample products for the demo organization.

### 4. Run the Development Server
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🧪 Running Automated Tests

```bash
npm test
```
Runs the test suites covering:
1. **Inventory Low Stock Logic**: Custom threshold handling, organization default threshold fallback, zero-stock out-of-stock detection, and stock adjustment limits.
2. **Multi-Tenant Security**: Strict organization isolation, cross-tenant leak prevention, and per-organization SKU uniqueness.

---

## 🔒 Multi-Tenant Data Scoping

StockFlow is engineered with multi-tenancy as a core architectural primitive:
- Each product has a composite unique index: `@@unique([organizationId, sku])`. Different organizations can use the same SKU codes without collision.
- All queries in API route handlers (`/api/products`, `/api/dashboard`, `/api/settings`) explicitly enforce `where: { organizationId: session.organizationId }`.
- Unauthorized requests or cross-tenant query attempts are rejected with `401 Unauthorized` or `404 Not Found`.

---

## 🚢 Deployment Guide

### Option 1: Docker
A production `Dockerfile` is provided:
```bash
docker build -t stockflow-mvp .
docker run -p 3000:3000 stockflow-mvp
```

### Option 2: Render / Railway / Cloud VM
1. Fork or push the repo to GitHub.
2. Link the repository on Render or Railway as a Web Service.
3. Build Command: `npm run build`
4. Start Command: `npm start`
5. Environment Variables:
   - `JWT_SECRET`: Random 32-character string
   - `DATABASE_URL`: `file:./dev.db` (or PostgreSQL connection string)

---

## 📁 Project Structure

```
├── prisma/
│   ├── schema.prisma       # Database schema (Org, User, Product, StockLog)
│   └── seed.js             # Initial database seeder
├── src/
│   ├── app/
│   │   ├── (app)/          # Authenticated application shell
│   │   │   ├── dashboard/  # Dashboard overview & low-stock table
│   │   │   ├── products/   # Products catalog, search, CRUD & inline stock updates
│   │   │   └── settings/   # Global low-stock threshold configuration
│   │   ├── api/            # API Route handlers (Auth, Products, Stock, Settings)
│   │   ├── login/          # Sign in page
│   │   ├── signup/         # Organization creation & registration
│   │   ├── layout.tsx      # Root application layout
│   │   └── page.tsx        # Landing hero page
│   ├── lib/
│   │   ├── auth.ts         # JWT & bcrypt authentication helpers
│   │   ├── prisma.ts       # Prisma client singleton
│   │   └── types.ts        # TypeScript interface definitions
│   └── middleware.ts       # Route protection & session validation
├── tests/
│   ├── inventory-logic.test.ts
│   └── multi-tenant.test.ts
└── README.md
```
