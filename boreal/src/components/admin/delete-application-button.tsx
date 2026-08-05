"use client";

import { Trash2 } from "lucide-react";
import { deleteApplicationAction } from "@/app/admin/(panel)/demandes/actions";
import { cn } from "@/lib/utils";

export function DeleteApplicationButton({
  id,
  variant = "compact",
}: {
  id: string;
  variant?: "compact" | "full";
}) {
  return (
    <form
      action={deleteApplicationAction}
      onSubmit={(e) => {
        if (
          !confirm(
            "Supprimer définitivement ce dossier ? Cette action est irréversible.",
          )
        ) {
          e.preventDefault();
        }
      }}
    >
      <input type="hidden" name="id" value={id} />
      <button
        type="submit"
        className={cn(
          "inline-flex items-center gap-1.5 rounded-md bg-destructive font-medium text-destructive-foreground transition-colors hover:bg-destructive/90",
          variant === "compact" ? "px-2.5 py-1 text-xs" : "px-4 py-2 text-sm",
        )}
      >
        <Trash2 className={variant === "compact" ? "size-3.5" : "size-4"} />
        Supprimer{variant === "full" ? " le dossier" : ""}
      </button>
    </form>
  );
}
