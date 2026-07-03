"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { CheckCircle2, FileLock2, Upload } from "lucide-react";

type DocumentSlot = {
  caseType: "IDENTITY" | "OWNER_AUTHORITY" | "PROFESSIONAL";
  documentType:
    | "IDENTITY_DOCUMENT"
    | "OWNERSHIP_EVIDENCE"
    | "MANAGEMENT_MANDATE"
    | "PROFESSIONAL_CARD"
    | "BUSINESS_REGISTRATION"
    | "PROFESSIONAL_INSURANCE";
  label: string;
  help: string;
};

const IDENTITY_SLOT: DocumentSlot = {
  caseType: "IDENTITY",
  documentType: "IDENTITY_DOCUMENT",
  label: "Pièce d’identité",
  help: "Carte nationale, passeport ou titre d’identité valide.",
};

const OWNER_SLOTS: DocumentSlot[] = [IDENTITY_SLOT];

const AGENT_SLOTS: DocumentSlot[] = [
  IDENTITY_SLOT,
  {
    caseType: "PROFESSIONAL",
    documentType: "PROFESSIONAL_CARD",
    label: "Carte professionnelle",
    help: "Carte professionnelle en cours de validité. Un seul justificatif professionnel suffit.",
  },
  {
    caseType: "PROFESSIONAL",
    documentType: "BUSINESS_REGISTRATION",
    label: "Registre de commerce",
    help: "RCCM mentionnant l’activité immobilière et le responsable. Alternative à la carte.",
  },
  {
    caseType: "PROFESSIONAL",
    documentType: "PROFESSIONAL_INSURANCE",
    label: "Assurance professionnelle",
    help: "Facultatif à l’inscription, recommandé pour renforcer votre profil.",
  },
];

export default function VerificationDocumentsForm({
  requestedRole,
  existingDocumentTypes,
  editableCaseTypes,
}: {
  requestedRole: "OWNER" | "AGENT";
  existingDocumentTypes: string[];
  editableCaseTypes: string[];
}) {
  const router = useRouter();
  const slots = requestedRole === "AGENT" ? AGENT_SLOTS : OWNER_SLOTS;
  const [uploaded, setUploaded] = useState(() => new Set(existingDocumentTypes));
  const [busySlot, setBusySlot] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function upload(slot: DocumentSlot, file: File) {
    setError("");
    setBusySlot(slot.documentType);
    const body = new FormData();
    body.set("caseType", slot.caseType);
    body.set("documentType", slot.documentType);
    body.set("file", file);
    try {
      const response = await fetch("/api/verification/documents", {
        method: "POST",
        body,
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Envoi impossible");
      setUploaded((current) => new Set(current).add(slot.documentType));
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Envoi impossible");
    } finally {
      setBusySlot(null);
    }
  }

  const hasIdentity = uploaded.has("IDENTITY_DOCUMENT");
  const hasRoleEvidence =
    requestedRole === "AGENT"
      ? uploaded.has("PROFESSIONAL_CARD") || uploaded.has("BUSINESS_REGISTRATION")
      : true;
  const ready = hasIdentity && hasRoleEvidence;

  async function submit() {
    setError("");
    setSubmitting(true);
    try {
      const response = await fetch("/api/verification/submit", { method: "POST" });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error ?? "Soumission impossible");
      setSuccess(true);
      router.refresh();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Soumission impossible");
    } finally {
      setSubmitting(false);
    }
  }

  if (editableCaseTypes.length === 0) {
    return (
      <div className="mt-7 rounded-2xl border border-[#E8DDD0] bg-white p-5 text-sm leading-6 text-[#6B5E52]">
        Votre dossier est verrouillé pendant son examen. Vous pourrez remplacer un document uniquement si
        l’équipe demande une correction.
      </div>
    );
  }

  return (
    <section className="mt-8" aria-labelledby="documents-heading">
      <div className="mb-5 flex items-center gap-3">
        <FileLock2 className="text-[#1B4D3E]" size={22} aria-hidden="true" />
        <div>
          <h2 id="documents-heading" className="font-semibold text-[#1C1917]">
            Justificatifs sécurisés
          </h2>
          <p className="text-xs text-[#6B5E52]">PDF, JPEG ou PNG · 8 Mo maximum par fichier</p>
        </div>
      </div>

      <div className="space-y-3">
        {slots.map((slot) => {
          const isUploaded = uploaded.has(slot.documentType);
          const isEditable = editableCaseTypes.includes(slot.caseType);
          const isProfessionalAlternative =
            requestedRole === "AGENT" &&
            ["PROFESSIONAL_CARD", "BUSINESS_REGISTRATION"].includes(slot.documentType);
          return (
            <label
              key={slot.documentType}
              className={`flex min-h-20 items-center gap-4 rounded-2xl border border-[#E8DDD0] bg-white p-4 transition-colors ${
                isEditable ? "cursor-pointer hover:border-[#C8922A]" : "cursor-not-allowed opacity-60"
              }`}
            >
              <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-[#1B4D3E]/10 text-[#1B4D3E]">
                {isUploaded ? <CheckCircle2 size={21} aria-hidden="true" /> : <Upload size={20} aria-hidden="true" />}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block text-sm font-semibold text-[#1C1917]">
                  {slot.label}
                  {isProfessionalAlternative ? " (un seul des deux suffit)" : ""}
                </span>
                <span className="mt-1 block text-xs leading-5 text-[#6B5E52]">{slot.help}</span>
              </span>
              <span className="text-xs font-medium text-[#1B4D3E]">
                {!isEditable
                  ? "Verrouillé"
                  : busySlot === slot.documentType
                    ? "Envoi…"
                    : isUploaded
                      ? "Remplacer"
                      : "Choisir"}
              </span>
              <input
                className="sr-only"
                type="file"
                accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
                disabled={!isEditable || busySlot !== null || submitting}
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  if (file) void upload(slot, file);
                  event.currentTarget.value = "";
                }}
              />
            </label>
          );
        })}
      </div>

      {error && (
        <p role="alert" className="mt-4 rounded-xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
          {error}
        </p>
      )}
      {success && (
        <p role="status" className="mt-4 rounded-xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">
          Dossier transmis. Notre équipe va maintenant examiner vos justificatifs.
        </p>
      )}

      <button
        type="button"
        onClick={submit}
        disabled={!ready || busySlot !== null || submitting || success}
        className="mt-6 inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-[#1B4D3E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#12382D] disabled:cursor-not-allowed disabled:opacity-45"
      >
        {submitting ? "Transmission…" : "Soumettre le dossier à vérification"}
      </button>
    </section>
  );
}
