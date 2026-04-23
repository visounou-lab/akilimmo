"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

export default function ForgotPasswordPage() {
  const [email, setEmail]     = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent]       = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center justify-center bg-[#0066CC] rounded-2xl p-3 mx-auto">
            <Image src="/logo.png" alt="AKIL IMMO" width={64} height={64} />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Mot de passe oublié</h1>
          <p className="mt-1 text-sm text-slate-500">Recevez un lien de réinitialisation par email</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          {sent ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center mx-auto">
                <svg className="w-6 h-6 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <p className="text-slate-700 font-medium">Email envoyé</p>
              <p className="text-sm text-slate-500">
                Si cet email existe, un lien vous a été envoyé. Vérifiez votre boîte mail.
              </p>
              <Link href="/login" className="block text-sm text-[#0066CC] hover:underline font-medium mt-2">
                Retour à la connexion
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Adresse email
                </label>
                <input
                  type="email"
                  required
                  placeholder="votre@email.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full inline-flex items-center justify-center rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition-colors shadow-sm"
              >
                {loading ? "Envoi…" : "Envoyer le lien de réinitialisation"}
              </button>
              <p className="text-center text-sm text-slate-500">
                <Link href="/login" className="text-[#0066CC] hover:underline font-medium">
                  Retour à la connexion
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
