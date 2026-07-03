import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });

  const admin = await prisma.user.findUnique({
    where: { id: userId },
    select: { role: true },
  });
  if (admin?.role !== "ADMIN") {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const cases = await prisma.verificationCase.findMany({
    where: {
      status: "PENDING",
      type: { in: ["IDENTITY", "OWNER_AUTHORITY", "PROFESSIONAL"] },
    },
    orderBy: [{ submittedAt: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      type: true,
      status: true,
      submittedAt: true,
      subjectUser: {
        select: {
          id: true,
          name: true,
          email: true,
          phone: true,
          country: true,
          city: true,
          requestedRole: true,
        },
      },
      documents: {
        orderBy: { createdAt: "asc" },
        select: {
          id: true,
          type: true,
          originalName: true,
          mimeType: true,
          sizeBytes: true,
          createdAt: true,
        },
      },
    },
  });

  return NextResponse.json(cases);
}
