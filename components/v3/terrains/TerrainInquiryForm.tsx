"use client";

import { useState } from "react";

interface Props {
  landId: string;
  landTitle: string;
  landCountry: string;
}

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1.5px solid #E8DDD0",
  padding: "10px 14px",
  fontSize: "0.875rem",
  color: "#1C1917",
  backgroundColor: "#FDFCF8",
  fontFamily: "var(--font-inter), sans-serif",
  outline: "none",
  transition: "border-color 0.15s",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontSize: "0.7rem",
  fontWeight: 600,
  letterSpacing: "0.1em",
  textTransform: "uppercase",
  color: "#6B5E52",
  marginBottom: 6,
  fontFamily: "var(--font-inter), sans-serif",
};

export default function TerrainInquiryForm({ landId, landTitle, landCountry }: Props) {
  const phonePrefix = landCountry === "COTE_D_IVOIRE" ? "+225 " : "+229 ";

  const [clientName, setClientName]   = useState("");
  const [clientPhone, setClientPhone] = useState(phonePrefix);
  const [clientEmail, setClientEmail] = useState("");
  const [message, setMessage]         = useState("");
  const [status, setStatus]           = useState<"idle" | "loading" | "sent" | "error">("idle");
  const [errorMsg, setErrorMsg]       = useState("");

  const canSubmit = !!(clientName.trim() && clientPhone.trim());

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit || status === "loading") return;
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/terrains/inquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          landId,
          clientName,
          clientPhone,
          clientEmail: clientEmail.trim() || undefined,
          message: message.trim() || undefined,
        }),
      });
      if (!res.ok) {
        const p = (await res.json().catch(() => null)) as { error?: string } | null;
        throw new Error(p?.error ?? "Échec de l'envoi");
      }
      setStatus("sent");
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Une erreur est survenue");
      setStatus("error");
    }
  }

  if (status === "sent") {
    return (
      <div
        className="rounded-2xl p-6 text-center"
        style={{ backgroundColor: "#FDFCF8", border: "1.5px solid rgba(27,77,62,0.35)" }}
      >
        <div className="w-14 h-14 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-4">
          <svg className="w-7 h-7 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.2rem", color: "#1C1917" }}>
          Demande envoyée !
        </h3>
        <p className="mt-2 text-sm" style={{ color: "#6B5E52", fontFamily: "var(--font-inter), sans-serif" }}>
          Notre équipe AKIL IMMO vous recontacte au plus vite au sujet de ce terrain.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-2xl p-6 space-y-5"
      style={{
        backgroundColor: "#FDFCF8",
        border: "1.5px solid rgba(200,146,42,0.35)",
        boxShadow: "0 2px 12px rgba(28,25,23,0.06)",
      }}
    >
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "#C8922A", fontFamily: "var(--font-inter), sans-serif", letterSpacing: "0.12em" }}
        >
          CE TERRAIN VOUS INTÉRESSE ?
        </p>
        <h3 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.25rem", color: "#1C1917" }}>
          Demande d&apos;information
        </h3>
      </div>

      <div>
        <label htmlFor="inq-name" style={labelStyle}>Nom complet *</label>
        <input
          id="inq-name" type="text" value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Ex : Jean Dupont" autoComplete="name" required style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      <div>
        <label htmlFor="inq-phone" style={labelStyle}>Téléphone *</label>
        <input
          id="inq-phone" type="tel" value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder={`${phonePrefix}…`} autoComplete="tel" required style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      <div>
        <label htmlFor="inq-email" style={labelStyle}>Email (optionnel)</label>
        <input
          id="inq-email" type="email" value={clientEmail}
          onChange={(e) => setClientEmail(e.target.value)}
          placeholder="vous@exemple.com" autoComplete="email" style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      <div>
        <label htmlFor="inq-message" style={labelStyle}>Message (optionnel)</label>
        <textarea
          id="inq-message" value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Je souhaite plus d'informations sur « ${landTitle} »…`}
          rows={4} style={{ ...inputStyle, resize: "none", lineHeight: 1.6 }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      {status === "error" && (
        <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-inter), sans-serif" }}>{errorMsg}</p>
      )}

      <button
        type="submit"
        disabled={!canSubmit || status === "loading"}
        className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-200"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 500,
          backgroundColor: canSubmit ? "#E07B39" : "#E8DDD0",
          color: canSubmit ? "#ffffff" : "#A89B8C",
          cursor: canSubmit ? "pointer" : "not-allowed",
          boxShadow: canSubmit ? "0 4px 14px rgba(224,123,57,0.35)" : "none",
        }}
        onMouseEnter={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = "#C96A28"; }}
        onMouseLeave={(e) => { if (canSubmit) e.currentTarget.style.backgroundColor = "#E07B39"; }}
      >
        {status === "loading" ? "Envoi en cours…" : "Envoyer ma demande"}
      </button>
    </form>
  );
}
