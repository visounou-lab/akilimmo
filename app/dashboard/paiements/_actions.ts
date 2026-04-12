"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
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

  await prisma.payment.create({
    data: {
      contractId,
      payerId:  contract.tenantId,
      amount:   parseFloat(formData.get("amount") as string),
      dueDate:  new Date(formData.get("dueDate") as string),
      paidAt:   paidAtRaw
                  ? new Date(paidAtRaw)
                  : status === "PAID" ? new Date() : null,
      status,
    },
  });

  revalidatePath("/dashboard/paiements");
  redirect("/dashboard/paiements");
}

export async function markAsPaid(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.payment.update({
    where: { id },
    data: { status: "PAID", paidAt: new Date() },
  });

  revalidatePath("/dashboard/paiements");
}
