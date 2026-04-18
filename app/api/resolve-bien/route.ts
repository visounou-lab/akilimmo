import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "id requis" }, { status: 400 });

  const property = await prisma.property.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!property) {
    return NextResponse.redirect(new URL("/biens", req.url), { status: 302 });
  }

  const dest = new URL(`/biens/${property.slug}`, req.url);
  return NextResponse.redirect(dest, { status: 301 });
}
