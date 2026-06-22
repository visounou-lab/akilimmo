"use client";

import { useEffect } from "react";

export default function ViewTracker({ slug }: { slug: string }) {
  useEffect(() => {
    const key = `akil_viewed_${slug}`;
    // Une seule vue par session navigateur
    if (sessionStorage.getItem(key)) return;
    sessionStorage.setItem(key, "1");
    fetch(`/api/property/${slug}/view`, { method: "POST" }).catch(() => {});
  }, [slug]);

  return null;
}
