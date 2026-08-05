"use client";

import type { Role } from "@prisma/client";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import {
  setUserRoleAction,
  toggleActiveAction,
  deleteUserAction,
} from "@/app/admin/(panel)/acces/actions";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

interface Row {
  id: string;
  name: string;
  email: string;
  role: Role;
  active: boolean;
  lastLoginAt: string | null;
}

export function UsersTable({
  users,
  currentUserId,
}: {
  users: Row[];
  currentUserId: string;
}) {
  return (
    <div className="overflow-x-auto rounded-xl border bg-card shadow-[var(--shadow-soft)]">
      <table className="w-full text-sm">
        <thead className="text-left text-xs text-muted-foreground">
          <tr className="border-b">
            <th className="px-4 py-3 font-medium">Nom</th>
            <th className="px-4 py-3 font-medium">Courriel</th>
            <th className="px-4 py-3 font-medium">Rôle</th>
            <th className="px-4 py-3 font-medium">Statut</th>
            <th className="px-4 py-3 text-right font-medium">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y">
          {users.map((u) => {
            const self = u.id === currentUserId;
            return (
              <tr key={u.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 font-medium">
                  {u.name}
                  {self && <span className="ml-2 text-xs text-muted-foreground">(vous)</span>}
                </td>
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3">
                  <form action={setUserRoleAction} className="flex items-center gap-2">
                    <input type="hidden" name="userId" value={u.id} />
                    <select
                      name="role"
                      defaultValue={u.role}
                      className="h-9 rounded-md border bg-background/60 px-2 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
                    >
                      {ROLES.map((r) => (
                        <option key={r} value={r}>
                          {ROLE_LABELS[r]}
                        </option>
                      ))}
                    </select>
                    <button
                      type="submit"
                      className="rounded-md border px-2 py-1 text-xs font-medium hover:bg-accent"
                    >
                      OK
                    </button>
                  </form>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={
                      u.active
                        ? "inline-flex rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-medium text-emerald-800 dark:bg-emerald-500/15 dark:text-emerald-300"
                        : "inline-flex rounded-full bg-zinc-200 px-2 py-0.5 text-xs font-medium text-zinc-700 dark:bg-zinc-500/15 dark:text-zinc-300"
                    }
                  >
                    {u.active ? "Actif" : "Inactif"}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-end gap-2">
                    {!self && (
                      <>
                        <form action={toggleActiveAction}>
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="rounded-md border px-2.5 py-1 text-xs font-medium hover:bg-accent"
                          >
                            {u.active ? "Désactiver" : "Réactiver"}
                          </button>
                        </form>
                        <form
                          action={deleteUserAction}
                          onSubmit={(e) => {
                            if (!confirm(`Supprimer le compte ${u.email} ?`)) e.preventDefault();
                          }}
                        >
                          <input type="hidden" name="userId" value={u.id} />
                          <button
                            type="submit"
                            className="rounded-md bg-destructive px-2.5 py-1 text-xs font-medium text-destructive-foreground hover:bg-destructive/90"
                          >
                            Supprimer
                          </button>
                        </form>
                      </>
                    )}
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
