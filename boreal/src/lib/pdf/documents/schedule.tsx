import { View, Text, StyleSheet } from "@react-pdf/renderer";

import type { DocumentPayload } from "@/lib/documents";
import {
  Document,
  DraftPage,
  VerificationBlock,
  styles as base,
  fmtMoney,
  fmtDate,
  COLORS,
} from "@/lib/pdf/chrome";

const t = StyleSheet.create({
  th: {
    flexDirection: "row",
    backgroundColor: COLORS.navy,
    color: "#ffffff",
    paddingVertical: 4,
    paddingHorizontal: 4,
    fontSize: 8,
    fontFamily: "Helvetica-Bold",
  },
  tr: {
    flexDirection: "row",
    paddingVertical: 3,
    paddingHorizontal: 4,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.line,
    fontSize: 8,
  },
  cPeriod: { width: "12%" },
  cNum: { width: "22%", textAlign: "right" },
});

export interface DocProps {
  payload: DocumentPayload;
  verifyUrl: string;
  fingerprint: string;
  qrDataUrl: string;
  generatedAt: Date;
}

export function ScheduleDocument({
  payload,
  verifyUrl,
  fingerprint,
  qrDataUrl,
  generatedAt,
}: DocProps) {
  const { loan, applicant, reference, company } = payload;
  return (
    <Document title={`Tableau d'amortissement ${reference}`}>
      <DraftPage company={company}>
        <Text style={base.h1}>Tableau d&apos;amortissement</Text>
        <Text style={base.meta}>
          Dossier {reference} · {applicant.firstName} {applicant.lastName} ·{" "}
          {fmtDate(generatedAt)}
        </Text>

        <View style={base.grid}>
          <Item label="Produit" value={loan.productLabel} />
          <Item label="Montant" value={fmtMoney(loan.amount, loan.currency)} />
          <Item label="Durée" value={`${loan.months} mois`} />
          <Item label="Taux indicatif" value={`${loan.annualRate} %`} />
          <Item label="Mensualité" value={fmtMoney(loan.monthlyPayment, loan.currency)} />
          <Item label="Coût total du crédit" value={fmtMoney(loan.totalCost, loan.currency)} />
        </View>

        <Text style={base.sectionTitle}>Échéancier prévisionnel</Text>
        <View style={t.th}>
          <Text style={t.cPeriod}>Éch.</Text>
          <Text style={t.cNum}>Mensualité</Text>
          <Text style={t.cNum}>Capital</Text>
          <Text style={t.cNum}>Intérêts</Text>
          <Text style={t.cNum}>Solde</Text>
        </View>
        {payload.schedule.map((r) => (
          <View style={t.tr} key={r.period} wrap={false}>
            <Text style={t.cPeriod}>{r.period}</Text>
            <Text style={t.cNum}>{fmtMoney(r.payment, loan.currency)}</Text>
            <Text style={t.cNum}>{fmtMoney(r.principal, loan.currency)}</Text>
            <Text style={t.cNum}>{fmtMoney(r.interest, loan.currency)}</Text>
            <Text style={t.cNum}>{fmtMoney(r.balance, loan.currency)}</Text>
          </View>
        ))}

        <Text style={[base.meta, { marginTop: 10 }]}>
          Échéancier indicatif calculé sur un taux fixe. Aucune offre de crédit.
        </Text>

        <VerificationBlock
          verifyUrl={verifyUrl}
          fingerprint={fingerprint}
          qrDataUrl={qrDataUrl}
          generatedAt={generatedAt}
        />
      </DraftPage>
    </Document>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <View style={base.gridItem}>
      <Text style={base.gridLabel}>{label}</Text>
      <Text style={base.gridValue}>{value}</Text>
    </View>
  );
}
