# Selam Kids 🌟

A modern, full-stack educational and creative writing platform for children, inspired by **Night Zookeeper**. Built with **Next.js 15 (App Router)**, **TypeScript**, **Tailwind CSS**, and **Supabase (PostgreSQL, Auth, RLS, Storage)**.

[![GitHub repo](https://img.shields.io/badge/GitHub-robel--hindeya%2Fmagazin-blue?logo=github)](https://github.com/robel-hindeya/magazin)
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
git clone https://github.com/robel-hindeya/magazin.git
cd magazin

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

1. Push your repository to GitHub: `https://github.com/robel-hindeya/magazin`
2. Import the project into your [Vercel Dashboard](https://vercel.com). Vercel will automatically detect **Next.js**.
3. (Optional) Set your environment variables (`NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`, `NEXT_PUBLIC_APP_URL`).
4. Click **Deploy**.

---

## ✈️ Telegram Sign-in & Bot

Parents and teachers can sign in with Telegram, and a bot sends them an alert for every new sign-in.

**How it works**
- *Continue with Telegram* goes through the bot, so it works on any domain, including localhost:
  1. The website creates a one-time request that lasts 5 minutes. It's tied to the browser by an httpOnly cookie, and the website opens `t.me/<bot>?start=login_<id>`.
  2. The bot shows the device, IP and time, with **✅ Confirm** and **✖️ Cancel** buttons.
  3. Pressing Confirm reaches the server as a secret-checked webhook update, so the Telegram identity comes from Telegram, never from the browser.
  4. The page that started the request (and only that page) polls `/api/auth/telegram/bot-login/status` and is signed in once.
- A Telegram that isn't linked yet creates a new **FAMILY** account (`tg-<telegram id>`), so one Telegram account can never create two accounts.
- Signed-in users connect or disconnect Telegram from **Settings** with the same Confirm flow. Kid accounts can't connect Telegram.
- Bot commands: `/start`, `/login`, `/profile`, `/verify`, `/alerts`, `/unlink`, `/help`.
- **Password reset:** `/auth/forgot-password` sends a one-time 6-digit code to the linked Telegram. It expires in 10 minutes, works once, and is burned after 5 wrong tries. Codes are never returned to the browser in production. In development the page shows the code so you can test without Telegram.
- Links are stored in `.data/telegram.json`, or in Supabase `telegram_accounts` once a real Supabase project is configured (migration `20261118000000_telegram_accounts.sql`). Logins, links, unlinks and password resets are written to the audit log.

**Phone accounts**
- Saved to `.data/users.json` (or `/tmp` on serverless). Passwords and reset codes are stored as hashes (scrypt / SHA-256), never as plain text.
- Login is limited to 8 tries per number per 15 minutes and 30 per IP per 10 minutes. A wrong number and a wrong password give the same message.
- There are no demo accounts or one-click logins. The owner super admin comes from `SUPERADMIN_PHONE` + `SUPERADMIN_PASSWORD` (set them locally too, or you have no admin login).
- ⚠️ On Vercel, `/tmp` is wiped when the server sleeps or redeploys, so accounts created there don't last. For a public launch, move storage to a real database.

**Testing the bot locally**
Telegram can't reach `localhost`, so run the dev server and, in a second terminal, `npm run bot:dev`. It polls Telegram and forwards messages to your local webhook. It removes any production webhook while it runs, so register it again afterwards (step 4).

**Setup**
1. In [@BotFather](https://t.me/BotFather), send `/newbot` and copy the token.
2. Set these environment variables (in Vercel too):
   - `TELEGRAM_BOT_TOKEN`: the token (server-only, never commit it)
   - `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME`: the bot's username without `@`
   - `TELEGRAM_WEBHOOK_SECRET`: a random string (letters, digits, `_`, `-`)
   - `SESSION_SECRET`: 32+ random characters used to sign session cookies
3. Set `SUPERADMIN_PHONE` and `SUPERADMIN_PASSWORD` (8+ characters) for the owner admin account.
4. Deploy. Then, signed in as super admin, register the webhook and command menu once:
   `fetch('/api/superadmin/telegram', { method: 'POST' }).then(r => r.json())` in the browser console.
   `GET /api/superadmin/telegram` shows the webhook status.

**Endpoints**

| Method | Path | Access | Purpose |
|---|---|---|---|
| POST | `/api/auth/telegram/bot-login` | public (`intent: "link"` needs a session) | Start a Telegram sign-in or link; returns the t.me link |
| GET | `/api/auth/telegram/bot-login/status` | the browser that started it | Poll; signs in once the user confirms in the bot |
| POST | `/api/telegram/webhook` | Telegram only (secret header) | Bot commands |
| GET / POST | `/api/superadmin/telegram` | super admin | Webhook status / register webhook and commands |

**Sessions:** the `selam_local_session` cookie is HMAC-signed and expires after 7 days. Forged or edited cookies are rejected. If `SESSION_SECRET` isn't set, a key derived from `SUPABASE_SERVICE_ROLE_KEY` is used.

---

## 📄 License

This project is licensed under the MIT License.