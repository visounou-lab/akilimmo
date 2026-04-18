"use client";
import { useState } from "react";
type FormState = "idle" | "sending" | "success";

export default function ContactForm() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", country: "", subject: "", message: "" });
  const [status, setStatus] = useState<FormState>("idle");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("sending");
    await new Promise((r) => setTimeout(r, 1500));
    setStatus("success");
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center gap-4 rounded-3xl bg-green-50 p-10 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
          <svg className="h-8 w-8 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h3 className="text-xl font-semibold text-slate-900">Message envoyé !</h3>
        <p className="text-sm text-slate-500">Un expert AKIL IMMO vous répond sur info@akilimmo.com dans les 24h.</p>
        <button onClick={() => setStatus("idle")} className="rounded-full bg-[#0066CC] px-6 py-2.5 text-sm font-semibold text-white hover:bg-[#004499]">
          Envoyer un autre message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="name">Nom complet <span className="text-red-400">*</span></label>
          <input id="name" name="name" type="text" required value={form.name} onChange={handleChange} placeholder="Ex : Jean Dupont"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="email">Email <span className="text-red-400">*</span></label>
          <input id="email" name="email" type="email" required value={form.email} onChange={handleChange} placeholder="vous@exemple.com"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20" />
        </div>
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="phone">Téléphone</label>
          <input id="phone" name="phone" type="tel" value={form.phone} onChange={handleChange} placeholder="+229 01 00 00 00"
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20" />
        </div>
        <div className="space-y-1.5">
          <label className="text-sm font-medium text-slate-700" htmlFor="country">Pays</label>
          <select id="country" name="country" value={form.country} onChange={handleChange}
            className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20">
            <option value="">Sélectionner...</option>
            <option value="benin">Bénin</option>
            <option value="cotedivoire">Côte d&apos;Ivoire</option>
            <option value="both">Les deux pays</option>
            <option value="other">Autre (diaspora)</option>
          </select>
        </div>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="subject">Sujet <span className="text-red-400">*</span></label>
        <select id="subject" name="subject" required value={form.subject} onChange={handleChange}
          className="w-full rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20">
          <option value="">Choisir un sujet...</option>
          <option value="location">Recherche de location</option>
          <option value="vente">Achat / Vente de bien</option>
          <option value="gestion">Gestion locative</option>
          <option value="mandat">Mandat de gestion</option>
          <option value="autre">Autre demande</option>
        </select>
      </div>
      <div className="space-y-1.5">
        <label className="text-sm font-medium text-slate-700" htmlFor="message">Message <span className="text-red-400">*</span></label>
        <textarea id="message" name="message" required rows={4} value={form.message} onChange={handleChange} placeholder="Décrivez votre demande..."
          className="w-full resize-none rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20" />
      </div>
      <button type="submit" disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-[#0066CC] px-6 py-3.5 text-sm font-semibold text-white shadow-lg transition hover:bg-[#004499] disabled:opacity-60">
        {status === "sending" ? "Envoi en cours..." : "Envoyer ma demande"}
      </button>
    </form>
  );
}