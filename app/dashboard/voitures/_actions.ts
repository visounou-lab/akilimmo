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
  return raw.split("\n").map((s) => s.trim()).filter(Boolean);
}

type OrderItem =
  | { kind: "existing"; url: string }
  | { kind: "new"; fileIndex: number };

async function buildFinalImages(formData: FormData): Promise<string[]> {
  const orderRaw = formData.get("photoOrder") as string | null;
  const newFiles = formData.getAll("images") as File[];

  // Upload les nouvelles photos
  const uploadedUrls: string[] = [];
  for (const file of newFiles) {
    if (file && file.size > 0) {
      const result = await uploadVehicleImage(file);
      uploadedUrls.push(result.url);
    }
  }

  // Si pas d'ordre défini (création simple sans JS), utiliser les uploads dans l'ordre
  if (!orderRaw) {
    return uploadedUrls;
  }

  const order = JSON.parse(orderRaw) as OrderItem[];
  return order.map((item) => {
    if (item.kind === "existing") return item.url;
    return uploadedUrls[item.fileIndex] ?? "";
  }).filter(Boolean);
}

export async function createVehicle(formData: FormData) {
  await requireAdmin();

  const images = await buildFinalImages(formData);
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
      imageUrl:  images[0] ?? null,
      images,
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

  const images = await buildFinalImages(formData);
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
      imageUrl:  images[0] ?? null,
      images,
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
