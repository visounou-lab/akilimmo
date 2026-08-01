# Charte de marque — AKIL IMMO

> Version 1 · Ce document fait référence pour tout usage du logo, des couleurs,
> de la typographie et de la mascotte **AKI**. En cas de doute, ne pas
> improviser : réutiliser les fichiers fournis dans `public/brand/`.

---

## 1. Plateforme de marque

- **Nom :** AKIL IMMO
- **Signature :** « Vous êtes loin, nous sommes là. »
- **Métier :** agence immobilière de confiance — location meublée, gestion
  locative et suivi à distance, en Côte d'Ivoire et au Bénin (+ diaspora).
- **Personnalité :** premium, rassurante, humaine, africaine contemporaine.
  Jamais tape‑à‑l'œil, jamais enfantine.

---

## 2. Logo

Le logo est un **monogramme « A‑maison »** : un « A » qui se lit aussi comme une
maison à pignon avec une **porte en arc** (l'accueil, l'entrée), accompagné du
logotype **AKIL IMMO**.

**Le logo est la signature principale et permanente.**
AKI est la mascotte / ambassadrice publicitaire — **AKI ne remplace jamais le
logo** et n'est jamais présentée comme un logo.

### Déclinaisons (voir `public/brand/logo/` + son `README.md`)

| Forme | Quand l'utiliser |
|---|---|
| **Monogramme** seul | Avatar, favicon, tampon, pastille, filigrane |
| **Horizontal** (monogramme + AKIL IMMO) | En‑tête de site, e‑mail, bandeau, signature — le plus courant |
| **Empilé** (carré) | Posts carrés, packaging, cachet |
| **Tuile / badge** | Icône d'application, photo de profil réseaux |

Chaque forme existe en **or**, **ivoire**, **ink**, **monochrome**, et sur fonds
**ink / vert forêt / clair**. Le monogramme est fourni en **SVG** (vectoriel,
net à toute taille) — à préférer dès que possible.

### Zone de protection & taille minimale
- Garder autour du logo un espace vide **≥ la hauteur du monogramme**.
- Tailles minimales lisibles : **monogramme 24 px** ; **logotype horizontal
  120 px** de large.

### Interdits
- Ne pas déformer, incliner, ni changer les proportions.
- Ne pas recolorer hors palette ; ne pas poser l'**or sur fond clair** peu
  contrasté (préférer l'ink).
- Ne pas reconstituer « AKIL IMMO » dans une autre police que Playfair Display.
- Pas d'ombre portée criarde, pas de contour, pas de dégradé arc‑en‑ciel.

---

## 3. Couleurs

| Rôle | Nom | HEX | Usage |
|---|---|---|---|
| Signature | **Or** | `#C8922A` | Accents, « IMMO », traits, CTA |
| Or clair | Or clair | `#E3B75B` | Reflet supérieur des dégradés |
| Fond principal | **Ink** | `#1C1917` | Fonds sombres, tuiles, navbar |
| Univers AKI | **Vert forêt** | `#1B4D3E` | Bandeaux, affiches AKI, CTA secondaire |
| Clair | **Ivoire** | `#FDFCF8` | Texte sur sombre, fonds clairs |
| Alerte / WhatsApp | Orange | `#E07B39` | Bouton WhatsApp uniquement |

Deux mondes cohérents : **ink + or** (interface, logo) et **vert forêt + or**
(affiches et univers d'AKI). L'or et l'ivoire font le pont entre les deux.

---

## 4. Typographie

- **Titres & logotype : Playfair Display** — AKIL en poids 800, IMMO en 700.
  Élégante, sérif, haut de gamme.
- **Textes courants : Inter** (300–600) — lisible, moderne, neutre.

Règle : un seul niveau de titre sérif par visuel, beaucoup d'air, textes
espacés. Éviter les majuscules serrées.

---

## 5. AKI — la mascotte

AKI est une **maison‑personnage 3D** : toit vert forêt en porte‑à‑faux à liseré
or, façade verte et ivoire, deux fenêtres lumineuses, porte en bois, jardinière,
petits pieds, tablette intégrée et **clé dorée flottante**. C'est **le symbole
de la vigilance** : la promesse d'un accompagnement du premier contact jusqu'à
la remise des clés.

### Rôle
- AKI **incarne la promesse** dans la publicité et les réseaux, pour ancrer la
  marque dans les mémoires.
- AKI **accompagne** le logo ; elle ne le remplace pas.

### Références d'identité (à ne jamais modifier)
`public/brand/aki/aki-master-concept-v1.png` (concept maître) et
`aki-character-sheet-v1.png` (poses). Détourage transparent prêt à l'emploi :
`public/brand/aki/aki-cutout.png`.

### Règles
- Décor **ouest‑africain crédible** (Abidjan, Cotonou, Calavi) — éviter
  Dubaï / Europe / Amérique.
- Ne pas rendre AKI enfantine, ni la transformer en logo.
- Ne jamais inventer prix, taux, statistique, avis ou garantie.

---

## 6. Coordonnées officielles (à vérifier avant chaque publication)

| Pays | WhatsApp | Zones |
|---|---|---|
| **Bénin** | `+229 01 97 59 86 82` | Cotonou · Abomey‑Calavi |
| **Côte d'Ivoire** | `+225 07 10 25 91 46` | Abidjan |

Site : `www.akilimmo.com` · E‑mail : `info@akilimmo.com`
**Toujours afficher le numéro du bon pays.**

---

## 7. Où trouver quoi

```
public/brand/
├── logo/            Pack logo complet (SVG + PNG) + README d'usage
│   ├── svg/         Monogrammes vectoriels
│   ├── png/         Monogrammes rasterisés (512/1024)
│   ├── horizontal/  Logotypes horizontaux (tous fonds)
│   ├── stacked/     Logotypes empilés (carrés)
│   └── social/      Photos de profil circle‑safe
├── social/          Prêts à publier : profils + couverture Facebook
├── ads/             Gabarits pubs finis (feed 4:5, story 9:16 · CI & Bénin)
└── aki/             Mascotte AKI (concept, poses, détourage transparent)
```

Favicon / icônes d'app : `public/icon.svg`, `public/apple-touch-icon.png`,
`public/icon-192.png`, `public/icon-512.png`, `app/favicon.ico`.
Image de partage (OpenGraph) : `public/og-image.jpg`.

Pour **produire de nouvelles affiches AKI** : voir
`docs/PROMPTS-PUBLICITES-AKI.md`.
