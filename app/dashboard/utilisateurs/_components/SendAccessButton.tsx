"use client";

import { useState } from "react";

export default function SendAccessButton({ id }: { id: string }) {
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSend() {
    if (!confirm("Envoyer les accès par email à ce locataire ?")) return;
    setStatus("loading");
    try {
      const res = await fetch(`/api/dashboard/utilisateurs/${id}/send-access`, { method: "POST" });
      setStatus(res.ok ? "done" : "error");
      if (res.ok) setTimeout(() => setStatus("idle"), 3000);
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium px-2">
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
        </svg>
        Envoyé
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={handleSend}
      disabled={status === "loading"}
      title="Envoyer les accès par email"
      className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-sky-50 hover:text-sky-600 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
    >
      {status === "loading" ? (
        <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
        </svg>
      ) : (
        <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
}
