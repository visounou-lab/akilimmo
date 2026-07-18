import React from "react";
import { View, Text, Image, StyleSheet } from "@react-pdf/renderer";
import type { CompanySettings } from "@prisma/client";

const NAVY = "#18305F";
const CTA = "#2666EB";
const MUTED = "#55617a";
const BORDER = "#dfe3ec";

export const s = StyleSheet.create({
  page: { fontFamily: "SansUnicode", fontSize: 9, color: "#111827", paddingTop: 42, paddingBottom: 56, paddingHorizontal: 42, lineHeight: 1.4 },
  headerRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "flex-start" },
  brandRow: { flexDirection: "row", alignItems: "center", gap: 6 },
  mark: { width: 22, height: 22, borderRadius: 5, backgroundColor: CTA, color: "#fff", fontSize: 10, fontWeight: 700, textAlign: "center", paddingTop: 5 },
  brandName: { fontSize: 12, fontWeight: 700, color: NAVY },
  companyMeta: { fontSize: 8, color: MUTED, marginTop: 4 },
  headerRight: { textAlign: "right" },
  headerRef: { fontSize: 10, fontWeight: 700, color: NAVY },
  headerDate: { fontSize: 8, color: MUTED, marginTop: 2 },
  rule: { borderBottomWidth: 1, borderBottomColor: NAVY, marginTop: 8, marginBottom: 14 },
  title: { fontSize: 15, fontWeight: 700, color: NAVY, textAlign: "center", marginBottom: 4 },
  subtitle: { fontSize: 9, color: MUTED, textAlign: "center", marginBottom: 12 },
  band: { backgroundColor: NAVY, color: "#fff", fontSize: 9, fontWeight: 700, paddingVertical: 5, paddingHorizontal: 8, marginTop: 12, marginBottom: 8 },
  kvGrid: { flexDirection: "row", flexWrap: "wrap" },
  kv: { width: "50%", marginBottom: 9, paddingRight: 10 },
  kvFull: { width: "100%", marginBottom: 9 },
  kvLabel: { fontSize: 7.5, color: MUTED, fontWeight: 700, textTransform: "uppercase", marginBottom: 2 },
  kvValue: { fontSize: 9.5, borderBottomWidth: 1, borderBottomColor: BORDER, paddingBottom: 3, minHeight: 12 },
  footer: { position: "absolute", bottom: 24, left: 42, right: 42, borderTopWidth: 1, borderTopColor: BORDER, paddingTop: 6, flexDirection: "row", justifyContent: "space-between", fontSize: 7.5, color: MUTED },
  stampWrap: { width: 130, height: 130, borderRadius: 65, borderWidth: 2, borderColor: NAVY, alignItems: "center", justifyContent: "center", padding: 12 },
  stampInner: { borderWidth: 1, borderColor: NAVY, borderRadius: 55, width: 106, height: 106, alignItems: "center", justifyContent: "center", padding: 8 },
  stampName: { fontSize: 8.5, fontWeight: 700, color: NAVY, textAlign: "center" },
  stampMeta: { fontSize: 6.5, color: NAVY, textAlign: "center", marginTop: 3 },
  sigLine: { borderTopWidth: 1, borderTopColor: "#111827", marginTop: 40, paddingTop: 4 },
  sigName: { fontSize: 9.5, fontWeight: 700 },
  sigRole: { fontSize: 8, color: MUTED, marginTop: 1 },
  qrImg: { width: 78, height: 78 },
  qrCaption: { fontSize: 7, color: MUTED, marginTop: 3, maxWidth: 120 },
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

export function Band({ children }: { children: React.ReactNode }) {
  return <Text style={s.band}>{children}</Text>;
}

export function KV({ label, value, full }: { label: string; value?: string | null; full?: boolean }) {
  return (
    <View style={full ? s.kvFull : s.kv}>
      <Text style={s.kvLabel}>{label}</Text>
      <Text style={s.kvValue}>{value || " "}</Text>
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

export function QrBlock({ dataUrl, reference, caption }: { dataUrl: string; reference: string; caption: string }) {
  return (
    <View style={{ alignItems: "center" }}>
      <Image style={s.qrImg} src={dataUrl} />
      <Text style={{ fontSize: 7.5, color: MUTED, marginTop: 3 }}>N° {reference}</Text>
      <Text style={s.qrCaption}>{caption}</Text>
    </View>
  );
}
