import "server-only";
import { prisma } from "@/lib/db";
import type { CompanySettings } from "@prisma/client";

/** Returns the singleton company settings, creating defaults on first access. */
export async function getCompanySettings(): Promise<CompanySettings> {
  return prisma.companySettings.upsert({
    where: { id: "default" },
    update: {},
    create: { id: "default", legalName: "SAND FINANZ GRUPPE" },
  });
}
