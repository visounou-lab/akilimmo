import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const payment = await prisma.payment.findFirst({
    where: { payerId: user.id, status: "PENDING" },
    orderBy: { dueDate: "asc" },
    select: { id: true, amount: true, dueDate: true, status: true },
  });

  if (!payment) return NextResponse.json(null);

  return NextResponse.json({
    ...payment,
    amount: Number(payment.amount),
    dueDate: payment.dueDate.toISOString(),
  });
}
