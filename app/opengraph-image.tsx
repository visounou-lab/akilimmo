import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt     = "AKIL IMMO — Location au Bénin & Côte d'Ivoire";
export const size    = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width:           "100%",
          height:          "100%",
          display:         "flex",
          flexDirection:   "column",
          alignItems:      "center",
          justifyContent:  "center",
          background:      "linear-gradient(135deg, #1E3A8A 0%, #1E40AF 50%, #2563EB 100%)",
          fontFamily:      "sans-serif",
          padding:         "60px",
        }}
      >
        {/* Logo text */}
        <div
          style={{
            fontSize:    72,
            fontWeight:  800,
            color:       "white",
            letterSpacing: "-2px",
            marginBottom: 24,
          }}
        >
          AKIL IMMO
        </div>

        {/* Divider */}
        <div
          style={{
            width:           120,
            height:          4,
            background:      "rgba(255,255,255,0.5)",
            borderRadius:    2,
            marginBottom:    28,
          }}
        />

        {/* Tagline */}
        <div
          style={{
            fontSize:    30,
            color:       "rgba(255,255,255,0.90)",
            textAlign:   "center",
            maxWidth:    700,
            lineHeight:  1.4,
          }}
        >
          Location Appartements &amp; Villas
        </div>
        <div
          style={{
            fontSize:    26,
            color:       "rgba(255,255,255,0.75)",
            textAlign:   "center",
            marginTop:   12,
          }}
        >
          Bénin · Côte d&apos;Ivoire
        </div>

        {/* Bottom badge */}
        <div
          style={{
            position:        "absolute",
            bottom:          48,
            fontSize:        20,
            color:           "rgba(255,255,255,0.55)",
            letterSpacing:   "2px",
          }}
        >
          www.akilimmo.com
        </div>
      </div>
    ),
    { ...size }
  );
}
