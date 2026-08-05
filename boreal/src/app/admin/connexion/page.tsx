"use client";

import { useActionState } from "react";
import { Loader2, Lock } from "lucide-react";

import { loginAction, type LoginState } from "../auth-actions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { BorealMark, Wordmark } from "@/components/layout/logo";

export default function LoginPage() {
  const [state, formAction, pending] = useActionState<LoginState, FormData>(
    loginAction,
    {},
  );

  return (
    <div className="flex min-h-dvh items-center justify-center bg-secondary/40 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="flex items-center gap-2.5">
            <BorealMark />
            <Wordmark />
          </div>
          <p className="text-sm text-muted-foreground">Espace d'administration</p>
        </div>

        <form
          action={formAction}
          className="space-y-5 rounded-2xl border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8"
        >
          <div className="flex items-center gap-2 text-sm font-medium">
            <Lock className="size-4 text-glacier" />
            Connexion sécurisée
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Courriel</Label>
            <Input
              id="email"
              name="email"
              type="email"
              autoComplete="username"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Mot de passe</Label>
            <Input
              id="password"
              name="password"
              type="password"
              autoComplete="current-password"
              required
            />
          </div>

          {state.error && (
            <p className="rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
              {state.error}
            </p>
          )}

          <Button type="submit" variant="aurora" className="w-full" disabled={pending}>
            {pending && <Loader2 className="size-4 animate-spin" />}
            Se connecter
          </Button>
        </form>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          Accès réservé au personnel autorisé de Boreal Finance Group.
        </p>
      </div>
    </div>
  );
}
