"use client";

import { useTranslations } from "next-intl";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

export const FAQ_KEYS = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export function FaqAccordion({
  keys = FAQ_KEYS,
}: {
  keys?: readonly string[];
}) {
  const t = useTranslations("faqList");

  return (
    <Accordion type="single" collapsible className="w-full">
      {keys.map((key) => (
        <AccordionItem key={key} value={key}>
          <AccordionTrigger>{t(`${key}.q`)}</AccordionTrigger>
          <AccordionContent>{t(`${key}.a`)}</AccordionContent>
        </AccordionItem>
      ))}
    </Accordion>
  );
}
