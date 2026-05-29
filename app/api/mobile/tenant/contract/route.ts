import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const contract = await prisma.contract.findFirst({
    where: { tenantId: user.id, status: "ACTIVE" },
    select: {
      id: true,
      rentAmount: true,
      endDate: true,
      property: { select: { title: true, city: true, address: true } },
    },
  });

  if (!contract) return NextResponse.json(null);

  return NextResponse.json({
    ...contract,
    rentAmount: Number(contract.rentAmount),
    endDate: contract.endDate.toISOString(),
  });
}
