import { setRequestLocale } from "next-intl/server";

import { Hero } from "@/components/home/hero";
import { ProductsGrid } from "@/components/home/products-grid";
import { Process } from "@/components/home/process";
import { Advantages } from "@/components/home/advantages";
import { FaqPreview } from "@/components/home/faq-preview";
import { HomeCta } from "@/components/home/cta";

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <>
      <Hero />
      <ProductsGrid />
      <Process />
      <Advantages />
      <FaqPreview />
      <HomeCta />
    </>
  );
}
