"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, Check } from "lucide-react";

const COUNTRY_OPTIONS = [
  { value: "BENIN", label: "Bénin", prefix: "+229" },
  { value: "COTE_D_IVOIRE", label: "Côte d'Ivoire", prefix: "+225" },
];

const inputStyle: React.CSSProperties = {
  width: "100%",
  borderRadius: 8,
  border: "1px solid rgba(27,77,62,0.2)",
  padding: "12px 14px",
  fontSize: "0.875rem",
  fontFamily: "var(--font-inter), sans-serif",
  color: "#1C1917",
  backgroundColor: "#ffffff",
  transition: "border-color 150ms, box-shadow 150ms",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-inter), sans-serif",
  fontWeight: 500,
  fontSize: "0.82rem",
  color: "#1C1917",
  marginBottom: 6,
};

const requiredMark = <span style={{ color: "#E07B39" }}>*</span>;

export default function InscriptionFormV3() {
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

  /* ── Success screen ── */
  if (success) {
    return (
      <div
        className="min-h-screen flex items-center justify-center px-4"
        style={{ backgroundColor: "#F5F0E8" }}
      >
        <div
          className="rounded-2xl p-10 max-w-md w-full text-center"
          style={{
            backgroundColor: "#FDFCF8",
            border: "1px solid #E8DDD0",
            boxShadow: "0 4px 24px rgba(28,25,23,0.08)",
          }}
        >
          <div
            className="flex items-center justify-center rounded-full mx-auto mb-6"
            style={{
              width: 64,
              height: 64,
              backgroundColor: "rgba(200,146,42,0.12)",
              border: "1px solid rgba(200,146,42,0.3)",
            }}
          >
            <Check size={28} style={{ color: "#C8922A" }} aria-hidden="true" />
          </div>

          <h2
            className="mb-3"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "1.5rem",
              color: "#1C1917",
            }}
          >
            Vérifiez votre email
          </h2>

          <p
            className="mb-4"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              color: "#6B5E52",
              lineHeight: 1.75,
            }}
          >
            Un lien de confirmation a été envoyé à{" "}
            <strong style={{ color: "#1C1917", fontWeight: 500 }}>{form.email}</strong>.
            Cliquez sur le lien pour activer votre compte.
          </p>

          <p
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontSize: "0.8rem",
              color: "#6B5E52",
            }}
          >
            Le lien expire dans 24 heures. Vérifiez aussi vos spams.
          </p>

          <Link
            href="/v3"
            className="mt-6 inline-flex items-center justify-center gap-2 rounded-lg px-6 py-3 text-sm cursor-pointer transition-all duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 500,
              backgroundColor: "#E07B39",
              color: "#ffffff",
              boxShadow: "0 4px 16px rgba(224,123,57,0.4)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = "#C96A28";
              e.currentTarget.style.transform = "translateY(-1px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = "#E07B39";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  /* ── Main form ── */
  return (
    <>
      {/* Scoped focus styles for form fields */}
      <style>{`
        .v3-field:focus {
          border-color: #C8922A !important;
          box-shadow: 0 0 0 3px rgba(200,146,42,0.12) !important;
          outline: none;
        }
        .v3-field::placeholder {
          color: #A89880;
        }
      `}</style>

      <div className="min-h-screen flex flex-col">

        {/* ── Header ── */}
        <header
          className="flex items-center justify-between px-6 lg:px-12 shrink-0"
          style={{
            backgroundColor: "#1B4D3E",
            height: 80,
            borderBottom: "1px solid rgba(200,146,42,0.2)",
          }}
        >
          {/* Wordmark */}
          <div className="flex items-center gap-2">
            <span
              aria-hidden="true"
              style={{
                display: "block",
                width: 3,
                height: 20,
                backgroundColor: "#C8922A",
                borderRadius: 2,
                flexShrink: 0,
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-playfair), serif",
                fontWeight: 700,
                fontSize: "1.15rem",
                color: "#FDFCF8",
                letterSpacing: "0.06em",
              }}
            >
              AKIL IMMO
            </span>
          </div>

          {/* Back link */}
          <Link
            href="/v3"
            className="flex items-center gap-1.5 text-sm cursor-pointer transition-colors duration-200"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              color: "rgba(253,252,248,0.6)",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "#C8922A")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "rgba(253,252,248,0.6)")}
          >
            <ArrowLeft size={14} aria-hidden="true" />
            Retour à l&apos;accueil
          </Link>
        </header>

        {/* ── Split layout ── */}
        <div className="flex flex-1 overflow-hidden">

          {/* LEFT COLUMN — desktop only */}
          <div className="hidden lg:flex lg:w-1/2 relative flex-col justify-end overflow-hidden">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage:
                  "url(https://images.unsplash.com/photo-1600210492493-0946911123ea?w=1200&q=80)",
                backgroundSize: "cover",
                backgroundPosition: "center",
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(180deg, rgba(27,77,62,0.45) 0%, rgba(27,77,62,0.94) 65%, rgba(28,25,23,0.96) 100%)",
              }}
            />

            <div className="relative z-10 p-12 pb-16">
              {/* Badge */}
              <div
                className="mb-6 inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
                style={{
                  backgroundColor: "rgba(200,146,42,0.18)",
                  border: "1px solid rgba(200,146,42,0.55)",
                  color: "#C8922A",
                  fontFamily: "var(--font-inter), sans-serif",
                  letterSpacing: "0.12em",
                }}
              >
                Pour les propriétaires
              </div>

              <h2
                className="mb-5"
                style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontWeight: 700,
                  fontSize: "clamp(1.6rem, 2.4vw, 2.4rem)",
                  color: "#FDFCF8",
                  letterSpacing: "-0.01em",
                  lineHeight: 1.25,
                }}
              >
                Confiez.{" "}
                <em style={{ fontStyle: "italic", color: "#C8922A" }}>
                  Gérez à distance.
                </em>{" "}
                Encaissez.
              </h2>

              <p
                className="mb-8 max-w-sm"
                style={{
                  fontFamily: "var(--font-inter), sans-serif",
                  fontWeight: 300,
                  color: "rgba(253,252,248,0.72)",
                  lineHeight: 1.75,
                  fontSize: "0.93rem",
                }}
              >
                Rejoignez les propriétaires qui font confiance à AKIL IMMO
                pour gérer leurs biens en Côte d&apos;Ivoire et au Bénin.
              </p>

              <ul className="space-y-4" role="list">
                {[
                  "Inscription gratuite, validation sous 24h",
                  "Publication de votre bien sous 48h",
                  "Tableau de bord propriétaire en temps réel",
                ].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <div
                      className="flex items-center justify-center rounded-full shrink-0"
                      style={{
                        width: 24,
                        height: 24,
                        backgroundColor: "rgba(200,146,42,0.18)",
                        border: "1px solid rgba(200,146,42,0.4)",
                      }}
                      aria-hidden="true"
                    >
                      <Check size={12} style={{ color: "#C8922A" }} />
                    </div>
                    <span
                      style={{
                        fontFamily: "var(--font-inter), sans-serif",
                        fontWeight: 300,
                        fontSize: "0.875rem",
                        color: "rgba(253,252,248,0.82)",
                      }}
                    >
                      {item}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RIGHT COLUMN — form */}
          <div
            className="w-full lg:w-1/2 overflow-y-auto"
            style={{ backgroundColor: "#FDFCF8" }}
          >
            <div className="flex min-h-full items-start lg:items-center justify-center px-6 py-10 lg:py-12">
              <div className="w-full max-w-md">

                {/* Mobile badge */}
                <div className="lg:hidden mb-5">
                  <div
                    className="inline-flex items-center gap-2 rounded-full px-4 py-1.5 text-xs font-medium tracking-widest uppercase"
                    style={{
                      backgroundColor: "rgba(27,77,62,0.08)",
                      border: "1px solid rgba(27,77,62,0.2)",
                      color: "#1B4D3E",
                      fontFamily: "var(--font-inter), sans-serif",
                      letterSpacing: "0.12em",
                    }}
                  >
                    Pour les propriétaires
                  </div>
                </div>

                {/* Page title */}
                <div className="mb-8">
                  <h1
                    className="mb-2"
                    style={{
                      fontFamily: "var(--font-playfair), serif",
                      fontWeight: 700,
                      fontSize: "clamp(1.6rem, 3vw, 2rem)",
                      color: "#1C1917",
                      letterSpacing: "-0.01em",
                      lineHeight: 1.2,
                    }}
                  >
                    Devenir{" "}
                    <em style={{ fontStyle: "italic", color: "#C8922A" }}>
                      propriétaire
                    </em>
                  </h1>
                  <p
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 300,
                      color: "#6B5E52",
                      fontSize: "0.875rem",
                      lineHeight: 1.65,
                    }}
                  >
                    Créez votre compte et gérez vos biens au Bénin et en Côte d&apos;Ivoire.
                  </p>
                </div>

                {/* ── Form ── */}
                <form onSubmit={handleSubmit} className="space-y-5" noValidate>

                  {/* Prénom + Nom */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="v3-firstName" style={labelStyle}>
                        Prénom {requiredMark}
                      </label>
                      <input
                        id="v3-firstName"
                        type="text"
                        required
                        autoComplete="given-name"
                        placeholder="ex : Kofi"
                        value={form.firstName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, firstName: e.target.value }))
                        }
                        className="v3-field"
                        style={inputStyle}
                      />
                    </div>
                    <div>
                      <label htmlFor="v3-lastName" style={labelStyle}>
                        Nom {requiredMark}
                      </label>
                      <input
                        id="v3-lastName"
                        type="text"
                        required
                        autoComplete="family-name"
                        placeholder="ex : Mensah"
                        value={form.lastName}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, lastName: e.target.value }))
                        }
                        className="v3-field"
                        style={inputStyle}
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label htmlFor="v3-email" style={labelStyle}>
                      Email {requiredMark}
                    </label>
                    <input
                      id="v3-email"
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="votre@email.com"
                      value={form.email}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, email: e.target.value }))
                      }
                      className="v3-field"
                      style={inputStyle}
                    />
                  </div>

                  {/* Pays */}
                  <div>
                    <label htmlFor="v3-country" style={labelStyle}>
                      Pays {requiredMark}
                    </label>
                    <select
                      id="v3-country"
                      required
                      autoComplete="country"
                      value={form.country}
                      onChange={(e) => handleCountryChange(e.target.value)}
                      className="v3-field"
                      style={{ ...inputStyle, cursor: "pointer" }}
                    >
                      {COUNTRY_OPTIONS.map((o) => (
                        <option key={o.value} value={o.value}>
                          {o.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Téléphone */}
                  <div>
                    <label htmlFor="v3-phoneNumber" style={labelStyle}>
                      Téléphone {requiredMark}
                    </label>
                    <div className="flex gap-2">
                      <select
                        aria-label="Indicatif téléphonique"
                        value={form.phonePrefix}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phonePrefix: e.target.value }))
                        }
                        className="v3-field"
                        style={{
                          ...inputStyle,
                          width: "auto",
                          flexShrink: 0,
                          paddingLeft: 10,
                          paddingRight: 10,
                          cursor: "pointer",
                        }}
                      >
                        {COUNTRY_OPTIONS.map((o) => (
                          <option key={o.value} value={o.prefix}>
                            {o.prefix} {o.label.split(" ")[0]}
                          </option>
                        ))}
                      </select>
                      <input
                        id="v3-phoneNumber"
                        type="tel"
                        required
                        autoComplete="tel-national"
                        placeholder="XX XX XX XX"
                        value={form.phoneNumber}
                        onChange={(e) =>
                          setForm((f) => ({ ...f, phoneNumber: e.target.value }))
                        }
                        className="v3-field"
                        style={{ ...inputStyle, flex: 1 }}
                      />
                    </div>
                  </div>

                  {/* Ville */}
                  <div>
                    <label htmlFor="v3-city" style={labelStyle}>
                      Ville {requiredMark}
                    </label>
                    <input
                      id="v3-city"
                      type="text"
                      required
                      autoComplete="address-level2"
                      placeholder="ex : Cotonou"
                      value={form.city}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, city: e.target.value }))
                      }
                      className="v3-field"
                      style={inputStyle}
                    />
                  </div>

                  {/* Mot de passe */}
                  <div>
                    <label htmlFor="v3-password" style={labelStyle}>
                      Mot de passe {requiredMark}
                    </label>
                    <input
                      id="v3-password"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="Minimum 8 caractères"
                      value={form.password}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, password: e.target.value }))
                      }
                      className="v3-field"
                      style={inputStyle}
                    />
                  </div>

                  {/* Confirmation mot de passe */}
                  <div>
                    <label htmlFor="v3-confirmPassword" style={labelStyle}>
                      Confirmer le mot de passe {requiredMark}
                    </label>
                    <input
                      id="v3-confirmPassword"
                      type="password"
                      required
                      autoComplete="new-password"
                      placeholder="••••••••"
                      value={form.confirmPassword}
                      onChange={(e) =>
                        setForm((f) => ({ ...f, confirmPassword: e.target.value }))
                      }
                      className="v3-field"
                      style={inputStyle}
                    />
                  </div>

                  {/* Error */}
                  {error && (
                    <div
                      role="alert"
                      className="rounded-lg px-4 py-3 text-sm"
                      style={{
                        backgroundColor: "rgba(224,123,57,0.08)",
                        border: "1px solid rgba(224,123,57,0.35)",
                        fontFamily: "var(--font-inter), sans-serif",
                        color: "#C96A28",
                      }}
                    >
                      {error}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2 cursor-pointer rounded-lg px-6 py-3.5 text-sm transition-all duration-200"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontWeight: 500,
                      backgroundColor: "#E07B39",
                      color: "#ffffff",
                      boxShadow: "0 4px 16px rgba(224,123,57,0.35)",
                      opacity: loading ? 0.6 : 1,
                      cursor: loading ? "not-allowed" : "pointer",
                    }}
                    onMouseEnter={(e) => {
                      if (!loading) {
                        e.currentTarget.style.backgroundColor = "#C96A28";
                        e.currentTarget.style.transform = "translateY(-1px)";
                      }
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.backgroundColor = "#E07B39";
                      e.currentTarget.style.transform = "translateY(0)";
                    }}
                  >
                    {loading ? (
                      <>
                        <svg
                          className="animate-spin"
                          style={{ width: 16, height: 16 }}
                          fill="none"
                          viewBox="0 0 24 24"
                          aria-hidden="true"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          />
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                          />
                        </svg>
                        Création en cours…
                      </>
                    ) : (
                      "Créer mon compte propriétaire"
                    )}
                  </button>

                  {/* Legal */}
                  <p
                    className="text-center"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      fontSize: "0.75rem",
                      color: "#6B5E52",
                      lineHeight: 1.6,
                    }}
                  >
                    En créant un compte, vous acceptez nos{" "}
                    <Link
                      href="/mentions-legales"
                      style={{ color: "#C8922A", textDecoration: "underline" }}
                    >
                      Conditions d&apos;utilisation
                    </Link>{" "}
                    et notre{" "}
                    <Link
                      href="/confidentialite"
                      style={{ color: "#C8922A", textDecoration: "underline" }}
                    >
                      Politique de confidentialité
                    </Link>
                    .
                  </p>

                  {/* Login link */}
                  <p
                    className="text-center text-sm"
                    style={{
                      fontFamily: "var(--font-inter), sans-serif",
                      color: "#6B5E52",
                    }}
                  >
                    Déjà un compte ?{" "}
                    <Link
                      href="/login"
                      style={{ color: "#C8922A", fontWeight: 500 }}
                      onMouseEnter={(e) =>
                        (e.currentTarget.style.textDecoration = "underline")
                      }
                      onMouseLeave={(e) =>
                        (e.currentTarget.style.textDecoration = "none")
                      }
                    >
                      Se connecter
                    </Link>
                  </p>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
