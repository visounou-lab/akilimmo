import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createPayment } from "../_actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default async function NewPaiementPage() {
  const contracts = await prisma.contract.findMany({
    where: { status: { in: ["ACTIVE", "PENDING"] } },
    orderBy: { createdAt: "desc" },
    select: {
      id:         true,
      rentAmount: true,
      property:   { select: { title: true, city: true } },
      tenant:     { select: { name: true, email: true } },
    },
  });

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/paiements" className="hover:text-[#0066CC] transition-colors">
          Paiements
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Nouveau paiement</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Enregistrer un paiement</h1>
          <p className="text-sm text-slate-400 mt-0.5">Associez un paiement à un contrat actif ou en attente.</p>
        </div>

        {contracts.length === 0 ? (
          <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3">
            <p className="text-sm font-medium text-amber-700">Aucun contrat actif ou en attente</p>
            <p className="text-xs text-amber-600 mt-1">
              Créez d&apos;abord un contrat depuis{" "}
              <Link href="/dashboard/contrats/new" className="underline font-medium">
                la gestion des contrats
              </Link>.
            </p>
          </div>
        ) : (
          <form action={createPayment} className="space-y-6">
            {/* Contrat */}
            <div>
              <label className={labelClass}>
                Contrat <span className="text-red-400">*</span>
              </label>
              <select name="contractId" required className={inputClass}>
                <option value="">— Sélectionner un contrat —</option>
                {contracts.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.property.title} · {c.tenant.name ?? c.tenant.email} ({c.property.city}) —{" "}
                    {new Intl.NumberFormat("fr-FR").format(Number(c.rentAmount))} XOF/nuit
                  </option>
                ))}
              </select>
            </div>

            {/* Montant / Statut */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Montant (XOF) <span className="text-red-400">*</span>
                </label>
                <input
                  type="number"
                  name="amount"
                  required
                  min={0}
                  step={1000}
                  placeholder="ex : 150 000"
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Statut <span className="text-red-400">*</span>
                </label>
                <select name="status" required defaultValue="PENDING" className={inputClass}>
                  <option value="PENDING">En attente</option>
                  <option value="PAID">Payé</option>
                  <option value="FAILED">Échoué</option>
                </select>
              </div>
            </div>

            {/* Mode de paiement + Référence */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Mode de paiement</label>
                <select name="paymentMethod" className={inputClass} defaultValue="">
                  <option value="">— Non précisé —</option>
                  <option value="wave">Wave</option>
                  <option value="orange_money">Orange Money</option>
                  <option value="free_money">Free Money</option>
                  <option value="virement">Virement bancaire</option>
                  <option value="especes">Espèces</option>
                  <option value="autre">Autre</option>
                </select>
              </div>
              <div>
                <label className={labelClass}>
                  Référence / N° transaction
                  <span className="text-slate-400 font-normal text-xs ml-1">(optionnel)</span>
                </label>
                <input
                  type="text"
                  name="waveReference"
                  placeholder="ex : WV-2024-XXXXXXX"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>
                  Date d&apos;échéance <span className="text-red-400">*</span>
                </label>
                <input
                  type="date"
                  name="dueDate"
                  required
                  defaultValue={today}
                  className={inputClass}
                />
              </div>
              <div>
                <label className={labelClass}>
                  Date de paiement{" "}
                  <span className="text-slate-400 font-normal text-xs">(optionnel)</span>
                </label>
                <input type="date" name="paidAt" className={inputClass} />
              </div>
            </div>

            {/* Submit */}
            <div className="flex items-center gap-3 pt-2">
              <button
                type="submit"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                </svg>
                Enregistrer le paiement
              </button>
              <Link
                href="/dashboard/paiements"
                className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
              >
                Annuler
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
