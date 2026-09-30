"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import {
  generateTwoFactorSecret,
  twoFactorQrDataUrl,
  verifyTwoFactorToken,
} from "@/lib/twofactor";

async function requireAdminId(): Promise<string> {
  const session = await auth();
  const u = session?.user as { id?: string; role?: string } | undefined;
  if (!u?.id || u.role !== "ADMIN") throw new Error("Accès refusé");
  return u.id;
}

/**
 * Démarre l'enrôlement : génère un secret, l'enregistre (2FA encore inactive),
 * et renvoie le QR + la clé manuelle. Refusé si la 2FA est déjà active
 * (désactiver d'abord pour régénérer).
 */
export async function startEnroll(): Promise<
  { ok: true; qr: string; secret: string } | { ok: false; error: string }
> {
  const id = await requireAdminId();
  const current = await prisma.user.findUnique({
    where: { id },
    select: { twoFactorEnabled: true },
  });
  if (current?.twoFactorEnabled) {
    return { ok: false, error: "La 2FA est déjà activée. Désactivez-la d'abord pour la régénérer." };
  }
  const secret = generateTwoFactorSecret();
  const user = await prisma.user.update({
    where: { id },
    data: { twoFactorSecret: secret, twoFactorEnabled: false },
    select: { email: true },
  });
  const qr = await twoFactorQrDataUrl(user.email, secret);
  return { ok: true, qr, secret };
}

/** Confirme l'enrôlement avec un code de l'application → active la 2FA. */
export async function confirmEnroll(code: string): Promise<{ ok: boolean; error?: string }> {
  const id = await requireAdminId();
  const user = await prisma.user.findUnique({
    where: { id },
    select: { twoFactorSecret: true },
  });
  if (!user?.twoFactorSecret) return { ok: false, error: "Générez d'abord un QR code." };
  if (!verifyTwoFactorToken(code, user.twoFactorSecret)) {
    return { ok: false, error: "Code invalide. Vérifiez l'heure de votre téléphone et réessayez." };
  }
  await prisma.user.update({ where: { id }, data: { twoFactorEnabled: true } });
  revalidatePath("/dashboard/securite");
  revalidatePath("/dashboard");
  return { ok: true };
}

/** Désactive la 2FA (exige un code valide pour éviter une désactivation abusive). */
export async function disableTwoFactor(code: string): Promise<{ ok: boolean; error?: string }> {
  const id = await requireAdminId();
  const user = await prisma.user.findUnique({
    where: { id },
    select: { twoFactorSecret: true, twoFactorEnabled: true },
  });
  if (!user?.twoFactorEnabled || !user.twoFactorSecret) return { ok: true };
  if (!verifyTwoFactorToken(code, user.twoFactorSecret)) {
    return { ok: false, error: "Code invalide." };
  }
  await prisma.user.update({
    where: { id },
    data: { twoFactorEnabled: false, twoFactorSecret: null },
  });
  revalidatePath("/dashboard/securite");
  return { ok: true };
}
