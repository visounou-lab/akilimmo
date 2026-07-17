# SAND FINANZ GRUPPE

Standalone multilingual financing site, credit calculator and application portal.

> This application is **independent** and shares no code, assets, content or
> branding with any other project in this repository. It has its own
> `package.json`, dependencies, configuration and build.

Built to the *Plan directeur de reconstruction* (chapters 4–13). Source language
is **German**; public routes are `/de`, `/pl`, `/sv`, `/cz`
(the `/cz` route maps to the `cs-CZ` locale).

---

## What is implemented (this batch)

Batches 1–4 of the plan, delivered as a coherent, deployable slice:

- **i18n foundation** — locale routing `/de /pl /sv /cz`, German as source and
  fallback (no raw keys ever surface), per-locale currency + BCP-47 mapping.
- **Design system** — original SAND tokens (navy `#18305F`, CTA `#2666EB`,
  accent `#FF6A00`), accessible components, visible focus, reduced-motion
  support, responsive layout.
- **Public site** — Startseite, Leistungen, Kreditrechner, Ablauf, Unterlagen,
  Über uns, FAQ, Kontakt, Antrag + legal pages (Impressum, Datenschutz,
  Cookies, Nutzungsbedingungen).
- **Versioned credit engine** (`lib/credit-engine`) — the single source of truth
  used by the calculator (and, in later batches, offers/contracts). Constant
  monthly payment `M = P·r·(1+r)^n / ((1+r)^n − 1)` with the `r = 0` edge case,
  amortisation schedule, origination fees, indicative APR, per-product bounds.
  Fully **unit-tested** (`vitest`).
- **Calculator UI** — live results, amortisation table, product bounds, honest
  "simulation, not an offer" disclaimer.
- **Multi-step application form** — Projekt → Identität → Situation →
  Einwilligungen → Bestätigung, client + server validation, reference number.
- **Contact form** with server validation.
- **SEO** — per-locale metadata, `hreflang` + `x-default`, canonical,
  localized `sitemap.xml`, `robots.txt` (application flow is `noindex`),
  FAQ structured data.
- **Security baseline** — HSTS + hardening headers, no banking credentials ever
  collected, application flow excluded from indexing.

## Deliberately NOT yet built (later batches)

These are stubbed or noted in code so the boundary is explicit:

- **Persistence** — the intake API acknowledges and returns a reference but does
  not yet write to PostgreSQL (batch *Formulaire/Admin*).
- **Admin back-office** — auth + MFA, RBAC, dossiers, statuses, credit-parameter
  editor, audit log (batch *Admin*).
- **PDF generation** — offer, contract, deposit certificate, summary, schedule
  (batch *PDF*).
- **Secure uploads** — private storage, signed URLs, antivirus, hashing
  (batch *Formulaire uploads*).
- **Transactional e-mail** — Resend/Postmark acknowledgement.
- **Professional translations** — PL/SV/CZ cover the primary UI; deeper body and
  **all legal text** currently fall back to German and must be professionally
  (legally) translated before publication.

## ⚠️ Placeholder data — nothing legal or regulatory is invented

Per the plan's non-negotiable *Exactitude* / *Transparence* principles:

- Credit parameters in `lib/credit-engine/catalog.ts` (amounts, terms, **rates**,
  fees, product availability) are **examples** to make staging functional — not
  real SAND offers.
- Legal pages, company identity, registration numbers, partners and contact
  details are explicit placeholders, badged in the UI, to be replaced only after
  internal legal/compliance validation.

---

## Getting started

```bash
cd sand-finanz
npm install
cp .env.example .env.local   # optional for the public slice
npm run dev                  # http://localhost:3000  (redirects to /de)
```

### Scripts

| Command          | Purpose                                  |
| ---------------- | ---------------------------------------- |
| `npm run dev`    | Development server                       |
| `npm run build`  | Production build (SSG for all 4 locales) |
| `npm run start`  | Serve the production build               |
| `npm run test`   | Credit-engine unit tests (`vitest`)      |
| `npm run lint`   | ESLint (`next/core-web-vitals`)          |

### Environment variables

See `.env.example`. Only `NEXT_PUBLIC_SITE_URL` matters for the public slice
(drives canonical/hreflang/sitemap absolute URLs). The rest are placeholders for
later batches (DB, storage, e-mail, admin auth).

---

## Architecture

```
sand-finanz/
├─ app/
│  ├─ layout.tsx                 # root metadata
│  ├─ page.tsx                   # / → /de redirect
│  ├─ not-found.tsx              # root 404 (own html/body)
│  ├─ sitemap.ts, robots.ts
│  ├─ [locale]/
│  │  ├─ layout.tsx              # <html lang>, header/footer, SEO alternates
│  │  ├─ page.tsx                # Startseite
│  │  ├─ leistungen | kreditrechner | ablauf | unterlagen | ueber-uns
│  │  ├─ faq | kontakt | antrag
│  │  └─ impressum | datenschutz | cookies | nutzungsbedingungen
│  └─ api/antrag, api/kontakt    # intake endpoints (server validation)
├─ components/                   # Header, Footer, Calculator, ApplicationForm, …
├─ lib/
│  ├─ i18n/                      # locale config + translator (German fallback)
│  ├─ nav.ts                     # slug config + href helper
│  └─ credit-engine/             # types, engine, catalog, format, tests
└─ messages/                     # de.json (source) + pl, sv, cs
```

**Why the credit engine is isolated:** the public calculator and every generated
document must produce identical numbers for identical parameters. Keeping the
math and the versioned parameters in one module (and attaching an immutable
version to any future offer) guarantees a historical dossier never changes when
parameters are later edited.

---

## Validation checklist (this batch)

- [x] `npm run build` passes with no warnings; all 4 locales prerender.
- [x] `npm run test` — 14 credit-engine tests pass.
- [x] `/` redirects to `/de`; `/de /pl /sv /cz` return 200 with correct
      `<html lang>` (incl. `/cz` → `cs-CZ`).
- [x] No missing/raw i18n keys (German fallback).
- [x] `hreflang` (+ `x-default`) and `canonical` present; `sitemap.xml` and
      `robots.txt` generated; `/…/antrag` is `noindex` + disallowed.
- [x] Calculator output matches the server engine for the same parameters.
- [x] Application form completes and returns a reference; server rejects missing
      consent / invalid e-mail (422).
- [x] Responsive (desktop + mobile), visible keyboard focus, reduced-motion.

## Before production (from the plan)

Provide and validate: legal company identity + Impressum, real product
availability/rates/fees, professional legal translations (PL/SV/CZ), brand
vector logo, transactional e-mail domain (DKIM/SPF/DMARC), DB/storage/Vercel
credentials, and the compliance sign-off.
