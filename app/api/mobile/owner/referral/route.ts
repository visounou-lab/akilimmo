import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { verifyMobileToken } from "@/lib/mobile-auth";

function generateCode(name: string, id: string): string {
  const namePart = (name ?? "USER").replace(/\s+/g, "").slice(0, 4).toUpperCase();
  const idPart   = id.slice(-4).toUpperCase();
  return `${namePart}${idPart}`;
}

export async function GET(req: NextRequest) {
  const user = verifyMobileToken(req);
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const code = generateCode(user.name, user.id);

  // Count users referred by this code (will return 0 until schema updated)
  const referralCount = await prisma.user.count({
    where: { verifyToken: `ref:${code}` },
  }).catch(() => 0);

  return NextResponse.json({
    code,
    referralCount,
    estimatedEarnings: 0,
    description: "Partagez votre code avec d'autres propriétaires. Pour chaque nouveau propriétaire inscrit via votre code, vous gagnez une commission sur les 3 premiers mois de gestion.",
  });
}
