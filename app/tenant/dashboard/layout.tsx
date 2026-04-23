import { auth, signOut } from "@/lib/auth";
import { redirect } from "next/navigation";
import TenantShell from "./_components/TenantShell";

async function handleSignOut() {
  "use server";
  await signOut({ redirectTo: "/login" });
}

export default async function TenantLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  const user = session?.user as {
    id?: string;
    role?: string;
    name?: string | null;
    email?: string | null;
  } | undefined;

  if (!session?.user) redirect("/login");
  if (user?.role === "ADMIN")  redirect("/dashboard");
  if (user?.role === "OWNER")  redirect("/owner/dashboard");

  return (
    <TenantShell
      userName={user?.name ?? "Locataire"}
      userEmail={user?.email ?? ""}
      userInitial={(user?.name ?? "L").charAt(0).toUpperCase()}
      signOutAction={handleSignOut}
    >
      {children}
    </TenantShell>
  );
}
