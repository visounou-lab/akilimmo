CREATE TABLE "ListingReport" (
  "id" TEXT NOT NULL,
  "propertyId" TEXT NOT NULL,
  "reporterId" TEXT,
  "reporterEmail" TEXT,
  "reason" TEXT NOT NULL,
  "details" TEXT,
  "status" TEXT NOT NULL DEFAULT 'OPEN',
  "priority" TEXT NOT NULL DEFAULT 'NORMAL',
  "sourceHash" TEXT,
  "reviewedById" TEXT,
  "reviewedAt" TIMESTAMP(3),
  "resolution" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "ListingReport_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ListingReport_propertyId_status_idx" ON "ListingReport"("propertyId", "status");
CREATE INDEX "ListingReport_status_createdAt_idx" ON "ListingReport"("status", "createdAt");
CREATE INDEX "ListingReport_sourceHash_createdAt_idx" ON "ListingReport"("sourceHash", "createdAt");

ALTER TABLE "ListingReport"
ADD CONSTRAINT "ListingReport_propertyId_fkey"
FOREIGN KEY ("propertyId") REFERENCES "Property"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "ListingReport"
ADD CONSTRAINT "ListingReport_reporterId_fkey"
FOREIGN KEY ("reporterId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "ListingReport"
ADD CONSTRAINT "ListingReport_reviewedById_fkey"
FOREIGN KEY ("reviewedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
