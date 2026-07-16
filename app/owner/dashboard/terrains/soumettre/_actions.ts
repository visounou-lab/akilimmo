"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { sendNewLandNotification } from "@/lib/mailer";
import { notifyLandSubmitted } from "@/lib/telegram";
import { revalidatePath } from "next/cache";
import { uniqueLandSlug } from "@/lib/slug";

const TITLE_TYPES = [
  "TITRE_FONCIER",
  "ACD",
  "LETTRE_ATTRIBUTION",
  "CONVENTION_VENTE",
  "AUTRE",
] as const;
type TitleType = (typeof TITLE_TYPES)[number];

function normalizeTitleType(raw: unknown): TitleType {
  const key = String(raw ?? "").trim().toUpperCase();
  return (TITLE_TYPES as readonly string[]).includes(key) ? (key as TitleType) : "AUTRE";
}

export async function submitLand(formData: FormData) {
  const session = await auth();
  const userId  = (session?.user as { id?: string })?.id;
  if (!userId) throw new Error("Non authentifié");

  const ownerAccount = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      role: true,
      status: true,
      verificationCases: {
        where: { type: "IDENTITY", status: "APPROVED" },
        orderBy: { createdAt: "desc" },
        take: 1,
        select: { expiresAt: true },
      },
    },
  });
  const identity = ownerAccount?.verificationCases[0];
  if (
    ownerAccount?.role !== "OWNER" ||
    ownerAccount.status !== "active" ||
    !identity ||
    (identity.expiresAt && identity.expiresAt <= new Date())
  ) {
    throw new Error("Votre identité doit être vérifiée avant de publier un terrain.");
  }

  const files = formData.getAll("images") as File[];
  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      uploaded.push(await uploadImage(file));
    }
  }

  const title = (formData.get("title") as string)?.trim();
  const city  = (formData.get("city") as string)?.trim();
  if (!title || !city) throw new Error("Titre et ville sont requis.");

  const price   = parseFloat(formData.get("price") as string);
  const surface = parseInt(formData.get("surface") as string, 10);
  if (!Number.isFinite(price) || price <= 0) throw new Error("Prix de vente invalide.");
  if (!Number.isFinite(surface) || surface <= 0) throw new Error("Superficie invalide.");

  const slug     = await uniqueLandSlug(title, city);
  const videoUrl = (formData.get("videoUrl") as string | null)?.trim() || null;

  const land = await prisma.land.create({
    data: {
      slug,
      title,
      description:   (formData.get("description") as string)?.trim() ?? "",
      country:       formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city,
      address:       (formData.get("address") as string)?.trim() ?? "",
      price,
      surface,
      titleType:     normalizeTitleType(formData.get("titleType")),
      serviced:      formData.get("serviced") === "on" || formData.get("serviced") === "true",
      imageUrl:      uploaded[0]?.url ?? null,
      images:        uploaded.map((u) => u.url),
      videoUrl,
      ownerId:       userId,
      submittedBy:   userId,
      publishStatus: "pending_review",
    },
  });

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  await sendNewLandNotification({
    ownerName: user?.name ?? "Propriétaire",
    title:     land.title,
    city:      land.city,
    surface:   land.surface,
  });
  await notifyLandSubmitted({
    title:     land.title,
    ownerName: user?.name ?? "Propriétaire",
    city:      land.city,
    surface:   land.surface,
  });

  revalidatePath("/owner/dashboard/terrains");
  return { success: true };
}
