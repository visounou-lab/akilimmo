"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createNotification } from "@/lib/notifications";
import { sendPaymentConfirmedEmail } from "@/lib/mailer";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function createPayment(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const contractId = formData.get("contractId") as string;
  if (!contractId) throw new Error("Veuillez sélectionner un contrat.");

  const status    = formData.get("status") as "PENDING" | "PAID" | "FAILED";
  const paidAtRaw = formData.get("paidAt") as string | null;

  // Auto-dérive le payerId depuis le locataire du contrat
  const contract = await prisma.contract.findUniqueOrThrow({
    where: { id: contractId },
    select: { tenantId: true },
  });

  const methodRaw    = formData.get("paymentMethod") as string | null;
  const referenceRaw = formData.get("waveReference") as string | null;

  await prisma.payment.create({
    data: {
      contractId,
      payerId:       contract.tenantId,
      amount:        parseFloat(formData.get("amount") as string),
      dueDate:       new Date(formData.get("dueDate") as string),
      paidAt:        paidAtRaw
                       ? new Date(paidAtRaw)
                       : status === "PAID" ? new Date() : null,
      status,
      ...(methodRaw    && { paymentMethod: methodRaw }),
      ...(referenceRaw && { waveReference: referenceRaw }),
    },
  });

  revalidatePath("/dashboard/paiements");
  redirect("/dashboard/paiements");
}

export async function markAsPaid(
  id: string,
  opts?: { method?: string; reference?: string; phone?: string }
) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const payment = await prisma.payment.update({
    where: { id },
    data: {
      status: "PAID",
      paidAt: new Date(),
      ...(opts?.method    && { paymentMethod: opts.method }),
      ...(opts?.reference && { waveReference: opts.reference }),
      ...(opts?.phone     && { payerPhone: opts.phone }),
    },
    include: {
      contract: {
        include: {
          property: {
            select: {
              id:      true,
              title:   true,
              ownerId: true,
              owner:   { select: { email: true, name: true } },
            },
          },
          tenant: { select: { name: true } },
        },
      },
    },
  });

  const { property, tenant } = payment.contract;
  const methodLabel: Record<string, string> = {
    wave: "Wave", orange_money: "Orange Money", free_money: "Free Money",
    virement: "Virement", especes: "Espèces", autre: "Autre",
  };
  const modeStr = opts?.method ? ` via ${methodLabel[opts.method] ?? opts.method}` : "";

  await Promise.all([
    createNotification({
      userId:     property.ownerId,
      category:   "PAYMENT",
      title:      "Paiement confirmé",
      body:       `Le loyer de ${tenant.name ?? "votre locataire"} pour « ${property.title} » a été encaissé${modeStr}.`,
      actionUrl:  "/owner/dashboard/paiements",
      propertyId: property.id,
    }),
    sendPaymentConfirmedEmail({
      ownerEmail:    property.owner.email!,
      ownerName:     property.owner.name ?? "Propriétaire",
      propertyTitle: property.title,
      amount:        Number(payment.amount),
      paymentMethod: opts?.method ?? null,
      reference:     opts?.reference ?? null,
      paidAt:        payment.paidAt ?? new Date(),
    }),
  ]);

  revalidatePath("/dashboard/paiements");
}
