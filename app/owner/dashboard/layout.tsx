import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import { signOut } from "@/lib/auth";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

const sidebarItems = [
  {
    label: "Mes biens",
    href: "/owner/dashboard/biens",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
      </svg>
    ),
  },
  {
    label: "Soumettre un bien",
    href: "/owner/dashboard/soumettre",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
      </svg>
    ),
  },
  {
    label: "Mes revenus",
    href: "/owner/dashboard/revenus",
    icon: (
      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
      </svg>
    ),
  },
];

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as { id?: string; role?: string; status?: string; name?: string; email?: string } | undefined;

  if (!session?.user) redirect("/login");
  if (user?.role !== "OWNER") redirect(user?.role === "ADMIN" ? "/dashboard" : "/");

  // Status pending or suspended → waiting page
  if (user?.status !== "active") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-full bg-amber-50 flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-500" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-900 mb-3">
            {user?.status === "suspended" ? "Compte suspendu" : "Compte en cours de validation"}
          </h2>
          <p className="text-slate-500 leading-relaxed mb-6">
            {user?.status === "suspended"
              ? "Votre compte propriétaire a été suspendu. Contactez notre équipe pour plus d'informations."
              : "Votre email a été vérifié. Notre équipe valide votre compte sous 24-48h. Vous recevrez un email dès que votre espace sera activé."}
          </p>
          <Link href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] transition">
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Akil Immo" width={140} height={140} />
          <p className="text-xs text-slate-400 mt-1">Espace propriétaire</p>
        </div>

        <div className="flex-1 overflow-y-auto py-4 px-3">
          <nav className="space-y-1">
            <p className="px-3 mb-2 text-xs font-semibold text-slate-400 uppercase tracking-wider">Menu</p>
            {sidebarItems.map((item) => (
              <Link key={item.href} href={item.href}
                className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors text-slate-600 hover:bg-slate-50 hover:text-slate-900">
                <span className="text-slate-400">{item.icon}</span>
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
              <span className="text-[#0066CC] font-semibold text-xs">
                {user?.name?.charAt(0).toUpperCase() ?? "P"}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">{user?.name ?? "Propriétaire"}</p>
              <p className="text-xs text-slate-400 truncate">{user?.email}</p>
            </div>
          </div>
          <form action={handleSignOut}>
            <button type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium">
              <svg className="w-4 h-4 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
