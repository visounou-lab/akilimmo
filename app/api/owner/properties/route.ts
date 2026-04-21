import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string } | undefined;

  if (!user?.id || user.role !== "OWNER") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const properties = await prisma.property.findMany({
    where:   { ownerId: user.id },
    select:  { id: true, title: true },
    orderBy: { createdAt: "desc" },
  });

  return NextResponse.json(properties);
}
