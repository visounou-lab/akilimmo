"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { deleteImage, uploadImage } from "@/lib/cloudinary";
import { uniquePropertySlug } from "@/lib/slug";
import { rateLimit } from "@/lib/ratelimit";
import { normalizePropertyType, normalizeStayType } from "@/lib/mobile-normalize";

function requiredText(formData: FormData, key: string, max = 500): string {
  const value = String(formData.get(key) ?? "").trim();
  if (!value || value.length > max) throw new Error("Informations obligatoires invalides.");
  return value;
}

export async function submitAgentProperty(formData: FormData) {
  const session = await auth();
  const agentId = (session?.user as { id?: string } | undefined)?.id;
  if (!agentId) throw new Error("Non authentifié.");

  const limit = rateLimit(`agent-property:${agentId}`, 10, 24 * 60 * 60 * 1000);
  if (!limit.allowed) throw new Error("Limite de sécurité quotidienne atteinte.");

  const agent = await prisma.user.findUnique({
    where: { id: agentId },
    select: {
      role: true,
      status: true,
      verificationCases: {
        where: { type: { in: ["IDENTITY", "PROFESSIONAL"] }, status: "APPROVED" },
        select: { type: true, expiresAt: true },
      },
    },
  });
  const now = new Date();
  const approved = (type: "IDENTITY" | "PROFESSIONAL") =>
    agent?.verificationCases.some(
      (item) => item.type === type && (!item.expiresAt || item.expiresAt > now),
    );
  if (
    agent?.role !== "AGENT" ||
    agent.status !== "active" ||
    !approved("IDENTITY") ||
    !approved("PROFESSIONAL")
  ) {
    throw new Error("Seul un agent actif et vérifié peut soumettre une annonce.");
  }

  const images = (formData.getAll("images") as File[]).filter((file) => file.size > 0).slice(0, 10);
  if (images.length === 0) throw new Error("Ajoutez au moins une photo.");
  if (images.some((file) => file.size > 8 * 1024 * 1024 || !file.type.startsWith("image/"))) {
    throw new Error("Chaque photo doit être une image de 8 Mo maximum.");
  }

  const title = requiredText(formData, "title", 160);
  const city = requiredText(formData, "city", 100);
  const country = String(formData.get("country") ?? "");
  if (!["BENIN", "COTE_D_IVOIRE"].includes(country)) throw new Error("Pays invalide.");
  const price = Number(formData.get("price"));
  const bedrooms = Number(formData.get("bedrooms"));
  const bathrooms = Number(formData.get("bathrooms"));
  if (!Number.isFinite(price) || price <= 0 || !Number.isInteger(bedrooms) || !Number.isInteger(bathrooms)) {
    throw new Error("Prix ou caractéristiques invalides.");
  }

  const uploaded: { url: string; publicId: string }[] = [];
  try {
    for (const image of images) uploaded.push(await uploadImage(image));
    const property = await prisma.property.create({
      data: {
        slug: await uniquePropertySlug(title, city),
        title,
        description: requiredText(formData, "description", 5000),
        country: country as "BENIN" | "COTE_D_IVOIRE",
        city,
        address: requiredText(formData, "address", 250),
        price,
        bedrooms,
        bathrooms,
        propertyType: normalizePropertyType(requiredText(formData, "type", 50)),
        stayType: normalizeStayType(formData.get("stayType")),
        ownerId: agentId,
        submittedBy: agentId,
        imageUrl: uploaded[0].url,
        publishStatus: "pending_review",
        images: {
          create: uploaded.map((image, index) => ({
            url: image.url,
            publicId: image.publicId,
            isPrimary: index === 0,
            order: index,
            uploadedById: agentId,
          })),
        },
      },
    });
    revalidatePath("/agent/dashboard");
    return { success: true, propertyId: property.id };
  } catch (error) {
    await Promise.allSettled(uploaded.map((image) => deleteImage(image.publicId)));
    throw error;
  }
}
