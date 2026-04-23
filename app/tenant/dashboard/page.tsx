import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

function formatPrice(n: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(n)) + " FCFA";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

function daysUntil(date: Date): number {
  return Math.ceil((date.getTime() - Date.now()) / 86_400_000);
}

export default async function TenantDashboardPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const firstName = (session?.user?.name ?? "").split(" ").at(-1) || "Locataire";

  const [contract, nextPayment] = await Promise.all([
    prisma.contract.findFirst({
      where:   { tenantId: userId, status: "ACTIVE" },
      include: { property: { select: { title: true, city: true, country: true, address: true } } },
    }),
    prisma.payment.findFirst({
      where:   { payerId: userId, status: "PENDING" },
      orderBy: { dueDate: "asc" },
    }),
  ]);

  const isOverdue = nextPayment ? nextPayment.dueDate < new Date() : false;
  const days      = nextPayment ? daysUntil(nextPayment.dueDate) : null;

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Bonjour, {firstName}</h1>
        <p className="text-sm text-slate-500 mt-0.5">Bienvenue dans votre espace locataire AKIL IMMO</p>
      </div>

      {/* Contrat actif */}
      {contract ? (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 mb-4">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-slate-400 mb-1">Votre logement</p>
              <p className="text-lg font-bold text-slate-900">{contract.property.title}</p>
              <p className="text-sm text-slate-500">{contract.property.address} · {contract.property.city}</p>
            </div>
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 shrink-0">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              Actif
            </span>
          </div>
          <div className="grid grid-cols-2 gap-3 pt-4 border-t border-slate-100">
            <div>
              <p className="text-xs text-slate-400">Loyer mensuel</p>
              <p className="text-sm font-bold text-slate-800 mt-0.5">{formatPrice(contract.rentAmount)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Fin du contrat</p>
              <p className="text-sm font-semibold text-slate-800 mt-0.5">{formatDate(contract.endDate)}</p>
            </div>
          </div>
          <Link
            href="/tenant/dashboard/contrat"
            className="inline-flex items-center gap-1 mt-4 text-xs font-medium text-[#0066CC] hover:underline"
          >
            Voir le détail du contrat →
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 p-10 text-center mb-4">
          <p className="text-slate-500 font-medium">Aucun contrat actif</p>
          <p className="text-sm text-slate-400 mt-1">Contactez AKIL IMMO pour plus d&apos;informations.</p>
        </div>
      )}

      {/* Prochain paiement */}
      {nextPayment && (
        <div className={`rounded-2xl border p-5 mb-4 ${
          isOverdue
            ? "bg-red-50 border-red-200"
            : days !== null && days <= 5
              ? "bg-amber-50 border-amber-200"
              : "bg-white border-slate-100 shadow-sm"
        }`}>
          <p className="text-xs font-semibold uppercase tracking-widest mb-2 ${isOverdue ? 'text-red-500' : 'text-slate-400'}">
            {isOverdue ? "⚠️ Loyer en retard" : "Prochain paiement"}
          </p>
          <div className="flex items-center justify-between">
            <div>
              <p className={`text-2xl font-bold ${isOverdue ? "text-red-700" : "text-slate-900"}`}>
                {formatPrice(nextPayment.amount)}
              </p>
              <p className="text-sm text-slate-500 mt-0.5">
                Échéance : {formatDate(nextPayment.dueDate)}
                {isOverdue && ` (${Math.abs(days!)} jour${Math.abs(days!) > 1 ? "s" : ""} de retard)`}
                {!isOverdue && days !== null && days <= 5 && ` (dans ${days} jour${days > 1 ? "s" : ""})`}
              </p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-3">
            Pour effectuer votre paiement, contactez AKIL IMMO via WhatsApp ou email.
          </p>
        </div>
      )}

      {/* Liens rapides */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { href: "/tenant/dashboard/paiements", label: "Historique paiements", icon: "M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" },
          { href: "/tenant/dashboard/contrat",   label: "Mon contrat",          icon: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="bg-white rounded-2xl border border-slate-100 shadow-sm p-4 flex items-center gap-3 hover:border-[#0066CC]/30 hover:shadow-md transition-all"
          >
            <div className="w-9 h-9 rounded-xl bg-[#0066CC]/10 flex items-center justify-center shrink-0">
              <svg className="w-4.5 h-4.5 text-[#0066CC]" style={{ width: 18, height: 18 }} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                <path strokeLinecap="round" strokeLinejoin="round" d={item.icon} />
              </svg>
            </div>
            <span className="text-sm font-medium text-slate-700">{item.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
