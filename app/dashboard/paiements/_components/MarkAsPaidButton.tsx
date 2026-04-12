"use client";

import { useState } from "react";
import { markAsPaid } from "../_actions";

export default function MarkAsPaidButton({ id }: { id: string }) {
  const [pending, setPending] = useState(false);

  async function handleClick() {
    setPending(true);
    await markAsPaid(id);
  }

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={pending}
      title="Marquer comme payé"
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors disabled:opacity-40"
    >
      {pending ? (
        <svg className="w-3.5 h-3.5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
      )}
      Marquer payé
    </button>
  );
}
