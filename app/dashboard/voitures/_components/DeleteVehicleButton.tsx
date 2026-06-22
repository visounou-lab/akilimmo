"use client";

import { useState } from "react";
import { deleteVehicle } from "../_actions";

export default function DeleteVehicleButton({ id, name }: { id: string; name: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer "${name}" définitivement ?`)) return;
    setPending(true);
    await deleteVehicle(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      className="rounded-lg border border-red-200 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 transition-colors disabled:opacity-40"
    >
      {pending ? "Suppression…" : "Supprimer"}
    </button>
  );
}
