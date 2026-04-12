# CLAUDE.md — PACAPP Project Context

> This file is read automatically by Claude Code at the start of each session. It contains the master context, conventions, and rules for the PACAPP project. Do not delete or overwrite without explicit instruction.

---

## What is PACAPP

PACAPP is a marketplace web app for the Dominican Republic that connects second-hand clothing stores ("pacas") with buyers. The goal is to formalize an informal but large sector by giving sellers a trustworthy digital storefront and buyers a unified catalog with search, maps, chat, and reviews.

- **Name:** PACAPP
- **Market:** Dominican Republic (all provinces, launching nationwide from day one)
- **Language of the UI:** Spanish (Dominican dialect)
- **Language of the code & comments:** English
- **Type of app:** Responsive web app (Next.js), installable as PWA. No native mobile app in MVP.

## Actors / roles

1. **Visitor** (not logged in): browses catalog and stores, cannot chat or favorite.
2. **Buyer** (logged in): browses, chats with sellers, favorites, leaves reviews after chatting.
3. **Seller** (logged in): manages one store, uploads products, receives chats, manages subscription.
4. **Admin** (logged in): internal role, manages users/stores/payments/reviews/charity.

## Monetization model (MVP)

Subscription-based, NOT commission-based. In-app payments will come later.

- **Plan Gratis:** RD$0 — up to 10 products, no verification, no highlights
- **Plan Básico:** ~RD$500/month — up to 100 products, verified badge, stats
- **Plan Pro:** ~RD$1,500/month — unlimited products, highlights, wholesale module, advanced stats

Subscription payments are handled **manually** in the MVP: sellers upload a payment proof, admin approves, plan activates for 30 days. Real payment processor integration (Azul, CardNet) is post-MVP.

## Tech stack (authoritative — do not deviate without asking)

- **Framework:** Next.js 14+ with App Router
- **Language:** TypeScript (strict mode)
- **Styling:** Tailwind CSS
- **UI components:** shadcn/ui (all UI primitives must come from shadcn)
- **Icons:** lucide-react
- **Forms:** react-hook-form + zod for validation
- **State management:** Zustand for client state (only when needed — prefer server components)
- **Backend-as-a-service:** Supabase
  - PostgreSQL database
  - Supabase Auth (email/password + Google OAuth)
  - Supabase Storage (for product and store images)
  - Supabase Realtime (for chat)
  - Row Level Security (RLS) for all tables
  - Edge Functions (only when logic must not run on client)
- **Email:** Resend (for transactional emails — chat notifications, subscription reminders)
- **Maps:** Google Maps JavaScript API (with Places API for address autocomplete)
- **PWA:** next-pwa
- **Hosting:** Vercel (frontend) + Supabase Cloud (backend)
- **Package manager:** pnpm

## Folder structure (must be respected)

```
pacapp/
├── app/
│   ├── (public)/              # No login required
│   │   ├── page.tsx           # Home / catalog
│   │   ├── explorar/
│   │   ├── productos/[id]/
│   │   ├── tiendas/[id]/
│   │   ├── mapa/
│   │   └── mayoreo/
│   ├── (auth)/
│   │   ├── login/
│   │   ├── registro/
│   │   └── recuperar/
│   ├── (buyer)/               # Buyer-only routes → URLs: /favoritos, /chats, /perfil
│   │   ├── layout.tsx         # Renders <Header /> + min-h-screen wrapper
│   │   ├── favoritos/
│   │   ├── chats/
│   │   └── perfil/
│   ├── (seller)/              # Seller-only routes → URLs: /seller/*
│   │   └── seller/            # ⚠️ Required subfolder — keeps URLs at /seller/* to avoid conflicts
│   │       ├── dashboard/
│   │       ├── productos/
│   │       ├── tienda/
│   │       ├── suscripcion/
│   │       ├── estadisticas/
│   │       └── chats/
│   ├── (admin)/               # Admin-only routes → URLs: /admin/*
│   │   └── admin/             # ⚠️ Required subfolder — keeps URLs at /admin/* to avoid conflicts
│   │       ├── dashboard/
│   │       ├── usuarios/
│   │       ├── tiendas/
│   │       ├── pagos/
│   │       ├── resenas/
│   │       └── caridad/
│   ├── auth/
│   │   └── callback/          # OAuth + email confirmation handler
│   │       └── route.ts
│   └── api/
├── components/
│   ├── ui/                    # shadcn primitives
│   ├── shared/                # Shared across roles
│   ├── catalog/
│   ├── chat/
│   ├── map/
│   └── admin/
├── lib/
│   ├── supabase/
│   │   ├── client.ts          # Browser client
│   │   ├── server.ts          # Server client
│   │   └── middleware.ts      # Session refresh helper (used by proxy.ts)
│   ├── utils/
│   └── validations/           # Zod schemas
├── hooks/
├── types/
│   └── database.types.ts      # Hand-written Phase 1; regenerate after migrations
├── public/
├── supabase/
│   ├── migrations/            # SQL migrations (run manually via Supabase dashboard)
│   └── seed.sql
└── proxy.ts                   # Route protection (Next.js 16 — NOT middleware.ts)
```

## Brand identity

- **Concept:** Modern marketplace with Caribbean warmth. Clean, trustworthy, professional, but not corporate or cliché-eco.
- **Primary color:** `#0F7B5A` (deep emerald green)
- **Secondary accent:** `#F5E6D3` (warm sand)
- **Background:** `#FAFAF7` (off-white)
- **Text:** `#1A1A1A` (charcoal)
- **Success:** `#16A34A`
- **Typography:** Inter (body) + DM Serif Display or similar (headings)
- **Tagline:** "Tu próxima prenda favorita está más cerca de lo que crees"

## Coding conventions

1. **TypeScript strict mode** enabled. No `any` unless absolutely necessary.
2. **Server components by default.** Use `"use client"` only when you need interactivity, hooks, or browser APIs.
3. **Supabase clients:** use the server client in server components and route handlers; use the browser client in client components. Never mix.
4. **All database tables must have RLS policies.** Never create a table without its policies in the same migration.
5. **Never hardcode secrets.** Use `.env.local` for local, Vercel env vars for prod.
6. **Zod for all form validation.** Schemas live in `/lib/validations/`.
7. **UI text in Spanish.** Code, variable names, comments, and database fields in English.
8. **Use shadcn components.** Do not reinvent UI primitives.
9. **Responsive mobile-first.** Every page must work on a 360px-wide phone.
10. **Accessibility:** semantic HTML, alt texts, aria-labels where needed.
11. **File naming:** kebab-case for files, PascalCase for React components, camelCase for functions.
12. **Error handling:** every async operation that can fail must have try/catch with meaningful user-facing messages (in Spanish) and console errors (in English).

## Database conventions

- Primary keys are UUIDs (`uuid` type, default `gen_random_uuid()`).
- Every table has `id`, `created_at`, `updated_at`.
- Use `snake_case` for column names.
- Use enums for bounded sets of values (roles, statuses, plans, categories, conditions, genders).
- Foreign keys use `on delete cascade` when the child should die with the parent, `on delete set null` when it should survive.
- RLS policies: write them explicitly for each role (anon, authenticated, and the custom roles buyer/seller/admin).

## Phase-based development

The project is built in 10 phases. Each phase has its own dedicated prompt. **Do not jump ahead.** Only implement what the current phase prompt asks for. If something feels missing but belongs to a later phase, leave a clear `// TODO (phase X)` comment and move on.

**Phases:**

| # | Name | Status |
|---|------|--------|
| 1 | Foundation | ✅ Complete (2026-04-10) |
| 2 | Stores & products | ✅ Complete (2026-04-12) |
| 3 | Public catalog | 🔜 Next |
| 4 | Map | ⬜ Pending |
| 5 | Chat | ⬜ Pending |
| 6 | Reviews | ⬜ Pending |
| 7 | Subscriptions | ⬜ Pending |
| 8 | Wholesale | ⬜ Pending |
| 9 | Admin | ⬜ Pending |
| 10 | Polish | ⬜ Pending |

---

## Phase 1 — What was built (completed 2026-04-10)

### Environment & tooling
- Package manager is **pnpm** exclusively. Never run `npm install`.
- `zustand` added to dependencies.
- `.env.local` holds real credentials (gitignored). `.env.local.example` documents all keys.
- The correct Supabase env var name is `NEXT_PUBLIC_SUPABASE_ANON_KEY` (NOT `PUBLISHABLE_KEY`).
- **Supabase CLI is NOT installed** on this machine. All `supabase` CLI commands must be run manually via the Supabase dashboard SQL editor, or the user must install the CLI first.

### Next.js 16 specifics
- This project runs **Next.js 16.2**. In Next.js 16, `middleware.ts` was renamed to **`proxy.ts`**. Always use `proxy.ts` for the route interception file — never `middleware.ts`.
- The exported function is called `proxy` (not `middleware`) and `config` is still exported the same way. Both the filename and the function name changed in Next.js 16.

### Auth system
- Supabase Auth with email/password and Google OAuth.
- Google OAuth redirect URL: `{origin}/auth/callback`
- Auth callback route: `app/auth/callback/route.ts` — handles OAuth code exchange, email confirmation, and password recovery redirects.
- Password recovery redirects to `/actualizar-contrasena` (not yet built — Phase 1 scope only covers sending the email).
- After sign-up, Supabase sends a confirmation email **if email confirmations are enabled** in the dashboard. For dev, confirmations are off (`enable_confirmations = false` in `supabase/config.toml`).

### Database (run migration manually in Supabase SQL editor)
- Migration file: `supabase/migrations/20260410000001_foundation.sql`
- Enums created: `user_role`, `subscription_plan`, `subscription_status`, `store_status`, `product_condition`, `product_gender`, `product_category`
- `profiles` table: linked to `auth.users` via trigger `on_auth_user_created`. Role stored here, not in JWT. Trigger reads `raw_user_meta_data.role` and `raw_user_meta_data.full_name` from the sign-up payload.
- `stores` table: skeleton only — columns defined, RLS in place, no CRUD UI yet (Phase 2).
- Types: `types/database.types.ts` is hand-written for Phase 1. After each future migration, regenerate with the CLI.

### Route protection (`proxy.ts`)
- Auth routes (`/login`, `/registro`, `/recuperar`) redirect logged-in users to `/`.
- Buyer routes (`/favoritos`, `/chats`, `/perfil`) require `role = 'buyer'` or `'admin'`.
- Seller routes (`/seller/*`) require `role = 'seller'` or `'admin'`.
- Admin routes (`/admin/*`) require `role = 'admin'`.
- Unauthenticated users hitting protected routes are sent to `/login?redirectTo=<path>`.
- The proxy fetches the profile from Supabase on every protected request to read the role. This is acceptable for MVP; cache later if needed.

### v0 pages with `@ts-nocheck`
The following pages were generated by v0 and use stale mock-data types. They are suppressed with `// @ts-nocheck` and marked with `// TODO (phase X)`. **Do not remove the suppression — rewrite the whole page in the correct phase instead.**

| File | Rewrite in |
|------|-----------|
| `app/(public)/explorar/page.tsx` | Phase 3 |
| `app/(public)/tiendas/page.tsx` | Phase 3 |
| `app/(public)/tiendas/[id]/page.tsx` | Phase 3 |
| `app/(public)/productos/[id]/page.tsx` | Phase 3 |
| `app/(admin)/admin/tiendas/page.tsx` | Phase 9 |

### Header architecture
- **Public & buyer pages:** use `components/header.tsx` (async Server Component). Calls `supabase.auth.getUser()` and fetches `profiles` for `full_name`, `role`, `avatar_url`. Passes `HeaderUser | null` to `<HeaderClient />` (Client Component).
- **Seller pages:** use `components/seller-layout.tsx` (Client Component) — a sidebar layout with integrated nav and logout. Do NOT render the public `<Header />` on seller pages; the SellerLayout already has its own mobile header.
- `app/(buyer)/layout.tsx` renders `<Header />`. Public server-component pages render `<Header />` in their layout file.
- After any sign-in/sign-out, always call `router.refresh()` before redirecting so server components re-run `getUser()`.
- `sonner` + `components/ui/sonner.tsx` (Toaster) is installed. `<Toaster richColors position="bottom-right" />` is mounted in `app/layout.tsx`.

### Seller layout architecture (`components/seller-layout.tsx`)
- Single source of truth for all seller page chrome.
- Desktop: left sidebar (64px) with logo, store name, nav links, "Ver catálogo público" button, logout button.
- Mobile: sticky top header with hamburger Sheet + fixed bottom nav (5 items).
- Active nav item detected via `usePathname()` — matches exact path and sub-paths (`startsWith`).
- `app/(seller)/layout.tsx` is an **async server component** that fetches the store name via Supabase and passes it as `storeName` prop to `<SellerLayout>`. Individual seller pages must NOT wrap themselves in `<SellerLayout>` — the route group layout handles it.
- No search bar for sellers (intentional — sellers don't browse the catalog from their panel).

### Login / register post-auth redirects
- **Login (`/login`):** after successful sign-in, checks `?redirectTo=` param first; otherwise fetches profile role and redirects: `seller` → `/seller/dashboard`, `admin` → `/admin/dashboard`, `buyer` → `/`.
- **Register (`/registro`):** after successful sign-up, redirects: `seller` → `/seller/onboarding`, `buyer` → `/`.
- `useSearchParams()` in the login form requires a `<Suspense>` wrapper — the login page exports a `LoginPage` that wraps `LoginForm` in `<Suspense>`.

### Seller onboarding guard
- **No redirect loop pattern:** the `(seller)` route group layout does NOT guard for store existence. Doing so caused infinite redirect loops because `/seller/onboarding` is inside the same layout group.
- Instead: `app/(seller)/seller/onboarding/page.tsx` is a **server component** that queries the store — if found, redirects to `/seller/dashboard`; if not, renders `<OnboardingForm />` (client component in `OnboardingForm.tsx`).
- The dashboard page (`seller/dashboard/page.tsx`) also has `if (!store) redirect('/seller/onboarding')` as a safety net.
- Other seller pages can add the same safety net if needed; for MVP it is acceptable to let them redirect through the dashboard.

### Database — `handle_new_user` trigger (patched 2026-04-12)
The Phase 1 migration had a bug: the trigger inserted `(id, full_name, avatar_url)` but omitted `role`. Every new user got the default role `'buyer'`. Fixed by patching the live function in the Supabase SQL editor AND updating `supabase/migrations/20260410000001_foundation.sql`. The corrected trigger reads `coalesce((raw_user_meta_data->>'role')::public.user_role, 'buyer')`.

### Supabase dashboard setup needed before testing
1. Run `supabase/migrations/20260410000001_foundation.sql` in the SQL editor (includes the trigger fix).
2. Run `supabase/migrations/20260412000001_products_and_storage.sql` in the SQL editor.
3. Create two Storage buckets: `store-assets` (public) and `product-images` (public).
4. Authentication → Providers → Google: enable with Client ID + Secret.
5. Authentication → URL Configuration → Site URL: `http://localhost:3000`, Redirect URL: `http://localhost:3000/auth/callback`.

## Phase 2 — What was built (completed 2026-04-12)

### Database changes (`supabase/migrations/20260412000001_products_and_storage.sql`)
- Dropped Phase 1 English enums and recreated with Spanish values: `product_condition` (`nuevo_etiqueta`, `como_nuevo`, `buen_estado`, `usado`), `product_gender` (`mujer`, `hombre`, `nina`, `nino`, `unisex`), `product_category` (10 values).
- New enums: `product_size` (clothing + pants + shoe sizes), `product_status` (`active`, `sold`, `hidden`), `store_category`.
- Extended `stores` table: added `instagram`, `facebook`, `categories text[]`.
- New `products` table with RLS, indexes, auto-title trigger.
- New `product_images` table with `unique(product_id, position)` and RLS.
- Storage bucket policies for `store-assets` and `product-images` (must create buckets manually in dashboard).

### Key new files
| File | Purpose |
|------|---------|
| `lib/utils/image.ts` | `compressImage()`, `uploadImage()`, `deleteStorageFile()` using `browser-image-compression` |
| `lib/validations/store.ts` | Zod schema + PROVINCES_RD, STORE_CATEGORIES constants |
| `lib/validations/product.ts` | Zod schema + category/condition/gender/size helpers |
| `components/seller/StoreFormFields.tsx` | Reusable store form fields (used in onboarding + edit store) |
| `components/seller/ProductFormFields.tsx` | Reusable product form fields (used in new + edit product) |
| `components/seller/PhotoUploader.tsx` | Drop zone, compress on select, thumbnail grid, reorder arrows |
| `components/seller/SegmentedControl.tsx` | Button-group selector for size/condition/gender |
| `components/seller/CategoryPicker.tsx` | Grid of category buttons with lucide icons |
| `components/seller/ProductCard.tsx` | Seller product card with DropdownMenu (edit/sold/hide/delete) |
| `components/shared/EmptyState.tsx` | Shared empty state with icon, title, description, CTA |
| `app/(seller)/seller/onboarding/OnboardingForm.tsx` | Client form component (split from page for server gate) |

### Seller pages (all real Supabase data, no mock)
- `seller/onboarding` — server gate + client form; creates store with image upload
- `seller/dashboard` — metrics (active/sold products, views), recent 6 products, empty state
- `seller/productos` — searchable list with status filter, pagination, row actions
- `seller/productos/nuevo` — photo upload (up to 5), price, category picker, size/condition/gender
- `seller/productos/[id]/editar` — edit all fields + manage existing photos + status toggle
- `seller/tienda` — edit store profile, cover image change, public URL preview + copy

### `types/database.types.ts`
Every table must have `Relationships: []` (or with actual FK entries) to satisfy `@supabase/postgrest-js` v0.17+. Without it, all table queries return `never`. Also requires `CompositeTypes: Record<string, never>` in the `Database` interface.

## Rules when working on this project

1. **Always read this file first** at the start of every session.
2. **Ask before deleting or rewriting existing code** that you didn't author in the current session.
3. **Commit after each phase.** Use conventional commits: `feat(phase-1): add supabase auth`.
4. **Generate TypeScript types from Supabase** after every migration. The Supabase CLI is not installed locally — use the cloud project instead: `pnpm dlx supabase gen types typescript --project-id nxmfuvypzfckjmainpdr > types/database.types.ts`. Until the CLI is set up, keep `types/database.types.ts` hand-written and in sync.
5. **Do not install packages the user didn't approve.** If you think a package is needed, propose it and wait for confirmation.
6. **Prefer small, reviewable changes.** Do not create 20 files in one shot without explaining.
7. **Test as you go.** After each major change, run `pnpm dev` and verify the happy path.
8. **If you hit an error you can't resolve in 2 attempts, stop and report it** with the exact error message. Do not go in circles.
9. **Never expose service role keys to the client.** The service role key lives only in server-side code and environment variables.
10. **When in doubt about a decision, ask.** It is better to pause and ask than to generate the wrong thing.

## Out of scope for the MVP (do not build these)

- In-app payment processing
- Real-time delivery / logistics
- Native mobile apps
- Push notifications
- WhatsApp integration
- Multi-employee store accounts
- Seller → buyer reviews
- Image messages in chat
- Multi-language support
