import { neon } from "@neondatabase/serverless";
import "dotenv/config";

const sql = neon(process.env.DATABASE_URL);

await sql`
  CREATE TABLE IF NOT EXISTS "DocumentRequest" (
    "id"          TEXT NOT NULL,
    "ownerId"     TEXT NOT NULL,
    "type"        TEXT NOT NULL,
    "status"      TEXT NOT NULL DEFAULT 'pending',
    "propertyId"  TEXT,
    "message"     TEXT,
    "createdAt"   TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deliveredAt" TIMESTAMP(3),
    CONSTRAINT "DocumentRequest_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "DocumentRequest_ownerId_fkey"
      FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "DocumentRequest_propertyId_fkey"
      FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE SET NULL ON UPDATE CASCADE
  )
`;

await sql`
  CREATE INDEX IF NOT EXISTS "DocumentRequest_ownerId_idx"
  ON "DocumentRequest"("ownerId")
`;

await sql`
  CREATE INDEX IF NOT EXISTS "DocumentRequest_status_idx"
  ON "DocumentRequest"("status")
`;

console.log("✓ Table DocumentRequest créée (ou déjà existante)");
