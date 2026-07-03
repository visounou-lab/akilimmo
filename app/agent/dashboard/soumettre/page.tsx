"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ShieldCheck } from "lucide-react";
import { submitAgentProperty } from "./_actions";

const input =
  "min-h-11 w-full rounded-xl border border-[#DCCDBD] bg-white px-4 py-3 text-base text-[#1C1917] outline-none focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20";

export default function AgentPropertySubmissionPage() {
  const router = useRouter();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setBusy(true);
    setError("");
    try {
      await submitAgentProperty(new FormData(event.currentTarget));
      router.push("/agent/dashboard?submitted=1");
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : "Soumission impossible.");
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#F5F0E8] px-4 py-12">
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[#C8922A]">Annonce professionnelle</p>
        <h1 className="mt-2 font-serif text-3xl font-bold text-[#1C1917]">Soumettre un bien</h1>
        <div className="mt-5 flex gap-3 rounded-2xl border border-[#1B4D3E]/20 bg-[#EAF3EF] p-5 text-sm leading-6 text-[#334E45]">
          <ShieldCheck className="shrink-0 text-[#1B4D3E]" aria-hidden="true" />
          Votre profil professionnel est déjà vérifié. L’annonce restera invisible jusqu’au contrôle interne d’AKIL IMMO.
        </div>

        <form onSubmit={submit} className="mt-8 space-y-6 rounded-3xl border border-[#E2D6C8] bg-[#FDFCF8] p-6 sm:p-8">
          <div className="grid gap-5 sm:grid-cols-2">
            <Field label="Titre du bien"><input name="title" required maxLength={160} className={input} /></Field>
            <Field label="Type"><select name="type" required className={input}><option value="appartement">Appartement</option><option value="villa">Villa</option><option value="studio">Studio</option><option value="bureau">Bureau</option></select></Field>
            <Field label="Pays"><select name="country" required className={input}><option value="BENIN">Bénin</option><option value="COTE_D_IVOIRE">Côte d’Ivoire</option></select></Field>
            <Field label="Ville"><input name="city" required maxLength={100} className={input} /></Field>
          </div>
          <Field label="Adresse du bien"><input name="address" required maxLength={250} className={input} /></Field>
          <div className="grid gap-5 sm:grid-cols-3">
            <Field label="Prix par nuit (XOF)"><input name="price" type="number" min="1" required className={input} /></Field>
            <Field label="Chambres"><input name="bedrooms" type="number" min="0" max="30" required className={input} /></Field>
            <Field label="Salles de bain"><input name="bathrooms" type="number" min="0" max="30" required className={input} /></Field>
          </div>
          <Field label="Description"><textarea name="description" required maxLength={5000} rows={5} className={input} /></Field>
          <Field label="Photos du bien (1 à 10)">
            <input name="images" type="file" accept="image/jpeg,image/png,image/webp" multiple required className={`${input} cursor-pointer`} />
          </Field>
          {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
          <button disabled={busy} className="min-h-12 w-full cursor-pointer rounded-xl bg-[#1B4D3E] px-6 font-semibold text-white hover:bg-[#12382D] disabled:cursor-not-allowed disabled:opacity-60">
            {busy ? "Transmission…" : "Soumettre l’annonce au contrôle"}
          </button>
        </form>
      </div>
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-[#3D3530]">{label} *</span>{children}</label>;
}
