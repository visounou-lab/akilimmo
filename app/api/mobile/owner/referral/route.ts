import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";
import { createUniqueReferralCode } from "@/lib/referral";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const account = await prisma.user.findUnique({
    where: { id: user.id },
    select: {
      referralCode: true,
      status: true,
      role: true,
      verificationCases: {
        where: { type: "IDENTITY", status: "APPROVED" },
        take: 1,
        select: { id: true, expiresAt: true },
      },
    },
  });
  if (!account) return NextResponse.json({ error: "Compte introuvable" }, { status: 404 });

  const identityVerification = account.verificationCases[0];
  const isEligible =
    account.status === "active" &&
    ["OWNER", "AGENT"].includes(account.role) &&
    Boolean(identityVerification) &&
    (!identityVerification?.expiresAt || identityVerification.expiresAt > new Date());

  if (!isEligible) {
    return NextResponse.json({
      eligible: false,
      code: null,
      referralCount: 0,
      estimatedEarnings: 0,
      description: "Votre code sera disponible après validation de votre identité et de votre rôle.",
    });
  }

  let code = account.referralCode;
  if (!code) {
    code = await createUniqueReferralCode();
    await prisma.user.update({ where: { id: user.id }, data: { referralCode: code } });
  }

  const referralCount = await prisma.user.count({
    where: { referredById: user.id },
  });

  return NextResponse.json({
    eligible: true,
    code,
    referralCount,
    estimatedEarnings: 0,
    description:
      "Le parrainage est enregistré à l'inscription. Une récompense éventuelle reste verrouillée jusqu'à la vérification du filleul et à une transaction éligible.",
  });
}
