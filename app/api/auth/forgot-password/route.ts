import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendPasswordResetEmail } from "@/lib/mailer";
import { randomBytes } from "crypto";

export async function POST(req: NextRequest) {
  const { email } = await req.json();

  if (!email) return NextResponse.json({ error: "Email requis" }, { status: 400 });

  const user = await prisma.user.findUnique({
    where: { email: email.toLowerCase().trim() },
    select: { id: true, name: true, email: true },
  });

  if (user) {
    const token   = randomBytes(32).toString("hex");
    const expires = new Date(Date.now() + 60 * 60 * 1000); // 1h

    await prisma.user.update({
      where: { id: user.id },
      data:  { resetToken: token, resetExpires: expires },
    });

    const firstName = user.name?.split(" ")[0] ?? "Utilisateur";
    await sendPasswordResetEmail(user.email, firstName, token).catch(() => {});
  }

  return NextResponse.json({ message: "ok" });
}
