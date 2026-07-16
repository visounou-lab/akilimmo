import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { notifyNewLandInquiry } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Corps invalide" }, { status: 400 });
  }

  const { landId, clientName, clientPhone, clientEmail, message } = body as {
    landId:       string;
    clientName:   string;
    clientPhone:  string;
    clientEmail?: string;
    message?:     string;
  };

  if (!landId || !clientName?.trim() || !clientPhone?.trim()) {
    return NextResponse.json({ error: "Champs requis manquants" }, { status: 400 });
  }

  try {
    const land = await prisma.land.findUnique({
      where: { id: landId },
      select: { id: true, title: true, publishStatus: true },
    });
    if (!land || land.publishStatus !== "published") {
      return NextResponse.json({ error: "Terrain introuvable" }, { status: 404 });
    }

    const inquiry = await prisma.landInquiry.create({
      data: {
        landId,
        clientName:  clientName.trim(),
        clientPhone: clientPhone.trim(),
        clientEmail: clientEmail?.trim() || null,
        message:     message?.trim() || null,
        status:      "pending",
      },
    });

    const admins = await prisma.user.findMany({
      where:  { role: "ADMIN" },
      select: { id: true },
    });
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
    }).catch((e) => console.error("[land inquiry telegram]", e));

    return NextResponse.json({ ok: true, id: inquiry.id });
  } catch (err) {
    console.error("[/api/terrains/inquiry] error:", err);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}
