import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";

import { ApplicationForm } from "@/components/application/application-form";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "apply" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function ApplyPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <div className="relative overflow-hidden">
      <div className="aurora-veil absolute inset-x-0 top-0 -z-10 h-72 opacity-50" />
      <div className="container-boreal py-14 sm:py-16">
        <ApplicationForm />
      </div>
    </div>
  );
}
