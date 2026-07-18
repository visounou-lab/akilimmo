import "server-only";
import bwipjs from "bwip-js";

/** Returns a PNG data URL of a Code128 barcode encoding `text` (e.g. the reference). */
export async function barcodeDataUrl(text: string): Promise<string> {
  const png = await bwipjs.toBuffer({
    bcid: "code128",
    text,
    scale: 3,
    height: 9,
    includetext: false,
    paddingwidth: 0,
    paddingheight: 0,
  });
  return `data:image/png;base64,${Buffer.from(png).toString("base64")}`;
}
