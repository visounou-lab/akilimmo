import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payments = await prisma.payment.findMany({
    where: { payerId: user.id },
    orderBy: { dueDate: "desc" },
    take: 24,
    select: {
      id: true,
      amount: true,
      status: true,
      dueDate: true,
      paidAt: true,
      paymentMethod: true,
    },
  });

  return NextResponse.json(
    payments.map((p) => ({
      ...p,
      amount: Number(p.amount),
      dueDate: p.dueDate.toISOString(),
      paidAt: p.paidAt?.toISOString() ?? null,
    }))
  );
}
