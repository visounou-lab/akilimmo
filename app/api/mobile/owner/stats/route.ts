import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const now = new Date();
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

  const [total, published, pendingRequests, revenueAgg] = await Promise.all([
    prisma.property.count({ where: { ownerId: user.id } }),
    prisma.property.count({ where: { ownerId: user.id, publishStatus: "published" } }),
    prisma.reservationRequest.count({
      where: { property: { ownerId: user.id }, status: "pending" },
    }),
    prisma.payment.aggregate({
      where: {
        status: "PAID",
        paidAt: { gte: startOfMonth },
        contract: { property: { ownerId: user.id } },
      },
      _sum: { netAmount: true, amount: true },
    }),
  ]);

  const monthlyRevenue = Number(revenueAgg._sum.netAmount ?? revenueAgg._sum.amount ?? 0);

  return NextResponse.json({
    totalProperties:    total,
    publishedProperties: published,
    pendingRequests,
    monthlyRevenue,
  });
}
