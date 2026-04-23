import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { createUser } from "./_actions";
import DeleteUserButton from "./_components/DeleteUserButton";
import SendAccessButton from "./_components/SendAccessButton";

const ROLE_CONFIG: Record<string, { label: string; classes: string }> = {
  ADMIN:  { label: "Admin",      classes: "bg-purple-50 text-purple-700" },
  OWNER:  { label: "Propriétaire", classes: "bg-[#0066CC]/10 text-[#0066CC]" },
  TENANT: { label: "Locataire",  classes: "bg-emerald-50 text-emerald-700" },
};

const inputClass =
  "w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm text-slate-800 " +
  "focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition-colors bg-white";

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(date);
}

export default async function UtilisateursPage() {
  const session = await auth();
  const currentUserId = (session?.user as { id?: string })?.id;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true },
  });

  return (
    <div className="p-8">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Utilisateurs</h1>
          <p className="text-sm text-slate-500 mt-0.5">{users.length} utilisateur{users.length !== 1 ? "s" : ""}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Liste */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-x-auto">
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
                {users.map((u) => {
                  const role = ROLE_CONFIG[u.role] ?? ROLE_CONFIG.TENANT;
                  return (
                    <tr key={u.id} className="hover:bg-slate-50/50 transition-colors group">
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
                          {u.role === "TENANT" && (
                            <SendAccessButton id={u.id} />
                          )}
                          <DeleteUserButton id={u.id} isSelf={u.id === currentUserId} />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Formulaire création */}
        <div>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-base font-semibold text-slate-800 mb-5">Ajouter un utilisateur</h2>
            <form action={createUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Nom complet</label>
                <input type="text" name="name" placeholder="ex : Kofi Mensah" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Email <span className="text-red-400">*</span>
                </label>
                <input type="email" name="email" required placeholder="kofi@email.com" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">
                  Mot de passe <span className="text-red-400">*</span>
                </label>
                <input type="password" name="password" required placeholder="••••••••" className={inputClass} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1.5">Rôle</label>
                <select name="role" defaultValue="TENANT" className={inputClass}>
                  <option value="TENANT">Locataire</option>
                  <option value="OWNER">Propriétaire</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button
                type="submit"
                className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-[#0066CC] hover:bg-[#004499] text-white text-sm font-semibold transition-colors shadow-sm"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
                </svg>
                Créer l&apos;utilisateur
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
