import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";

export const dynamic = "force-dynamic";

function formatDateTime(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", {
    dateStyle: "short",
    timeStyle: "short",
  }).format(date);
}

export default async function AuditPage() {
  await requirePermission("audit.view");
  const logs = await prisma.auditLog.findMany({
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { actor: { select: { name: true } } },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Journal d'audit</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          200 dernières actions enregistrées.
        </p>
      </div>

      <div className="overflow-x-auto rounded-xl border bg-card shadow-[var(--shadow-soft)]">
        <table className="w-full text-sm">
          <thead className="text-left text-xs text-muted-foreground">
            <tr className="border-b">
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Auteur</th>
              <th className="px-4 py-3 font-medium">Action</th>
              <th className="px-4 py-3 font-medium">Détail</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="px-4 py-10 text-center text-muted-foreground">
                  Aucune entrée pour le moment.
                </td>
              </tr>
            )}
            {logs.map((l) => (
              <tr key={l.id} className="hover:bg-muted/40">
                <td className="px-4 py-3 whitespace-nowrap text-muted-foreground">
                  {formatDateTime(l.createdAt)}
                </td>
                <td className="px-4 py-3">{l.actor?.name ?? "—"}</td>
                <td className="px-4 py-3">
                  <span className="rounded-md bg-secondary px-2 py-0.5 font-mono text-xs">
                    {l.action}
                  </span>
                </td>
                <td className="px-4 py-3 text-muted-foreground">{l.summary ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
