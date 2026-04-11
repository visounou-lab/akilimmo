"use client";

import { useState } from "react";
import { deleteContract } from "../_actions";

export default function DeleteContractButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleDelete() {
    if (!confirm("Supprimer ce contrat définitivement ?")) return;
    setPending(true);
    await deleteContract(id);
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={pending}
      title="Supprimer"
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors disabled:opacity-40"
    >
      {pending ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
        </svg>
      )}
    </button>
  );
}
