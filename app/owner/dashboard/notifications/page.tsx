import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import Link from "next/link";

const CATEGORY_CONFIG = {
  PAYMENT:  { label: "Paiement",  bg: "bg-emerald-50", text: "text-emerald-700", dot: "bg-emerald-500" },
  BOOKING:  { label: "Réservation", bg: "bg-blue-50",  text: "text-blue-700",   dot: "bg-blue-500"   },
  DOCUMENT: { label: "Document",  bg: "bg-purple-50",  text: "text-purple-700", dot: "bg-purple-500" },
  ALERT:    { label: "Alerte",    bg: "bg-amber-50",   text: "text-amber-700",  dot: "bg-amber-500"  },
};

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", {
    day: "2-digit", month: "short", year: "numeric",
    hour: "2-digit", minute: "2-digit",
  }).format(date);
}

export default async function NotificationsPage() {
  const session = await auth();
  const userId = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const [notifications] = await Promise.all([
    prisma.notification.findMany({
      where: { userId },
      orderBy: { createdAt: "desc" },
    }),
    // Mark all unread as read on page visit
    prisma.notification.updateMany({
      where: { userId, isRead: false },
      data:  { isRead: true },
    }),
  ]);

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-3xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          {notifications.length} notification{notifications.length !== 1 ? "s" : ""}
        </p>
      </div>

      {notifications.length === 0 ? (
        <div className="bg-white rounded-2xl border border-slate-100 p-16 text-center">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
            <svg className="w-6 h-6 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
            </svg>
          </div>
          <p className="text-slate-600 font-medium">Aucune notification</p>
          <p className="text-sm text-slate-400 mt-1">Vous serez notifié des paiements et événements importants.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((n) => {
            const cat = CATEGORY_CONFIG[n.category] ?? CATEGORY_CONFIG.ALERT;
            return (
              <div
                key={n.id}
                className={`bg-white rounded-2xl border p-4 flex gap-4 transition-colors ${
                  !n.isRead ? "border-[#0066CC]/20 bg-blue-50/30" : "border-slate-100"
                }`}
              >
                {/* Dot */}
                <div className="flex-shrink-0 mt-1">
                  <span className={`w-2 h-2 rounded-full block mt-1 ${!n.isRead ? "bg-[#0066CC]" : "bg-slate-200"}`} />
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${cat.bg} ${cat.text}`}>
                        <span className={`w-1.5 h-1.5 rounded-full ${cat.dot}`} />
                        {cat.label}
                      </span>
                      <span className="text-xs text-slate-400">{formatDate(n.createdAt)}</span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-slate-800">{n.title}</p>
                  <p className="text-sm text-slate-500 mt-0.5 leading-relaxed">{n.body}</p>
                  {n.actionUrl && (
                    <Link
                      href={n.actionUrl}
                      className="inline-flex items-center gap-1 mt-2 text-xs font-medium text-[#0066CC] hover:underline"
                    >
                      Voir le détail
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                      </svg>
                    </Link>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
