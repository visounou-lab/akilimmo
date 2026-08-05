import { NextResponse, type NextRequest } from "next/server";

import { getSessionUser } from "@/lib/auth/session";
import { can } from "@/lib/auth/rbac";
import { listApplications } from "@/lib/admin/queries";
import { STATUS_LABELS } from "@/lib/admin/status";
import { productLabel, countryLabel } from "@/lib/admin/labels";

export const dynamic = "force-dynamic";

function csvCell(value: string | number): string {
  const s = String(value ?? "");
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) {
    return NextResponse.json({ error: "Non authentifié" }, { status: 401 });
  }
  if (!can(user.role, "applications.export")) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const sp = request.nextUrl.searchParams;
  const rows = await listApplications({
    tab: sp.get("tab") ?? "all",
    q: sp.get("q") ?? "",
    country: sp.get("country") ?? "",
    product: sp.get("product") ?? "",
    sort: sp.get("sort") ?? "recent",
  });

  const headers = [
    "Référence",
    "Client",
    "Courriel",
    "Produit",
    "Pays",
    "Devise",
    "Montant",
    "Mensualité",
    "Statut",
    "Chargé·e",
    "Date",
  ];

  const lines = rows.map((a) =>
    [
      a.reference,
      `${a.firstName} ${a.lastName}`,
      a.email,
      productLabel(a.product),
      countryLabel(a.country),
      a.currency,
      a.amount,
      a.monthlyPayment,
      STATUS_LABELS[a.status],
      a.assignedTo?.name ?? "",
      a.createdAt.toISOString().slice(0, 10),
    ]
      .map(csvCell)
      .join(","),
  );

  // BOM for Excel + French accents.
  const body = "﻿" + [headers.map(csvCell).join(","), ...lines].join("\n");
  const stamp = new Date().toISOString().slice(0, 10);

  return new NextResponse(body, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="demandes-boreal-${stamp}.csv"`,
    },
  });
}
