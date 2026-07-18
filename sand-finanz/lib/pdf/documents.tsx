import React from "react";
import { Document, Page, View, Text } from "@react-pdf/renderer";
import type { CompanySettings } from "@prisma/client";
import { s, DocHeader, DocFooter, Band, KV, Stamp, QrBlock, BarcodeBlock, CheckItem, Bullet, SignatureBlock } from "./components";

export interface ScheduleRow {
  no: number; date: string; paymentF: string; principalF: string; interestF: string; balanceF: string;
}

export interface DocCtx {
  company: CompanySettings;
  reference: string;
  date: string;
  t: (key: string, vars?: Record<string, string>) => string;
  customer: {
    firstName: string; lastName: string; address: string; city: string; postal: string;
    country: string; phone: string; email: string; occupation: string; incomeF: string; iban: string;
  };
  loan: { amountF: string; term: string; monthlyF: string; rateF: string; interestF: string; purpose: string; typeLabel: string; startDate: string };
  bank: { name: string; iban: string; bic: string };
  schedule: ScheduleRow[];
  qrDataUrl: string;
  barcodeDataUrl: string;
  accessCaption: string;
  placeLine: string;
  lender: { name: string; title: string };
}

const NAVY = "#18305F";
const GREEN = "#15803d";

function sigProps(ctx: DocCtx, borrowerRole: string) {
  return {
    company: ctx.company,
    borrowerName: `${ctx.customer.firstName} ${ctx.customer.lastName}`,
    borrowerRole,
    borrowerNote: ctx.t("readApproved"),
    lenderName: ctx.lender.name,
    lenderTitle: ctx.lender.title,
    place: ctx.placeLine,
    qrDataUrl: ctx.qrDataUrl,
    barcodeDataUrl: ctx.barcodeDataUrl,
    reference: ctx.reference,
    qrCaption: ctx.accessCaption,
  };
}

/* ---------------------------------------------------------------- Anmeldeformular */
export function Anmeldeformular({ ctx }: { ctx: DocCtx }) {
  const t = ctx.t, c = ctx.customer;
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <DocHeader company={ctx.company} reference={ctx.reference} date={ctx.date} />
        <Text style={s.title}>{t("reg_title")}</Text>
        <Text style={s.subtitle}>{t("reg_intro")}</Text>

        <Band>{t("reg_s1")}</Band>
        <View style={s.kvGrid}>
          <KV label={t("reg_lastName")} value={c.lastName} />
          <KV label={t("reg_firstName")} value={c.firstName} />
          <KV label={t("reg_address")} value={c.address} full />
          <KV label={t("reg_city")} value={c.city} />
          <KV label={t("reg_postal")} value={c.postal} />
          <KV label={t("reg_country")} value={c.country} />
          <KV label={t("reg_phone")} value={c.phone} />
          <KV label={t("reg_email")} value={c.email} />
          <KV label={t("reg_occupation")} value={c.occupation} />
          <KV label={t("reg_income")} value={c.incomeF} />
          <KV label={t("reg_iban")} value={c.iban} full />
        </View>

        <Band>{t("reg_s2")}</Band>
        <View style={s.kvGrid}>
          <KV label={t("reg_amount")} value={ctx.loan.amountF} />
          <KV label={t("reg_term")} value={`${ctx.loan.term} ${t("months")}`} />
          <KV label={t("reg_monthly")} value={ctx.loan.monthlyF} />
          <KV label={t("reg_rate")} value={ctx.loan.rateF} />
          <KV label={t("reg_purpose")} value={ctx.loan.purpose} full />
        </View>

        {/* Page 2 */}
        <View break>
          <Band>{t("reg_s3")}</Band>
          <CheckItem text={t("reg_doc1")} />
          <CheckItem text={t("reg_doc2")} />
          <CheckItem text={t("reg_doc3")} />

          <Band>{t("reg_s4")}</Band>
          <Bullet text={t("reg_cond1")} />
          <Bullet text={t("reg_cond2")} />
          <Bullet text={t("reg_cond3")} />

          <Text style={{ marginTop: 18, fontSize: 9.5, color: "#55617a" }}>{t("reg_thanks")}</Text>

          <SignatureBlock {...sigProps(ctx, t("reg_applicant"))} />
        </View>

        <DocFooter company={ctx.company} />
      </Page>
    </Document>
  );
}

/* ---------------------------------------------------------------- Tilgungsplan */
export function Tilgungsplan({ ctx }: { ctx: DocCtx }) {
  const t = ctx.t;
  const cell = { paddingVertical: 3.5, paddingHorizontal: 4 };
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <DocHeader company={ctx.company} reference={ctx.reference} date={ctx.date} />
        <Text style={s.title}>{t("amort_title")}</Text>
        <Text style={s.subtitle}>{ctx.customer.firstName} {ctx.customer.lastName}</Text>

        <View style={{ flexDirection: "row", backgroundColor: NAVY, color: "#fff", borderRadius: 4, padding: 9, marginBottom: 12 }}>
          {[
            [t("amort_amount"), ctx.loan.amountF],
            [t("amort_rate"), ctx.loan.rateF],
            [t("amort_term"), `${ctx.loan.term} ${t("months")}`],
            [t("amort_monthly"), ctx.loan.monthlyF],
            [t("amort_start"), ctx.loan.startDate],
          ].map(([label, val], i) => (
            <View key={i} style={{ flex: 1 }}>
              <Text style={{ fontSize: 7.5, opacity: 0.85 }}>{label}</Text>
              <Text style={{ fontSize: 9.5, fontWeight: 700, marginTop: 2 }}>{val}</Text>
            </View>
          ))}
        </View>

        <View fixed style={{ flexDirection: "row", backgroundColor: "#eef3fc", color: NAVY, fontWeight: 700, fontSize: 8.5 }}>
          <Text style={{ ...cell, width: "8%" }}>{t("amort_no")}</Text>
          <Text style={{ ...cell, width: "20%" }}>{t("amort_date")}</Text>
          <Text style={{ ...cell, width: "20%", textAlign: "right" }}>{t("amort_payment")}</Text>
          <Text style={{ ...cell, width: "18%", textAlign: "right" }}>{t("amort_principal")}</Text>
          <Text style={{ ...cell, width: "16%", textAlign: "right" }}>{t("amort_interest")}</Text>
          <Text style={{ ...cell, width: "18%", textAlign: "right" }}>{t("amort_balance")}</Text>
        </View>
        {ctx.schedule.map((r) => (
          <View key={r.no} style={{ flexDirection: "row", fontSize: 8.5, borderBottomWidth: 0.5, borderBottomColor: "#eef1f6" }}>
            <Text style={{ ...cell, width: "8%" }}>{r.no}</Text>
            <Text style={{ ...cell, width: "20%" }}>{r.date}</Text>
            <Text style={{ ...cell, width: "20%", textAlign: "right" }}>{r.paymentF}</Text>
            <Text style={{ ...cell, width: "18%", textAlign: "right", color: GREEN }}>{r.principalF}</Text>
            <Text style={{ ...cell, width: "16%", textAlign: "right", color: "#b45309" }}>{r.interestF}</Text>
            <Text style={{ ...cell, width: "18%", textAlign: "right" }}>{r.balanceF}</Text>
          </View>
        ))}

        <DocFooter company={ctx.company} />
      </Page>
    </Document>
  );
}

/* ---------------------------------------------------------------- Vertrag (contract) */
export function Vertrag({ ctx }: { ctx: DocCtx }) {
  const t = ctx.t, co = ctx.company, c = ctx.customer;
  const article = (title: string, ...paras: React.ReactNode[]) => (
    <View style={{ marginTop: 14 }} wrap={false}>
      <Text style={{ fontSize: 11, fontWeight: 700, color: NAVY, marginBottom: 5 }}>{title}</Text>
      {paras.map((p, i) => <Text key={i} style={{ marginBottom: 5 }}>{p}</Text>)}
    </View>
  );
  const bankBox = (rows: Array<[string, string]>) => (
    <View style={{ backgroundColor: "#f6f8fc", borderLeftWidth: 3, borderLeftColor: NAVY, padding: 9, marginTop: 5 }}>
      {rows.map(([k, v], i) => (
        <View key={i} style={{ flexDirection: "row", marginBottom: 3 }}>
          <Text style={{ width: "35%", color: "#55617a" }}>{k}</Text>
          <Text style={{ width: "65%", fontWeight: 700 }}>{v || "—"}</Text>
        </View>
      ))}
    </View>
  );

  return (
    <Document>
      <Page size="A4" style={s.page}>
        <DocHeader company={co} reference={ctx.reference} date={ctx.date} />
        <View style={{ borderWidth: 1.5, borderColor: NAVY, borderRadius: 6, paddingVertical: 9, marginBottom: 14, marginTop: 4 }}>
          <Text style={{ fontSize: 14, fontWeight: 700, color: NAVY, textAlign: "center" }}>{t("contract_title")}</Text>
        </View>

        <Text style={{ fontSize: 11, fontWeight: 700, color: NAVY, borderBottomWidth: 1, borderBottomColor: NAVY, paddingBottom: 4 }}>{t("contract_party1")}</Text>
        <View style={{ marginTop: 6, marginBottom: 4 }}>
          <Row k={co.legalName} v="" bold />
          <Row k={t("contract_seat")} v={co.address ?? "—"} />
          <Row k="E-Mail" v={co.email ?? "—"} />
          <Row k={t("contract_representedBy")} v={ctx.lender.name || "—"} />
        </View>
        <Text style={{ color: "#55617a" }}>{t("contract_p1role")}</Text>

        <Text style={{ marginTop: 14, fontSize: 11, fontWeight: 700, color: NAVY, borderBottomWidth: 1, borderBottomColor: NAVY, paddingBottom: 4 }}>{t("contract_party2")}</Text>
        <View style={{ marginTop: 6, marginBottom: 4 }}>
          <Row k={`${c.firstName} ${c.lastName}`} v="" bold />
          <Row k={t("reg_address")} v={c.address || "—"} />
          <Row k={t("reg_phone")} v={c.phone || "—"} />
          <Row k="E-Mail" v={c.email || "—"} />
          <Row k={t("contract_type")} v={ctx.loan.typeLabel} />
        </View>
        <Text style={{ color: "#55617a" }}>{t("contract_p2role")}</Text>
        <Text style={{ marginTop: 8 }}>{t("contract_intro")}</Text>

        {article(t("art1_title"), t("art1_1", { amount: ctx.loan.amountF, term: ctx.loan.term }), t("art1_2"))}
        {bankBox([[t("reg_iban"), ctx.bank.iban], ["BIC/SWIFT", ctx.bank.bic], [t("contract_bank"), ctx.bank.name]])}

        {article(t("art2_title"), t("art2_1"), t("art2_2", { monthly: ctx.loan.monthlyF, start: ctx.loan.startDate }))}
        {bankBox([[t("contract_holder"), co.legalName], [t("contract_bank"), co.bankName ?? "—"], ["IBAN", co.iban ?? "—"], ["BIC/SWIFT", co.bic ?? "—"]])}

        {article(t("art3_title"), t("art3_1", { rate: ctx.loan.rateF, interest: ctx.loan.interestF }))}
        {article(t("art4_title"), t("art4_1"))}
        {article(t("art5_title"), t("art5_1"), t("art5_2"), t("art5_3"))}

        <Text style={{ marginTop: 12 }}>{t("contract_declaration")}</Text>

        <SignatureBlock {...sigProps(ctx, t("borrower"))} />
        <DocFooter company={co} />
      </Page>
    </Document>
  );
}

/* ---------------------------------------------------------------- Einlagenzertifikat */
export function Einlagenzertifikat({ ctx }: { ctx: DocCtx }) {
  const t = ctx.t, co = ctx.company, c = ctx.customer;
  const year = new Date().getFullYear();
  const greenRow = (k: string, v: string) => (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <Text style={{ width: "38%", color: "#3f6b4e" }}>{k}</Text>
      <Text style={{ width: "62%", fontWeight: 700 }}>{v || "—"}</Text>
    </View>
  );
  return (
    <Document>
      <Page size="A4" style={s.page}>
        <DocHeader company={co} reference={ctx.reference} date={ctx.date} />
        <Text style={{ ...s.title, color: NAVY }}>{t("cert_title")}</Text>
        <Text style={{ ...s.subtitle }}>{t("cert_subref")}: CERT-{ctx.reference}-{year}</Text>

        {/* green summary band */}
        <View style={{ flexDirection: "row", backgroundColor: GREEN, color: "#fff", borderRadius: 4, padding: 10, marginBottom: 14 }}>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 7.5, opacity: 0.9 }}>{t("cert_amount")}</Text><Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{ctx.loan.amountF}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 7.5, opacity: 0.9 }}>{t("cert_beneficiary")}</Text><Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{c.firstName} {c.lastName}</Text></View>
          <View style={{ flex: 1 }}><Text style={{ fontSize: 7.5, opacity: 0.9 }}>{t("cert_reference")}</Text><Text style={{ fontSize: 11, fontWeight: 700, marginTop: 2 }}>{ctx.reference}</Text></View>
        </View>

        {/* two parties */}
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 8.5, color: "#55617a", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{t("cert_senderLabel")}</Text>
            <Text style={{ fontWeight: 700 }}>{co.legalName}</Text>
            {co.address ? <Text style={{ color: "#55617a" }}>{co.address}</Text> : null}
            {co.email ? <Text style={{ color: "#55617a" }}>{co.email}</Text> : null}
          </View>
          <View style={{ width: "48%" }}>
            <Text style={{ fontSize: 8.5, color: "#55617a", fontWeight: 700, textTransform: "uppercase", marginBottom: 3 }}>{t("cert_beneficiaryLabel")}</Text>
            <Text style={{ fontWeight: 700 }}>{c.firstName} {c.lastName}</Text>
            {c.address ? <Text style={{ color: "#55617a" }}>{c.address}</Text> : null}
            {c.email ? <Text style={{ color: "#55617a" }}>{c.email}</Text> : null}
            {c.phone ? <Text style={{ color: "#55617a" }}>{c.phone}</Text> : null}
          </View>
        </View>

        <View style={{ borderBottomWidth: 1, borderBottomColor: "#dfe3ec", marginVertical: 12 }} />

        <Text>{t("cert_senderInfo", { company: co.legalName })}</Text>
        <Text style={{ fontSize: 16, fontWeight: 700, color: GREEN, textAlign: "center", marginVertical: 8 }}>{ctx.loan.amountF}</Text>
        <Text>{t("cert_sentTo")}</Text>

        <View style={{ backgroundColor: "#eefaf1", borderWidth: 1, borderColor: "#bfe4cd", borderRadius: 4, padding: 10, marginTop: 8 }}>
          {greenRow(t("cert_holder"), `${c.firstName} ${c.lastName}`)}
          {greenRow(t("cert_bank"), ctx.bank.name)}
          {greenRow(t("cert_iban"), ctx.bank.iban)}
          {greenRow(t("cert_bic"), ctx.bank.bic)}
          {greenRow(t("cert_country"), c.country)}
        </View>

        <Text style={{ marginTop: 10 }}>{t("cert_confirm", { company: co.legalName, amount: ctx.loan.amountF })}</Text>
        <Text style={{ marginTop: 8, fontSize: 8.5, color: "#55617a" }}>{t("cert_stampNote")}</Text>

        <SignatureBlock {...sigProps(ctx, t("cert_beneficiary"))} />
        <DocFooter company={co} />
      </Page>
    </Document>
  );
}

function Row({ k, v, bold }: { k: string; v: string; bold?: boolean }) {
  return (
    <View style={{ flexDirection: "row", marginBottom: 3 }}>
      <Text style={{ width: "35%", fontWeight: bold ? 700 : 400, color: bold ? "#111827" : "#55617a" }}>{k}</Text>
      <Text style={{ width: "65%" }}>{v}</Text>
    </View>
  );
}
