import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { createContract } from "../_actions";

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white";

const labelClass = "block text-sm font-medium text-slate-700 mb-1.5";

export default async function NewContratPage() {
  const [properties, tenants] = await Promise.all([
    prisma.property.findMany({
      where: { status: { in: ["AVAILABLE", "RESERVED"] } },
      orderBy: { title: "asc" },
      select: { id: true, title: true, city: true, price: true },
    }),
    prisma.user.findMany({
      where: { role: "TENANT" },
      orderBy: { name: "asc" },
      select: { id: true, name: true, email: true },
    }),
  ]);

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/contrats" className="hover:text-[#0066CC] transition-colors">
          Contrats
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Nouveau contrat</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Créer un contrat</h1>
          <p className="text-sm text-slate-400 mt-0.5">Associez un bien à un locataire et définissez les conditions.</p>
        </div>

        <form action={createContract} className="space-y-6">
          {/* Bien */}
          <div>
            <label className={labelClass}>Bien immobilier <span className="text-red-400">*</span></label>
            {properties.length === 0 ? (
              <p className="text-sm text-amber-600 bg-amber-50 rounded-xl px-4 py-3">
                Aucun bien disponible ou réservé. <Link href="/dashboard/biens/new" className="underline">Ajouter un bien</Link>.
              </p>
            ) : (
              <select name="propertyId" required className={inputClass}>
                <option value="">— Sélectionner un bien —</option>
                {properties.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.title} — {p.city} ({new Intl.NumberFormat("fr-FR").format(Number(p.price))} XOF/nuit)
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Locataire */}
          <div>
            <label className={labelClass}>Locataire <span className="text-red-400">*</span></label>
            {tenants.length === 0 ? (
              <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 space-y-1">
                <p className="text-sm font-medium text-amber-700">Aucun locataire disponible</p>
                <p className="text-xs text-amber-600">
                  Seuls les utilisateurs avec le rôle <strong>Locataire</strong> apparaissent ici.
                  Il n&apos;y a actuellement aucun compte locataire en base.
                  Créez d&apos;abord un utilisateur locataire depuis{" "}
                  <Link href="/dashboard/users" className="underline font-medium">
                    la gestion des utilisateurs
                  </Link>
                  , puis revenez créer le contrat.
                </p>
              </div>
            ) : (
              <select name="tenantId" required className={inputClass}>
                <option value="">— Sélectionner un locataire —</option>
                {tenants.map((t) => (
                  <option key={t.id} value={t.id}>
                    {t.name ?? t.email} — {t.email}
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Date de début <span className="text-red-400">*</span></label>
              <input type="date" name="startDate" required defaultValue={today} className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Date de fin <span className="text-red-400">*</span></label>
              <input type="date" name="endDate" required className={inputClass} />
            </div>
          </div>

          {/* Loyer / Statut */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Montant du loyer (XOF/nuit) <span className="text-red-400">*</span></label>
              <input
                type="number"
                name="rentAmount"
                required
                min={0}
                step={1000}
                placeholder="ex : 250000"
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>Statut initial <span className="text-red-400">*</span></label>
              <select name="status" required defaultValue="PENDING" className={inputClass}>
                <option value="PENDING">En attente</option>
                <option value="ACTIVE">Actif</option>
                <option value="TERMINATED">Résilié</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={tenants.length === 0 || properties.length === 0}
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
              </svg>
              Créer le contrat
            </button>
            <Link
              href="/dashboard/contrats"
              className="px-6 py-2.5 rounded-xl border border-slate-200 text-sm text-slate-600 hover:bg-slate-50 transition-colors"
            >
              Annuler
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
