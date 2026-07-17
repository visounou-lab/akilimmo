"use client";

import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import type { RouteLocale } from "@/lib/i18n/config";
import { getTranslator } from "@/lib/i18n";
import { getCatalog } from "@/lib/credit-engine";

type StepId = "project" | "identity" | "situation" | "consents" | "confirmation";
const ORDER: StepId[] = ["project", "identity", "situation", "consents", "confirmation"];

interface FormState {
  productType: string;
  amount: string;
  term: string;
  purpose: string;
  country: string;
  salutation: string;
  firstName: string;
  lastName: string;
  birthDate: string;
  nationality: string;
  address: string;
  phone: string;
  email: string;
  employment: string;
  income: string;
  expenses: string;
  housing: string;
  existingLoans: string;
  consentPrivacy: boolean;
  consentAccuracy: boolean;
  consentContact: boolean;
  consentMarketing: boolean;
}

export function ApplicationForm({ locale }: { locale: RouteLocale }) {
  const t = getTranslator(locale);
  const params = useSearchParams();
  const catalog = getCatalog();

  const [state, setState] = useState<FormState>({
    productType: params.get("product") ?? catalog[0].productType,
    amount: params.get("amount") ?? "",
    term: params.get("term") ?? "",
    purpose: "",
    country: "DE",
    salutation: "",
    firstName: "",
    lastName: "",
    birthDate: "",
    nationality: "",
    address: "",
    phone: "",
    email: "",
    employment: "",
    income: "",
    expenses: "",
    housing: "",
    existingLoans: "",
    consentPrivacy: false,
    consentAccuracy: false,
    consentContact: false,
    consentMarketing: false,
  });

  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [reference, setReference] = useState<string | null>(null);

  const step = ORDER[stepIndex];
  const set = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }));

  const productTypes = useMemo(
    () => Array.from(new Set(catalog.map((c) => c.productType))),
    [catalog],
  );

  function validateStep(current: StepId): boolean {
    const e: Record<string, string> = {};
    const required = (field: keyof FormState) => {
      if (!String(state[field]).trim()) e[field] = t("antrag.errorRequired");
    };
    if (current === "project") {
      required("productType");
      required("amount");
      required("term");
      required("country");
    } else if (current === "identity") {
      (["firstName", "lastName", "birthDate", "address", "phone", "email"] as const).forEach(required);
      if (state.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(state.email)) {
        e.email = t("antrag.errorEmail");
      }
    } else if (current === "situation") {
      (["employment", "income"] as const).forEach(required);
    } else if (current === "consents") {
      if (!state.consentPrivacy || !state.consentAccuracy || !state.consentContact) {
        e.consents = t("antrag.errorConsent");
      }
    }
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function next() {
    if (!validateStep(step)) return;
    if (step === "consents") {
      await submit();
      return;
    }
    setStepIndex((i) => Math.min(i + 1, ORDER.length - 1));
  }

  function back() {
    setSubmitError(null);
    setStepIndex((i) => Math.max(i - 1, 0));
  }

  async function submit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await fetch("/api/antrag", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ locale, ...state }),
      });
      if (!res.ok) throw new Error("submit failed");
      const data = (await res.json()) as { reference: string };
      setReference(data.reference);
      setStepIndex(ORDER.indexOf("confirmation"));
    } catch {
      setSubmitError(t("antrag.submitError"));
    } finally {
      setSubmitting(false);
    }
  }

  const totalUserSteps = ORDER.length - 1; // confirmation excluded from the counter

  return (
    <div className="sand-card" style={{ padding: "1.75rem", maxWidth: "720px", margin: "0 auto" }}>
      {/* Progress */}
      {step !== "confirmation" && (
        <div style={{ marginBottom: "1.5rem" }}>
          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem", fontSize: "0.85rem", color: "var(--color-sand-muted)" }}>
            <span>
              {t("antrag.step")} {stepIndex + 1} {t("antrag.of")} {totalUserSteps}
            </span>
            <span style={{ fontWeight: 600, color: "var(--color-sand-navy)" }}>
              {t(`antrag.steps.${step}`)}
            </span>
          </div>
          <div style={{ height: "6px", background: "var(--color-sand-border)", borderRadius: "99px", overflow: "hidden" }}>
            <div
              style={{
                height: "100%",
                width: `${((stepIndex + 1) / totalUserSteps) * 100}%`,
                background: "var(--color-sand-cta)",
                transition: "width 0.2s ease",
              }}
            />
          </div>
        </div>
      )}

      {step === "project" && (
        <Fieldset legend={t("antrag.steps.project")}>
          <Select label={t("antrag.fields.productType")} value={state.productType} error={errors.productType}
            onChange={(v) => set("productType", v)}
            options={productTypes.map((p) => ({ value: p, label: t(`home.solutions.${p}Title`) }))} />
          <Field label={t("antrag.fields.amount")} type="number" value={state.amount} error={errors.amount} onChange={(v) => set("amount", v)} />
          <Field label={t("antrag.fields.term")} type="number" value={state.term} error={errors.term} onChange={(v) => set("term", v)} />
          <Select label={t("antrag.fields.country")} value={state.country} error={errors.country} onChange={(v) => set("country", v)}
            options={[{ value: "DE", label: "DE" }, { value: "PL", label: "PL" }, { value: "SE", label: "SE" }, { value: "CZ", label: "CZ" }]} />
          <Field label={t("antrag.fields.purpose")} value={state.purpose} onChange={(v) => set("purpose", v)} textarea />
        </Fieldset>
      )}

      {step === "identity" && (
        <Fieldset legend={t("antrag.steps.identity")}>
          <Field label={t("antrag.fields.salutation")} value={state.salutation} onChange={(v) => set("salutation", v)} />
          <Field label={t("antrag.fields.firstName")} value={state.firstName} error={errors.firstName} onChange={(v) => set("firstName", v)} />
          <Field label={t("antrag.fields.lastName")} value={state.lastName} error={errors.lastName} onChange={(v) => set("lastName", v)} />
          <Field label={t("antrag.fields.birthDate")} type="date" value={state.birthDate} error={errors.birthDate} onChange={(v) => set("birthDate", v)} />
          <Field label={t("antrag.fields.nationality")} value={state.nationality} onChange={(v) => set("nationality", v)} />
          <Field label={t("antrag.fields.address")} value={state.address} error={errors.address} onChange={(v) => set("address", v)} textarea />
          <Field label={t("antrag.fields.phone")} type="tel" value={state.phone} error={errors.phone} onChange={(v) => set("phone", v)} />
          <Field label={t("antrag.fields.email")} type="email" value={state.email} error={errors.email} onChange={(v) => set("email", v)} />
        </Fieldset>
      )}

      {step === "situation" && (
        <Fieldset legend={t("antrag.steps.situation")}>
          <Field label={t("antrag.fields.employment")} value={state.employment} error={errors.employment} onChange={(v) => set("employment", v)} />
          <Field label={t("antrag.fields.income")} type="number" value={state.income} error={errors.income} onChange={(v) => set("income", v)} />
          <Field label={t("antrag.fields.expenses")} type="number" value={state.expenses} onChange={(v) => set("expenses", v)} />
          <Field label={t("antrag.fields.housing")} value={state.housing} onChange={(v) => set("housing", v)} />
          <Field label={t("antrag.fields.existingLoans")} value={state.existingLoans} onChange={(v) => set("existingLoans", v)} />
          <p style={{ fontSize: "0.8rem", color: "var(--color-sand-muted)", background: "var(--color-sand-bg)", padding: "0.75rem", borderRadius: "10px" }}>
            🔒 {t("antrag.securityNote")}
          </p>
        </Fieldset>
      )}

      {step === "consents" && (
        <Fieldset legend={t("antrag.steps.consents")}>
          <Checkbox label={t("antrag.consents.privacy")} checked={state.consentPrivacy} onChange={(v) => set("consentPrivacy", v)} />
          <Checkbox label={t("antrag.consents.accuracy")} checked={state.consentAccuracy} onChange={(v) => set("consentAccuracy", v)} />
          <Checkbox label={t("antrag.consents.contact")} checked={state.consentContact} onChange={(v) => set("consentContact", v)} />
          <Checkbox label={t("antrag.consents.marketing")} checked={state.consentMarketing} onChange={(v) => set("consentMarketing", v)} />
          {errors.consents && <p style={{ color: "#b91c1c", fontSize: "0.85rem" }}>{errors.consents}</p>}
        </Fieldset>
      )}

      {step === "confirmation" && (
        <div style={{ textAlign: "center", padding: "1rem 0" }}>
          <div style={{ fontSize: "2.5rem" }} aria-hidden="true">✓</div>
          <h2 style={{ fontSize: "1.4rem", fontWeight: 700, marginTop: "0.5rem" }}>{t("antrag.confirmation.title")}</h2>
          <p style={{ color: "var(--color-sand-muted)", marginTop: "0.75rem" }}>{t("antrag.confirmation.reference")}</p>
          <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "var(--color-sand-navy)", letterSpacing: "0.04em" }}>{reference}</p>
          <p style={{ marginTop: "1rem", maxWidth: "46ch", marginInline: "auto" }}>{t("antrag.confirmation.text")}</p>
          <div style={{ marginTop: "1.25rem", background: "var(--color-sand-bg)", borderRadius: "12px", padding: "1rem", textAlign: "left" }}>
            <strong>{t("antrag.confirmation.nextTitle")}</strong>
            <p style={{ marginTop: "0.35rem", color: "var(--color-sand-muted)" }}>{t("antrag.confirmation.nextText")}</p>
          </div>
        </div>
      )}

      {step !== "confirmation" && (
        <div style={{ marginTop: "1.75rem", display: "flex", justifyContent: "space-between", gap: "0.75rem" }}>
          <button type="button" className="sand-btn sand-btn-ghost" onClick={back} disabled={stepIndex === 0} style={{ visibility: stepIndex === 0 ? "hidden" : "visible" }}>
            {t("common.back")}
          </button>
          <button type="button" className="sand-btn sand-btn-primary" onClick={next} disabled={submitting}>
            {step === "consents" ? t("common.submit") : t("common.next")}
          </button>
        </div>
      )}
      {submitError && <p style={{ color: "#b91c1c", fontSize: "0.85rem", marginTop: "0.75rem", textAlign: "right" }}>{submitError}</p>}
    </div>
  );
}

function Fieldset({ legend, children }: { legend: string; children: React.ReactNode }) {
  return (
    <fieldset style={{ border: "none", padding: 0, margin: 0, display: "grid", gap: "1rem" }}>
      <legend style={{ fontSize: "1.15rem", fontWeight: 700, color: "var(--color-sand-navy)", marginBottom: "0.25rem" }}>
        {legend}
      </legend>
      {children}
    </fieldset>
  );
}

function Field({
  label, value, onChange, type = "text", error, textarea,
}: {
  label: string; value: string; onChange: (v: string) => void; type?: string; error?: string; textarea?: boolean;
}) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</span>
      {textarea ? (
        <textarea className="sand-field" value={value} rows={2} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      ) : (
        <input className="sand-field" type={type} value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error} />
      )}
      {error && <span style={{ color: "#b91c1c", fontSize: "0.8rem" }}>{error}</span>}
    </label>
  );
}

function Select({
  label, value, onChange, options, error,
}: {
  label: string; value: string; onChange: (v: string) => void; options: Array<{ value: string; label: string }>; error?: string;
}) {
  return (
    <label style={{ display: "grid", gap: "0.35rem" }}>
      <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>{label}</span>
      <select className="sand-field" value={value} onChange={(e) => onChange(e.target.value)} aria-invalid={!!error}>
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
      {error && <span style={{ color: "#b91c1c", fontSize: "0.8rem" }}>{error}</span>}
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label style={{ display: "flex", gap: "0.7rem", alignItems: "flex-start", cursor: "pointer" }}>
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} style={{ marginTop: "0.2rem", accentColor: "var(--color-sand-cta)", width: "18px", height: "18px" }} />
      <span style={{ fontSize: "0.9rem", lineHeight: 1.5 }}>{label}</span>
    </label>
  );
}
