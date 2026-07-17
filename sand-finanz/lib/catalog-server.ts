import "server-only";
import { prisma } from "@/lib/db";
import { PLACEHOLDER_CATALOG } from "@/lib/credit-engine/catalog";
import type { CreditProductVersion } from "@/lib/credit-engine";

/**
 * The published credit catalogue used by BOTH the public calculator and the
 * admin/offer engine — a single source of truth. Reads the latest PUBLISHED
 * version per product key from the database; falls back to the static
 * placeholder catalogue when the DB is empty or unreachable, so the public
 * site keeps working before/without a provisioned database.
 */
export async function getPublishedCatalog(): Promise<CreditProductVersion[]> {
  try {
    const rows = await prisma.creditProductVersion.findMany({
      where: { status: "PUBLISHED" },
      orderBy: [{ key: "asc" }, { version: "desc" }],
    });
    if (rows.length === 0) return PLACEHOLDER_CATALOG;

    // Keep only the highest version per key.
    const latest = new Map<string, (typeof rows)[number]>();
    for (const r of rows) if (!latest.has(r.key)) latest.set(r.key, r);

    return Array.from(latest.values()).map((v) => ({
      id: v.id,
      version: v.version,
      country: v.country,
      productType: v.productType,
      currency: v.currency,
      minAmount: v.minAmount,
      maxAmount: v.maxAmount,
      minTerm: v.minTerm,
      maxTerm: v.maxTerm,
      nominalRate: v.nominalRate,
      effectiveRate: v.effectiveRate ?? undefined,
      originationFee:
        v.originationFeeType && v.originationFeeValue != null
          ? { type: v.originationFeeType, value: v.originationFeeValue }
          : null,
      rounding: { unit: v.roundingUnit, mode: v.roundingMode },
      activeFrom: v.activeFrom,
      activeTo: v.activeTo,
      disclaimerKey: v.disclaimerKey,
    }));
  } catch (err) {
    console.error("[catalog] DB read failed, using placeholder catalogue", err);
    return PLACEHOLDER_CATALOG;
  }
}
