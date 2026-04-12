import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import SidebarNav from "./_components/SidebarNav";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/login");

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-gray-200 flex flex-col fixed inset-y-0 left-0 z-20">
        {/* Logo */}
        <div className="px-6 py-4 border-b border-gray-100 flex flex-col items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Akil Immo" width={140} height={140} />
          <p className="text-xs text-slate-400 mt-1">Administration</p>
        </div>

        {/* Navigation */}
        <div className="flex-1 overflow-y-auto py-4 px-3">
          <SidebarNav />
        </div>

        {/* User info + Sign out */}
        <div className="border-t border-gray-100 p-4 space-y-3">
          <div className="flex items-center gap-3 px-2">
            <div className="w-8 h-8 rounded-full bg-[#0066CC]/10 flex items-center justify-center shrink-0">
              <span className="text-[#0066CC] font-semibold text-xs">
                {session.user.name?.charAt(0).toUpperCase()}
              </span>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-medium text-slate-800 truncate">
                {session.user.name}
              </p>
              <p className="text-xs text-slate-400 truncate">{session.user.email}</p>
            </div>
          </div>

          <form action={handleSignOut}>
            <button
              type="submit"
              className="w-full flex items-center gap-2.5 px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors font-medium"
            >
              <svg
                className="w-4 h-4 shrink-0"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              Se déconnecter
            </button>
          </form>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 ml-64 min-h-screen">{children}</main>
    </div>
  );
}
