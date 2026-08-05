"use client";

import { useActionState } from "react";
import {
  changeOwnPasswordAction,
  type AccessState,
} from "@/app/admin/(panel)/acces/actions";

export function ChangePasswordForm() {
  const [state, action, pending] = useActionState<AccessState, FormData>(
    changeOwnPasswordAction,
    {},
  );

  return (
    <form action={action} className="space-y-4">
      <Field label="Mot de passe actuel">
        <input name="current" type="password" required className={inputCls} />
      </Field>
      <Field label="Nouveau mot de passe">
        <input name="next" type="password" required minLength={10} className={inputCls} />
      </Field>
      <Field label="Confirmer le nouveau mot de passe">
        <input name="confirm" type="password" required minLength={10} className={inputCls} />
      </Field>

      {state.error && <p className="text-sm text-destructive">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-emerald-600 dark:text-emerald-400">{state.success}</p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-60"
      >
        Changer le mot de passe
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
