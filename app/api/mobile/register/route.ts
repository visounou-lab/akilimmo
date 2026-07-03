import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { createUniqueReferralCode, findEligibleReferrer, normalizeReferralCode } from "@/lib/referral";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, password, role, referralCode } = await req.json();

    if (!name?.trim() || !email?.trim() || !password?.trim()) {
      return NextResponse.json({ error: "Nom, email et mot de passe sont requis." }, { status: 400 });
    }

    if (!["TENANT", "OWNER"].includes(role)) {
      return NextResponse.json({ error: "Rôle invalide." }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit contenir au moins 8 caractères." }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (existing) {
      return NextResponse.json({ error: "Un compte existe déjà avec cet email." }, { status: 409 });
    }

    const hashed = await bcrypt.hash(password, 12);
    const normalizedReferralCode = normalizeReferralCode(referralCode);
    const referrer = normalizedReferralCode
      ? await findEligibleReferrer(normalizedReferralCode)
      : null;

    if (normalizedReferralCode && !referrer) {
      return NextResponse.json(
        { error: "Code de parrainage invalide ou parrain non vérifié." },
        { status: 400 },
      );
    }

    const isRoleCandidate = role === "OWNER";
    const personalReferralCode = await createUniqueReferralCode();

    await prisma.user.create({
      data: {
        name:     name.trim(),
        email:    email.toLowerCase().trim(),
        phone:    phone?.trim() || null,
        password: hashed,
        role: "TENANT",
        requestedRole: isRoleCandidate ? "OWNER" : null,
        status: isRoleCandidate ? "pending" : "active",
        referralCode: personalReferralCode,
        referredById: referrer?.id,
        ...(isRoleCandidate && {
          verificationCases: {
            create: {
              type: "IDENTITY" as const,
              status: "NOT_SUBMITTED" as const,
            },
          },
        }),
      },
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Erreur serveur. Réessayez." }, { status: 500 });
  }
}
