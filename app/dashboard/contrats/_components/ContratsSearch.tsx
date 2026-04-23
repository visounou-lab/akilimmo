"use client";

import { useState } from "react";
import Link from "next/link";
import DeleteContractButton from "./DeleteContractButton";

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  PENDING:    { label: "En attente", classes: "bg-amber-50 text-amber-700" },
  ACTIVE:     { label: "Actif",      classes: "bg-emerald-50 text-emerald-700" },
  TERMINATED: { label: "Résilié",    classes: "bg-slate-100 text-slate-600" },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat("fr-FR").format(amount) + " XOF";
}

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

type Contract = {
  id: string;
  status: string;
  rentAmount: number;
  startDate: string;
  endDate: string;
  property: { title: string; city: string };
  tenant: { name: string | null; email: string };
  owner: { name: string | null };
};

export default function ContratsSearch({ contracts }: { contracts: Contract[] }) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? contracts.filter((c) => {
        const s = q.toLowerCase();
        return (
          c.property.title.toLowerCase().includes(s) ||
          c.property.city.toLowerCase().includes(s) ||
          (c.tenant.name ?? "").toLowerCase().includes(s) ||
          c.tenant.email.toLowerCase().includes(s) ||
          (c.owner.name ?? "").toLowerCase().includes(s)
        );
      })
    : contracts;

  return (
    <>
      <div className="relative mb-4 w-full sm:w-80">
        <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <input
          type="text"
          value={q}
          onChange={(e) => setQ(e.target.value)}
          placeholder="Bien, locataire, propriétaire…"
          className="w-full rounded-xl border border-slate-200 pl-9 pr-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white"
        />
        {q && (
          <button onClick={() => setQ("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
        {filtered.length === 0 ? (
          <div className="p-12 text-center">
            <p className="text-slate-500 font-medium">Aucun résultat pour « {q} »</p>
            <button onClick={() => setQ("")} className="text-sm text-[#0066CC] mt-2 hover:underline">Effacer la recherche</button>
          </div>
        ) : (
          <table className="w-full text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Bien</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Locataire</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden md:table-cell">Période</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Loyer</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Statut</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((c) => {
                const status = STATUS_CONFIG[c.status] ?? STATUS_CONFIG.PENDING;
                return (
                  <tr key={c.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <p className="font-medium text-slate-800 truncate max-w-[180px]">{c.property.title}</p>
                      <p className="text-xs text-slate-400">{c.property.city}</p>
                    </td>
                    <td className="px-4 py-3.5">
                      <p className="text-slate-700">{c.tenant.name ?? "—"}</p>
                      <p className="text-xs text-slate-400 truncate max-w-[160px]">{c.tenant.email}</p>
                    </td>
                    <td className="px-4 py-3.5 text-slate-600 text-xs hidden md:table-cell whitespace-nowrap">
                      <span>{formatDate(c.startDate)}</span>
                      <span className="mx-1 text-slate-300">→</span>
                      <span>{formatDate(c.endDate)}</span>
                    </td>
                    <td className="px-4 py-3.5 font-semibold text-slate-800 whitespace-nowrap">
                      {formatPrice(c.rentAmount)}
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${status.classes}`}>
                        {status.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        <Link
                          href={`/dashboard/contrats/${c.id}/edit`}
                          title="Modifier le statut"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-[#0066CC]/10 hover:text-[#0066CC] transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                          </svg>
                        </Link>
                        <Link
                          href={`/dashboard/contrats/${c.id}/pdf`}
                          target="_blank"
                          title="Télécharger PDF"
                          className="inline-flex items-center justify-center w-8 h-8 rounded-lg text-slate-400 hover:bg-emerald-50 hover:text-emerald-600 transition-colors"
                        >
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        </Link>
                        <DeleteContractButton id={c.id} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}
