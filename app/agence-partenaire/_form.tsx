"use client";

import { useActionState } from "react";
import { submitAgentApplication } from "./_actions";

type State = { success?: boolean; error?: string } | null;

const inputStyle: React.CSSProperties = {
  width: "100%",
  padding: "0.75rem 1rem",
  borderRadius: 10,
  border: "1.5px solid rgba(200,146,42,0.3)",
  backgroundColor: "#FDFCF8",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "0.9rem",
  color: "#1C1917",
  outline: "none",
};

const labelStyle: React.CSSProperties = {
  display: "block",
  fontFamily: "var(--font-inter), sans-serif",
  fontSize: "0.8rem",
  fontWeight: 500,
  color: "#6B5E52",
  marginBottom: "0.4rem",
};

export default function AgentApplicationForm() {
  const [state, action, pending] = useActionState<State, FormData>(submitAgentApplication, null);

  if (state?.success) {
    return (
      <div
        className="rounded-2xl p-8 text-center"
        style={{ backgroundColor: "#FDFCF8", border: "1.5px solid rgba(200,146,42,0.3)" }}
      >
        <p className="text-3xl mb-4">✅</p>
        <h3
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: "1.3rem",
            color: "#1C1917",
            marginBottom: "0.75rem",
          }}
        >
          Candidature enregistrée !
        </h3>
        <p
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "#6B5E52",
            lineHeight: 1.65,
          }}
        >
          Votre agence est sur la liste d&apos;attente. L&apos;équipe AKIL IMMO vous contactera
          dès le lancement officiel du programme partenaire pour valider votre dossier.
        </p>
      </div>
    );
  }

  return (
    <form
      action={action}
      className="space-y-5"
      style={{
        backgroundColor: "#FDFCF8",
        border: "1.5px solid rgba(200,146,42,0.25)",
        borderRadius: 20,
        padding: "2rem",
        boxShadow: "0 4px 24px rgba(28,25,23,0.07)",
      }}
    >
      {state?.error && (
        <div
          className="rounded-xl px-4 py-3 text-sm"
          style={{ backgroundColor: "rgba(239,68,68,0.07)", border: "1px solid rgba(239,68,68,0.2)", color: "#B91C1C", fontFamily: "var(--font-inter), sans-serif" }}
        >
          {state.error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>Nom de l&apos;agence *</label>
          <input name="agencyName" required placeholder="IMMO PLUS CI" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Nom du responsable *</label>
          <input name="contactName" required placeholder="Jean Kouassi" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>Email professionnel *</label>
          <input name="email" type="email" required placeholder="contact@agence.ci" style={inputStyle} />
        </div>
        <div>
          <label style={labelStyle}>Téléphone *</label>
          <input name="phone" type="tel" required placeholder="+225 07 00 00 00 00" style={inputStyle} />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
        <div>
          <label style={labelStyle}>Pays *</label>
          <select name="country" required style={inputStyle}>
            <option value="">-- Sélectionner --</option>
            <option value="COTE_D_IVOIRE">Côte d&apos;Ivoire</option>
            <option value="BENIN">Bénin</option>
          </select>
        </div>
        <div>
          <label style={labelStyle}>Ville d&apos;activité *</label>
          <input name="city" required placeholder="Abidjan" style={inputStyle} />
        </div>
      </div>

      <div>
        <label style={labelStyle}>Document officiel disponible *</label>
        <select name="documentType" required style={inputStyle}>
          <option value="">-- Sélectionner --</option>
          <option value="registre_commerce">Registre de commerce</option>
          <option value="carte_exercice">Carte d&apos;exercice de démarchage</option>
        </select>
        <p style={{ fontFamily: "var(--font-inter), sans-serif", fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.3rem" }}>
          Le document vous sera demandé lors de la validation de votre dossier.
        </p>
      </div>

      <div>
        <label style={labelStyle}>Message (facultatif)</label>
        <textarea
          name="message"
          rows={3}
          placeholder="Décrivez brièvement votre activité, votre zone de couverture..."
          style={{ ...inputStyle, resize: "vertical" }}
        />
      </div>

      <button
        type="submit"
        disabled={pending}
        style={{
          width: "100%",
          padding: "0.875rem",
          borderRadius: 12,
          border: "none",
          backgroundColor: pending ? "#A8998A" : "#C8922A",
          color: "#FDFCF8",
          fontFamily: "var(--font-inter), sans-serif",
          fontWeight: 600,
          fontSize: "0.9375rem",
          cursor: pending ? "not-allowed" : "pointer",
          transition: "background-color 0.15s",
        }}
      >
        {pending ? "Envoi en cours…" : "Rejoindre la liste d'attente"}
      </button>
    </form>
  );
}
