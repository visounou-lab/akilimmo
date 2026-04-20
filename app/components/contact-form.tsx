"use client";
import { useState } from "react";

type Status = "idle" | "loading" | "success" | "error";

const EMPTY = { nom: "", email: "", telephone: "", pays: "", sujet: "", message: "" };

export default function ContactForm() {
  const [form, setForm] = useState(EMPTY);
  const [status, setStatus] = useState<Status>("idle");
  const [errorMsg, setErrorMsg] = useState<string>("");

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("loading");
    setErrorMsg("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom:       form.nom,
          email:     form.email,
          telephone: form.telephone || undefined,
          pays:      form.pays     || undefined,
          sujet:     form.sujet,
          message:   form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setStatus("success");
      setForm(EMPTY);
    } catch (err) {
      setStatus("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur inconnue");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-green-50 border border-green-100 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Merci !</h3>
        <p className="text-sm text-slate-500 max-w-sm">
          Votre demande a bien été envoyée. Un expert AKIL IMMO vous répondra sous 24h.
        </p>
        <button
          onClick={() => setStatus("idle")}
          className="rounded-full bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004499] transition-colors"
        >
          Envoyer un autre message
        </button>
      </div>
    );
  }

  const inputClass =
    "w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {status === "error" && (
        <div className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          <svg className="mt-0.5 h-4 w-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v4m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
          </svg>
          <span className="flex-1">{errorMsg}</span>
          <button
            type="button"
            onClick={() => setStatus("idle")}
            className="shrink-0 font-semibold underline hover:no-underline"
          >
            Réessayer
          </button>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="nom">
            Nom complet <span className="text-red-400">*</span>
          </label>
          <input
            id="nom" name="nom" type="text" required
            value={form.nom} onChange={handleChange}
            placeholder="Ex : Jean Dupont"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">
            Email <span className="text-red-400">*</span>
          </label>
          <input
            id="email" name="email" type="email" required
            value={form.email} onChange={handleChange}
            placeholder="vous@exemple.com"
            className={inputClass}
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="telephone">Téléphone</label>
          <input
            id="telephone" name="telephone" type="tel"
            value={form.telephone} onChange={handleChange}
            placeholder="+229 01 00 00 00"
            className={inputClass}
          />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="pays">Pays</label>
          <select id="pays" name="pays" value={form.pays} onChange={handleChange} className={inputClass}>
            <option value="">Sélectionner...</option>
            <option value="Bénin">Bénin</option>
            <option value="Côte d'Ivoire">Côte d&apos;Ivoire</option>
            <option value="Les deux pays">Les deux pays</option>
            <option value="Autre (diaspora)">Autre (diaspora)</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="sujet">
          Sujet <span className="text-red-400">*</span>
        </label>
        <select id="sujet" name="sujet" required value={form.sujet} onChange={handleChange} className={inputClass}>
          <option value="">Choisir un sujet...</option>
          <option value="Recherche de location">Recherche de location</option>
          <option value="Achat / Vente de bien">Achat / Vente de bien</option>
          <option value="Gestion locative">Gestion locative</option>
          <option value="Mandat de gestion">Mandat de gestion</option>
          <option value="Autre demande">Autre demande</option>
        </select>
      </div>

      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="message">
          Message <span className="text-red-400">*</span>
        </label>
        <textarea
          id="message" name="message" required rows={4}
          value={form.message} onChange={handleChange}
          placeholder="Décrivez votre demande..."
          className={`${inputClass} resize-none`}
        />
      </div>

      <button
        type="submit"
        disabled={status === "loading"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0066CC] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#004499] disabled:opacity-60"
      >
        {status === "loading" ? (
          <>
            <svg className="h-4 w-4 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 100 16v-4l-3 3 3 3v-4a8 8 0 01-8-8z" />
            </svg>
            Envoi en cours...
          </>
        ) : (
          "Envoyer ma demande"
        )}
      </button>
    </form>
  );
}
