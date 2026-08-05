"use client";

import { useActionState } from "react";
import type { Role } from "@prisma/client";
import { ROLE_LABELS } from "@/lib/auth/rbac";
import {
  createUserAction,
  type AccessState,
} from "@/app/admin/(panel)/acces/actions";

const ROLES = Object.keys(ROLE_LABELS) as Role[];

export function CreateUserForm() {
  const [state, action, pending] = useActionState<AccessState, FormData>(
    createUserAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Nom complet">
          <input name="name" required className={inputCls} />
        </Field>
        <Field label="Courriel">
          <input name="email" type="email" required className={inputCls} />
        </Field>
        <Field label="Rôle">
          <select name="role" defaultValue="READ_ONLY" className={inputCls}>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {ROLE_LABELS[r]}
              </option>
            ))}
          </select>
        </Field>
        <Field label="Mot de passe initial">
          <input name="password" type="text" required minLength={10} className={inputCls} />
        </Field>
      </div>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        Créer le compte
      </button>
    </form>
  );
}

const inputCls =
  "h-10 w-full rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50";

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      {children}
    </div>
  );
}
