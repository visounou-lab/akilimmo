import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const properties = await prisma.property.findMany({
    where: { ownerId: user.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true, title: true, city: true,
      price: true, status: true, publishStatus: true,
    },
  });

  return NextResponse.json(
    properties.map((p) => ({ ...p, price: Number(p.price) }))
  );
}
