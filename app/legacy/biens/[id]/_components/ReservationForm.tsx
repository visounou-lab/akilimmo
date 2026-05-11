"use client";

import { useState } from "react";

const WA_ICON = (
  <svg className="w-5 h-5 shrink-0" fill="currentColor" viewBox="0 0 24 24">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.122 1.518 5.854L.057 23.882a.5.5 0 00.61.637l6.198-1.63A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.386l-.36-.213-3.722.979.999-3.646-.234-.375A9.818 9.818 0 1112 21.818z" />
  </svg>
);

interface Props {
  bienTitle: string;
  bienCity: string;
  bienCountry: string;
  pricePerUnit: number;
  whatsappNumber: string;
}

function calcDuration(from: string, to: string, type: "nuit" | "mois"): number {
  if (!from || !to) return 0;
  const d1 = new Date(from);
  const d2 = new Date(to);
  if (d2 <= d1) return 0;
  if (type === "nuit") {
    return Math.ceil((d2.getTime() - d1.getTime()) / 86_400_000);
  }
  const months =
    (d2.getFullYear() - d1.getFullYear()) * 12 + (d2.getMonth() - d1.getMonth());
  return Math.max(1, months);
}

const fmt = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
const fmtDate = (s: string) =>
  s ? new Date(s).toLocaleDateString("fr-FR") : "";
const today = () => new Date().toISOString().split("T")[0];

export default function ReservationForm({
  bienTitle,
  bienCity,
  bienCountry,
  pricePerUnit,
  whatsappNumber,
}: Props) {
  const [clientName, setClientName] = useState("");
  const [clientPhone, setClientPhone] = useState("");
  const [locationType, setLocationType] = useState<"nuit" | "mois">("nuit");
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [message, setMessage] = useState("");

  const duration = calcDuration(checkIn, checkOut, locationType);
  const total = duration * pricePerUnit;
  const countryLabel = bienCountry === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : "Bénin";
  const canReserve = !!(clientName && clientPhone && checkIn && checkOut && duration > 0);

  function openWA(text: string) {
    window.open(
      `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`,
      "_blank",
      "noopener,noreferrer"
    );
  }

  function handleReserve() {
    if (!canReserve) return;
    const durationLabel =
      locationType === "nuit"
        ? `${duration} nuit${duration > 1 ? "s" : ""}`
        : `${duration} mois`;

    let text =
      `Bonjour AKIL IMMO 👋\n\n` +
      `Je souhaite réserver :\n` +
      `🏠 *${bienTitle}*\n` +
      `📍 ${bienCity}, ${countryLabel}\n\n` +
      `👤 Nom : ${clientName}\n` +
      `📞 Téléphone : ${clientPhone}\n` +
      `📅 Arrivée : ${fmtDate(checkIn)}\n` +
      `📅 Départ : ${fmtDate(checkOut)}\n` +
      `🌙 Durée : ${durationLabel}\n` +
      `💰 Total estimé : ${fmt(total)} XOF`;

    if (message.trim()) text += `\n\n${message.trim()}`;
    openWA(text);
  }

  function handleQuestion() {
    openWA(`Bonjour, j'ai une question sur le bien : *${bienTitle}* à ${bienCity}.`);
  }

  return (
    <div className="rounded-3xl bg-white border border-slate-200 p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <span className="text-[#25D366]">{WA_ICON}</span>
        Réserver ce bien
      </h2>

      <div className="space-y-4">
        {/* Nom */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            Nom complet
          </label>
          <input
            type="text"
            value={clientName}
            onChange={(e) => setClientName(e.target.value)}
            placeholder="Ex : Jean Dupont"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#0066CC] transition"
          />
        </div>

        {/* Téléphone */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            Téléphone
          </label>
          <input
            type="text"
            value={clientPhone}
            onChange={(e) => setClientPhone(e.target.value)}
            placeholder="+229 …"
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#0066CC] transition"
          />
        </div>

        {/* Type de location */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            Type de location
          </label>
          <div className="flex rounded-xl border border-slate-200 overflow-hidden text-sm font-medium">
            {(["nuit", "mois"] as const).map((t, i) => (
              <button
                key={t}
                type="button"
                onClick={() => setLocationType(t)}
                className={`flex-1 py-2.5 transition ${
                  i > 0 ? "border-l border-slate-200" : ""
                } ${
                  locationType === t
                    ? "bg-[#0066CC] text-white"
                    : "bg-white text-slate-600 hover:bg-slate-50"
                }`}
              >
                {t === "nuit" ? "Courte durée (nuitées)" : "Longue durée (mensuel)"}
              </button>
            ))}
          </div>
        </div>

        {/* Dates */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Arrivée
            </label>
            <input
              type="date"
              value={checkIn}
              min={today()}
              onChange={(e) => {
                setCheckIn(e.target.value);
                if (checkOut && e.target.value >= checkOut) setCheckOut("");
              }}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] transition"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
              Départ
            </label>
            <input
              type="date"
              value={checkOut}
              min={checkIn || today()}
              onChange={(e) => setCheckOut(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] transition"
            />
          </div>
        </div>

        {/* Calcul */}
        {duration > 0 && (
          <div className="rounded-xl bg-emerald-50 border border-emerald-100 px-4 py-3 text-sm text-emerald-800">
            {duration} {locationType === "nuit" ? `nuit${duration > 1 ? "s" : ""}` : "mois"}&nbsp;×&nbsp;
            {fmt(pricePerUnit)} XOF/{locationType}&nbsp;=&nbsp;
            <span className="font-bold">{fmt(total)} XOF</span>
          </div>
        )}

        {/* Message optionnel */}
        <div>
          <label className="block text-xs font-semibold uppercase tracking-wide text-slate-400 mb-1.5">
            Message (optionnel)
          </label>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Précisions, questions particulières…"
            rows={3}
            className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 placeholder-slate-300 focus:outline-none focus:border-[#0066CC] transition resize-none"
          />
        </div>

        {/* Bouton principal */}
        <button
          type="button"
          onClick={handleReserve}
          disabled={!canReserve}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl bg-[#25D366] hover:bg-[#1ebe5d] disabled:opacity-40 disabled:cursor-not-allowed px-6 py-3.5 text-sm font-semibold text-white transition shadow-lg shadow-green-500/25"
        >
          {WA_ICON}
          Réserver par WhatsApp
        </button>

        {/* Bouton secondaire */}
        <button
          type="button"
          onClick={handleQuestion}
          className="w-full inline-flex items-center justify-center gap-2 rounded-2xl border-2 border-[#25D366] bg-white hover:bg-green-50 px-6 py-3 text-sm font-semibold text-[#25D366] transition"
        >
          💬 Poser une question sur ce bien
        </button>
      </div>
    </div>
  );
}
