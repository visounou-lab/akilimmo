"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage, deleteImage } from "@/lib/cloudinary";
import { uniquePropertySlug } from "@/lib/slug";

export async function createProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const files = formData.getAll("images") as File[];
  const primaryIndex = parseInt(formData.get("primaryIndex") as string, 10) || 0;

  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      uploaded.push(await uploadImage(file));
    }
  }

  const primaryUrl = uploaded[primaryIndex]?.url ?? uploaded[0]?.url ?? null;
  const videoUrl   = (formData.get("videoUrl") as string | null)?.trim() || null;

  const title = formData.get("title") as string;
  const city  = formData.get("city") as string;
  const slug  = await uniquePropertySlug(title, city);

  const property = await prisma.property.create({
    data: {
      slug,
      title,
      description: formData.get("description") as string,
      country:     formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city,
      address:     formData.get("address") as string,
      price:       parseFloat(formData.get("price") as string),
      status:      formData.get("status") as "AVAILABLE" | "RESERVED" | "RENTED" | "OFF_MARKET",
      bedrooms:    parseInt(formData.get("bedrooms") as string, 10),
      bathrooms:   parseInt(formData.get("bathrooms") as string, 10),
      imageUrl:    primaryUrl,
      videoUrl,
      ownerId:     userId,
    },
  });

  if (uploaded.length > 0) {
    await prisma.propertyImage.createMany({
      data: uploaded.map(({ url, publicId }, i) => ({
        propertyId: property.id,
        url,
        publicId,
        isPrimary: i === primaryIndex,
        order: i,
      })),
    });
  }

  revalidatePath("/dashboard/biens");
  redirect("/dashboard/biens");
}

export async function updateProperty(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.property.findUniqueOrThrow({ where: { id } });

  const files = formData.getAll("images") as File[];
  const primaryIndex = parseInt(formData.get("primaryIndex") as string, 10) || 0;

  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      uploaded.push(await uploadImage(file));
    }
  }

  let imageUrl = existing.imageUrl;
  if (uploaded.length > 0) {
    imageUrl = uploaded[primaryIndex]?.url ?? uploaded[0]?.url ?? existing.imageUrl;
  }

  const videoUrl = (formData.get("videoUrl") as string | null)?.trim() || null;
  const title    = formData.get("title") as string;
  const city     = formData.get("city") as string;

  const slugData =
    title !== existing.title || city !== existing.city
      ? { slug: await uniquePropertySlug(title, city, id) }
      : {};

  await prisma.property.update({
    where: { id },
    data: {
      ...slugData,
      title,
      description: formData.get("description") as string,
      country:     formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city,
      address:     formData.get("address") as string,
      price:       parseFloat(formData.get("price") as string),
      status:      formData.get("status") as "AVAILABLE" | "RESERVED" | "RENTED" | "OFF_MARKET",
      bedrooms:    parseInt(formData.get("bedrooms") as string, 10),
      bathrooms:   parseInt(formData.get("bathrooms") as string, 10),
      imageUrl,
      videoUrl,
    },
  });

  if (uploaded.length > 0) {
    const existingCount = await prisma.propertyImage.count({ where: { propertyId: id } });

    if (existingCount === 0) {
      await prisma.propertyImage.createMany({
        data: uploaded.map(({ url, publicId }, i) => ({
          propertyId: id,
          url,
          publicId,
          isPrimary: i === primaryIndex,
          order: i,
        })),
      });
    } else {
      await prisma.propertyImage.updateMany({
        where: { propertyId: id, isPrimary: true },
        data: { isPrimary: false },
      });
      await prisma.propertyImage.createMany({
        data: uploaded.map(({ url, publicId }, i) => ({
          propertyId: id,
          url,
          publicId,
          isPrimary: i === primaryIndex,
          order: existingCount + i,
        })),
      });
    }
  }

  revalidatePath("/dashboard/biens");
  redirect("/dashboard/biens");
}

export async function deleteProperty(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.property.delete({ where: { id } });

  revalidatePath("/dashboard/biens");
}

// ─── helpers ─────────────────────────────────────────────────────────────────

async function assertImageAccess(userId: string, propertyId: string) {
  const [property, user] = await Promise.all([
    prisma.property.findUnique({ where: { id: propertyId }, select: { ownerId: true, slug: true } }),
    prisma.user.findUnique({ where: { id: userId }, select: { role: true } }),
  ]);
  if (!property) throw new Error("Bien introuvable");
  if (property.ownerId !== userId && user?.role !== "ADMIN") throw new Error("Accès refusé");
  return property;
}

// ─── upload ──────────────────────────────────────────────────────────────────

export async function uploadPropertyImages(
  propertyId: string,
  files: File[]
): Promise<{ uploaded: number; errors: string[] }> {
  const session = await auth();
  if (!session?.user) throw new Error("Non authentifié");
  const userId = (session.user as { id: string }).id;

  const property = await assertImageAccess(userId, propertyId);

  const existingCount = await prisma.propertyImage.count({ where: { propertyId } });
  if (existingCount + files.length > 15) {
    return { uploaded: 0, errors: [`Maximum 15 photos (${existingCount} existante(s) déjà enregistrée(s))`] };
  }

  const errors: string[] = [];
  let uploaded = 0;

  for (let i = 0; i < files.length; i++) {
    try {
      const { url, publicId } = await uploadImage(files[i]);
      const isFirst = existingCount === 0 && i === 0;
      await prisma.propertyImage.create({
        data: { propertyId, url, publicId, isPrimary: isFirst, order: existingCount + i, alt: null },
      });
      if (isFirst) {
        await prisma.property.update({ where: { id: propertyId }, data: { imageUrl: url } });
      }
      uploaded++;
    } catch {
      errors.push(files[i].name ?? `Photo ${i + 1}`);
    }
  }

  revalidatePath(`/dashboard/biens/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);
  revalidatePath("/dashboard/biens");

  return { uploaded, errors };
}

// ─── delete ──────────────────────────────────────────────────────────────────

export async function deletePropertyImage(
  imageId: string
): Promise<{ success: boolean; error?: string }> {
  const session = await auth();
  if (!session?.user) return { success: false, error: "Non authentifié" };
  const userId = (session.user as { id: string }).id;

  const image = await prisma.propertyImage.findUnique({
    where: { id: imageId },
    include: { property: { select: { ownerId: true, slug: true } } },
  });
  if (!image) return { success: false, error: "Image introuvable" };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (image.property.ownerId !== userId && user?.role !== "ADMIN") {
    return { success: false, error: "Accès refusé" };
  }

  if (image.publicId) {
    try { await deleteImage(image.publicId); }
    catch (e) { console.error("[deletePropertyImage] Cloudinary:", e); }
  }

  await prisma.$transaction(async (tx) => {
    await tx.propertyImage.delete({ where: { id: imageId } });
    if (image.isPrimary) {
      const next = await tx.propertyImage.findFirst({
        where: { propertyId: image.propertyId },
        orderBy: { order: "asc" },
      });
      if (next) {
        await tx.propertyImage.update({ where: { id: next.id }, data: { isPrimary: true } });
        await tx.property.update({ where: { id: image.propertyId }, data: { imageUrl: next.url } });
      } else {
        await tx.property.update({ where: { id: image.propertyId }, data: { imageUrl: null } });
      }
    }
  });

  revalidatePath(`/dashboard/biens/${image.propertyId}/edit`);
  revalidatePath(`/biens/${image.property.slug}`);
  revalidatePath("/dashboard/biens");

  return { success: true };
}

// ─── set primary ─────────────────────────────────────────────────────────────

export async function setPrimaryPropertyImage(
  imageId: string
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };
  const userId = (session.user as { id: string }).id;

  const image = await prisma.propertyImage.findUnique({
    where: { id: imageId },
    include: { property: { select: { ownerId: true, slug: true } } },
  });
  if (!image) return { success: false };

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { role: true } });
  if (image.property.ownerId !== userId && user?.role !== "ADMIN") return { success: false };

  await prisma.$transaction([
    prisma.propertyImage.updateMany({ where: { propertyId: image.propertyId }, data: { isPrimary: false } }),
    prisma.propertyImage.update({ where: { id: imageId }, data: { isPrimary: true } }),
    prisma.property.update({ where: { id: image.propertyId }, data: { imageUrl: image.url } }),
  ]);

  revalidatePath(`/dashboard/biens/${image.propertyId}/edit`);
  revalidatePath(`/biens/${image.property.slug}`);

  return { success: true };
}

// ─── reorder ─────────────────────────────────────────────────────────────────

export async function reorderPropertyImages(
  propertyId: string,
  orderedIds: string[]
): Promise<{ success: boolean }> {
  const session = await auth();
  if (!session?.user) return { success: false };
  const userId = (session.user as { id: string }).id;

  const property = await assertImageAccess(userId, propertyId);

  const existing = await prisma.propertyImage.findMany({
    where: { propertyId },
    select: { id: true },
  });
  const existingIds = new Set(existing.map((i) => i.id));
  if (!orderedIds.every((id) => existingIds.has(id))) return { success: false };

  await prisma.$transaction(
    orderedIds.map((id, i) => prisma.propertyImage.update({ where: { id }, data: { order: i } }))
  );

  revalidatePath(`/dashboard/biens/${propertyId}/edit`);
  revalidatePath(`/biens/${property.slug}`);

  return { success: true };
}
