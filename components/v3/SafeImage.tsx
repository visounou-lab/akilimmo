"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { PLACEHOLDER_SVG } from "@/lib/youtube";

/**
 * next/image qui bascule sur un placeholder neutre si l'image échoue à charger
 * (URL morte/supprimée, domaine non autorisé par remotePatterns, timeout, VPN…).
 * Évite les cartes « noires » quand une photo de bien est cassée.
 *
 * Le placeholder est une data URI SVG → toujours servi en `unoptimized`.
 */
type SafeImageProps = Omit<ImageProps, "onError" | "src"> & {
  src: string;
  /** classe appliquée à la place de `className` quand on affiche le placeholder */
  fallbackClassName?: string;
};

export default function SafeImage({
  src,
  alt,
  className,
  fallbackClassName,
  unoptimized,
  ...rest
}: SafeImageProps) {
  const [failed, setFailed] = useState(false);

  // Réinitialise l'état d'échec si la source change (ex. carrousel).
  useEffect(() => {
    setFailed(false);
  }, [src]);

  return (
    <Image
      {...rest}
      src={failed ? PLACEHOLDER_SVG : src}
      alt={alt}
      unoptimized={failed ? true : unoptimized}
      onError={() => setFailed(true)}
      className={failed ? (fallbackClassName ?? className) : className}
    />
  );
}
