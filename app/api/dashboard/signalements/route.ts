import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const adminId = (session?.user as { id?: string } | undefined)?.id;
  if (!adminId) return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  const admin = await prisma.user.findUnique({ where: { id: adminId }, select: { role: true } });
  if (admin?.role !== "ADMIN") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const reports = await prisma.listingReport.findMany({
    where: { status: { in: ["OPEN", "IN_REVIEW"] } },
    orderBy: [{ priority: "asc" }, { createdAt: "asc" }],
    select: {
      id: true,
      reason: true,
      details: true,
      priority: true,
      status: true,
      reporterEmail: true,
      createdAt: true,
      property: {
        select: {
          id: true,
          slug: true,
          title: true,
          city: true,
          publishStatus: true,
          owner: { select: { id: true, name: true, email: true, status: true } },
          submitter: { select: { id: true, name: true, email: true, status: true } },
        },
      },
    },
  });
  return NextResponse.json(reports);
}
