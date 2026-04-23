const ALLOWED_HANDLE = "akilimmo1";

export async function GET(request: Request) {
  const url = new URL(request.url).searchParams.get("url");
  if (!url) return Response.json({ valid: false, error: "URL manquante" });

  try {
    const oembedRes = await fetch(
      `https://www.youtube.com/oembed?url=${encodeURIComponent(url)}&format=json`,
      { next: { revalidate: 0 } }
    );
    if (!oembedRes.ok) {
      return Response.json({ valid: false, error: "Vidéo introuvable sur YouTube" });
    }
    const data = await oembedRes.json() as { author_url?: string; author_name?: string };
    const authorUrl = (data.author_url ?? "").toLowerCase();
    const isAkilimmo = authorUrl.includes(ALLOWED_HANDLE);
    return Response.json({
      valid: isAkilimmo,
      channelName: data.author_name,
      error: isAkilimmo ? null : "Cette vidéo n'appartient pas à la chaîne AKIL IMMO",
    });
  } catch {
    return Response.json({ valid: false, error: "Impossible de vérifier la vidéo" });
  }
}
