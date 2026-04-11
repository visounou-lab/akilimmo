"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createContract(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const propertyId = formData.get("propertyId") as string | null;
  const tenantId   = formData.get("tenantId")   as string | null;
  const status     = formData.get("status")      as "PENDING" | "ACTIVE" | "TERMINATED";

  if (!propertyId) throw new Error("Veuillez sélectionner un bien immobilier.");
  if (!tenantId)   throw new Error("Veuillez sélectionner un locataire.");

  // Récupère le propriétaire depuis le bien sélectionné
  const property = await prisma.property.findUniqueOrThrow({ where: { id: propertyId } });

  await prisma.contract.create({
    data: {
      propertyId,
      tenantId,
      ownerId:    property.ownerId,
      startDate:  new Date(formData.get("startDate") as string),
      endDate:    new Date(formData.get("endDate") as string),
      rentAmount: parseFloat(formData.get("rentAmount") as string),
      status,
    },
  });

  // Synchronise le statut du bien
  const propertyStatus =
    status === "ACTIVE"     ? "RENTED"    :
    status === "PENDING"    ? "RESERVED"  : "AVAILABLE";
  await prisma.property.update({ where: { id: propertyId }, data: { status: propertyStatus } });

  revalidatePath("/dashboard/contrats");
  revalidatePath("/dashboard/biens");
  redirect("/dashboard/contrats");
}

export async function updateContractStatus(id: string, formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const status = formData.get("status") as "PENDING" | "ACTIVE" | "TERMINATED";

  const contract = await prisma.contract.update({
    where: { id },
    data: { status },
  });

  const propertyStatus =
    status === "ACTIVE"     ? "RENTED"    :
    status === "TERMINATED" ? "AVAILABLE" : "RESERVED";
  await prisma.property.update({ where: { id: contract.propertyId }, data: { status: propertyStatus } });

  revalidatePath("/dashboard/contrats");
  revalidatePath(`/dashboard/contrats/${id}`);
}

export async function deleteContract(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const contract = await prisma.contract.findUniqueOrThrow({ where: { id } });
  await prisma.contract.delete({ where: { id } });
  // Remet le bien disponible
  await prisma.property.update({ where: { id: contract.propertyId }, data: { status: "AVAILABLE" } });

  revalidatePath("/dashboard/contrats");
  revalidatePath("/dashboard/biens");
}
