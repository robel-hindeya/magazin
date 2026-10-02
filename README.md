# Selam Kids 🌟

A modern, full-stack educational and creative writing platform for children, inspired by **Night Zookeeper**. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, RLS, Storage)**.

[![GitHub repo](https://img.shields.io/badge/GitHub-robel--hindeya%2Fselamkidsweb-blue?logo=github)](https://github.com/robel-hindeya/selamkidsweb)
[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-v4-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)

---

## 🌟 Key Highlights & Features

### 1. 📖 Night Zoo Magazine Lounge
- **October Edition**: Kid-authored digital magazines with vibrant 3D flip card interactions.
- **Fullscreen Interactive Reader**: Rich magazine articles, creature highlights, and community stories.

### 2. ✍️ Daily Creative Writing & Message to God
- **Dual Writing Modes**: Switch between **Daily Creative Writing** quests and heartfelt **Message to God** prayers.
- **Gamified Orb Rewards**: Real-time word counter granting magical glowing orbs for writing accomplishments.

### 3. 🦁 Companion Creature Studio & Explorer Profile
- **12 Animated Characters**: Kids can customize their creature with fan-favorite companions:
  - 🦁 Simba (*The Lion King*)
  - 🐼 Po Panda (*Kung Fu Panda*)
  - 🐉 Toothless (*How to Train Your Dragon*)
  - 👽 Stitch (*Lilo & Stitch*)
  - 🍌 Minion (*Despicable Me*)
  - ⚡ Pikachu (*Pokémon*)
  - 🦔 Sonic (*Sonic the Hedgehog*)
  - 🟢 Shrek (*Shrek*)
  - 🐠 Nemo (*Finding Nemo*)
  - 🌰 Scrat (*Ice Age*)
  - 🐧 Skipper Penguin (*Madagascar*)
  - 🤠 Woody (*Toy Story*)
- **Custom Dropdown & Quick-Pick**: Real-time avatar preview with dark mode glassmorphic styling.
- **Unified Settings**: Explorer display name, phone identity, security, and theme settings directly on the Profile page.

### 4. 📱 Phone-Based Authentication
- Secure phone number authentication with normalized international dial codes (supporting Ethiopian `+251` and global formats).
- Demo quick-fill accounts for rapid evaluation across all 5 roles.

### 5. 🎨 Cosmic Dual-Realm Theme System
- **Day Realm**: Cheerful, high-contrast daylight palette for focused daytime reading.
- **Night Realm**: Deep cosmic starry galaxy mode (`#0c0522` / `#12092e`) tailored for nighttime bedtime writing quests.

### 6. 🛡️ Parent Gate & Multi-Tier Role System
- 4-digit PIN gate to protect parent settings and account billing from accidental kid navigation.
- 5 tailored role dashboards: **KID**, **FAMILY**, **TEACHER**, **ADMIN**, and **SUPERADMIN**.

---

## 🏗️ Project Architecture

The codebase enforces strict separation of concerns across a clean layer model:

```text
UI (React Server / Client Components)
   ↓
API Route Handlers / Server Actions
   ↓
Zod Validation Layer
   ↓
Role & Permission Authorization Guards
   ↓
Business Services Layer
   ↓
Repositories & Data Access Layer
   ↓
Supabase PostgreSQL (Enforced with RLS)
```

### Folder Structure

```text
├── backend/
│   ├── auth/            # Phone auth, server actions, guards, permissions, roles, sessions
│   ├── constants/       # Roles, permissions, status definitions
│   ├── db/              # Client, Server, Admin Supabase clients & repositories
│   ├── errors/          # AppError, AuthError, and ApiError classes
│   ├── services/        # Business services (Kid, Family, Teacher, Admin, Superadmin)
│   ├── utils/           # Pagination, response helpers, security sanitizers, logger
│   └── validation/      # Zod validation schemas
├── app/
│   ├── (public)/        # Landing page, Wonder Zone, squads
│   ├── auth/            # Phone login, registration, password recovery
│   ├── users/           # Kid Arena, Family Hub, Classroom HQ, Explorer Profile
│   ├── admin/           # Administrative console & moderation queue
│   ├── superadmin/      # Root security, roles, database telemetry, audit logs
│   └── api/             # Next.js Route Handlers
├── components/          # Reusable UI primitives, magazines, creature forms, navigation
├── hooks/               # React hooks (useUser, useAuth, usePermissions)
├── lib/                 # Supabase SSR clients, site config, utilities
├── public/              # Character assets, magazine covers, SVG beasts
├── supabase/            # PostgreSQL migrations, seed data, and schema definitions
└── types/               # Database, auth, and API TypeScript definitions
```

---

## 👥 Roles & Access Scope

| Role | Primary Scope | Default Target |
| :--- | :--- | :--- |
| **KID** | Magazine reading, creative writing quests, creature studio, orb awards | `/users/kids` |
| **FAMILY** | Multi-child management, reading progress analytics, family plan | `/users/families` |
| **TEACHER** | Classroom cohorts, curriculum prompt assignments, student reviews | `/users/teachers` |
| **ADMIN** | Platform operations, user directory moderation, teacher verification | `/admin` |
| **SUPERADMIN** | Root clearance, admin commissioning, role matrix, immutable audit ledger | `/superadmin` |

---

## 🚀 Quick Start Guide

### 1. Prerequisites
- **Node.js** `v20.x` or `v22.x`+
- **npm** `10.x`+ (or pnpm / yarn)
- **Git**

### 2. Clone and Install
```bash
# Clone the repository
git clone https://github.com/robel-hindeya/selamkidsweb.git
cd selamkidsweb

# Install dependencies
npm install
```

### 3. Environment Variables
Create `.env.local` based on `.env.example`:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key

# Application Settings
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development
```

> **Security Note:** `SUPABASE_SERVICE_ROLE_KEY` is strictly confined to server-side code (`backend/db/admin.ts`). It is never bundled or exposed to client browsers.

### 4. Run Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🛠️ Development Scripts

| Command | Description |
| :--- | :--- |
| `npm run dev` | Starts Next.js development server with hot-reload |
| `npm run typecheck` | Runs TypeScript compiler checks (`tsc --noEmit`) |
| `npm run lint` | Runs ESLint validation |
| `npm run build` | Compiles optimized production bundle |
| `npm run start` | Runs production server |

---

## 🗄️ Database & Migrations

If using local Supabase CLI:
```bash
# Start local Supabase containers
npx supabase start

# Apply initial migrations and schema
npx supabase migration up

# Seed initial roles, permissions, and test accounts
npx supabase db reset
```

Or apply the migration scripts directly in your Supabase SQL editor:
1. [`supabase/migrations/20260101000000_initial_schema.sql`](supabase/migrations/20260101000000_initial_schema.sql)
2. [`supabase/seed.sql`](supabase/seed.sql)

---

## 📦 Deployment to Vercel

1. Push your repository to GitHub: `https://github.com/robel-hindeya/selamkidsweb`
2. Import the project into your [Vercel Dashboard](https://vercel.com).
3. Set your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`).
4. Click **Deploy**.

---

## 📄 License

This project is licensed under the MIT License — see the LICENSE file for details.