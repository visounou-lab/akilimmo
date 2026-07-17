# SAND FINANZ GRUPPE

Standalone multilingual financing site, credit calculator, application portal
and secure admin back-office.

> This application is **independent** and shares no code, assets, content or
> branding with any other project in this repository.

Source language is **German**; public routes are `/de`, `/pl`, `/sv`, `/cz`
(the `/cz` route maps to the `cs-CZ` locale). Stack: Next.js 15 (App Router) ·
TypeScript · Tailwind v4 · PostgreSQL + Prisma · jose sessions · TOTP MFA.

---

## What is implemented

**Public site (batches 1–4)**
- i18n `/de /pl /sv /cz` (German source + fallback, no raw keys).
- Original SAND design system (navy/CTA), accessible, responsive.
- Pages: Startseite, Leistungen, Kreditrechner, Ablauf, Unterlagen, Über uns,
  FAQ, Kontakt, Antrag + legal pages (placeholders, badged).
- **Versioned credit engine** (`lib/credit-engine`) — single source of truth,
  `M = P·r·(1+r)^n/((1+r)^n − 1)` with `r=0` edge case, schedule, fees,
  indicative APR. Unit-tested (`vitest`, 14 tests).
- Multi-step application form → persists to the database, returns a reference.
- SEO: per-locale metadata, hreflang + x-default, canonical, sitemap, robots.

**Admin back-office (batch 5)** — under `/admin`, not indexed
- **Auth**: credential login + **mandatory TOTP 2FA** (enrol on first login),
  signed-JWT session cookie (jose), edge middleware gate.
- **RBAC**: `SUPER_ADMIN`, `ANALYST`, `ADVISOR`, `READ_ONLY` (see `lib/auth/rbac.ts`).
- **Dashboard** with KPIs by status.
- **Anträge**: filter/search, detail with customer + financial data + consents,
  status workflow (15 states), assignment, notes.
- **Angebote**: generated with the SAME credit engine as the public calculator
  and bound to the exact (immutable) product version used.
- **Kreditparameter**: versioned editor — saving publishes a new version and
  archives the previous one; the public calculator reads the latest published
  version (DB → static fallback).
- **Benutzer**: create/disable users, reset 2FA (never lock yourself out).
- **Audit-Log**: every security-relevant action (login, status change, offer,
  user management…) with actor, entity, metadata, IP.

## Not yet built (later batches)

- **PDF generation** — offer, contract, deposit certificate, summary, schedule.
- **Secure uploads** — private storage, signed URLs, antivirus, hashing.
- **Transactional e-mail** — Resend/Postmark acknowledgement.
- **Professional PL/SV/CZ translations** and **all legal text** (currently
  German fallback / placeholders — to be validated & legally translated).

## ⚠️ Placeholder data

Credit parameters (amounts, terms, **rates**, fees, availability), legal pages,
company identity and contact details are **explicit placeholders**, badged in the
UI. Replace only after SAND FINANZ compliance/legal validation.

---

## Getting started

```bash
cd sand-finanz
npm install
cp .env.example .env.local     # set DATABASE_URL + AUTH_SECRET

# Database (requires a reachable PostgreSQL)
npx prisma migrate deploy      # or: npm run db:migrate (dev)
npm run db:seed                # creates 3 credit versions + a super-admin

npm run dev                    # http://localhost:3000  (redirects to /de)
```

The seed prints the initial super-admin credentials
(`admin@sand-finanz.local` / `ChangeMe!2026` unless `SEED_ADMIN_*` is set).
On first login you are required to enrol TOTP 2FA (scan the QR with an
authenticator app). **Change the default password after first login.**

### Scripts

| Command           | Purpose                                              |
| ----------------- | ---------------------------------------------------- |
| `npm run dev`     | Development server                                   |
| `npm run build`   | `prisma generate` → migrate (if `DATABASE_URL`) → build |
| `npm run test`    | Credit-engine unit tests                             |
| `npm run db:migrate` | Create/apply a dev migration                      |
| `npm run db:seed` | Seed credit versions + super-admin                   |
| `npm run db:studio` | Prisma Studio                                      |

### Deploying on Vercel

1. Provision PostgreSQL (Vercel Postgres / Neon / Supabase). On Vercel Storage
   this injects `DATABASE_URL` automatically — otherwise add it yourself. Use a
   **pooled** connection string.
2. Set `AUTH_SECRET` (long random) and `NEXT_PUBLIC_SITE_URL` (your domain).
3. Deploy. The build runs migrations automatically when `DATABASE_URL` is set;
   without it, the **public site still builds** (calculator uses the fallback
   catalogue) while `/admin` and form submission stay inactive until the DB is
   connected.
4. Run the seed once against the production DB to create the first admin.

---

## Data model (Prisma)

`User`, `Customer`, `Application`, `FinancialProfile`, `ApplicationNote`,
`CreditProductVersion`, `Offer`, `AuditLog` — see `prisma/schema.prisma`.
Credit product versions are immutable once published so historical offers stay
reproducible.

## Validation checklist (this batch)

- [x] `npm run test` — 14 credit-engine tests pass; `npm run build` green.
- [x] Login → **forced TOTP enrolment** → dashboard (verified E2E against Postgres).
- [x] Offer generated via the shared engine, bound to the product version.
- [x] Status change, notes, assignment persist; audit log records each action.
- [x] RBAC gates actions; middleware blocks `/admin` without a full session.
- [x] Public calculator reads DB published versions with static fallback.

## Before production

Provide/validate: legal company identity + Impressum, real product
availability/rates/fees, professional legal translations, brand vector logo,
transactional e-mail domain (DKIM/SPF/DMARC), DB/storage credentials, and the
compliance sign-off.
