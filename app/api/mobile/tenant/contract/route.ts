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
      startDate: true,
      endDate: true,
      property: {
        select: {
          title: true,
          city: true,
          address: true,
          imageUrl: true,
          bedrooms: true,
          propertyType: true,
          images: {
            where: { isPrimary: true, status: "APPROVED" },
            take: 1,
            select: { url: true },
          },
        },
      },
    },
  });

  if (!contract) return NextResponse.json(null);

  return NextResponse.json({
    ...contract,
    rentAmount: Number(contract.rentAmount),
    startDate:  contract.startDate.toISOString(),
    endDate:    contract.endDate.toISOString(),
    property: {
      ...contract.property,
      coverImage: contract.property.images[0]?.url ?? contract.property.imageUrl ?? null,
      images: undefined,
    },
  });
}
