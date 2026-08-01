/**
 * Identité visuelle AKIL IMMO — logo & logotype.
 *
 * Le monogramme est un « A » qui se lit aussi comme une maison à pignon,
 * avec une porte en arc (accueil / entrée). Or #C8922A sur ink #1C1917 —
 * la palette officielle de la marque (cf. components/v3, Navbar/Footer).
 *
 * Deux composants, sans dépendance ni état (utilisables côté serveur) :
 *   <Logomark />   — le symbole seul (SVG), déclinable en tuile ou nu.
 *   <BrandLogo />  — le lockup horizontal (symbole + « AKIL IMMO »).
 *
 * Le dégradé doré « premium » vit dans les assets rasterisés (icon.svg,
 * logo.png, og-image) ; ici on reste en aplat pour un rendu net à petite
 * taille et une réutilisation sans collision d'identifiants SVG.
 */

export const BRAND = {
  gold: "#C8922A",
  goldHi: "#E3B75B",
  goldDeep: "#A97620",
  ink: "#1C1917",
  ivory: "#FDFCF8",
  forest: "#1B4D3E",
} as const;

/** Tracé du monogramme (viewBox 0 0 96 96) — source unique de vérité. */
export const MARK_PATH =
  "M48 8 L87 85 L71.5 85 L48 26 L24.5 85 L9 85 Z " +
  "M22.68 53 L73.32 53 L73.32 63 L22.68 63 Z " +
  "M40.25 85 L40.25 56 A7.75 7.75 0 0 1 55.75 56 L55.75 85 Z";

type Tone = "gold" | "ink" | "ivory" | "currentColor";

function toneColor(tone: Tone): string {
  switch (tone) {
    case "gold":
      return BRAND.gold;
    case "ink":
      return BRAND.ink;
    case "ivory":
      return BRAND.ivory;
    default:
      return "currentColor";
  }
}

export function Logomark({
  size = 32,
  tone = "gold",
  tile = false,
  tileTone = "ink",
  title = "AKIL IMMO",
  className,
  style,
}: {
  /** Côté du symbole en px. */
  size?: number;
  /** Couleur du tracé. */
  tone?: Tone;
  /** Poser le symbole sur une tuile arrondie (façon app-icon). */
  tile?: boolean;
  /** Couleur de la tuile. */
  tileTone?: "ink" | "ivory";
  /** Texte accessible ; passer "" pour un rôle purement décoratif. */
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}) {
  const decorative = title === "";

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 96 96"
      className={className}
      style={style}
      role={decorative ? "presentation" : "img"}
      aria-hidden={decorative || undefined}
      aria-label={decorative ? undefined : title}
      xmlns="http://www.w3.org/2000/svg"
    >
      {!decorative && <title>{title}</title>}
      {tile && (
        <rect
          x="0"
          y="0"
          width="96"
          height="96"
          rx="22"
          fill={tileTone === "ivory" ? BRAND.ivory : BRAND.ink}
        />
      )}
      <path d={MARK_PATH} fill={toneColor(tone)} fillRule="evenodd" />
    </svg>
  );
}

export function BrandLogo({
  height = 32,
  theme = "dark",
  showWordmark = true,
  className,
  style,
}: {
  /** Hauteur du symbole en px (le logotype s'aligne dessus). */
  height?: number;
  /** "dark" : sur fond ink (AKIL ivoire). "light" : sur fond clair (AKIL ink). */
  theme?: "dark" | "light";
  showWordmark?: boolean;
  className?: string;
  style?: React.CSSProperties;
}) {
  const akilColor = theme === "dark" ? BRAND.ivory : BRAND.ink;

  return (
    <span
      className={className}
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: Math.round(height * 0.34),
        ...style,
      }}
    >
      <Logomark size={height} title={showWordmark ? "" : "AKIL IMMO"} />
      {showWordmark && (
        <span
          aria-label="AKIL IMMO"
          style={{
            display: "inline-flex",
            alignItems: "baseline",
            gap: "0.32em",
            fontFamily: "var(--font-playfair), Georgia, serif",
            fontWeight: 700,
            fontSize: Math.round(height * 0.58),
            lineHeight: 1,
            letterSpacing: "0.06em",
            whiteSpace: "nowrap",
          }}
        >
          <span style={{ color: akilColor }}>AKIL</span>
          <span style={{ color: BRAND.gold }}>IMMO</span>
        </span>
      )}
    </span>
  );
}

export default BrandLogo;
