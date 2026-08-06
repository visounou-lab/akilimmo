import {
  Document,
  Page,
  View,
  Text,
  Image,
  StyleSheet,
} from "@react-pdf/renderer";
import type { DocumentPayload } from "@/lib/documents";

export const COLORS = {
  navy: "#16293a",
  teal: "#2f6f7e",
  gold: "#a97e2b",
  gray: "#6b7280",
  line: "#e2e6ea",
  soft: "#f4f6f8",
  draft: "#c0362c",
};

export function fmtMoney(amount: number, currency: string): string {
  return new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function fmtDate(date: Date): string {
  return new Intl.DateTimeFormat("fr-CA", { dateStyle: "long" }).format(date);
}

export const styles = StyleSheet.create({
  page: {
    paddingTop: 90,
    paddingBottom: 96,
    paddingHorizontal: 48,
    fontSize: 9.5,
    fontFamily: "Helvetica",
    color: COLORS.navy,
    lineHeight: 1.5,
  },
  watermark: {
    position: "absolute",
    top: 320,
    left: 40,
    right: 40,
    textAlign: "center",
    color: COLORS.draft,
    opacity: 0.08,
    fontSize: 52,
    fontFamily: "Helvetica-Bold",
    transform: "rotate(-28deg)",
  },
  header: {
    position: "absolute",
    top: 30,
    left: 48,
    right: 48,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.line,
    paddingBottom: 10,
  },
  brand: { fontSize: 14, fontFamily: "Helvetica-Bold", color: COLORS.navy },
  brandSub: { fontSize: 8, color: COLORS.gray, marginTop: 2 },
  draftBadge: {
    color: COLORS.draft,
    borderWidth: 1,
    borderColor: COLORS.draft,
    borderRadius: 3,
    paddingVertical: 3,
    paddingHorizontal: 6,
    fontSize: 7.5,
    fontFamily: "Helvetica-Bold",
  },
  footer: {
    position: "absolute",
    bottom: 28,
    left: 48,
    right: 48,
    borderTopWidth: 1,
    borderTopColor: COLORS.line,
    paddingTop: 8,
    fontSize: 7,
    color: COLORS.gray,
  },
  h1: { fontSize: 17, fontFamily: "Helvetica-Bold", marginBottom: 2 },
  meta: { fontSize: 8.5, color: COLORS.gray, marginBottom: 16 },
  sectionTitle: {
    fontSize: 10.5,
    fontFamily: "Helvetica-Bold",
    color: COLORS.teal,
    marginTop: 14,
    marginBottom: 6,
    textTransform: "uppercase",
    letterSpacing: 0.5,
  },
  row: { flexDirection: "row", justifyContent: "space-between", paddingVertical: 2.5 },
  rowLabel: { color: COLORS.gray },
  rowValue: { fontFamily: "Helvetica-Bold" },
  grid: { flexDirection: "row", flexWrap: "wrap" },
  gridItem: { width: "50%", paddingVertical: 3, paddingRight: 10 },
  gridLabel: { fontSize: 7.5, color: COLORS.gray, textTransform: "uppercase" },
  gridValue: { fontSize: 10 },
  verify: {
    marginTop: 20,
    flexDirection: "row",
    gap: 12,
    borderWidth: 1,
    borderColor: COLORS.line,
    borderRadius: 5,
    padding: 10,
    backgroundColor: COLORS.soft,
  },
  qr: { width: 66, height: 66 },
  verifyTitle: { fontSize: 8.5, fontFamily: "Helvetica-Bold" },
  verifyText: { fontSize: 7.5, color: COLORS.gray, marginTop: 2 },
  mono: { fontFamily: "Courier", fontSize: 7 },
});

export function Watermark() {
  return (
    <Text style={styles.watermark} fixed>
      BROUILLON — NON CONTRACTUEL
    </Text>
  );
}

export function Header({ company }: { company: DocumentPayload["company"] }) {
  return (
    <View style={styles.header} fixed>
      <View>
        <Text style={styles.brand}>Boreal Finance Group</Text>
        <Text style={styles.brandSub}>{company.legalName}</Text>
      </View>
      <Text style={styles.draftBadge}>BROUILLON · NON CONTRACTUEL</Text>
    </View>
  );
}

export function Footer({ company }: { company: DocumentPayload["company"] }) {
  return (
    <View style={styles.footer} fixed>
      <Text>
        Document de démonstration — brouillon non contractuel. Ne constitue ni une
        offre de crédit, ni un engagement, ni une preuve de fonds.
      </Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 3 }}>
        <Text>
          {company.legalName} · {company.addressLine}
          {company.city ? `, ${company.postalCode} ${company.city}` : ""} ·{" "}
          {company.registerNumber}
        </Text>
        <Text render={({ pageNumber, totalPages }) => `Page ${pageNumber} / ${totalPages}`} />
      </View>
    </View>
  );
}

export function VerificationBlock({
  verifyUrl,
  fingerprint,
  qrDataUrl,
  generatedAt,
}: {
  verifyUrl: string;
  fingerprint: string;
  qrDataUrl: string;
  generatedAt: Date;
}) {
  return (
    <View style={styles.verify} wrap={false}>
      {/* eslint-disable-next-line jsx-a11y/alt-text */}
      <Image style={styles.qr} src={qrDataUrl} />
      <View style={{ flex: 1 }}>
        <Text style={styles.verifyTitle}>Vérification du document</Text>
        <Text style={styles.verifyText}>
          Ce brouillon est vérifiable en ligne. Scannez le code ou visitez :
        </Text>
        <Text style={[styles.mono, { marginTop: 2, color: COLORS.teal }]}>{verifyUrl}</Text>
        <Text style={[styles.verifyText, { marginTop: 4 }]}>
          Généré le {fmtDate(generatedAt)} · Empreinte SHA-256 :
        </Text>
        <Text style={styles.mono}>{fingerprint}</Text>
      </View>
    </View>
  );
}

export function DraftPage({
  company,
  children,
}: {
  company: DocumentPayload["company"];
  children: React.ReactNode;
}) {
  return (
    <Page size="A4" style={styles.page}>
      <Watermark />
      <Header company={company} />
      {children}
      <Footer company={company} />
    </Page>
  );
}

export { Document };
