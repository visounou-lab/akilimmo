import { redirect } from "next/navigation";
import Link from "next/link";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import VerificationDocumentsForm from "./VerificationDocumentsForm";

const STATUS_LABELS = {
  NOT_SUBMITTED: "Justificatifs à transmettre",
  PENDING: "Vérification en cours",
  APPROVED: "Identité vérifiée",
  REJECTED: "Documents à corriger",
  EXPIRED: "Vérification expirée",
  SUSPENDED: "Vérification suspendue",
} as const;

const CASE_LABELS = {
  IDENTITY: "Identité",
  OWNER_AUTHORITY: "Droit sur le bien",
  PROFESSIONAL: "Qualité professionnelle",
} as const;

export default async function VerificationPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      emailVerified: true,
      requestedRole: true,
      verificationCases: {
        where: { type: { in: ["IDENTITY", "OWNER_AUTHORITY", "PROFESSIONAL"] } },
        orderBy: { createdAt: "desc" },
        select: {
          type: true,
          status: true,
          rejectionReason: true,
          documents: { select: { type: true } },
        },
      },
    },
  });
  if (!user) redirect("/login");
  if (user.requestedRole !== "OWNER" && user.requestedRole !== "AGENT") {
    redirect("/tenant/dashboard");
  }

  const identityVerification = user.verificationCases.find((item) => item.type === "IDENTITY");
  const status = identityVerification?.status ?? "NOT_SUBMITTED";
  const editableCaseTypes = user.verificationCases
    .filter((item) => ["NOT_SUBMITTED", "REJECTED", "EXPIRED"].includes(item.status))
    .map((item) => item.type);
  const existingDocumentTypes = user.verificationCases.flatMap((item) =>
    item.documents.map((document) => document.type),
  );

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-16">
      <div className="mx-auto max-w-xl rounded-3xl border border-[#E8DDD0] bg-[#FDFCF8] p-8 shadow-sm sm:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8922A]">
          Sécurisation du compte
        </p>
        <h1 className="mt-3 font-serif text-3xl font-bold text-[#1C1917]">
          Vérification de votre identité
        </h1>
        <p className="mt-3 leading-7 text-[#6B5E52]">
          Bonjour {user.name?.split(" ")[0] ?? ""}. Votre demande de rôle{" "}
          <strong>{user.requestedRole === "AGENT" ? "agent" : "propriétaire"}</strong>{" "}
          est enregistrée, mais elle ne sera activée qu’après contrôle des justificatifs.
        </p>

        <div className="mt-8 space-y-3">
          <div className="flex items-center justify-between rounded-2xl border border-[#E8DDD0] p-4">
            <span className="text-sm text-[#6B5E52]">Adresse email</span>
            <strong className="text-sm text-[#1B4D3E]">
              {user.emailVerified ? "Confirmée" : "À confirmer"}
            </strong>
          </div>
          <div className="flex items-center justify-between rounded-2xl border border-[#E8DDD0] p-4">
            <span className="text-sm text-[#6B5E52]">Identité</span>
            <strong className="text-sm text-[#1B4D3E]">{STATUS_LABELS[status]}</strong>
          </div>
        </div>

        {user.verificationCases
          .filter((item) => item.status === "REJECTED" && item.rejectionReason)
          .map((item) => (
            <p
              key={item.type}
              className="mt-5 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700"
            >
              <strong>
                {CASE_LABELS[item.type as keyof typeof CASE_LABELS] ?? "Vérification"} :
              </strong>{" "}
              {item.rejectionReason}
            </p>
          ))}

        <VerificationDocumentsForm
          requestedRole={user.requestedRole}
          existingDocumentTypes={existingDocumentTypes}
          editableCaseTypes={editableCaseTypes}
        />

        <p className="mt-7 text-sm leading-6 text-[#6B5E52]">
          Vos fichiers sont privés et réservés aux personnes habilitées à examiner votre dossier.
          Ne transmettez jamais vos pièces d’identité par WhatsApp.
        </p>

        <Link
          href="/"
          className="mt-7 inline-flex min-h-11 items-center justify-center rounded-xl bg-[#1B4D3E] px-5 py-3 text-sm font-semibold text-white"
        >
          Retour à l’accueil
        </Link>
      </div>
    </main>
  );
}
