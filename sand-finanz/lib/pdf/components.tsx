import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { CompanySettings } from "@prisma/client";

const NAVY = "#18305F";
const CTA = "#2666EB";
const MUTED = "#55617a";
const BORDER = "#dfe3ec";

export const s = StyleSheet.create({
  page: { fontFamily: "SansUnicode", fontSize: 10, color: "#111827", paddingTop: 44, paddingBottom: 60, paddingHorizontal: 46, lineHeight: 1.45 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  mark: { width: 24, height: 24, borderRadius: 5, backgroundColor: CTA, color: "#fff", fontSize: 11, fontWeight: 700, textAlign: "center", paddingTop: 5 },
  brandName: { fontSize: 13, fontWeight: 700, color: NAVY },
  companyMeta: { fontSize: 8.5, color: MUTED, marginTop: 3 },
  headerRight: { textAlign: "right" },
  headerRef: { fontSize: 10.5, fontWeight: 700, color: NAVY },
  headerDate: { fontSize: 8.5, color: MUTED, marginTop: 2 },
  rule: { borderBottomWidth: 1, borderBottomColor: NAVY, marginTop: 10, marginBottom: 16 },
  title: { fontSize: 17, fontWeight: 700, color: NAVY, textAlign: "center", marginBottom: 5 },
  subtitle: { fontSize: 10, color: MUTED, textAlign: "center", marginBottom: 14 },
  band: { backgroundColor: NAVY, color: "#fff", fontSize: 10, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 9, marginTop: 16, marginBottom: 10 },
  bandGreen: { backgroundColor: "#15803d", color: "#fff", fontSize: 10, fontWeight: 700, paddingVertical: 6, paddingHorizontal: 9, marginTop: 16, marginBottom: 10 },
  kvGrid: { flexDirection: "row", flexWrap: "wrap" },
  kv: { width: "50%", marginBottom: 11, paddingRight: 12 },
  kvFull: { width: "100%", marginBottom: 11 },
  kvLabel: { fontSize: 8.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", marginBottom: 3 },
  kvValue: { fontSize: 11, borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 4, minHeight: 15 },
  footer: { position: "absolute", bottom: 26, left: 46, right: 46, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 7, flexDirection: "row", justifyContent: "space-between", fontSize: 8, color: MUTED },
  checkItem: { flexDirection: "row", alignItems: "flex-start", marginBottom: 8 },
  checkBox: { width: 12, height: 12, borderWidth: 1, borderColor: NAVY, marginRight: 8, marginTop: 1 },
  bullet: { flexDirection: "row", marginBottom: 6 },
  stampWrap: { width: 128, height: 128, borderRadius: 64, borderWidth: 2, borderColor: NAVY, alignItems: "center", justifyContent: "center", padding: 12 },
  stampInner: { borderWidth: 1, borderColor: NAVY, borderRadius: 54, width: 104, height: 104, alignItems: "center", justifyContent: "center", padding: 8 },
  stampName: { fontSize: 8.5, fontWeight: 700, color: NAVY, textAlign: "center" },
  stampMeta: { fontSize: 6.5, color: NAVY, textAlign: "center", marginTop: 3 },
  sigLine: { borderTopWidth: 1, borderTopColor: "#111827", marginTop: 44, paddingTop: 5 },
  sigName: { fontSize: 10.5, fontWeight: 700 },
  sigRole: { fontSize: 8.5, color: MUTED, marginTop: 1 },
  qrImg: { width: 74, height: 74 },
  barcodeImg: { width: 150, height: 40 },
});

export function DocHeader({ company, reference, date }: { company: CompanySettings; reference: string; date: string }) {
  return (
    <View>
      <View style={s.headerRow}>
        <View>
          <View style={s.brandRow}>
            <Text style={s.mark}>SF</Text>
            <Text style={s.brandName}>{company.legalName}</Text>
          </View>
          {company.address ? <Text style={s.companyMeta}>{company.address}</Text> : null}
          {company.email ? <Text style={s.companyMeta}>{company.email}</Text> : null}
        </View>
        <View style={s.headerRight}>
          <Text style={s.headerRef}>Dossier #{reference}</Text>
          <Text style={s.headerDate}>{date}</Text>
        </View>
      </View>
      <View style={s.rule} />
    </View>
  );
}

export function DocFooter({ company }: { company: CompanySettings }) {
  return (
    <View style={s.footer} fixed>
      <Text>{company.legalName}{company.address ? ` · ${company.address}` : ""}</Text>
      <Text render={({ pageNumber, totalPages }) => `${pageNumber}/${totalPages}`} />
    </View>
  );
}

export function Band({ children, green }: { children: React.ReactNode; green?: boolean }) {
  return <Text style={green ? s.bandGreen : s.band}>{children}</Text>;
}

export function KV({ label, value, full }: { label: string; value?: string | null; full?: boolean }) {
  return (
    <View style={full ? s.kvFull : s.kv}>
      <Text style={s.kvLabel}>{label}</Text>
      <Text style={s.kvValue}>{value || " "}</Text>
    </View>
  );
}

export function CheckItem({ text }: { text: string }) {
  return (
    <View style={s.checkItem}>
      <View style={s.checkBox} />
      <Text style={{ flex: 1 }}>{text}</Text>
    </View>
  );
}

export function Bullet({ text }: { text: string }) {
  return (
    <View style={s.bullet}>
      <Text style={{ width: 12 }}>–</Text>
      <Text style={{ flex: 1 }}>{text}</Text>
    </View>
  );
}

/** Company seal (cachet) generated from the settings — the company's own stamp. */
export function Stamp({ company }: { company: CompanySettings }) {
  return (
    <View style={s.stampWrap}>
      <View style={s.stampInner}>
        <Text style={s.stampName}>{company.legalName.toUpperCase()}</Text>
        {company.address ? <Text style={s.stampMeta}>{company.address}</Text> : null}
        {company.email ? <Text style={s.stampMeta}>{company.email}</Text> : null}
      </View>
    </View>
  );
}

export function QrBlock({ dataUrl, caption }: { dataUrl: string; caption: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image style={s.qrImg} src={dataUrl} />
      <Text style={{ fontSize: 6.5, color: MUTED, marginTop: 2, maxWidth: 86, textAlign: "center" }}>{caption}</Text>
    </View>
  );
}

export function BarcodeBlock({ dataUrl, reference, company }: { dataUrl: string; reference: string; company: CompanySettings }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image style={s.barcodeImg} src={dataUrl} />
      <Text style={{ fontSize: 8, color: "#111827", marginTop: 2 }}>N° {reference}</Text>
      <Text style={{ fontSize: 7, color: MUTED }}>{company.legalName}</Text>
    </View>
  );
}

/** Signature lines (both parties) + company stamp + online-access QR + barcode. */
export function SignatureBlock({
  company, borrowerName, borrowerRole, borrowerNote, lenderName, lenderTitle, place,
  qrDataUrl, barcodeDataUrl, reference, qrCaption,
}: {
  company: CompanySettings; borrowerName: string; borrowerRole: string; borrowerNote?: string;
  lenderName: string; lenderTitle: string; place: string;
  qrDataUrl: string; barcodeDataUrl: string; reference: string; qrCaption: string;
}) {
  return (
    <View wrap={false} style={{ marginTop: 22 }}>
      <Text style={{ fontSize: 9.5 }}>{place}</Text>
      <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 6 }}>
        <View style={{ width: "45%" }}>
          <View style={s.sigLine}>
            <Text style={s.sigName}>{borrowerName}</Text>
            <Text style={s.sigRole}>{borrowerRole}</Text>
            {borrowerNote ? <Text style={s.sigRole}>{borrowerNote}</Text> : null}
          </View>
        </View>
        <View style={{ width: "45%" }}>
          <View style={s.sigLine}>
            <Text style={s.sigName}>{lenderName || company.legalName}</Text>
            {lenderTitle ? <Text style={s.sigRole}>{lenderTitle}</Text> : null}
            <Text style={s.sigRole}>{company.legalName}</Text>
          </View>
        </View>
      </View>
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "flex-end", marginTop: 20 }}>
        <Stamp company={company} />
        <QrBlock dataUrl={qrDataUrl} caption={qrCaption} />
        <BarcodeBlock dataUrl={barcodeDataUrl} reference={reference} company={company} />
      </View>
    </View>
  );
}
