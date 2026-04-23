import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import ProfilForm from "../../../owner/dashboard/profil/_components/ProfilForm";

export default async function TenantProfilPage() {
  const session = await auth();
  const userId  = (session?.user as { id?: string } | undefined)?.id;
  if (!userId) redirect("/login");

  const user = await prisma.user.findUnique({
    where:  { id: userId },
    select: { name: true, email: true, phone: true, country: true, city: true, createdAt: true },
  });
  if (!user) redirect("/login");

  return (
    <div className="px-4 py-6 sm:px-6 lg:p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-900">Mon profil</h1>
        <p className="text-sm text-slate-500 mt-0.5">
          Compte créé le {new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
        </p>
      </div>
      <div className="bg-white rounded-2xl border border-slate-100 p-6">
        <ProfilForm
          initialName={user.name ?? ""}
          email={user.email}
          initialPhone={user.phone ?? ""}
          initialCountry={user.country ?? ""}
          initialCity={user.city ?? ""}
        />
      </div>
    </div>
  );
}
