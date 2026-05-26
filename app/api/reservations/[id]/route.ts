import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

const VALID_STATUSES = ["pending", "contacted", "confirmed", "cancelled"] as const;

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (!session?.user || user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const { id } = await params;
  let body: Record<string, unknown>;
  try { body = await req.json(); } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { status } = body as { status: string };
  if (!VALID_STATUSES.includes(status as typeof VALID_STATUSES[number])) {
    return NextResponse.json({ error: "Statut invalide" }, { status: 400 });
  }

  try {
    const updated = await prisma.reservationRequest.update({
      where: { id },
      data:  { status },
      select: { id: true, status: true },
    });
    return NextResponse.json({ ok: true, ...updated });
  } catch {
    return NextResponse.json({ error: "Réservation introuvable" }, { status: 404 });
  }
}
