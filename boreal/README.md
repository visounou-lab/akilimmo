# Boreal Finance Group

Plateforme premium de financement — **site public bilingue (FR/EN) + simulateur**.

> ⚠️ **Environnement de démonstration.** Ce projet est une démonstration. Aucune
> offre réelle, aucune donnée réelle : tous les contenus, taux et exemples sont
> fictifs et fournis à titre indicatif. Le taux « à partir de 3 % » n'est **ni
> automatique ni garanti**.

- **Domaine prévu :** borealfinanx.com
- **Société exploitante :** établie en Allemagne _(placeholders juridiques à compléter)_
- **Marché principal :** Canada
- **Langues :** français (principale) et anglais — routes `/fr` et `/en`

---

## Stack

| Domaine        | Technologie                                  |
| -------------- | -------------------------------------------- |
| Framework      | Next.js (App Router) + TypeScript **strict** |
| Styles         | Tailwind CSS v4 + design system « Boréal »    |
| Composants     | shadcn/ui (Radix UI)                          |
| i18n           | next-intl (FR/EN, préfixe de locale)          |
| Formulaires    | React Hook Form + Zod                        |
| Base de données| Prisma + PostgreSQL (Supabase)               |
| Emails         | Resend _(fondation posée)_                    |
| PDF            | Playwright _(phases suivantes)_               |
| Déploiement    | Vercel                                       |

## Périmètre — Phase 1

✅ Projet initialisé, arborescence, TypeScript / Tailwind / shadcn / next-intl
✅ Routes bilingues `/fr` et `/en`
✅ Design system (clair + sombre), header, footer, bannière démo
✅ Page d'accueil (hero, taux, simulateur rapide, produits, process, avantages, FAQ, CTA)
✅ Simulateur de financement (mensualité, coût total, échéancier)
✅ Pages : Financements, Comment ça fonctionne, À propos, FAQ, Contact,
   Mentions légales, Confidentialité, Réclamations
✅ Déployable sur Vercel

Les phases suivantes couvrent : formulaire de demande multiétape, espace client,
tableau de bord admin, rôles/permissions, messagerie, génération PDF.

## Démarrage

```bash
cp .env.example .env.local   # renseigner les valeurs (facultatif en Phase 1)
npm install
npm run dev                  # http://localhost:3000  → redirige vers /fr
```

> La Phase 1 (site public + simulateur) **ne nécessite pas** de base de données.
> Les variables Prisma/Supabase/Resend ne sont utiles qu'aux phases suivantes.

## Scripts

| Script              | Rôle                                  |
| ------------------- | ------------------------------------- |
| `npm run dev`       | Serveur de développement              |
| `npm run build`     | Build de production                   |
| `npm run start`     | Serveur de production                 |
| `npm run lint`      | ESLint                                |
| `npm run typecheck` | Vérification des types (tsc)          |

## Structure

```
src/
├─ app/
│  ├─ globals.css              # design system (tokens Tailwind v4)
│  ├─ [locale]/                # layout + pages bilingues
│  ├─ robots.ts · sitemap.ts
├─ components/
│  ├─ ui/                      # primitives shadcn/ui
│  ├─ layout/                  # header, footer, bannière démo, switcher langue
│  ├─ home/                    # sections de la page d'accueil
│  ├─ simulator/               # simulateur de financement
│  └─ contact/                 # formulaire de contact
├─ i18n/                       # routing, navigation, request (next-intl)
└─ lib/                        # utils, finance, products, prisma, supabase, resend
messages/                      # fr.json · en.json
prisma/schema.prisma           # fondation (User, Application, ContactMessage)
```

## Déploiement Vercel

1. Importer le dossier `boreal/` comme projet Vercel (framework détecté : Next.js).
2. Ajouter le domaine `borealfinanx.com`.
3. Variables d'environnement : facultatives en Phase 1 ; requises dès l'ajout
   de la base de données (voir `.env.example`).
4. Déployer. Le build (`next build`) est entièrement statique pour le site public.

## Règles produit (à respecter)

- Ne jamais présenter le taux de 3 % comme garanti.
- Ne jamais inventer de licence, numéro d'enregistrement ou autorité → **placeholders**.
- Ne jamais générer de faux documents officiels.
- Ne jamais demander de NIP, CVV, mot de passe bancaire ou code SMS.
- Toutes les données de démonstration sont **fictives**.
- Conserver la bannière « Environnement de démonstration » tant que le projet
  n'est pas en production.
