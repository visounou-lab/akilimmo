"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
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
    status === "ACTIVE"  ? "RENTED"   :
    status === "PENDING" ? "RESERVED" : "AVAILABLE";
  await prisma.property.update({ where: { id: propertyId }, data: { status: propertyStatus } });

  // Notifie le propriétaire si le contrat est actif dès la création
  if (status === "ACTIVE") {
    await createNotification({
      userId:     property.ownerId,
      category:   "BOOKING",
      title:      "Contrat activé",
      body:       `Un contrat de location a été activé pour « ${property.title} ». Votre bien est maintenant loué.`,
      actionUrl:  "/owner/dashboard/paiements",
      propertyId: property.id,
    });
  }

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
    include: { property: { select: { title: true, ownerId: true } } },
  });

  const propertyStatus =
    status === "ACTIVE"     ? "RENTED"    :
    status === "TERMINATED" ? "AVAILABLE" : "RESERVED";
  await prisma.property.update({ where: { id: contract.propertyId }, data: { status: propertyStatus } });

  const notifBody: Record<string, { title: string; body: string } | null> = {
    ACTIVE:     { title: "Contrat activé",  body: `Le contrat pour « ${contract.property.title} » est maintenant actif. Votre bien est loué.` },
    TERMINATED: { title: "Contrat résilié", body: `Le contrat pour « ${contract.property.title} » a été résilié. Votre bien est de nouveau disponible.` },
    PENDING:    null,
  };
  const notif = notifBody[status];
  if (notif) {
    await createNotification({
      userId:     contract.property.ownerId,
      category:   "BOOKING",
      title:      notif.title,
      body:       notif.body,
      actionUrl:  "/owner/dashboard/biens",
      propertyId: contract.propertyId,
    });
  }

  revalidatePath("/dashboard/contrats");
  redirect(`/dashboard/contrats/${id}`);
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
