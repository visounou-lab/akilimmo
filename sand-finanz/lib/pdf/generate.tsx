import "server-only";
import React from "react";
import { createHash } from "node:crypto";
import { renderToBuffer } from "@react-pdf/renderer";
import { prisma } from "@/lib/db";
import { getCompanySettings } from "@/lib/settings";
import { getPublishedCatalog } from "@/lib/catalog-server";
import { calculate, validate, formatMoney, formatPercent, type Currency } from "@/lib/credit-engine";
import { getTranslator } from "@/lib/i18n";
import { isRouteLocale, localeConfig, type RouteLocale } from "@/lib/i18n/config";
import { ensureFonts } from "./fonts";
import { docT } from "./i18n";
import { signDocToken, accessUrl, qrDataUrl, type DocType } from "./token";
import { Anmeldeformular, Tilgungsplan, Vertrag, Einlagenzertifikat, type DocCtx, type ScheduleRow } from "./documents";

const DOC_LABEL: Record<DocType, string> = {
  anmeldeformular: "anmeldeformular",
  tilgungsplan: "tilgungsplan",
  vertrag: "vertrag",
  einlagenzertifikat: "einlagenzertifikat",
};

export async function generateDocument(reference: string, type: DocType): Promise<{
  buffer: Buffer;
  filename: string;
  sha256: string;
} | null> {
  ensureFonts();

  const app = await prisma.application.findUnique({
    where: { reference },
    include: { customer: true, financialProfile: true },
  });
  if (!app) return null;

  const company = await getCompanySettings();
  const c = app.customer;
  const locale: RouteLocale = isRouteLocale(c.locale) ? c.locale : "de";
  const bcp47 = localeConfig[locale].bcp47;
  const t = docT(locale);
  const siteT = getTranslator(locale);
  const currency = app.currency as Currency;
  const money = (n: number) => formatMoney(n, currency, bcp47);
  const dateFmt = (d: Date) => new Intl.DateTimeFormat(bcp47, { day: "2-digit", month: "2-digit", year: "numeric" }).format(d);

  // Calculation via the shared engine (clamped to the published product bounds).
  const catalog = await getPublishedCatalog();
  const product = catalog.find((p) => p.productType === app.productType);
  let amountF = money(app.amount), monthlyF = "—", rateF = "—", interestF = "—";
  let schedule: ScheduleRow[] = [];
  const startBase = parseDate(app.paymentStartDate) ?? new Date();

  if (product) {
    const principal = Math.min(Math.max(app.amount, product.minAmount), product.maxAmount);
    const term = Math.min(Math.max(app.termMonths, product.minTerm), product.maxTerm);
    if (validate({ principal, termMonths: term }, product).length === 0) {
      const r = calculate({ principal, termMonths: term }, product);
      amountF = money(r.principal);
      monthlyF = money(r.monthlyPayment);
      rateF = formatPercent(r.nominalRate, bcp47);
      interestF = money(r.totalInterest);
      schedule = r.schedule.map((row) => ({
        no: row.month,
        date: dateFmt(addMonths(startBase, row.month - 1)),
        paymentF: money(row.payment),
        principalF: money(row.principal),
        interestF: money(row.interest),
        balanceF: money(row.balance),
      }));
    }
  }

  const token = await signDocToken(reference, type);
  const url = accessUrl(token);
  const qr = await qrDataUrl(url);

  const ctx: DocCtx = {
    company,
    reference,
    date: dateFmt(new Date()),
    t,
    customer: {
      firstName: c.firstName, lastName: c.lastName, address: c.address ?? "", city: c.city ?? "",
      postal: c.postalCode ?? "", country: c.nationality ?? app.country, phone: c.phone ?? "",
      email: c.email, occupation: c.occupation ?? "", iban: app.iban ?? "",
      incomeF: app.financialProfile?.income != null ? money(app.financialProfile.income) : "",
    },
    loan: {
      amountF, term: String(app.termMonths), monthlyF, rateF, interestF,
      purpose: app.purpose ?? "", typeLabel: siteT(`home.solutions.${app.productType}Title`),
      startDate: dateFmt(startBase),
    },
    bank: { name: app.bankName ?? "", iban: app.iban ?? "", bic: app.bic ?? "" },
    schedule,
    qrDataUrl: qr,
    accessCaption: t("onlineAccess"),
    lender: { name: company.representative ?? "", title: "" },
  };

  const element =
    type === "anmeldeformular" ? <Anmeldeformular ctx={ctx} /> :
    type === "tilgungsplan" ? <Tilgungsplan ctx={ctx} /> :
    type === "vertrag" ? <Vertrag ctx={ctx} /> :
    <Einlagenzertifikat ctx={ctx} />;

  const buffer = await renderToBuffer(element);
  const sha256 = createHash("sha256").update(buffer).digest("hex");
  const filename = `${DOC_LABEL[type]}-${reference}.pdf`;
  return { buffer, filename, sha256 };
}

function parseDate(v: string | null): Date | null {
  if (!v) return null;
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? null : d;
}
function addMonths(d: Date, m: number): Date {
  const x = new Date(d);
  x.setMonth(x.getMonth() + m);
  return x;
}
