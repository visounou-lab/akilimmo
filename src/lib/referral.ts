import { prisma } from "@/lib/prisma";

export function normalizeReferralCode(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, "");
  return normalized.length >= 6 && normalized.length <= 24 ? normalized : null;
}

export async function createUniqueReferralCode(): Promise<string> {
  for (let attempt = 0; attempt < 5; attempt += 1) {
    const suffix = crypto.randomUUID().replaceAll("-", "").slice(0, 10).toUpperCase();
    const code = `AKI-${suffix}`;
    const exists = await prisma.user.findUnique({
      where: { referralCode: code },
      select: { id: true },
    });
    if (!exists) return code;
  }
  throw new Error("Impossible de générer un code de parrainage unique");
}

export async function findEligibleReferrer(rawCode: unknown) {
  const code = normalizeReferralCode(rawCode);
  if (!code) return null;

  return prisma.user.findFirst({
    where: {
      referralCode: code,
      status: "active",
      role: { in: ["OWNER", "AGENT"] },
      verificationCases: {
        some: {
          type: "IDENTITY",
          status: "APPROVED",
          OR: [{ expiresAt: null }, { expiresAt: { gt: new Date() } }],
        },
      },
    },
    select: { id: true, referralCode: true },
  });
}
