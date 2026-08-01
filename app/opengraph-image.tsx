import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "AKIL IMMO — Location au Bénin & Côte d'Ivoire";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

// Monogramme AKIL IMMO — un « A » qui se lit comme une maison à pignon.
const MARK_PATH =
  "M48 8 L87 85 L71.5 85 L48 26 L24.5 85 L9 85 Z " +
  "M22.68 53 L73.32 53 L73.32 63 L22.68 63 Z " +
  "M40.25 85 L40.25 56 A7.75 7.75 0 0 1 55.75 56 L55.75 85 Z";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          background: "linear-gradient(135deg, #26211C 0%, #1C1917 55%, #14110F 100%)",
          fontFamily: "serif",
          padding: 60,
          position: "relative",
        }}
      >
        {/* Cadre or */}
        <div
          style={{
            position: "absolute",
            top: 28,
            left: 28,
            right: 28,
            bottom: 28,
            border: "1.5px solid #C8922A",
            borderRadius: 4,
          }}
        />

        {/* Monogramme */}
        <svg width="150" height="150" viewBox="0 0 96 96" style={{ marginBottom: 28 }}>
          <path d={MARK_PATH} fill="#C8922A" fillRule="evenodd" />
        </svg>

        {/* Logotype */}
        <div style={{ display: "flex", fontSize: 92, fontWeight: 700, letterSpacing: 4 }}>
          <span style={{ color: "#FDFCF8" }}>AKIL</span>
          <span style={{ width: 24 }} />
          <span style={{ color: "#C8922A" }}>IMMO</span>
        </div>

        {/* Ornement */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 26, marginBottom: 24 }}>
          <div style={{ width: 70, height: 1.5, background: "#C8922A" }} />
          <div style={{ width: 9, height: 9, background: "#C8922A", transform: "rotate(45deg)" }} />
          <div style={{ width: 70, height: 1.5, background: "#C8922A" }} />
        </div>

        {/* Tagline */}
        <div style={{ fontSize: 38, color: "rgba(253,252,248,0.92)", fontFamily: "sans-serif" }}>
          Vous êtes loin, nous sommes là.
        </div>
        <div style={{ fontSize: 24, color: "rgba(253,252,248,0.6)", marginTop: 14, fontFamily: "sans-serif" }}>
          Location meublée · Bénin · Côte d&apos;Ivoire
        </div>

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 54,
            fontSize: 22,
            color: "#C8922A",
            letterSpacing: 4,
            fontFamily: "sans-serif",
          }}
        >
          WWW.AKILIMMO.COM
        </div>
      </div>
    ),
    { ...size }
  );
}
