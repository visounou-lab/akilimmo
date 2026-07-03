import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail } from "@/lib/mailer";
import { notifyNewAgentApplication } from "@/lib/telegram";
import { rateLimit } from "@/lib/ratelimit";
import {
  createUniqueReferralCode,
  findEligibleReferrer,
  normalizeReferralCode,
} from "@/lib/referral";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const PASSWORD_PATTERN = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{10,}$/;

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const { allowed, retryAfterMs } = rateLimit(`register-agent:${ip}`, 3, 3_600_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop de tentatives. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  try {
    const body = (await req.json()) as Record<string, unknown>;
    const agencyName = String(body.agencyName ?? "").trim();
    const firstName = String(body.firstName ?? "").trim();
    const lastName = String(body.lastName ?? "").trim();
    const email = String(body.email ?? "").trim().toLowerCase();
    const phone = String(body.phone ?? "").trim();
    const city = String(body.city ?? "").trim();
    const country = String(body.country ?? "");
    const password = String(body.password ?? "");
    const referralCode = String(body.referralCode ?? "");
    const acceptedTerms = body.acceptedTerms === true;

    if (
      !agencyName ||
      !firstName ||
      !lastName ||
      !email ||
      !phone ||
      !city ||
      !["BENIN", "COTE_D_IVOIRE"].includes(country)
    ) {
      return NextResponse.json({ error: "Tous les champs obligatoires sont requis." }, { status: 400 });
    }
    if (!EMAIL_PATTERN.test(email)) {
      return NextResponse.json({ error: "Adresse email invalide." }, { status: 400 });
    }
    if (!PASSWORD_PATTERN.test(password)) {
      return NextResponse.json(
        { error: "Le mot de passe doit contenir au moins 10 caractères, une majuscule, une minuscule et un chiffre." },
        { status: 400 },
      );
    }
    if (!acceptedTerms) {
      return NextResponse.json(
        { error: "Vous devez accepter les conditions et la politique de confidentialité." },
        { status: 400 },
      );
    }

    const [existingUser, existingApplication] = await Promise.all([
      prisma.user.findUnique({ where: { email }, select: { id: true } }),
      prisma.agentApplication.findFirst({ where: { email }, select: { id: true, userId: true } }),
    ]);
    if (existingUser || existingApplication?.userId) {
      return NextResponse.json({ error: "Cette adresse email est déjà utilisée." }, { status: 409 });
    }

    const normalizedReferralCode = normalizeReferralCode(referralCode);
    const referrer = normalizedReferralCode
      ? await findEligibleReferrer(normalizedReferralCode)
      : null;
    if (normalizedReferralCode && !referrer) {
      return NextResponse.json(
        { error: "Ce code de parrainage est invalide ou son titulaire n’est pas vérifié." },
        { status: 400 },
      );
    }

    const verifyToken = crypto.randomUUID();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);
    const passwordHash = await bcrypt.hash(password, 12);
    const personalReferralCode = await createUniqueReferralCode();

    await prisma.$transaction(async (tx) => {
      const user = await tx.user.create({
        data: {
          name: `${firstName} ${lastName}`,
          email,
          phone,
          country: country as "BENIN" | "COTE_D_IVOIRE",
          city,
          password: passwordHash,
          role: "TENANT",
          requestedRole: "AGENT",
          isVerified: false,
          status: "pending",
          referralCode: personalReferralCode,
          referredById: referrer?.id,
          verifyToken,
          verifyExpires,
          verificationCases: {
            create: [
              { type: "IDENTITY", status: "NOT_SUBMITTED" },
              { type: "PROFESSIONAL", status: "NOT_SUBMITTED" },
            ],
          },
        },
      });

      if (existingApplication) {
        await tx.agentApplication.update({
          where: { id: existingApplication.id },
          data: {
            userId: user.id,
            agencyName,
            contactName: `${firstName} ${lastName}`,
            phone,
            city,
            country: country as "BENIN" | "COTE_D_IVOIRE",
            documentType: "SECURE_VERIFICATION_REQUIRED",
          },
        });
      } else {
        await tx.agentApplication.create({
          data: {
            userId: user.id,
            agencyName,
            contactName: `${firstName} ${lastName}`,
            email,
            phone,
            city,
            country: country as "BENIN" | "COTE_D_IVOIRE",
            documentType: "SECURE_VERIFICATION_REQUIRED",
          },
        });
      }
    });

    await Promise.allSettled([
      sendVerificationEmail(email, verifyToken),
      notifyNewAgentApplication({
        agencyName,
        contactName: `${firstName} ${lastName}`,
        email,
        city,
        country,
        documentType: "Dossier sécurisé à compléter",
      }),
    ]);

    return NextResponse.json(
      {
        message: "Compte créé. Confirmez votre email pour transmettre vos justificatifs.",
        referralRecorded: Boolean(referrer),
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("[register agent]", error);
    return NextResponse.json({ error: "Création du compte impossible." }, { status: 500 });
  }
}
