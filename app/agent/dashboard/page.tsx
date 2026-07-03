import Link from "next/link";
import { redirect } from "next/navigation";
import { BadgeCheck, FileCheck2, Share2 } from "lucide-react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import Navbar from "../../../components/v3/Navbar";
import TrustBadge from "../../../components/v3/TrustBadge";

export default async function AgentDashboardPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: {
      name: true,
      role: true,
      referralCode: true,
      verificationCases: {
        where: { type: { in: ["IDENTITY", "PROFESSIONAL"] } },
        select: { type: true, status: true, expiresAt: true },
      },
      agentApplication: { select: { agencyName: true, city: true } },
    },
  });
  if (!user) redirect("/login");
  if (user.role !== "AGENT") {
    redirect(user.role === "ADMIN" ? "/dashboard" : "/");
  }

  const now = new Date();
  const currentApproval = (type: "IDENTITY" | "PROFESSIONAL") =>
    user.verificationCases.some(
      (item) =>
        item.type === type &&
        item.status === "APPROVED" &&
        (!item.expiresAt || item.expiresAt > now),
    );
  const agentVerified = currentApproval("IDENTITY") && currentApproval("PROFESSIONAL");

  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-[#F5F0E8] px-4 pb-16 pt-28">
        <div className="mx-auto max-w-5xl">
          <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8922A]">
                Espace agent
              </p>
              <h1 className="mt-2 font-serif text-3xl font-bold text-[#1C1917]">
                Bonjour {user.name?.split(" ")[0] ?? ""}
              </h1>
              <p className="mt-2 text-[#5F554C]">
                {user.agentApplication?.agencyName ?? "Activité immobilière"} ·{" "}
                {user.agentApplication?.city ?? "Zone non renseignée"}
              </p>
            </div>
            {agentVerified && <TrustBadge kind="agent-verified" />}
          </div>

          <section className="mt-8 grid gap-5 md:grid-cols-3" aria-label="État du compte agent">
            <article className="rounded-2xl border border-[#E2D6C8] bg-white p-6">
              <BadgeCheck className="text-[#1B4D3E]" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-[#1C1917]">Statut professionnel</h2>
              <p className="mt-2 text-sm leading-6 text-[#5F554C]">
                {agentVerified ? "Vérifié et actif" : "Contrôle à compléter"}
              </p>
            </article>
            <article className="rounded-2xl border border-[#E2D6C8] bg-white p-6">
              <FileCheck2 className="text-[#1B4D3E]" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-[#1C1917]">Dossier</h2>
              <p className="mt-2 text-sm leading-6 text-[#5F554C]">
                Les décisions et renouvellements restent enregistrés dans votre historique.
              </p>
            </article>
            <article className="rounded-2xl border border-[#E2D6C8] bg-white p-6">
              <Share2 className="text-[#1B4D3E]" aria-hidden="true" />
              <h2 className="mt-4 font-semibold text-[#1C1917]">Code partenaire</h2>
              <p className="mt-2 break-all font-mono text-sm font-semibold text-[#1B4D3E]">
                {user.referralCode ?? "En préparation"}
              </p>
            </article>
          </section>

          <div className="mt-8 rounded-2xl border border-[#1B4D3E]/20 bg-[#EAF3EF] p-6">
            <h2 className="font-serif text-xl font-bold text-[#1C1917]">
              Fonctionnalités partenaires
            </h2>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-[#334E45]">
              La publication de mandats, le suivi des clients apportés et les commissions seront
              ajoutés progressivement. Un code partagé ne génère jamais de paiement sans transaction
              éligible et validée.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
            <Link
              href="/agent/dashboard/soumettre"
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-xl bg-[#1B4D3E] px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-[#12382D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-2"
            >
              Soumettre un bien
            </Link>
            <Link
              href="/biens"
              className="mt-5 inline-flex min-h-11 cursor-pointer items-center rounded-xl border border-[#1B4D3E] px-5 py-3 text-sm font-semibold text-[#1B4D3E]"
            >
              Consulter les biens
            </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
