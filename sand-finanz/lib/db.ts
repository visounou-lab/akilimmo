import { PrismaClient } from "@prisma/client";

// Lazily instantiate a single PrismaClient. Using a Proxy means that merely
// importing this module never constructs the client — only the first actual
// query does. Routes/pages that don't touch the DB (e.g. the login screen)
// therefore never trigger any Prisma initialisation, so a DB/engine problem
// can't crash a page that doesn't query.
const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient };

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = new PrismaClient({
      log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    });
  }
  return globalForPrisma.prisma;
}

export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getClient();
    const value = Reflect.get(client as object, prop, receiver);
    return typeof value === "function" ? value.bind(client) : value;
  },
});
