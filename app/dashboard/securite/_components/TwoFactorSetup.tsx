"use client";

import { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { startEnroll, confirmEnroll, disableTwoFactor } from "../_actions";

const box: React.CSSProperties = {
  backgroundColor: "#FDFCF8",
  border: "1.5px solid rgba(200,146,42,0.25)",
  borderRadius: 16,
  padding: "1.5rem",
};
const input: React.CSSProperties = {
  width: "100%",
  borderRadius: 10,
  border: "1.5px solid rgba(200,146,42,0.3)",
  padding: "12px 14px",
  fontSize: "1.1rem",
  letterSpacing: "0.3em",
  textAlign: "center",
  color: "#1C1917",
  backgroundColor: "#fff",
  outline: "none",
};
const primaryBtn: React.CSSProperties = {
  backgroundColor: "#1B4D3E",
  color: "#fff",
  borderRadius: 10,
  padding: "12px 18px",
  fontSize: "0.9rem",
  fontWeight: 600,
  border: "none",
  cursor: "pointer",
};

export default function TwoFactorSetup({
  enabled,
  forced = false,
}: {
  enabled: boolean;
  forced?: boolean;
}) {
  const router = useRouter();
  const [qr, setQr] = useState<string | null>(null);
  const [secret, setSecret] = useState<string | null>(null);
  const [code, setCode] = useState("");
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleStart() {
    setError(""); setBusy(true);
    const res = await startEnroll();
    setBusy(false);
    if (!res.ok) { setError(res.error); return; }
    setQr(res.qr); setSecret(res.secret);
  }

  async function handleConfirm() {
    setError(""); setBusy(true);
    const res = await confirmEnroll(code);
    setBusy(false);
    if (!res.ok) { setError(res.error ?? "Erreur"); return; }
    router.refresh();
  }

  async function handleDisable() {
    setError(""); setBusy(true);
    const res = await disableTwoFactor(code);
    setBusy(false);
    if (!res.ok) { setError(res.error ?? "Erreur"); return; }
    setQr(null); setSecret(null); setCode("");
    router.refresh();
  }

  // ── Déjà activée : proposer la désactivation ──
  if (enabled) {
    return (
      <div style={box}>
        <p style={{ color: "#1B4D3E", fontWeight: 700, marginBottom: 4 }}>
          ✅ Double authentification activée
        </p>
        <p style={{ color: "#6B5E52", fontSize: "0.875rem", marginBottom: 16 }}>
          Un code de votre application d&apos;authentification est demandé à chaque connexion.
        </p>
        <label style={{ fontSize: "0.8rem", color: "#6B5E52" }}>
          Pour désactiver, entrez un code actuel :
        </label>
        <input
          style={{ ...input, margin: "8px 0" }}
          inputMode="numeric"
          maxLength={6}
          placeholder="123456"
          value={code}
          onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
        />
        {error && <p style={{ color: "#991B1B", fontSize: "0.8rem", marginBottom: 8 }}>{error}</p>}
        <button
          onClick={handleDisable}
          disabled={busy || code.length < 6}
          style={{ ...primaryBtn, backgroundColor: "#B91C1C", opacity: busy || code.length < 6 ? 0.6 : 1 }}
        >
          {busy ? "…" : "Désactiver la 2FA"}
        </button>
      </div>
    );
  }

  // ── Enrôlement ──
  return (
    <div style={box}>
      {forced && (
        <div
          className="mb-4 rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(200,146,42,0.1)", border: "1px solid rgba(200,146,42,0.3)", color: "#8a6a1f" }}
        >
          Pour votre sécurité, l&apos;accès au tableau de bord exige d&apos;abord l&apos;activation
          de la double authentification.
        </div>
      )}
      <p style={{ color: "#1C1917", fontWeight: 700, marginBottom: 4 }}>
        Activer la double authentification
      </p>
      <p style={{ color: "#6B5E52", fontSize: "0.875rem", marginBottom: 16 }}>
        Utilisez Google Authenticator, Authy ou Microsoft Authenticator.
      </p>

      {!qr ? (
        <button onClick={handleStart} disabled={busy} style={{ ...primaryBtn, opacity: busy ? 0.6 : 1 }}>
          {busy ? "…" : "Générer le QR code"}
        </button>
      ) : (
        <div>
          <ol style={{ color: "#3D3530", fontSize: "0.85rem", lineHeight: 1.7, paddingLeft: 18, marginBottom: 14 }}>
            <li>Scannez ce QR code dans votre application.</li>
            <li>Entrez le code à 6 chiffres affiché pour confirmer.</li>
          </ol>
          <div style={{ display: "flex", justifyContent: "center", marginBottom: 14 }}>
            <Image src={qr} alt="QR code de configuration 2FA" width={200} height={200} unoptimized style={{ borderRadius: 12, border: "1px solid rgba(200,146,42,0.25)" }} />
          </div>
          {secret && (
            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94A3B8", marginBottom: 14 }}>
              Clé manuelle : <code style={{ color: "#6B5E52", wordBreak: "break-all" }}>{secret}</code>
            </p>
          )}
          <input
            style={input}
            inputMode="numeric"
            maxLength={6}
            placeholder="123456"
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
          />
          {error && <p style={{ color: "#991B1B", fontSize: "0.8rem", margin: "8px 0" }}>{error}</p>}
          <button
            onClick={handleConfirm}
            disabled={busy || code.length < 6}
            style={{ ...primaryBtn, width: "100%", marginTop: 12, opacity: busy || code.length < 6 ? 0.6 : 1 }}
          >
            {busy ? "Vérification…" : "Activer"}
          </button>
        </div>
      )}
      {error && !qr && <p style={{ color: "#991B1B", fontSize: "0.8rem", marginTop: 10 }}>{error}</p>}
    </div>
  );
}
