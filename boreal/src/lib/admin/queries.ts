import "server-only";
import type { ApplicationStatus, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";
import { tabToStatuses } from "./status";

export interface CurrencyBucket {
  currency: string;
  total: number;
  count: number;
}

export async function getDashboardData() {
  const [total, statusGroups, currencyGroups, productGroups, countryGroups, recent] =
    await Promise.all([
      prisma.application.count(),
      prisma.application.groupBy({ by: ["status"], _count: { _all: true } }),
      prisma.application.groupBy({
        by: ["currency"],
        _count: { _all: true },
        _sum: { amount: true },
      }),
      prisma.application.groupBy({ by: ["product"], _count: { _all: true } }),
      prisma.application.groupBy({ by: ["country"], _count: { _all: true } }),
      prisma.application.findMany({
        orderBy: { createdAt: "desc" },
        take: 8,
        select: {
          id: true,
          reference: true,
          firstName: true,
          lastName: true,
          amount: true,
          currency: true,
          status: true,
          createdAt: true,
        },
      }),
    ]);

  const statusCount = (s: ApplicationStatus) =>
    statusGroups.find((g) => g.status === s)?._count._all ?? 0;

  const pending = statusCount("SUBMITTED");
  const approved = statusCount("APPROVED");
  const rejected = statusCount("REJECTED");
  const decided = approved + rejected;

  const portfolio: CurrencyBucket[] = currencyGroups
    .map((g) => ({
      currency: g.currency,
      total: g._sum.amount ?? 0,
      count: g._count._all,
    }))
    .sort((a, b) => b.count - a.count);

  return {
    total,
    pending,
    approved,
    rejected,
    approvalRate: decided > 0 ? Math.round((approved / decided) * 100) : null,
    portfolio,
    byProduct: productGroups
      .map((g) => ({ key: g.product, count: g._count._all }))
      .sort((a, b) => b.count - a.count),
    byCountry: countryGroups
      .map((g) => ({ key: g.country, count: g._count._all }))
      .sort((a, b) => b.count - a.count),
    recent,
  };
}

export interface ListFilters {
  tab?: string;
  q?: string;
  country?: string;
  product?: string;
  sort?: string;
}

export async function listApplications(filters: ListFilters) {
  const statuses = tabToStatuses(filters.tab ?? "all");
  const where: Prisma.ApplicationWhereInput = {};

  if (statuses) where.status = { in: statuses };
  if (filters.country) where.country = filters.country;
  if (filters.product) where.product = filters.product;
  if (filters.q) {
    const q = filters.q.trim();
    where.OR = [
      { firstName: { contains: q, mode: "insensitive" } },
      { lastName: { contains: q, mode: "insensitive" } },
      { email: { contains: q, mode: "insensitive" } },
      { reference: { contains: q, mode: "insensitive" } },
    ];
  }

  const orderBy: Prisma.ApplicationOrderByWithRelationInput =
    filters.sort === "amount"
      ? { amount: "desc" }
      : filters.sort === "amount_asc"
        ? { amount: "asc" }
        : filters.sort === "oldest"
          ? { createdAt: "asc" }
          : { createdAt: "desc" };

  return prisma.application.findMany({
    where,
    orderBy,
    take: 200,
    select: {
      id: true,
      reference: true,
      firstName: true,
      lastName: true,
      email: true,
      amount: true,
      currency: true,
      monthlyPayment: true,
      product: true,
      country: true,
      status: true,
      createdAt: true,
      assignedTo: { select: { name: true } },
    },
  });
}

export async function countByTab(tabKey: string): Promise<number> {
  const statuses = tabToStatuses(tabKey);
  return prisma.application.count({
    where: statuses ? { status: { in: statuses } } : undefined,
  });
}
