"use client";

import { useState } from "react";
import { updateProfile } from "../_actions";

const COUNTRY_OPTIONS = [
  { value: "",            label: "— Non renseigné —" },
  { value: "BENIN",       label: "Bénin"              },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire"   },
];

type Props = {
  initialName:    string;
  email:          string;
  initialPhone:   string;
  initialCountry: string;
  initialCity:    string;
};

type Status = "idle" | "loading" | "success" | "error";

export default function ProfilForm({ initialName, email, initialPhone, initialCountry, initialCity }: Props) {
  const [name,    setName]    = useState(initialName);
  const [phone,   setPhone]   = useState(initialPhone);
  const [country, setCountry] = useState(initialCountry);
  const [city,    setCity]    = useState(initialCity);
  const [status,  setStatus]  = useState<Status>("idle");
  const [errorMsg, setError]  = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setError("");
    const result = await updateProfile({ name, phone, country, city });
    if ("error" in result) {
      setStatus("error");
      setError(result.error);
    } else {
      setStatus("success");
      setTimeout(() => setStatus("idle"), 3000);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="grid gap-5 sm:grid-cols-2">
        {/* Name */}
        <div className="sm:col-span-2">
          <label htmlFor="name" className="block text-sm font-semibold text-slate-700 mb-1.5">
            Nom complet <span className="text-red-500">*</span>
          </label>
          <input
            id="name"
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC]"
          />
        </div>

        {/* Email (readonly) */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-semibold text-slate-700 mb-1.5">
            Adresse email
            <span className="ml-2 text-xs font-normal text-slate-400">(non modifiable)</span>
          </label>
          <input
            type="email"
            readOnly
            value={email}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-400 bg-slate-50 cursor-not-allowed"
          />
        </div>

        {/* Phone */}
        <div>
          <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 mb-1.5">Téléphone</label>
          <input
            id="phone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="+229 97 00 00 00"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC]"
          />
        </div>

        {/* City */}
        <div>
          <label htmlFor="city" className="block text-sm font-semibold text-slate-700 mb-1.5">Ville</label>
          <input
            id="city"
            type="text"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cotonou"
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC]"
          />
        </div>

        {/* Country */}
        <div>
          <label htmlFor="country" className="block text-sm font-semibold text-slate-700 mb-1.5">Pays</label>
          <select
            id="country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-[#0066CC]/40 focus:border-[#0066CC] bg-white"
          >
            {COUNTRY_OPTIONS.map((o) => (
              <option key={o.value} value={o.value}>{o.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Feedback */}
      {status === "error" && (
        <div className="flex items-center gap-2 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          {errorMsg}
        </div>
      )}
      {status === "success" && (
        <div className="flex items-center gap-2 rounded-xl bg-green-50 border border-green-100 px-4 py-3 text-sm text-green-700">
          <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
          Profil mis à jour avec succès.
        </div>
      )}

      <div className="pt-2">
        <button
          type="submit"
          disabled={status === "loading"}
          className="inline-flex items-center gap-2 rounded-full bg-[#0066CC] text-white px-6 py-2.5 text-sm font-semibold hover:bg-[#004499] disabled:opacity-60 transition-colors"
        >
          {status === "loading" ? (
            <>
              <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              Enregistrement…
            </>
          ) : "Enregistrer"}
        </button>
      </div>
    </form>
  );
}
