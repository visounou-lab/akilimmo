"use client";

import { useState, Suspense } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Eye, EyeOff } from "lucide-react";

function LoginForm() {
  const [email,       setEmail]       = useState("");
  const [password,    setPassword]    = useState("");
  const [showPass,    setShowPass]    = useState(false);
  const [error,       setError]       = useState("");
  const [loading,     setLoading]     = useState(false);
  const router       = useRouter();
  const searchParams = useSearchParams();
  const resetDone    = searchParams.get("reset") === "1";

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const user = session?.user as { role?: string; requestedRole?: string; status?: string } | undefined;

    if (user?.role === "ADMIN") {
      router.push("/dashboard");
    } else if (user?.requestedRole === "OWNER" || user?.requestedRole === "AGENT") {
      router.push("/verification");
    } else if (user?.role === "AGENT") {
      router.push("/agent/dashboard");
    } else if (user?.role === "OWNER") {
      router.push("/owner/dashboard");
    } else {
      router.push("/tenant/dashboard");
    }
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    borderRadius: 10,
    border: "1.5px solid rgba(200,146,42,0.25)",
    padding: "12px 14px",
    fontSize: "0.875rem",
    fontFamily: "var(--font-inter), sans-serif",
    color: "#1C1917",
    backgroundColor: "#FDFCF8",
    outline: "none",
    transition: "border-color 0.15s",
  };

  return (
    <div
      className="rounded-2xl p-8"
      style={{
        backgroundColor: "#FDFCF8",
        border: "1.5px solid rgba(200,146,42,0.2)",
        boxShadow: "0 4px 24px rgba(28,25,23,0.07)",
      }}
    >
      {resetDone && (
        <div
          className="mb-5 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "#D1FAE5", border: "1px solid #A7F3D0", color: "#065F46" }}
        >
          Mot de passe modifié avec succès ! Connectez-vous avec votre nouveau mot de passe.
        </div>
      )}
      {error && (
        <div
          className="mb-5 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "#FEE2E2", border: "1px solid #FECACA", color: "#991B1B" }}
        >
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label
            className="block mb-1.5"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6B5E52",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Email
          </label>
          <input
            type="email"
            required
            placeholder="votre@email.com"
            value={email}
            onChange={e => setEmail(e.target.value)}
            style={inputStyle}
            onFocus={e => { e.currentTarget.style.borderColor = "#C8922A"; }}
            onBlur={e => { e.currentTarget.style.borderColor = "rgba(200,146,42,0.25)"; }}
          />
        </div>

        <div>
          <label
            className="block mb-1.5"
            style={{
              fontSize: "0.7rem",
              fontWeight: 600,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
              color: "#6B5E52",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Mot de passe
          </label>
          <div style={{ position: "relative" }}>
            <input
              type={showPass ? "text" : "password"}
              required
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ ...inputStyle, paddingRight: "44px" }}
              onFocus={e => { e.currentTarget.style.borderColor = "#C8922A"; }}
              onBlur={e => { e.currentTarget.style.borderColor = "rgba(200,146,42,0.25)"; }}
            />
            <button
              type="button"
              onClick={() => setShowPass(v => !v)}
              style={{ position: "absolute", right: 12, top: "50%", transform: "translateY(-50%)", background: "none", border: "none", cursor: "pointer", color: "#94A3B8", padding: 0 }}
            >
              {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>

        <div className="flex justify-end">
          <Link
            href="/forgot-password"
            style={{
              fontSize: "0.8rem",
              color: "#C8922A",
              textDecoration: "none",
              fontFamily: "var(--font-inter), sans-serif",
            }}
          >
            Mot de passe oublié ?
          </Link>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full inline-flex items-center justify-center rounded-xl px-6 py-3.5 text-sm font-medium transition-all disabled:opacity-60"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            backgroundColor: "#1C1917",
            color: "#FDFCF8",
            boxShadow: "0 4px 14px rgba(28,25,23,0.2)",
          }}
          onMouseEnter={e => { if (!loading) e.currentTarget.style.backgroundColor = "#2D2420"; }}
          onMouseLeave={e => { if (!loading) e.currentTarget.style.backgroundColor = "#1C1917"; }}
        >
          {loading ? "Connexion…" : "Se connecter"}
        </button>
      </form>

      <div
        className="mt-6 pt-5 text-center text-sm"
        style={{
          borderTop: "1px solid rgba(200,146,42,0.15)",
          fontFamily: "var(--font-inter), sans-serif",
          color: "#6B5E52",
        }}
      >
        Pas encore de compte ?{" "}
        <Link
          href="/inscription"
          style={{ color: "#C8922A", fontWeight: 600, textDecoration: "none" }}
        >
          Devenir propriétaire →
        </Link>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: "#F5F0E8" }}
    >
      <div className="w-full max-w-md">
        {/* Logo + titre */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex flex-col items-center gap-3">
            <div
              className="rounded-2xl p-3 flex items-center justify-center"
              style={{
                backgroundColor: "#1C1917",
                border: "1px solid rgba(200,146,42,0.3)",
                boxShadow: "0 4px 16px rgba(28,25,23,0.15)",
              }}
            >
              <Image src="/logo.png" alt="AKIL IMMO" width={56} height={56} />
            </div>
            <span
              style={{
                fontSize: "0.65rem",
                fontWeight: 700,
                letterSpacing: "0.18em",
                textTransform: "uppercase",
                color: "#C8922A",
                fontFamily: "var(--font-inter), sans-serif",
              }}
            >
              AKIL IMMO
            </span>
          </Link>

          <h1
            className="mt-5"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "1.75rem",
              color: "#1C1917",
              letterSpacing: "-0.01em",
            }}
          >
            Connexion
          </h1>
          <p
            className="mt-1"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.875rem",
              fontWeight: 300,
              color: "#6B5E52",
            }}
          >
            Accédez à votre espace AKIL IMMO
          </p>
        </div>

        <Suspense
          fallback={
            <div
              className="rounded-2xl p-8"
              style={{ backgroundColor: "#FDFCF8", border: "1.5px solid rgba(200,146,42,0.2)" }}
            />
          }
        >
          <LoginForm />
        </Suspense>
      </div>
    </div>
  );
}
