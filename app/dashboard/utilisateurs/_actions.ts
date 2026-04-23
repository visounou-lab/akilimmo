"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";

export async function createUser(formData: FormData) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  const email = formData.get("email") as string;
  const name  = formData.get("name")  as string;
  const role  = formData.get("role")  as "ADMIN" | "OWNER" | "TENANT";
  const password = formData.get("password") as string;

  if (!email || !password) throw new Error("Email et mot de passe requis.");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) throw new Error("Un utilisateur avec cet email existe déjà.");

  const hashed = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, name, role, password: hashed, status: role === "OWNER" ? "pending" : "active" } });

  revalidatePath("/dashboard/utilisateurs");
  redirect("/dashboard/utilisateurs");
}

export async function deleteUser(id: string) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  await prisma.user.delete({ where: { id } });
  revalidatePath("/dashboard/utilisateurs");
}
