import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const [total, published, requests] = await Promise.all([
    prisma.property.count({ where: { ownerId: user.id } }),
    prisma.property.count({ where: { ownerId: user.id, publishStatus: "published" } }),
    prisma.documentRequest.count({ where: { ownerId: user.id, status: "pending" } }).catch(() => 0),
  ]);

  return NextResponse.json({
    totalProperties: total,
    publishedProperties: published,
    pendingRequests: requests,
  });
}
