import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewLandInquiry } from "@/lib/telegram";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const { clientName, clientPhone, clientEmail, message } = await req.json();

    if (!clientName?.trim() || !clientPhone?.trim()) {
      return NextResponse.json({ error: "Informations manquantes" }, { status: 400 });
    }

    const land = await prisma.land.findUnique({
      where: { slug, publishStatus: "published" },
      select: { id: true, title: true },
    });
    if (!land) return NextResponse.json({ error: "Terrain introuvable" }, { status: 404 });

    const inquiry = await prisma.landInquiry.create({
      data: {
        landId:      land.id,
        clientName:  clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail?.trim() || null,
        message:     message?.trim() || null,
        status:      "pending",
      },
      select: { id: true },
    });

    const admins = await prisma.user.findMany({ where: { role: "ADMIN" }, select: { id: true } });
    if (admins.length > 0) {
      await prisma.notification.createMany({
        data: admins.map((admin) => ({
          userId:    admin.id,
          title:     `Demande terrain — ${land.title}`,
          body:      `${clientName.trim()} · ${clientPhone.trim()}`,
          category:  "MESSAGE" as const,
          actionUrl: "/dashboard/terrains/demandes",
        })),
      });
    }

    await notifyNewLandInquiry({
      landTitle:   land.title,
      clientName:  clientName.trim(),
      clientPhone: clientPhone.trim(),
    }).catch((e) => console.error("[mobile land inquiry telegram]", e));

    return NextResponse.json({ success: true, requestId: inquiry.id });
  } catch {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
