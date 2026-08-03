# Brand kit — affiches « AKI CONSEILLE »

Générateur des affiches de prévention AKIL IMMO mettant en scène la mascotte
**AKI** (la maison-mascotte) qui délivre un conseil clé. Série pensée pour la
communication réseaux sociaux (Facebook, Instagram, statut WhatsApp).

## Ce que ça produit

Pour chaque conseil, deux formats prêts à publier dans `public/brand/ads/` :

| Fichier | Taille | Usage |
|---|---|---|
| `<slug>-1x1.png` | 1080×1080 | Feed Facebook / Instagram |
| `<slug>-9x16.png` | 1080×1920 | Story / statut WhatsApp |

Structure fixe (badge or « AKI CONSEILLE », grand titre Playfair, carte-conseil
signée AKI, bandeau contact) → seuls **le titre** et **le conseil** changent.
C'est ce qui construit la mémoire de marque : les gens reconnaissent AKI.

## Ajouter un conseil

1. Ouvrir `gen_aki_poster.py`, ajouter une entrée dans la liste `CONSEILS` :

   ```python
   {
       "slug":  "aki-conseil-visite",
       "badge": "AKI CONSEILLE  ·  SÉCURITÉ",
       "title": "Vérifier un propriétaire avant de payer",
       "tip":   "Demandez une pièce d'identité et le titre de propriété. Un vrai bailleur n'a rien à cacher.",
       "sign":  "— AKI veille sur vous.",
       "zone":  "BÉNIN · CÔTE D'IVOIRE",
   },
   ```

2. Lancer :

   ```bash
   pip install Pillow cairosvg      # une seule fois
   python3 brand-kit/gen_aki_poster.py
   ```

Les images sont (re)générées dans `public/brand/ads/`.

## Sources

- Mascotte : `public/brand/aki/aki-cutout.png` (détourée).
- Polices : `brand-kit/fonts/` — Playfair Display + Inter (licence SIL OFL).
- Palette : ink `#1C1917`, or `#C8922A`, or clair `#E3B75B`, vert forêt `#1B4D3E`.
