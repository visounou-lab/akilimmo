"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadImage } from "@/lib/cloudinary";

export async function createProperty(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const userId = (session.user as { id: string }).id;

  let imageUrl: string | null = null;
  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  await prisma.property.create({
    data: {
      title:       formData.get("title") as string,
      description: formData.get("description") as string,
      country:     formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city:        formData.get("city") as string,
      address:     formData.get("address") as string,
      price:       parseFloat(formData.get("price") as string),
      status:      formData.get("status") as "AVAILABLE" | "RESERVED" | "RENTED" | "OFF_MARKET",
      bedrooms:    parseInt(formData.get("bedrooms") as string, 10),
      bathrooms:   parseInt(formData.get("bathrooms") as string, 10),

      imageUrl,
      ownerId:     userId,
    },
  });

  revalidatePath("/dashboard/biens");
  redirect("/dashboard/biens");
}

export async function updateProperty(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const existing = await prisma.property.findUniqueOrThrow({ where: { id } });

  let imageUrl = existing.imageUrl;
  const image = formData.get("image") as File | null;
  if (image && image.size > 0) {
    imageUrl = await uploadImage(image);
  }

  await prisma.property.update({
    where: { id },
    data: {
      title:       formData.get("title") as string,
      description: formData.get("description") as string,
      country:     formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city:        formData.get("city") as string,
      address:     formData.get("address") as string,
      price:       parseFloat(formData.get("price") as string),
      status:      formData.get("status") as "AVAILABLE" | "RESERVED" | "RENTED" | "OFF_MARKET",
      bedrooms:    parseInt(formData.get("bedrooms") as string, 10),
      bathrooms:   parseInt(formData.get("bathrooms") as string, 10),

      imageUrl,
    },
  });

  revalidatePath("/dashboard/biens");
  redirect("/dashboard/biens");
}

export async function deleteProperty(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.property.delete({ where: { id } });

  revalidatePath("/dashboard/biens");
}
