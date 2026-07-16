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

  const inquiries = await prisma.landInquiry.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    select: {
      id: true, clientName: true, clientPhone: true, clientEmail: true,
      message: true, status: true, createdAt: true,
      land: { select: { title: true, slug: true, city: true } },
    },
  });

  return NextResponse.json(inquiries);
}
