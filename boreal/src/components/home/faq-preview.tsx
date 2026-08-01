import { useTranslations } from "next-intl";
import { ArrowRight } from "lucide-react";

import { Link } from "@/i18n/navigation";
import { Button } from "@/components/ui/button";
import { SectionHeading } from "@/components/section-heading";
import { FaqAccordion } from "@/components/faq-accordion";

export function FaqPreview() {
  const t = useTranslations("home.faq");

  return (
    <section className="border-t bg-secondary/30 py-20">
      <div className="container-boreal grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
        <div>
          <SectionHeading
            eyebrow={t("eyebrow")}
            title={t("title")}
            align="left"
          />
          <Button asChild variant="outline" className="mt-6">
            <Link href="/faq">
              {t("cta")}
              <ArrowRight className="size-4" />
            </Link>
          </Button>
        </div>
        <div className="rounded-xl border bg-card px-6 shadow-[var(--shadow-soft)]">
          <FaqAccordion keys={["q1", "q2", "q3", "q4"]} />
        </div>
      </div>
    </section>
  );
}
