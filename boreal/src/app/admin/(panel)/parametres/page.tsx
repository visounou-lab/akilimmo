import { Info } from "lucide-react";

import { prisma } from "@/lib/prisma";
import { requirePermission } from "@/lib/auth/guards";
import { updateSettingsAction } from "./actions";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  await requirePermission("settings.manage");
  const s = await prisma.companySettings.findUnique({ where: { id: "singleton" } });

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="font-serif text-2xl font-semibold">Réglages société</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Ces coordonnées alimentent les mentions légales et le pied des documents.
        </p>
      </div>

      <div className="flex items-start gap-3 rounded-xl border bg-secondary/40 p-4 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0 text-glacier" />
        <p>
          Saisissez uniquement des informations réelles et confirmées. Tant qu'un
          champ n'est pas renseigné, un placeholder est affiché sur le site public.
          N'inventez jamais de licence, de numéro d'enregistrement ni d'autorité.
        </p>
      </div>

      <form action={updateSettingsAction} className="space-y-8">
        <Section title="Informations de la société">
          <F name="legalName" label="Raison sociale" value={s?.legalName} />
          <F name="legalForm" label="Forme juridique" value={s?.legalForm} />
          <F name="registerCourt" label="Tribunal d'enregistrement" value={s?.registerCourt} />
          <F name="registerNumber" label="N° d'enregistrement" value={s?.registerNumber} />
          <F name="managingDirector" label="Représentant légal" value={s?.managingDirector} />
          <F name="supervisoryAuthority" label="Autorité de tutelle" value={s?.supervisoryAuthority} />
          <F name="vatId" label="N° de TVA" value={s?.vatId} />
          <F name="lei" label="LEI" value={s?.lei} />
        </Section>

        <Section title="Coordonnées">
          <F name="addressLine" label="Adresse" value={s?.addressLine} />
          <F name="postalCode" label="Code postal" value={s?.postalCode} />
          <F name="city" label="Ville" value={s?.city} />
          <F name="country" label="Pays" value={s?.country} />
          <F name="email" label="Courriel" value={s?.email} type="email" />
          <F name="phone" label="Téléphone" value={s?.phone} />
          <F name="website" label="Site web" value={s?.website} />
        </Section>

        <Section title="Coordonnées bancaires">
          <F name="iban" label="IBAN" value={s?.iban} />
          <F name="bic" label="BIC / SWIFT" value={s?.bic} />
        </Section>

        <button
          type="submit"
          className="rounded-md bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Enregistrer les paramètres
        </button>
      </form>
    </div>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-xl border bg-card p-6 shadow-[var(--shadow-soft)]">
      <h2 className="mb-4 font-serif text-lg font-semibold">{title}</h2>
      <div className="grid gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}

function F({
  name,
  label,
  value,
  type = "text",
}: {
  name: string;
  label: string;
  value?: string | null;
  type?: string;
}) {
  return (
    <div>
      <label className="mb-1 block text-xs text-muted-foreground">{label}</label>
      <input
        name={name}
        type={type}
        defaultValue={value ?? ""}
        className="h-10 w-full rounded-md border bg-background/60 px-3 text-sm outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50"
      />
    </div>
  );
}
