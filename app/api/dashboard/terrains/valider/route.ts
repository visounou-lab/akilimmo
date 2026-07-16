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

  const lands = await prisma.land.findMany({
    where:   { publishStatus: "pending_review" },
    orderBy: { createdAt: "asc" },
    select: {
      id: true, title: true, city: true, country: true, address: true, price: true,
      surface: true, titleType: true, serviced: true, description: true,
      imageUrl: true, images: true, videoUrl: true, adminNote: true, createdAt: true,
      submitter: { select: { name: true, email: true } },
      owner:     { select: { name: true, email: true } },
    },
  });

  return NextResponse.json(
    lands.map((l) => ({ ...l, price: l.price.toString() }))
  );
}
