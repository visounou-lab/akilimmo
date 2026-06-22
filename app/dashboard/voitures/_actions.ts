"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { uploadVehicleImage } from "@/lib/cloudinary";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id: string; role?: string };
  if (user.role !== "ADMIN") redirect("/login");
}

function parseFeatures(raw: string): string[] {
  return raw
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();

  const files = formData.getAll("images") as File[];
  const uploaded: string[] = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const result = await uploadVehicleImage(file);
      uploaded.push(result.url);
    }
  }

  const featuresRaw = (formData.get("features") as string) ?? "";

  await prisma.vehicle.create({
    data: {
      name:      formData.get("name") as string,
      variant:   (formData.get("variant") as string) || "SUV",
      color:     formData.get("color") as string,
      seats:     parseInt((formData.get("seats") as string) || "5", 10),
      fuel:      (formData.get("fuel") as string) || "Essence · Automatique",
      features:  parseFeatures(featuresRaw),
      priceDay:  parseInt(formData.get("priceDay") as string, 10),
      priceLong: parseInt(formData.get("priceLong") as string, 10),
      imageUrl:  uploaded[0] ?? null,
      images:    uploaded,
      available: formData.get("available") === "on",
      city:      "Abidjan",
      country:   "COTE_D_IVOIRE",
    },
  });

  revalidatePath("/dashboard/voitures");
  revalidatePath("/voitures");
  redirect("/dashboard/voitures");
}

export async function updateVehicle(id: string, formData: FormData) {
  await requireAdmin();

  const files = formData.getAll("images") as File[];
  const newUploaded: string[] = [];

  for (const file of files) {
    if (file && file.size > 0) {
      const result = await uploadVehicleImage(file);
      newUploaded.push(result.url);
    }
  }

  const keepExisting = formData.get("keepImages") === "true";
  const existingImages = ((formData.get("existingImages") as string) || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  const finalImages = keepExisting
    ? [...existingImages, ...newUploaded]
    : newUploaded.length > 0
    ? newUploaded
    : existingImages;

  const featuresRaw = (formData.get("features") as string) ?? "";

  await prisma.vehicle.update({
    where: { id },
    data: {
      name:      formData.get("name") as string,
      variant:   (formData.get("variant") as string) || "SUV",
      color:     formData.get("color") as string,
      seats:     parseInt((formData.get("seats") as string) || "5", 10),
      fuel:      (formData.get("fuel") as string) || "Essence · Automatique",
      features:  parseFeatures(featuresRaw),
      priceDay:  parseInt(formData.get("priceDay") as string, 10),
      priceLong: parseInt(formData.get("priceLong") as string, 10),
      imageUrl:  finalImages[0] ?? null,
      images:    finalImages,
      available: formData.get("available") === "on",
    },
  });

  revalidatePath("/dashboard/voitures");
  revalidatePath("/voitures");
  redirect("/dashboard/voitures");
}

export async function deleteVehicle(id: string) {
  await requireAdmin();
  await prisma.vehicle.delete({ where: { id } });
  revalidatePath("/dashboard/voitures");
  revalidatePath("/voitures");
}
