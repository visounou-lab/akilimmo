import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect } from "next/navigation";
import TwoFactorSetup from "./_components/TwoFactorSetup";

export const metadata = { title: "Sécurité — AKIL IMMO" };

export default async function SecuritePage() {
  const session = await auth();
  const u = session?.user as { id?: string; role?: string } | undefined;
  if (!u?.id) redirect("/login");
  if (u.role !== "ADMIN") redirect("/login");

  const dbUser = await prisma.user.findUnique({
    where: { id: u.id },
    select: { twoFactorEnabled: true },
  });

  return (
    <div className="max-w-lg">
      <h1 className="font-serif text-2xl font-bold text-[#1C1917]">Sécurité</h1>
      <p className="mt-1 mb-6 text-sm text-[#6B5E52]">
        Double authentification (2FA) du compte administrateur.
      </p>
      <TwoFactorSetup enabled={!!dbUser?.twoFactorEnabled} />
    </div>
  );
}
