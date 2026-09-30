import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import DashboardShell from "./_components/DashboardShell";
import TwoFactorSetup from "./securite/_components/TwoFactorSetup";

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

  const user = session.user as { id?: string; name?: string | null; email?: string | null; role?: string };
  if (user.role !== "ADMIN") redirect("/login");

  // ── Garde-fou : 2FA obligatoire avant tout accès au tableau de bord ──
  const dbUser = user.id
    ? await prisma.user.findUnique({ where: { id: user.id }, select: { twoFactorEnabled: true } })
    : null;

  if (!dbUser?.twoFactorEnabled) {
    return (
      <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: "#F5F0E8" }}>
        <div className="w-full max-w-md">
          <div className="text-center mb-6">
            <h1 className="font-serif text-2xl font-bold text-[#1C1917]">Sécuriser votre accès</h1>
            <p className="mt-1 text-sm text-[#6B5E52]">Compte administrateur AKIL IMMO</p>
          </div>
          <TwoFactorSetup enabled={false} forced />
          <form action={handleSignOut} className="mt-4 text-center">
            <button type="submit" className="text-sm underline" style={{ color: "#6B5E52" }}>
              Se déconnecter
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <DashboardShell
      userName={user.name ?? ""}
      userEmail={user.email ?? ""}
      userInitial={(user.name ?? "A").charAt(0).toUpperCase()}
      signOutAction={handleSignOut}
    >
      {children}
    </DashboardShell>
  );
}
