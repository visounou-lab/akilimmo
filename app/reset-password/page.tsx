"use client";

import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const token        = searchParams.get("token") ?? "";

  const [status, setStatus]         = useState<"loading" | "valid" | "expired" | "invalid">("loading");
  const [password, setPassword]     = useState("");
  const [confirm, setConfirm]       = useState("");
  const [error, setError]           = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) { setStatus("invalid"); return; }
    fetch(`/api/auth/reset-password?token=${token}`)
      .then((r) => r.json())
      .then((d) => {
        if (d.valid)          setStatus("valid");
        else if (d.error === "expired") setStatus("expired");
        else                  setStatus("invalid");
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    if (password !== confirm) { setError("Les mots de passe ne correspondent pas."); return; }
    if (password.length < 8)  { setError("Le mot de passe doit contenir au moins 8 caractères."); return; }
    setSubmitting(true);
    const res  = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, newPassword: password }),
    });
    const data = await res.json();
    setSubmitting(false);
    if (res.ok) {
      router.push("/login?reset=1");
    } else {
      setError(data.error ?? "Une erreur est survenue.");
    }
  }

  if (status === "loading") {
    return (
      <div className="text-center py-8 text-slate-400 text-sm">Vérification du lien…</div>
    );
  }

  if (status === "expired") {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <p className="text-slate-700 font-medium">Ce lien a expiré.</p>
        <p className="text-sm text-slate-500">Les liens de réinitialisation sont valables 1 heure.</p>
        <Link
          href="/forgot-password"
          className="inline-flex items-center justify-center w-full rounded-full bg-[#0066CC] hover:bg-[#004499] text-white px-6 py-3 text-sm font-semibold transition-colors mt-2"
        >
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  if (status === "invalid") {
    return (
      <div className="text-center space-y-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mx-auto">
          <svg className="w-6 h-6 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </div>
        <p className="text-slate-700 font-medium">Lien invalide.</p>
        <p className="text-sm text-slate-500">Ce lien de réinitialisation est invalide ou a déjà été utilisé.</p>
        <Link href="/forgot-password" className="block text-sm text-[#0066CC] hover:underline font-medium mt-2">
          Demander un nouveau lien
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
          {error}
        </div>
      )}
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Nouveau mot de passe</label>
        <input
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-slate-700 mb-1.5">Confirmer le mot de passe</label>
        <input
          type="password"
          required
          minLength={8}
          placeholder="••••••••"
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
        />
      </div>
      <button
        type="submit"
        disabled={submitting}
        className="w-full inline-flex items-center justify-center rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition-colors shadow-sm"
      >
        {submitting ? "Enregistrement…" : "Changer mon mot de passe"}
      </button>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/logo.png" alt="AKIL IMMO" width={80} height={80} className="mx-auto" />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Nouveau mot de passe</h1>
          <p className="mt-1 text-sm text-slate-500">Choisissez un nouveau mot de passe sécurisé</p>
        </div>
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          <Suspense fallback={<div className="text-center py-8 text-slate-400 text-sm">Chargement…</div>}>
            <ResetPasswordForm />
          </Suspense>
        </div>
      </div>
    </div>
  );
}
