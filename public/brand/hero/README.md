# Image de fond du hero (accueil)

Déposer ici la photo de fond du hero, idéalement une **vraie photo d'un bien
AKIL IMMO** (Abidjan / Cotonou / Abomey-Calavi) plutôt qu'une image de stock.

## Comment l'activer

1. Déposer le fichier dans ce dossier, par ex. `villa-hero.jpg`
   (format paysage, ≥ 1600 px de large, JPG optimisé < 400 Ko de préférence).
2. Dans `components/v3/HeroSection.tsx`, remplacer la constante `HERO_IMAGE` par :

   ```ts
   const HERO_IMAGE = "/brand/hero/villa-hero.jpg";
   ```

3. Mettre à jour `HERO_IMAGE_ALT` avec une description fidèle du bien.

## Repères d'identité

- Décor **ouest-africain** de préférence (éviter Dubaï / Europe / Amérique) —
  cf. `docs/PROMPTS-PUBLICITES-AKI.md`.
- Une photo trop « villa de luxe » peut créer un décalage avec le catalogue
  (appartements 30 000–60 000 XOF / nuit). Choisir un visuel cohérent avec
  l'offre réelle renforce la confiance.
- Le voile vert forêt du hero s'occupe de l'ambiance de marque : la photo peut
  être lumineuse, elle sera automatiquement fondue dans l'identité AKIL IMMO.
