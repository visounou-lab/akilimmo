"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useTranslations } from "next-intl";
import { CheckCircle2, Loader2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
  subject: z.string().min(2),
  message: z.string().min(10),
});

type FormValues = z.infer<typeof schema>;

export function ContactForm() {
  const t = useTranslations("pages.contact.form");
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function onSubmit() {
    // Demo only: no data leaves the browser. Wired to Resend/DB in a later phase.
    await new Promise((r) => setTimeout(r, 600));
    setSent(true);
    reset();
  }

  if (sent) {
    return (
      <div className="flex items-start gap-3 rounded-xl border border-aurora/40 bg-aurora/10 p-5 text-sm">
        <CheckCircle2 className="mt-0.5 size-5 shrink-0 text-aurora-foreground dark:text-aurora" />
        <p>{t("success")}</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
      <div className="grid gap-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="name">{t("name")}</Label>
          <Input
            id="name"
            placeholder={t("namePlaceholder")}
            aria-invalid={!!errors.name}
            {...register("name")}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="email">{t("email")}</Label>
          <Input
            id="email"
            type="email"
            placeholder={t("emailPlaceholder")}
            aria-invalid={!!errors.email}
            {...register("email")}
          />
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="subject">{t("subject")}</Label>
        <Input
          id="subject"
          placeholder={t("subjectPlaceholder")}
          aria-invalid={!!errors.subject}
          {...register("subject")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">{t("message")}</Label>
        <textarea
          id="message"
          rows={5}
          placeholder={t("messagePlaceholder")}
          aria-invalid={!!errors.message}
          className="border-input placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-ring/50 aria-invalid:border-destructive flex w-full rounded-md border bg-background/60 px-3 py-2 text-sm shadow-xs transition-[color,box-shadow] outline-none focus-visible:ring-[3px]"
          {...register("message")}
        />
      </div>

      <Button type="submit" variant="aurora" disabled={isSubmitting}>
        {isSubmitting && <Loader2 className="size-4 animate-spin" />}
        {t("submit")}
      </Button>
    </form>
  );
}
