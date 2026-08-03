"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  Controller,
  useForm,
  type Control,
  type Resolver,
  type UseFormRegister,
} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  ArrowRight,
  Clock,
  Save,
  CheckCircle2,
  Loader2,
} from "lucide-react";

import { Link } from "@/i18n/navigation";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { computeSimulation } from "@/lib/finance";
import { products, getProduct } from "@/lib/products";
import { COUNTRIES, currencyForCountry, DEFAULT_COUNTRY } from "@/lib/countries";
import {
  applicationSchema,
  STEP1_FIELDS,
  type ApplicationInput,
} from "@/lib/application-schema";
import { generateReference } from "@/lib/reference";
import { submitApplication } from "@/app/[locale]/demande/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const STORAGE_KEY = "boreal-application-v1";

function clamp(v: number, min: number, max: number) {
  return Math.min(max, Math.max(min, v));
}

const DEFAULT_VALUES: ApplicationInput = {
  product: "personal",
  country: DEFAULT_COUNTRY,
  amount: 10000,
  months: 48,
  purpose: "",
  salutation: "",
  firstName: "",
  lastName: "",
  birthDate: "",
  nationality: "",
  nationalId: "",
  addressLine: "",
  postalCode: "",
  city: "",
  phone: "",
  email: "",
  occupation: "",
  monthlyIncome: 0,
  monthlyExpenses: 0,
  housingSituation: "",
  existingCredits: "",
  consentDataProcessing: true,
  consentAccuracy: true,
  consentContact: true,
  consentMarketing: false,
};

export function ApplicationForm() {
  const t = useTranslations("apply");
  const tp = useTranslations("products.items");
  const tc = useTranslations("countries");
  const te = useTranslations("apply.errors");
  const locale = useLocale();

  const [hydrated, setHydrated] = useState(false);
  const [step, setStep] = useState<1 | 2>(1);
  const [reference, setReference] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [done, setDone] = useState<null | { reference: string }>(null);
  const topRef = useRef<HTMLDivElement>(null);

  const form = useForm<ApplicationInput>({
    resolver: zodResolver(applicationSchema) as Resolver<ApplicationInput>,
    defaultValues: {
      ...DEFAULT_VALUES,
      consentDataProcessing: false,
      consentAccuracy: false,
      consentContact: false,
    },
    mode: "onTouched",
  });

  const {
    register,
    control,
    handleSubmit,
    watch,
    trigger,
    reset,
    getValues,
    setValue,
    formState: { errors },
  } = form;

  // Hydrate from localStorage once on mount, generating a reference if needed.
  useEffect(() => {
    let saved: Partial<ApplicationInput> | undefined;
    let savedRef = "";
    let savedStep: 1 | 2 = 1;
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        saved = parsed.values;
        savedRef = typeof parsed.reference === "string" ? parsed.reference : "";
        savedStep = parsed.step === 2 ? 2 : 1;
      }
    } catch {
      /* ignore corrupt storage */
    }
    if (saved) reset({ ...DEFAULT_VALUES, ...saved });
    setReference(savedRef || generateReference());
    setStep(savedStep);
    setHydrated(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Autosave (debounced) whenever values change, after hydration.
  const watched = watch();
  useEffect(() => {
    if (!hydrated || done) return;
    const id = setTimeout(() => {
      try {
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ reference, step, values: getValues() }),
        );
      } catch {
        /* storage may be unavailable */
      }
    }, 400);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [watched, step, reference, hydrated, done]);

  const productKey = watch("product");
  const countryCode = watch("country");
  const amount = watch("amount");
  const months = watch("months");

  const product = getProduct(productKey) ?? products[0]!;
  const currency = currencyForCountry(countryCode);

  // Keep amount / term within the selected product's bounds.
  useEffect(() => {
    if (!hydrated) return;
    const p = getProduct(productKey);
    if (!p) return;
    const a = getValues("amount");
    const m = getValues("months");
    if (Number.isFinite(a)) {
      const ca = clamp(a, p.minAmount, p.maxAmount);
      if (ca !== a) setValue("amount", ca, { shouldValidate: true });
    }
    if (Number.isFinite(m)) {
      const cm = clamp(m, p.minMonths, p.maxMonths);
      if (cm !== m) setValue("months", cm, { shouldValidate: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [productKey, hydrated]);

  const sim = useMemo(() => {
    const a = Number.isFinite(amount) ? amount : 0;
    const m = Number.isFinite(months) && months > 0 ? months : 1;
    return computeSimulation({ amount: a, months: m, annualRate: product.fromRate });
  }, [amount, months, product.fromRate]);

  function scrollTop() {
    topRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  async function goNext() {
    const ok = await trigger([...STEP1_FIELDS]);
    if (ok) {
      setStep(2);
      scrollTop();
    }
  }

  function goBack() {
    setStep(1);
    scrollTop();
  }

  async function onValid(values: ApplicationInput) {
    setSubmitting(true);
    const payload = {
      ...values,
      salutation: values.salutation === "none" ? "" : values.salutation,
    };
    try {
      const result = await submitApplication(payload, reference, locale);
      if (result.ok && result.reference) {
        try {
          localStorage.removeItem(STORAGE_KEY);
        } catch {
          /* ignore */
        }
        setDone({ reference: result.reference });
        scrollTop();
      }
    } finally {
      setSubmitting(false);
    }
  }

  function err(name: keyof ApplicationInput): string | undefined {
    const e = errors[name];
    if (!e) return undefined;
    const code = typeof e.message === "string" ? e.message : "required";
    const known = ["required", "email", "consent", "amountRange", "durationRange"];
    return te(known.includes(code) ? code : "required");
  }

  if (done) {
    return <SuccessPanel reference={done.reference} onReset={() => resetAll()} />;
  }

  function resetAll() {
    reset({
      ...DEFAULT_VALUES,
      consentDataProcessing: false,
      consentAccuracy: false,
      consentContact: false,
    });
    setReference(generateReference());
    setStep(1);
    setDone(null);
    scrollTop();
  }

  return (
    <div ref={topRef} className="mx-auto max-w-3xl scroll-mt-24">
      {/* Header */}
      <div className="text-center">
        <span className="inline-flex items-center gap-1.5 rounded-full border bg-card px-3 py-1 text-xs font-medium text-muted-foreground shadow-[var(--shadow-soft)]">
          <Clock className="size-3.5 text-glacier" />
          {t("badge")}
        </span>
        <h1 className="mt-5 text-3xl font-semibold sm:text-4xl">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-muted-foreground">
          {t("subtitle")}
        </p>
      </div>

      {/* Progress */}
      <div className="mt-10">
        <div className="flex items-center justify-between text-sm">
          <span className="font-medium">
            {t("stepOf", { current: step, total: 2 })} ·{" "}
            {step === 1 ? t("steps.project") : t("steps.info")}
          </span>
          <span className="hidden items-center gap-1.5 text-muted-foreground sm:inline-flex">
            <Save className="size-3.5" />
            {t("autosaved")} · {t("reference")}{" "}
            <span className="font-mono font-medium text-foreground">
              {reference || "…"}
            </span>
          </span>
        </div>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-secondary">
          <div
            className="h-full rounded-full bg-gradient-to-r from-primary to-glacier transition-all duration-500"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit(onValid)} noValidate>
        <div className="mt-6 rounded-2xl border bg-card p-6 shadow-[var(--shadow-lift)] sm:p-8">
          {step === 1 ? (
            <StepProject
              t={t}
              tp={tp}
              tc={tc}
              locale={locale}
              control={control}
              register={register}
              product={product}
              currency={currency}
              sim={sim}
              err={err}
            />
          ) : (
            <StepInfo
              t={t}
              currency={currency}
              locale={locale}
              control={control}
              register={register}
              err={err}
            />
          )}
        </div>

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-between">
          <Button
            type="button"
            variant="ghost"
            onClick={goBack}
            disabled={step === 1}
            className={step === 1 ? "invisible" : ""}
          >
            <ArrowLeft className="size-4" />
            {t("back")}
          </Button>

          {step === 1 ? (
            <Button type="button" variant="aurora" onClick={goNext}>
              {t("next")}
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button type="submit" variant="aurora" disabled={submitting}>
              {submitting && <Loader2 className="size-4 animate-spin" />}
              {submitting ? t("submitting") : t("submit")}
            </Button>
          )}
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          {t("noOffer")}
        </p>
      </form>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 1 — Projet                                                            */
/* -------------------------------------------------------------------------- */

type StepProjectProps = {
  t: ReturnType<typeof useTranslations>;
  tp: ReturnType<typeof useTranslations>;
  tc: ReturnType<typeof useTranslations>;
  locale: string;
  control: Control<ApplicationInput>;
  register: UseFormRegister<ApplicationInput>;
  product: (typeof products)[number];
  currency: string;
  sim: ReturnType<typeof computeSimulation>;
  err: (name: keyof ApplicationInput) => string | undefined;
};

function StepProject({
  t,
  tp,
  tc,
  locale,
  control,
  register,
  product,
  currency,
  sim,
  err,
}: StepProjectProps) {
  return (
    <div className="space-y-6">
      <h2 className="font-serif text-xl font-semibold">
        {t("project.heading")}
      </h2>

      <Field label={t("project.type")} required error={err("product")}>
        <Controller
          control={control}
          name="product"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {products.map((p) => (
                  <SelectItem key={p.key} value={p.key}>
                    {tp(`${p.key}.title`)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <Field label={t("project.country")} required error={err("country")}>
        <Controller
          control={control}
          name="country"
          render={({ field }) => (
            <Select value={field.value} onValueChange={field.onChange}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {COUNTRIES.map((c) => (
                  <SelectItem key={c.code} value={c.code}>
                    {tc(c.code)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Field>

      <div className="grid gap-5 sm:grid-cols-2">
        <Field
          label={t("project.amount", { currency })}
          required
          error={err("amount")}
        >
          <Input
            type="number"
            inputMode="numeric"
            min={product.minAmount}
            max={product.maxAmount}
            step={500}
            {...register("amount", { valueAsNumber: true })}
          />
        </Field>
        <Field
          label={t("project.duration")}
          required
          error={err("months")}
        >
          <Input
            type="number"
            inputMode="numeric"
            min={product.minMonths}
            max={product.maxMonths}
            step={1}
            {...register("months", { valueAsNumber: true })}
          />
        </Field>
      </div>

      {/* Live simulation */}
      <div className="rounded-xl border border-glacier/40 bg-accent/40 p-5">
        <div className="text-xs font-semibold uppercase tracking-wide text-glacier">
          {t("project.simTitle")}
        </div>
        <div className="mt-4 grid grid-cols-3 gap-3 text-center">
          <SimStat
            value={formatCurrency(sim.monthlyPayment, locale, currency)}
            label={t("project.monthly")}
          />
          <SimStat
            value={formatPercent(product.fromRate, locale)}
            label={t("project.rate")}
          />
          <SimStat
            value={formatCurrency(sim.totalInterest, locale, currency)}
            label={t("project.totalCost")}
          />
        </div>
      </div>

      {/* Conditions */}
      <div className="rounded-xl border p-5">
        <div className="font-serif text-sm font-semibold">
          {t("project.conditions")}
        </div>
        <dl className="mt-4 space-y-2.5 text-sm">
          <ConditionRow
            label={t("project.minAmount")}
            value={formatCurrency(product.minAmount, locale, currency)}
          />
          <ConditionRow
            label={t("project.maxAmount")}
            value={formatCurrency(product.maxAmount, locale, currency)}
          />
          <ConditionRow
            label={t("project.minDuration")}
            value={t("project.months", { count: product.minMonths })}
          />
          <ConditionRow
            label={t("project.maxDuration")}
            value={t("project.months", { count: product.maxMonths })}
          />
        </dl>
      </div>

      <Field label={t("project.purpose")}>
        <Textarea
          rows={3}
          placeholder={t("project.purposePlaceholder")}
          {...register("purpose")}
        />
      </Field>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Step 2 — Vos informations                                                  */
/* -------------------------------------------------------------------------- */

type StepInfoProps = {
  t: ReturnType<typeof useTranslations>;
  currency: string;
  locale: string;
  control: Control<ApplicationInput>;
  register: UseFormRegister<ApplicationInput>;
  err: (name: keyof ApplicationInput) => string | undefined;
};

function StepInfo({ t, currency, control, register, err }: StepInfoProps) {
  return (
    <div className="space-y-8">
      {/* Identité */}
      <section className="space-y-5">
        <h2 className="font-serif text-xl font-semibold">
          {t("identity.heading")}
        </h2>

        <Field label={t("identity.salutation")}>
          <Controller
            control={control}
            name="salutation"
            render={({ field }) => (
              <Select
                value={field.value || "none"}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="sm:max-w-48">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">
                    {t("identity.salutationNone")}
                  </SelectItem>
                  <SelectItem value="mr">{t("identity.salutationMr")}</SelectItem>
                  <SelectItem value="mrs">
                    {t("identity.salutationMrs")}
                  </SelectItem>
                  <SelectItem value="other">
                    {t("identity.salutationOther")}
                  </SelectItem>
                </SelectContent>
              </Select>
            )}
          />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("identity.firstName")} required error={err("firstName")}>
            <Input {...register("firstName")} />
          </Field>
          <Field label={t("identity.lastName")} required error={err("lastName")}>
            <Input {...register("lastName")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("identity.birthDate")}
            required
            error={err("birthDate")}
          >
            <Input type="date" {...register("birthDate")} />
          </Field>
          <Field
            label={t("identity.nationality")}
            required
            error={err("nationality")}
          >
            <Input {...register("nationality")} />
          </Field>
        </div>

        <Field
          label={t("identity.nationalId")}
          hint={t("identity.nationalIdHint")}
          error={err("nationalId")}
        >
          <Input
            placeholder={t("identity.nationalIdPlaceholder")}
            {...register("nationalId")}
          />
        </Field>

        <Field label={t("identity.address")} required error={err("addressLine")}>
          <Input {...register("addressLine")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("identity.postalCode")}
            required
            error={err("postalCode")}
          >
            <Input {...register("postalCode")} />
          </Field>
          <Field label={t("identity.city")} required error={err("city")}>
            <Input {...register("city")} />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("identity.phone")} required error={err("phone")}>
            <Input type="tel" {...register("phone")} />
          </Field>
          <Field label={t("identity.email")} required error={err("email")}>
            <Input type="email" {...register("email")} />
          </Field>
        </div>
      </section>

      {/* Situation */}
      <section className="space-y-5">
        <h2 className="font-serif text-xl font-semibold">
          {t("situation.heading")}
        </h2>

        <Field
          label={t("situation.occupation")}
          required
          error={err("occupation")}
        >
          <Input {...register("occupation")} />
        </Field>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field
            label={t("situation.income", { currency })}
            required
            error={err("monthlyIncome")}
          >
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              {...register("monthlyIncome", { valueAsNumber: true })}
            />
          </Field>
          <Field
            label={t("situation.expenses", { currency })}
            required
            error={err("monthlyExpenses")}
          >
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              step={100}
              {...register("monthlyExpenses", { valueAsNumber: true })}
            />
          </Field>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t("situation.housing")}>
            <Input
              placeholder={t("situation.housingPlaceholder")}
              {...register("housingSituation")}
            />
          </Field>
          <Field label={t("situation.existingCredits")}>
            <Input
              placeholder={t("situation.existingCreditsPlaceholder")}
              {...register("existingCredits")}
            />
          </Field>
        </div>
      </section>

      {/* Consentements */}
      <section className="space-y-4">
        <h2 className="font-serif text-xl font-semibold">
          {t("consents.heading")}
        </h2>
        <ConsentRow
          control={control}
          name="consentDataProcessing"
          label={t("consents.dataProcessing")}
          error={err("consentDataProcessing")}
        />
        <ConsentRow
          control={control}
          name="consentAccuracy"
          label={t("consents.accuracy")}
          error={err("consentAccuracy")}
        />
        <ConsentRow
          control={control}
          name="consentContact"
          label={t("consents.contact")}
          error={err("consentContact")}
        />
        <ConsentRow
          control={control}
          name="consentMarketing"
          label={t("consents.marketing")}
        />
      </section>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Shared field primitives                                                    */
/* -------------------------------------------------------------------------- */

function Field({
  label,
  required,
  hint,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  hint?: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <Label>
        {label}
        {required && <span className="text-destructive"> *</span>}
      </Label>
      {children}
      {hint && !error && (
        <p className="text-xs text-muted-foreground">{hint}</p>
      )}
      {error && <p className="text-xs font-medium text-destructive">{error}</p>}
    </div>
  );
}

function SimStat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="font-serif text-lg font-semibold tabular-nums sm:text-xl">
        {value}
      </div>
      <div className="mt-0.5 text-xs text-muted-foreground">{label}</div>
    </div>
  );
}

function ConditionRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium tabular-nums">{value}</dd>
    </div>
  );
}

function ConsentRow({
  control,
  name,
  label,
  error,
}: {
  control: Control<ApplicationInput>;
  name:
    | "consentDataProcessing"
    | "consentAccuracy"
    | "consentContact"
    | "consentMarketing";
  label: string;
  error?: string;
}) {
  return (
    <div>
      <label className="flex cursor-pointer items-start gap-3">
        <Controller
          control={control}
          name={name}
          render={({ field }) => (
            <Checkbox
              checked={!!field.value}
              onCheckedChange={(v) => field.onChange(v === true)}
              aria-invalid={!!error}
              className="mt-0.5"
            />
          )}
        />
        <span className="text-sm leading-relaxed text-muted-foreground">
          {label}
        </span>
      </label>
      {error && (
        <p className="mt-1 ml-8 text-xs font-medium text-destructive">{error}</p>
      )}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* Success                                                                    */
/* -------------------------------------------------------------------------- */

function SuccessPanel({
  reference,
  onReset,
}: {
  reference: string;
  onReset: () => void;
}) {
  const t = useTranslations("apply.success");
  return (
    <div className="mx-auto max-w-2xl">
      <div className="rounded-2xl border bg-card p-8 text-center shadow-[var(--shadow-lift)] sm:p-12">
        <span className="mx-auto inline-flex size-14 items-center justify-center rounded-full bg-aurora/15 text-aurora-foreground dark:text-aurora">
          <CheckCircle2 className="size-7" />
        </span>
        <h1 className="mt-6 text-3xl font-semibold">{t("title")}</h1>
        <p className="mx-auto mt-3 max-w-lg text-muted-foreground">{t("body")}</p>

        <div className="mx-auto mt-6 w-fit rounded-xl border bg-secondary/50 px-6 py-4">
          <div className="text-xs uppercase tracking-wide text-muted-foreground">
            {t("referenceLabel")}
          </div>
          <div className="mt-1 font-mono text-2xl font-semibold">
            {reference}
          </div>
        </div>

        <p className="mx-auto mt-5 max-w-lg text-xs text-muted-foreground">
          {t("demoNote")}
        </p>

        <div className="mt-8 flex flex-wrap justify-center gap-3">
          <Button asChild variant="aurora">
            <Link href="/">{t("home")}</Link>
          </Button>
          <Button type="button" variant="outline" onClick={onReset}>
            {t("another")}
          </Button>
        </div>
      </div>
    </div>
  );
}
