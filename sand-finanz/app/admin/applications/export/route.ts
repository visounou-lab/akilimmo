import { NextResponse } from "next/server";
import type { ApplicationStatus, Prisma } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth/server";
import { can } from "@/lib/auth/rbac";
import { writeAudit } from "@/lib/audit";
import { ALL_STATUSES } from "@/lib/application-status";

function csvCell(v: unknown): string {
  const s = v == null ? "" : String(v);
  return /[",\n;]/.test(s) ? `"${s.replace(/"/g, '""')}"` : s;
}

export async function GET(request: Request) {
  const user = await getCurrentUser();
  if (!user || !can(user.role, "applications.view")) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const status = url.searchParams.get("status") ?? undefined;
  const q = url.searchParams.get("q") ?? undefined;

  const where: Prisma.ApplicationWhereInput = {};
  if (status && (ALL_STATUSES as string[]).includes(status)) where.status = status as ApplicationStatus;
  if (q && q.trim()) {
    const term = q.trim();
    where.OR = [
      { reference: { contains: term, mode: "insensitive" } },
      { customer: { is: { lastName: { contains: term, mode: "insensitive" } } } },
      { customer: { is: { email: { contains: term, mode: "insensitive" } } } },
    ];
  }

  const apps = await prisma.application.findMany({ where, orderBy: { createdAt: "desc" }, include: { customer: true } });

  const header = ["Referenz", "Vorname", "Nachname", "E-Mail", "Telefon", "Land", "Produkt", "Betrag", "Waehrung", "Laufzeit", "Status", "Erstellt"];
  const rows = apps.map((a) => [
    a.reference, a.customer.firstName, a.customer.lastName, a.customer.email, a.customer.phone ?? "",
    a.country, a.productType, a.amount, a.currency, a.termMonths, a.status, a.createdAt.toISOString(),
  ]);
  const csv = [header, ...rows].map((r) => r.map(csvCell).join(";")).join("\n");

  await writeAudit({ actorId: user.id, action: "applications.exported", entity: "Application", metadata: { count: apps.length } });

  return new NextResponse("﻿" + csv, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="antraege-${new Date().toISOString().slice(0, 10)}.csv"`,
    },
  });
}
