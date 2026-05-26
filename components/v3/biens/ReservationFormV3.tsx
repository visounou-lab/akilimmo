"use client";

import { useState } from "react";
import { MessageCircle } from "lucide-react";

interface Props {
  propertyId: string;
  bienTitle: string;
  bienCity: string;
  bienCountry: string;
  pricePerUnit: number;
  whatsappNumber: string;
  bienUrl: string;
}

function calcDuration(from: string, to: string, type: "nuit" | "mois"): number {
  if (!from || !to) return 0;
  const d1 = new Date(from);
  const d2 = new Date(to);
  if (d2 <= d1) return 0;
  if (type === "nuit") return Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
  const months =
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  return Math.max(1, months);
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const fmtDate = (s: string) => (s ? new Date(s).toLocaleDateString("fr-FR") : "");
const today = () => new Date().toISOString().split("T")[0];

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

export default function ReservationFormV3({
  propertyId,
  bienTitle,
  bienCity,
  bienCountry,
  pricePerUnit,
  whatsappNumber,
  bienUrl,
}: Props) {
  const phonePrefix = bienCountry === "COTE_D_IVOIRE" ? "+225 " : "+229 ";
  const cLabel = bienCountry === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : "Bénin";

  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState(phonePrefix);
  const [locationType, setLocationType] = useState<"nuit" | "mois">("nuit");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");

  const duration = calcDuration(checkIn, checkOut, locationType);
  const total = duration * pricePerUnit;
  const canReserve = !!(clientName && clientPhone && checkIn && checkOut && duration > 0);

  function openWA(text: string) {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  async function handleReserve() {
    if (!canReserve) return;
    const durationLabel =
      locationType === "nuit"
        ? `${duration} nuit${duration > 1 ? "s" : ""}`
        : `${duration} mois`;

    // Save to DB (fire-and-forget — ne bloque pas WhatsApp)
    fetch("/api/reservations", {
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        propertyId,
        clientName,
        clientPhone,
        checkIn,
        checkOut,
        locationType,
        duration,
        totalPrice: total,
        message: message.trim() || undefined,
      }),
    }).catch(() => {/* silencieux */});

    let text =
      `Bonjour AKIL IMMO 👋\n\n` +
      `Je souhaite réserver :\n` +
      `🏠 *${bienTitle}*\n` +
      `📍 ${bienCity}, ${cLabel}\n\n` +
      `👤 Nom : ${clientName}\n` +
      `📞 Téléphone : ${clientPhone}\n` +
      `📅 Arrivée : ${fmtDate(checkIn)}\n` +
      `📅 Départ : ${fmtDate(checkOut)}\n` +
      `🌙 Durée : ${durationLabel}\n` +
      `💰 Total estimé : ${fmt(total)} XOF\n` +
      `🔗 ${bienUrl}`;

    if (message.trim()) text += `\n\n${message.trim()}`;
    openWA(text);
  }

  function handleQuestion() {
    openWA(
      `Bonjour, j'ai une question sur le bien : *${bienTitle}* à ${bienCity}.\n🔗 ${bienUrl}`
    );
  }

  return (
    <div
      className="rounded-2xl p-6 space-y-5"
      style={{
        backgroundColor: "#FDFCF8",
        border: "1.5px solid rgba(200,146,42,0.35)",
        boxShadow: "0 2px 12px rgba(28,25,23,0.06)",
      }}
    >
      {/* Header */}
      <div>
        <p
          className="text-xs font-semibold tracking-widest uppercase mb-1"
          style={{ color: "#C8922A", fontFamily: "var(--font-inter), sans-serif", letterSpacing: "0.12em" }}
        >
          RÉSERVER CE BIEN
        </p>
        <h3
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "1.25rem",
            color: "#1C1917",
          }}
        >
          Demande de réservation
        </h3>
      </div>

      {/* Nom */}
      <div>
        <label htmlFor="res-name" style={labelStyle}>Nom complet *</label>
        <input
          id="res-name"
          type="text"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
          placeholder="Ex : Jean Dupont"
          autoComplete="name"
          required
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      {/* Téléphone */}
      <div>
        <label htmlFor="res-phone" style={labelStyle}>Téléphone *</label>
        <input
          id="res-phone"
          type="tel"
          value={clientPhone}
          onChange={(e) => setClientPhone(e.target.value)}
          placeholder={`${phonePrefix}…`}
          autoComplete="tel"
          required
          style={inputStyle}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      {/* Type de location */}
      <div>
        <p style={labelStyle} id="res-type-label">Type de location *</p>
        <div
          role="group"
          aria-labelledby="res-type-label"
          className="flex rounded-xl overflow-hidden"
          style={{ border: "1.5px solid #E8DDD0" }}
        >
          {(["nuit", "mois"] as const).map((t, i) => {
            const active = locationType === t;
            return (
              <button
                key={t}
                type="button"
                onClick={() => setLocationType(t)}
                aria-pressed={active}
                className="flex-1 py-2.5 text-sm cursor-pointer transition-all duration-150"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: active ? 500 : 400,
                  backgroundColor: active ? "#1B4D3E" : "#FDFCF8",
                  color: active ? "#FDFCF8" : "#6B5E52",
                  borderLeft: i > 0 ? "1.5px solid #E8DDD0" : "none",
                  border: "none",
                  ...(i > 0 ? { borderLeft: "1.5px solid #E8DDD0" } : {}),
                }}
              >
                {t === "nuit" ? "Courte durée (nuitées)" : "Longue durée (mensuel)"}
              </button>
            );
          })}
        </div>
      </div>

      {/* Dates */}
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label htmlFor="res-checkin" style={labelStyle}>Arrivée *</label>
          <input
            id="res-checkin"
            type="date"
            value={checkIn}
            min={today()}
            onChange={(e) => {
              setCheckIn(e.target.value);
              if (checkOut && e.target.value >= checkOut) setCheckOut("");
            }}
            required
            style={{ ...inputStyle, padding: "10px 8px" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
          />
        </div>
        <div>
          <label htmlFor="res-checkout" style={labelStyle}>Départ *</label>
          <input
            id="res-checkout"
            type="date"
            value={checkOut}
            min={checkIn || today()}
            onChange={(e) => setCheckOut(e.target.value)}
            required
            style={{ ...inputStyle, padding: "10px 8px" }}
            onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
          />
        </div>
      </div>

      {/* Calcul estimé */}
      {duration > 0 && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{
            backgroundColor: "rgba(27,77,62,0.06)",
            border: "1px solid rgba(27,77,62,0.15)",
            fontFamily: "var(--font-inter), sans-serif",
            color: "#1B4D3E",
          }}
        >
          {duration}{" "}
          {locationType === "nuit" ? `nuit${duration > 1 ? "s" : ""}` : "mois"}&nbsp;×&nbsp;
          {fmt(pricePerUnit)} XOF/{locationType}&nbsp;={" "}
          <span style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700 }}>
            {fmt(total)} XOF
          </span>
        </div>
      )}

      {/* Message optionnel */}
      <div>
        <label htmlFor="res-message" style={labelStyle}>Message (optionnel)</label>
        <textarea
          id="res-message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Précisions, questions particulières…"
          rows={4}
          style={{
            ...inputStyle,
            resize: "none",
            lineHeight: 1.6,
          }}
          onFocus={(e) => { e.currentTarget.style.borderColor = "#C8922A"; }}
          onBlur={(e) => { e.currentTarget.style.borderColor = "#E8DDD0"; }}
        />
      </div>

      {/* CTA principal */}
      <button
        type="button"
        onClick={handleReserve}
        disabled={!canReserve}
        className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl px-6 py-3.5 text-sm font-medium transition-all duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-2"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 500,
          backgroundColor: canReserve ? "#E07B39" : "#E8DDD0",
          color: canReserve ? "#ffffff" : "#A89B8C",
          cursor: canReserve ? "pointer" : "not-allowed",
          ["--tw-ring-color" as string]: "#E07B39",
          boxShadow: canReserve ? "0 4px 14px rgba(224,123,57,0.35)" : "none",
        }}
        onMouseEnter={(e) => {
          if (canReserve) e.currentTarget.style.backgroundColor = "#C96A28";
        }}
        onMouseLeave={(e) => {
          if (canReserve) e.currentTarget.style.backgroundColor = "#E07B39";
        }}
      >
        <MessageCircle size={16} aria-hidden="true" />
        Réserver par WhatsApp
      </button>

      {/* Lien secondaire */}
      <button
        type="button"
        onClick={handleQuestion}
        className="w-full inline-flex items-center justify-center gap-2 cursor-pointer rounded-xl px-6 py-3 text-sm transition-all duration-150 focus:outline-none focus-visible:ring-2"
        style={{
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 400,
          color: "#C8922A",
          backgroundColor: "transparent",
          border: "1.5px solid rgba(200,146,42,0.35)",
          ["--tw-ring-color" as string]: "#C8922A",
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.08)";
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = "transparent";
        }}
      >
        💬 Poser une question sur ce bien
      </button>
    </div>
  );
}
