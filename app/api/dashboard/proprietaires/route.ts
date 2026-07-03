import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET() {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }

  const adminUser = await prisma.user.findUnique({
    where: { id: (session.user as { id: string }).id },
    select: { role: true },
  });
  if (adminUser?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const owners = await prisma.user.findMany({
    where: {
      OR: [{ role: "OWNER" }, { requestedRole: { in: ["OWNER", "AGENT"] } }],
    },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      name: true,
      email: true,
      country: true,
      city: true,
      phone: true,
      isVerified: true,
      requestedRole: true,
      status: true,
      verificationCases: {
        where: { type: { in: ["IDENTITY", "PROFESSIONAL"] } },
        orderBy: { createdAt: "desc" },
        select: { type: true, status: true, expiresAt: true },
      },
      createdAt: true,
    },
  });

  return NextResponse.json(owners);
}
