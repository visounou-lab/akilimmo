import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const entries = await prisma.waitlistEntry.findMany({
    orderBy: { createdAt: "desc" },
    take: 500,
    select: { id: true, email: true, source: true, country: true, createdAt: true },
  });

  return NextResponse.json(entries);
}
