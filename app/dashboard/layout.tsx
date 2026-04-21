import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardShell from "./_components/DashboardShell";

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

  const user = session.user as { name?: string | null; email?: string | null };

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
