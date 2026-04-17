"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Suspense } from "react";

function VerifyContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const [status, setStatus] = useState<"loading" | "success" | "expired" | "invalid">("loading");
  const [expiredEmail, setExpiredEmail] = useState("");
  const [resendLoading, setResendLoading] = useState(false);
  const [resendDone, setResendDone] = useState(false);

  useEffect(() => {
    if (!token) {
      setStatus("invalid");
      return;
    }
    fetch(`/api/auth/verify?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.message === "ok") {
          setStatus("success");
        } else if (data.error === "expired") {
          setStatus("expired");
          setExpiredEmail(data.email ?? "");
        } else {
          setStatus("invalid");
        }
      })
      .catch(() => setStatus("invalid"));
  }, [token]);

  async function handleResend() {
    if (!expiredEmail) return;
    setResendLoading(true);
    try {
      await fetch("/api/auth/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: expiredEmail }),
      });
      setResendDone(true);
    } finally {
      setResendLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <div className="flex flex-col items-center gap-4">
        <svg className="w-10 h-10 animate-spin text-[#0066CC]" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
        <p className="text-slate-500 text-sm">Vérification en cours…</p>
      </div>
    );
  }

  if (status === "success") {
    return (
      <>
        <div className="w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-emerald-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Email vérifié ✅</h2>
        <p className="text-slate-500 leading-relaxed mb-6">
          Votre adresse email a bien été confirmée. Votre compte est actuellement{" "}
          <strong>en attente de validation</strong> par notre équipe.
          Vous recevrez un email dès que votre compte sera activé.
        </p>
        <Link
          href="/"
          className="inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] transition"
        >
          Retour à l&apos;accueil
        </Link>
      </>
    );
  }

  if (status === "expired") {
    return (
      <>
        <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-3">Lien expiré</h2>
        <p className="text-slate-500 mb-6">
          Ce lien de vérification a expiré (valide 24h). Demandez un nouveau lien.
        </p>
        {resendDone ? (
          <p className="text-emerald-600 font-medium text-sm">Un nouveau lien a été envoyé à votre email.</p>
        ) : (
          <button
            onClick={handleResend}
            disabled={resendLoading}
            className="inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] disabled:opacity-60 transition"
          >
            {resendLoading ? "Envoi…" : "Renvoyer le lien"}
          </button>
        )}
      </>
    );
  }

  return (
    <>
      <div className="w-16 h-16 rounded-full bg-red-50 flex items-center justify-center mx-auto mb-6">
        <svg className="w-8 h-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </div>
      <h2 className="text-2xl font-bold text-slate-900 mb-3">Lien invalide</h2>
      <p className="text-slate-500 mb-6">
        Ce lien de vérification est invalide ou a déjà été utilisé.
      </p>
      <Link
        href="/inscription"
        className="inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] transition"
      >
        Créer un nouveau compte
      </Link>
    </>
  );
}

export default function VerifyPage() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
        <Link href="/" className="inline-block mb-8">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="AKIL IMMO" className="h-10 mx-auto" style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(88%) saturate(1500%) hue-rotate(200deg)" }} />
        </Link>
        <Suspense fallback={<p className="text-slate-400 text-sm">Chargement…</p>}>
          <VerifyContent />
        </Suspense>
      </div>
    </div>
  );
}
