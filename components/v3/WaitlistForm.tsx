"use client";

import { useState } from "react";
import { Bell, Check } from "lucide-react";

interface Props {
  source?: string;
  className?: string;
}

export default function WaitlistForm({ source = "sejours", className = "" }: Props) {
  const [email, setEmail]     = useState("");
  const [country, setCountry] = useState("");
  const [status, setStatus]   = useState<"idle" | "loading" | "done" | "error">("idle");
  const [error, setError]     = useState("");

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!emailOk || status === "loading") return;
    setStatus("loading");
    setError("");
    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim(), source, country: country || undefined }),
      });
      if (!res.ok) {
        const p = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(p?.error ?? "Échec de l'inscription");
      }
      setStatus("done");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Une erreur est survenue");
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div
        className={`mx-auto flex max-w-md items-center gap-3 rounded-xl px-5 py-4 ${className}`}
        style={{ backgroundColor: "rgba(200,146,42,0.12)", border: "1px solid rgba(200,146,42,0.4)" }}
        role="status"
      >
        <span
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full"
          style={{ backgroundColor: "#C8922A" }}
        >
          <Check size={16} color="#1C1917" />
        </span>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.9rem", color: "#FDFCF8", textAlign: "left" }}>
          C&apos;est noté ! Vous serez parmi les premiers informés du lancement.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className={`mx-auto w-full max-w-md ${className}`}>
      <div className="flex flex-col gap-3 sm:flex-row">
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="Votre adresse email"
          autoComplete="email"
          required
          aria-label="Adresse email"
          className="flex-1 rounded-lg px-4 py-3 text-sm"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            backgroundColor: "rgba(253,252,248,0.06)",
            border: "1px solid rgba(253,252,248,0.2)",
            color: "#FDFCF8",
            outline: "none",
          }}
        />
        <button
          type="submit"
          disabled={!emailOk || status === "loading"}
          className="inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm font-medium transition-all duration-200"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 500,
            backgroundColor: emailOk ? "#C8922A" : "rgba(200,146,42,0.4)",
            color: "#ffffff",
            cursor: emailOk ? "pointer" : "not-allowed",
            whiteSpace: "nowrap",
          }}
        >
          <Bell size={15} aria-hidden="true" />
          {status === "loading" ? "…" : "Me prévenir"}
        </button>
      </div>

      {/* Pays (optionnel) */}
      <div className="mt-3 flex justify-center gap-2" role="group" aria-label="Votre pays (optionnel)">
        {[
          { value: "", label: "Peu importe" },
          { value: "BENIN", label: "Bénin" },
          { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire" },
        ].map((opt) => {
          const active = country === opt.value;
          return (
            <button
              key={opt.value || "any"}
              type="button"
              onClick={() => setCountry(opt.value)}
              className="rounded-full px-3 py-1.5 text-xs transition-colors"
              style={{
                fontFamily: "var(--font-inter), sans-serif",
                backgroundColor: active ? "rgba(200,146,42,0.2)" : "transparent",
                border: `1px solid ${active ? "#C8922A" : "rgba(253,252,248,0.2)"}`,
                color: active ? "#C8922A" : "rgba(253,252,248,0.6)",
              }}
            >
              {opt.label}
            </button>
          );
        })}
      </div>

      {status === "error" && (
        <p className="mt-3 text-sm" style={{ color: "#FCA5A5", fontFamily: "var(--font-inter), sans-serif" }}>
          {error}
        </p>
      )}
      <p className="mt-3 text-xs" style={{ color: "rgba(253,252,248,0.4)", fontFamily: "var(--font-inter), sans-serif" }}>
        Pas de spam — juste un message au lancement.
      </p>
    </form>
  );
}
