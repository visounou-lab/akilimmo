import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const session = await auth();
  const user = session?.user as { role?: string } | undefined;
  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey    = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  return NextResponse.json({
    cloudName:  cloudName  ? `${cloudName.slice(0, 3)}***` : "MISSING",
    apiKey:     apiKey     ? `${apiKey.slice(0, 4)}***`    : "MISSING",
    apiSecret:  apiSecret  ? "SET"                          : "MISSING",
    nodeEnv:    process.env.NODE_ENV,
    timestamp:  new Date().toISOString(),
  });
}
