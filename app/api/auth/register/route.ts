import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { sendVerificationEmail, sendNewOwnerNotification } from "@/lib/mailer";
import { rateLimit } from "@/lib/ratelimit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0] ?? "unknown";
  const { allowed, retryAfterMs } = rateLimit(`register:${ip}`, 3, 3_600_000);
  if (!allowed) {
    return NextResponse.json(
      { error: "Trop d'inscriptions depuis cette adresse. Réessayez plus tard." },
      { status: 429, headers: { "Retry-After": String(Math.ceil(retryAfterMs / 1000)) } },
    );
  }

  try {
    const { firstName, lastName, email, phone, country, city, password } = await req.json();

    if (!firstName || !lastName || !email || !phone || !country || !city || !password) {
      return NextResponse.json({ error: "Tous les champs sont requis" }, { status: 400 });
    }

    if (password.length < 8) {
      return NextResponse.json({ error: "Le mot de passe doit faire au moins 8 caractères" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: "Cette adresse email est déjà utilisée" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyToken = crypto.randomUUID();
    const verifyExpires = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await prisma.user.create({
      data: {
        name: `${firstName} ${lastName}`,
        email,
        phone,
        country: country as "BENIN" | "COTE_D_IVOIRE",
        city,
        password: hashedPassword,
        role: "OWNER",
        isVerified: false,
        status: "pending",
        verifyToken,
        verifyExpires,
      },
    });

    await sendVerificationEmail(email, verifyToken);
    await sendNewOwnerNotification({ name: `${firstName} ${lastName}`, email, country, city });

    return NextResponse.json({ message: "Compte créé. Vérifiez votre email." }, { status: 201 });
  } catch (error) {
    console.error("Register error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
