import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";
import { Building2, MapPin, Mail, Globe2 } from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { ContactForm } from "@/components/contact/contact-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "pages.contact" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ContactPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <ContactContent />;
}

function ContactContent() {
  const t = useTranslations("pages.contact");

  const info = [
    { icon: Building2, label: t("companyLabel"), value: t("company") },
    { icon: MapPin, label: t("addressLabel"), value: t("address") },
    { icon: Mail, label: t("emailLabel"), value: t("email") },
    { icon: Globe2, label: t("marketLabel"), value: t("market") },
  ];

  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr]">
          <div className="rounded-2xl border bg-card p-6 shadow-[var(--shadow-soft)] sm:p-8">
            <ContactForm />
          </div>

          <aside className="space-y-6">
            <h2 className="font-serif text-xl font-semibold">
              {t("infoTitle")}
            </h2>
            <ul className="space-y-4">
              {info.map(({ icon: Icon, label, value }) => (
                <li key={label} className="flex gap-3">
                  <span className="inline-flex size-9 shrink-0 items-center justify-center rounded-lg bg-accent text-primary">
                    <Icon className="size-4" />
                  </span>
                  <div>
                    <div className="text-xs text-muted-foreground">{label}</div>
                    <div className="text-sm font-medium">{value}</div>
                  </div>
                </li>
              ))}
            </ul>
          </aside>
        </div>
      </div>
    </>
  );
}
