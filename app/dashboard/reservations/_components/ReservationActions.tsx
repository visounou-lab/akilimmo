"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const NEXT_STATUS: Record<string, { label: string; next: string; color: string }> = {
  pending:   { label: "Marquer contacté",  next: "contacted", color: "#3B82F6" },
  contacted: { label: "Confirmer",         next: "confirmed", color: "#10B981" },
  confirmed: { label: "Annuler",           next: "cancelled", color: "#EF4444" },
  cancelled: { label: "Remettre en att.", next: "pending",   color: "#F59E0B" },
};

export default function ReservationActions({
  id,
  currentStatus,
}: {
  id: string;
  currentStatus: string;
}) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const action = NEXT_STATUS[currentStatus];
  if (!action) return null;

  async function handleClick() {
    setLoading(true);
    try {
      await fetch(`/api/reservations/${id}`, {
        method:  "PATCH",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ status: action.next }),
      });
      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-opacity disabled:opacity-50 whitespace-nowrap"
      style={{ backgroundColor: `${action.color}15`, color: action.color, border: `1px solid ${action.color}30` }}
    >
      {loading ? "…" : action.label}
    </button>
  );
}
