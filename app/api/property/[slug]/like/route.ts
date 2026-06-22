import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;
  const body = await req.json().catch(() => ({}));
  const action: string = body.action;

  if (action !== "like" && action !== "unlike") {
    return NextResponse.json({ error: "action must be 'like' or 'unlike'" }, { status: 400 });
  }

  const property = await prisma.property.findUnique({
    where: { slug },
    select: { id: true, likesCount: true },
  });

  if (!property) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  const newCount = Math.max(0, property.likesCount + (action === "like" ? 1 : -1));

  await prisma.property.update({
    where: { id: property.id },
    data: { likesCount: newCount },
  });

  return NextResponse.json({ likesCount: newCount });
}
