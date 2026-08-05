import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { UsersTable } from "@/components/admin/users-table";
import { CreateUserForm } from "@/components/admin/create-user-form";
import { ChangePasswordForm } from "@/components/admin/change-password-form";

export const dynamic = "force-dynamic";

export default async function AccessPage() {
  const current = await requirePermission("users.manage");
  const users = await prisma.user.findMany({
    orderBy: { createdAt: "asc" },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      active: true,
      lastLoginAt: true,
    },
  });

  return (
    <div className="space-y-8">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Accès</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gestion du personnel et des rôles (permissions par rôle).
        </p>
      </div>

      <UsersTable
        users={users.map((u) => ({
          ...u,
          lastLoginAt: u.lastLoginAt ? u.lastLoginAt.toISOString() : null,
        }))}
        currentUserId={current.id}
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-serif text-lg font-semibold">Nouveau compte</h2>
          <CreateUserForm />
        </section>

        <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
          <h2 className="mb-4 font-serif text-lg font-semibold">Mon mot de passe</h2>
          <ChangePasswordForm />
        </section>
      </div>
    </div>
  );
}
