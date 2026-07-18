"use server";

import { redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/server";
import { hashPassword, verifyPassword } from "@/lib/auth/password";
import { writeAudit } from "@/lib/audit";

export async function changeOwnPasswordAction(formData: FormData) {
  const user = await getCurrentUser();
  if (!user) redirect("/admin/login");

  const current = String(formData.get("current") ?? "");
  const next = String(formData.get("next") ?? "");
  const confirm = String(formData.get("confirm") ?? "");

  if (!(await verifyPassword(current, user.passwordHash))) {
    redirect("/admin/zugang?pw=wrong");
  }
  if (next.length < 8 || next !== confirm) {
    redirect("/admin/zugang?pw=invalid");
  }

  await prisma.user.update({ where: { id: user.id }, data: { passwordHash: await hashPassword(next) } });
  await writeAudit({ actorId: user.id, action: "user.password_changed", entity: "User", entityId: user.id });
  redirect("/admin/zugang?pw=ok");
}
