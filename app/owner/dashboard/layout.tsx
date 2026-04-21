import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";
import OwnerShell from "./_components/OwnerShell";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function OwnerLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as {
    id?: string;
    role?: string;
    status?: string;
    name?: string | null;
    email?: string | null;
  } | undefined;

  if (!session?.user) redirect("/login");
  if (user?.role !== "OWNER") redirect(user?.role === "ADMIN" ? "/dashboard" : "/");

  // Pending / suspended → waiting screen
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
          <Link
            href="/"
            className="inline-flex items-center justify-center rounded-full bg-[#0066CC] text-white px-6 py-3 text-sm font-semibold hover:bg-[#004499] transition"
          >
            Retour à l&apos;accueil
          </Link>
        </div>
      </div>
    );
  }

  return (
    <OwnerShell
      userName={user?.name ?? "Propriétaire"}
      userEmail={user?.email ?? ""}
      userInitial={(user?.name ?? "P").charAt(0).toUpperCase()}
      signOutAction={handleSignOut}
    >
      {children}
    </OwnerShell>
  );
}
