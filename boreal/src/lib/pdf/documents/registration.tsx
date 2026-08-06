import { View, Text } from "@react-pdf/renderer";

import {
  Document,
  DraftPage,
  VerificationBlock,
  styles as base,
  fmtMoney,
  fmtDate,
} from "@/lib/pdf/chrome";
import type { DocProps } from "./schedule";

export function RegistrationDocument({
  payload,
  verifyUrl,
  fingerprint,
  qrDataUrl,
  generatedAt,
}: DocProps) {
  const { applicant, loan, reference, company } = payload;
  const fullName = [applicant.salutation, applicant.firstName, applicant.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <Document title={`Formulaire d'inscription ${reference}`}>
      <DraftPage company={company}>
        <Text style={base.h1}>Formulaire d&apos;inscription</Text>
        <Text style={base.meta}>
          Dossier {reference} · {fmtDate(generatedAt)}
        </Text>

        <Text style={base.sectionTitle}>Identité du demandeur</Text>
        <View style={base.grid}>
          <Item label="Nom complet" value={fullName || "—"} />
          <Item label="Date de naissance" value={applicant.birthDate} />
          <Item label="Nationalité" value={applicant.nationality} />
          <Item label="N° national" value={applicant.nationalId} />
          <Item label="Adresse" value={applicant.address} />
          <Item label="Téléphone" value={applicant.phone} />
          <Item label="Courriel" value={applicant.email} />
        </View>

        <Text style={base.sectionTitle}>Situation</Text>
        <View style={base.grid}>
          <Item label="Emploi / activité" value={applicant.occupation} />
          <Item
            label="Revenu net mensuel"
            value={fmtMoney(applicant.monthlyIncome, loan.currency)}
          />
          <Item label="Logement" value={applicant.housing} />
          <Item label="Crédits en cours" value={applicant.existingCredits} />
        </View>

        <Text style={base.sectionTitle}>Demande de financement</Text>
        <View style={base.grid}>
          <Item label="Produit" value={loan.productLabel} />
          <Item label="Pays" value={loan.countryLabel} />
          <Item label="Montant demandé" value={fmtMoney(loan.amount, loan.currency)} />
          <Item label="Durée" value={`${loan.months} mois`} />
          <Item label="Taux indicatif" value={`${loan.annualRate} %`} />
          <Item label="Mensualité estimée" value={fmtMoney(loan.monthlyPayment, loan.currency)} />
          <Item label="Objet" value={loan.purpose} />
        </View>

        <Text style={[base.meta, { marginTop: 12 }]}>
          Les informations ci-dessus reflètent la demande déposée par le client. Ce
          formulaire est un brouillon non contractuel et ne vaut pas acceptation.
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
