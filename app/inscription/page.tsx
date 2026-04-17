"use client";

import { useState } from "react";
import Link from "next/link";

const COUNTRY_OPTIONS = [
  { value: "BENIN", label: "Bénin", prefix: "+229" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire", prefix: "+225" },
];

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 " +
  "transition-colors bg-white placeholder:text-slate-400";

export default function InscriptionPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phonePrefix: "+229",
    phoneNumber: "",
    country: "BENIN",
    city: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  function handleCountryChange(value: string) {
    const opt = COUNTRY_OPTIONS.find((o) => o.value === value);
    setForm((f) => ({ ...f, country: value, phonePrefix: opt?.prefix ?? "+229" }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }
    if (form.password.length < 8) {
      setError("Le mot de passe doit faire au moins 8 caractères.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          phone: `${form.phonePrefix} ${form.phoneNumber}`,
          country: form.country,
          city: form.city,
          password: form.password,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Erreur lors de l'inscription");
      } else {
        setSuccess(true);
      }
    } catch {
      setError("Erreur réseau. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  if (success) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">Vérifiez votre email</h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            Un lien de confirmation a été envoyé à <strong>{form.email}</strong>.
            Cliquez sur le lien pour activer votre compte.
          </p>
          <p className="text-sm text-slate-400">
            Le lien expire dans 24 heures. Vérifiez aussi vos spams.
          </p>
          <Link
            href="/"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4 py-16">
      <div className="w-full max-w-lg">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AKIL IMMO" className="h-12 mx-auto" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(88%) saturate(1500%) hue-rotate(200deg)" }} />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Devenir propriétaire</h1>
          <p className="mt-1 text-sm text-slate-500">
            Créez votre compte et gérez vos biens au Bénin et en Côte d&apos;Ivoire
          </p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Prénom + Nom */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Prénom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Kofi"
                  value={form.firstName}
                  onChange={(e) => setForm((f) => ({ ...f, firstName: e.target.value }))}
                  className={inputClass}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Nom <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  placeholder="ex : Mensah"
                  value={form.lastName}
                  onChange={(e) => setForm((f) => ({ ...f, lastName: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Email <span className="text-red-400">*</span>
              </label>
              <input
                type="email"
                required
                placeholder="votre@email.com"
                value={form.email}
                onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Pays */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Pays <span className="text-red-400">*</span>
              </label>
              <select
                required
                value={form.country}
                onChange={(e) => handleCountryChange(e.target.value)}
                className={inputClass}
              >
                {COUNTRY_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>{o.label}</option>
                ))}
              </select>
            </div>

            {/* Téléphone */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Téléphone <span className="text-red-400">*</span>
              </label>
              <div className="flex gap-2">
                <select
                  value={form.phonePrefix}
                  onChange={(e) => setForm((f) => ({ ...f, phonePrefix: e.target.value }))}
                  className="rounded-xl border border-slate-200 px-3 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] bg-white w-28 shrink-0"
                >
                  {COUNTRY_OPTIONS.map((o) => (
                    <option key={o.value} value={o.prefix}>{o.prefix} {o.label.split(" ")[0]}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  placeholder="XX XX XX XX"
                  value={form.phoneNumber}
                  onChange={(e) => setForm((f) => ({ ...f, phoneNumber: e.target.value }))}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Ville */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Ville <span className="text-red-400">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="ex : Cotonou"
                value={form.city}
                onChange={(e) => setForm((f) => ({ ...f, city: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Mot de passe */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Mot de passe <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="Minimum 8 caractères"
                value={form.password}
                onChange={(e) => setForm((f) => ({ ...f, password: e.target.value }))}
                className={inputClass}
              />
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">
                Confirmer le mot de passe <span className="text-red-400">*</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={form.confirmPassword}
                onChange={(e) => setForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                className={inputClass}
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition-colors shadow-sm"
            >
              {loading ? (
                <>
                  <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                  </svg>
                  Création en cours…
                </>
              ) : (
                "Créer mon compte propriétaire"
              )}
            </button>

            <p className="text-center text-sm text-slate-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="text-[#0066CC] hover:underline font-medium">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
