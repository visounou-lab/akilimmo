"use client";

import { useState } from "react";
import DeleteUserButton from "./DeleteUserButton";
import SendAccessButton from "./SendAccessButton";

const ROLE_CONFIG: Record<string, { label: string; classes: string }> = {
  ADMIN:  { label: "Admin",        classes: "bg-purple-50 text-purple-700" },
  OWNER:  { label: "Propriétaire", classes: "bg-[#0066CC]/10 text-[#0066CC]" },
  TENANT: { label: "Locataire",    classes: "bg-emerald-50 text-emerald-700" },
};

function formatDate(iso: string) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(new Date(iso));
}

type User = {
  id: string;
  name: string | null;
  email: string;
  role: string;
  createdAt: string;
};

export default function UtilisateursSearch({
  users,
  currentUserId,
}: {
  users: User[];
  currentUserId: string | undefined;
}) {
  const [q, setQ] = useState("");

  const filtered = q.trim()
    ? users.filter((u) => {
        const s = q.toLowerCase();
        return (
          (u.name ?? "").toLowerCase().includes(s) ||
          u.email.toLowerCase().includes(s) ||
          (ROLE_CONFIG[u.role]?.label ?? u.role).toLowerCase().includes(s)
        );
      })
    : users;

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
          placeholder="Nom, email ou rôle…"
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
          <table className="w-full text-sm min-w-[480px]">
            <thead>
              <tr className="border-b border-gray-100 bg-slate-50/60">
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Utilisateur</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider">Rôle</th>
                <th className="text-left px-4 py-3.5 text-xs font-semibold text-slate-500 uppercase tracking-wider hidden sm:table-cell">Inscrit le</th>
                <th className="px-4 py-3.5" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.map((u) => {
                const role = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.TENANT;
                return (
                  <tr key={u.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
                          <span className="text-xs font-semibold text-[#0066CC]">
                            {(u.name ?? u.email)[0].toUpperCase()}
                          </span>
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-slate-800 truncate">{u.name ?? "—"}</p>
                          <p className="text-xs text-slate-400 truncate">{u.email}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3.5">
                      <span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium ${role.classes}`}>
                        {role.label}
                      </span>
                    </td>
                    <td className="px-4 py-3.5 text-xs text-slate-500 hidden sm:table-cell">
                      {formatDate(u.createdAt)}
                    </td>
                    <td className="px-4 py-3.5">
                      <div className="flex items-center gap-1">
                        {u.role === "TENANT" && <SendAccessButton id={u.id} />}
                        <DeleteUserButton id={u.id} isSelf={u.id === currentUserId} />
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
