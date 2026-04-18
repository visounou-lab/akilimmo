"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/cloudinary";
import { uniquePropertySlug } from "@/lib/slug";

export async function createProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  const files = formData.getAll("images") as File[];
  const primaryIndex = parseInt(formData.get("primaryIndex") as string, 10) || 0;

  const uploadedUrls: string[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      const url = await uploadImage(file);
      uploadedUrls.push(url);
    }
  }

  const primaryUrl = uploadedUrls[primaryIndex] ?? uploadedUrls[0] ?? null;
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

  if (uploadedUrls.length > 0) {
    await prisma.propertyImage.createMany({
      data: uploadedUrls.map((url, i) => ({
        propertyId: property.id,
        url,
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

  const uploadedUrls: string[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      const url = await uploadImage(file);
      uploadedUrls.push(url);
    }
  }

  let imageUrl = existing.imageUrl;
  if (uploadedUrls.length > 0) {
    imageUrl = uploadedUrls[primaryIndex] ?? uploadedUrls[0];
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

  if (uploadedUrls.length > 0) {
    const existingCount = await prisma.propertyImage.count({ where: { propertyId: id } });

    if (existingCount === 0) {
      await prisma.propertyImage.createMany({
        data: uploadedUrls.map((url, i) => ({
          propertyId: id,
          url,
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
        data: uploadedUrls.map((url, i) => ({
          propertyId: id,
          url,
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
