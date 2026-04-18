"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { uploadImage } from "@/lib/cloudinary";
import { sendNewPropertyNotification } from "@/lib/mailer";
import { revalidatePath } from "next/cache";
import { uniquePropertySlug } from "@/lib/slug";

export async function submitProperty(formData: FormData) {
  const session = await auth();
  const userId  = (session?.user as { id?: string })?.id;
  if (!userId) throw new Error("Non authentifié");

  const files = formData.getAll("images") as File[];
  const uploaded: { url: string; publicId: string }[] = [];
  for (const file of files) {
    if (file && file.size > 0) {
      uploaded.push(await uploadImage(file));
    }
  }

  const videoUrl = (formData.get("videoUrl") as string | null)?.trim() || null;

  const title = formData.get("title") as string;
  const city  = formData.get("city") as string;
  const slug  = await uniquePropertySlug(title, city);

  const property = await prisma.property.create({
    data: {
      slug,
      title,
      description:   formData.get("description") as string,
      country:       formData.get("country") as "BENIN" | "COTE_D_IVOIRE",
      city,
      address:       formData.get("address") as string,
      price:         parseFloat(formData.get("price") as string),
      bedrooms:      parseInt(formData.get("bedrooms") as string, 10),
      bathrooms:     parseInt(formData.get("bathrooms") as string, 10),
      imageUrl:      uploaded[0]?.url ?? null,
      videoUrl,
      ownerId:       userId,
      submittedBy:   userId,
      publishStatus: "pending_review",
    },
  });

  if (uploaded.length > 0) {
    await prisma.propertyImage.createMany({
      data: uploaded.map(({ url, publicId }, i) => ({
        propertyId: property.id,
        url,
        publicId,
        isPrimary:  i === 0,
        order:      i,
      })),
    });
  }

  const user = await prisma.user.findUnique({ where: { id: userId }, select: { name: true } });
  await sendNewPropertyNotification({
    ownerName:  user?.name ?? "Propriétaire",
    title:      property.title,
    city:       property.city,
    propertyId: property.id,
  });

  revalidatePath("/owner/dashboard/biens");
  return { success: true };
}
