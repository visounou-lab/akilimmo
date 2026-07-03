"use client";

import Link from "next/link";
import { useState } from "react";
import { CheckCircle2, ShieldCheck } from "lucide-react";

type FormState = { status: "idle" | "loading" | "success" | "error"; message: string };

const inputClass =
  "min-h-11 w-full rounded-xl border border-[#DCCDBD] bg-[#FDFCF8] px-4 py-3 text-base text-[#1C1917] outline-none transition-colors duration-200 placeholder:text-[#8A7C70] focus:border-[#1B4D3E] focus:ring-2 focus:ring-[#1B4D3E]/20";

export default function AgentApplicationForm() {
  const [state, setState] = useState<FormState>({ status: "idle", message: "" });

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = event.currentTarget;
    const data = new FormData(form);
    if (data.get("password") !== data.get("confirmPassword")) {
      setState({ status: "error", message: "Les deux mots de passe ne correspondent pas." });
      return;
    }

    setState({ status: "loading", message: "" });
    const response = await fetch("/api/auth/register-agent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        agencyName: data.get("agencyName"),
        firstName: data.get("firstName"),
        lastName: data.get("lastName"),
        email: data.get("email"),
        phone: data.get("phone"),
        country: data.get("country"),
        city: data.get("city"),
        password: data.get("password"),
        referralCode: data.get("referralCode"),
        acceptedTerms: data.get("acceptedTerms") === "on",
      }),
    });
    const payload = (await response.json().catch(() => null)) as
      | { error?: string; message?: string }
      | null;

    if (!response.ok) {
      setState({
        status: "error",
        message: payload?.error ?? "Inscription impossible. Réessayez.",
      });
      return;
    }
    setState({
      status: "success",
      message: payload?.message ?? "Compte créé. Vérifiez votre boîte email.",
    });
    form.reset();
  }

  if (state.status === "success") {
    return (
      <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-8 text-center">
        <CheckCircle2 className="mx-auto text-emerald-700" size={42} aria-hidden="true" />
        <h3 className="mt-4 font-serif text-2xl font-bold text-[#1C1917]">Compte agent créé</h3>
        <p className="mx-auto mt-3 max-w-md leading-7 text-[#475569]">{state.message}</p>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#475569]">
          Après confirmation, connectez-vous : vous serez dirigé vers le dépôt privé de votre
          pièce d’identité, carte professionnelle, RCCM et assurance.
        </p>
        <Link
          href="/login"
          className="mt-6 inline-flex min-h-11 cursor-pointer items-center justify-center rounded-xl bg-[#1B4D3E] px-6 py-3 font-semibold text-white transition-colors hover:bg-[#12382D] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1B4D3E] focus-visible:ring-offset-2"
        >
          Aller à la connexion
        </Link>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="space-y-6 rounded-2xl border border-[#E2D6C8] bg-[#FDFCF8] p-6 shadow-sm sm:p-8"
    >
      <div className="flex gap-3 rounded-xl border border-[#1B4D3E]/20 bg-[#EAF3EF] p-4">
        <ShieldCheck className="mt-0.5 shrink-0 text-[#1B4D3E]" size={22} aria-hidden="true" />
        <p className="text-sm leading-6 text-[#334E45]">
          Cette inscription ne donne aucun badge automatiquement. Votre rôle agent restera
          verrouillé jusqu’à la validation humaine de tous les justificatifs.
        </p>
      </div>

      {state.status === "error" && (
        <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {state.message}
        </p>
      )}

      <fieldset className="space-y-5">
        <legend className="mb-4 font-serif text-xl font-bold text-[#1C1917]">
          Identité et activité
        </legend>
        <div>
          <label htmlFor="agencyName" className="mb-2 block text-sm font-medium text-[#3D3530]">
            Nom de l’agence ou de l’activité *
          </label>
          <input id="agencyName" name="agencyName" required maxLength={120} className={inputClass} />
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="firstName" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Prénom *
            </label>
            <input id="firstName" name="firstName" autoComplete="given-name" required maxLength={80} className={inputClass} />
          </div>
          <div>
            <label htmlFor="lastName" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Nom *
            </label>
            <input id="lastName" name="lastName" autoComplete="family-name" required maxLength={80} className={inputClass} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="agentEmail" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Email professionnel *
            </label>
            <input id="agentEmail" name="email" type="email" autoComplete="email" required className={inputClass} />
          </div>
          <div>
            <label htmlFor="agentPhone" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Téléphone *
            </label>
            <input id="agentPhone" name="phone" type="tel" autoComplete="tel" required maxLength={30} className={inputClass} />
          </div>
        </div>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="agentCountry" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Pays d’activité *
            </label>
            <select id="agentCountry" name="country" required className={`${inputClass} cursor-pointer`}>
              <option value="">Sélectionner</option>
              <option value="COTE_D_IVOIRE">Côte d’Ivoire</option>
              <option value="BENIN">Bénin</option>
            </select>
          </div>
          <div>
            <label htmlFor="agentCity" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Ville principale *
            </label>
            <input id="agentCity" name="city" required maxLength={100} className={inputClass} />
          </div>
        </div>
      </fieldset>

      <fieldset className="space-y-5 border-t border-[#E2D6C8] pt-6">
        <legend className="mb-4 font-serif text-xl font-bold text-[#1C1917]">
          Sécurité du compte
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <div>
            <label htmlFor="agentPassword" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Mot de passe *
            </label>
            <input
              id="agentPassword"
              name="password"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="mb-2 block text-sm font-medium text-[#3D3530]">
              Confirmer *
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              autoComplete="new-password"
              required
              minLength={10}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-xs leading-5 text-[#5F554C]">
          10 caractères minimum, avec une majuscule, une minuscule et un chiffre.
        </p>
        <div>
          <label htmlFor="agentReferral" className="mb-2 block text-sm font-medium text-[#3D3530]">
            Code de parrainage <span className="font-normal">(facultatif)</span>
          </label>
          <input id="agentReferral" name="referralCode" maxLength={40} className={inputClass} />
          <p className="mt-2 text-xs leading-5 text-[#5F554C]">
            Le code enregistre le parrain, mais ne remplace aucune vérification.
          </p>
        </div>
      </fieldset>

      <label className="flex cursor-pointer items-start gap-3 text-sm leading-6 text-[#475569]">
        <input
          name="acceptedTerms"
          type="checkbox"
          required
          className="mt-1 h-5 w-5 shrink-0 accent-[#1B4D3E]"
        />
        <span>
          J’accepte les{" "}
          <Link href="/mentions-legales" className="font-medium text-[#1B4D3E] underline">
            conditions
          </Link>{" "}
          et la{" "}
          <Link href="/confidentialite" className="font-medium text-[#1B4D3E] underline">
            politique de confidentialité
          </Link>
          .
        </span>
      </label>

      <button
        type="submit"
        disabled={state.status === "loading"}
        className="inline-flex min-h-12 w-full cursor-pointer items-center justify-center rounded-xl bg-[#C8922A] px-6 py-3 font-semibold text-white transition-colors duration-200 hover:bg-[#A97518] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A] focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {state.status === "loading" ? "Création sécurisée…" : "Créer mon compte agent"}
      </button>
    </form>
  );
}
