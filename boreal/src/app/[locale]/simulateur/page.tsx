import type { Metadata } from "next";
import { getTranslations, setRequestLocale } from "next-intl/server";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/page-header";
import { FinancingSimulator } from "@/components/simulator/financing-simulator";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "simulator" });
  return { title: t("title"), description: t("subtitle") };
}

export default async function SimulatorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  return <SimulatorContent />;
}

function SimulatorContent() {
  const t = useTranslations("simulator");
  return (
    <>
      <PageHeader title={t("title")} subtitle={t("subtitle")} />
      <div className="container-boreal py-16">
        <div className="mx-auto max-w-4xl">
          <FinancingSimulator variant="full" />
        </div>
      </div>
    </>
  );
}
