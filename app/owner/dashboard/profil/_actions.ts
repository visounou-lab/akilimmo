"use server";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";

export async function updateProfile(data: {
  name:    string;
  phone:   string;
  country: string;
  city:    string;
}): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const name = data.name.trim();
  if (!name) return { error: "Le nom est obligatoire" };

  const VALID_COUNTRIES = ["BENIN", "COTE_D_IVOIRE", ""];
  if (!VALID_COUNTRIES.includes(data.country)) {
    return { error: "Pays invalide" };
  }

  await prisma.user.update({
    where: { id: userId },
    data:  {
      name,
      phone:   data.phone.trim()   || null,
      country: (data.country as "BENIN" | "COTE_D_IVOIRE") || null,
      city:    data.city.trim()    || null,
    },
  });

  return { success: true };
}
