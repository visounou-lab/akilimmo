import path from "node:path";
import { Font } from "@react-pdf/renderer";

/**
 * Registers a Unicode font (DejaVu Sans) so German umlauts, Polish/Czech
 * diacritics, the € sign etc. all render correctly across the customer locales.
 * The TTFs are bundled with the serverless function (see next.config
 * outputFileTracingIncludes).
 */
let registered = false;

export function ensureFonts() {
  if (registered) return;
  const dir = path.join(process.cwd(), "lib", "pdf", "fonts");
  Font.register({
    family: "SansUnicode",
    fonts: [
      { src: path.join(dir, "DejaVuSans.ttf"), fontWeight: 400 },
      { src: path.join(dir, "DejaVuSans-Bold.ttf"), fontWeight: 700 },
    ],
  });
  // Avoid hyphenation splitting long IBANs / references.
  Font.registerHyphenationCallback((word) => [word]);
  registered = true;
}
