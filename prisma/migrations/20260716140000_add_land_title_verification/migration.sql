-- CreateEnum
CREATE TYPE "LandTitleVerification" AS ENUM ('UNVERIFIED', 'PENDING', 'VERIFIED', 'REJECTED');

-- CreateEnum
CREATE TYPE "LandDocumentType" AS ENUM ('TITLE_DEED', 'SURVEY_PLAN', 'SALE_AGREEMENT', 'OWNER_ID', 'OTHER');

-- AlterTable
ALTER TABLE "Land"
  ADD COLUMN "titleVerification" "LandTitleVerification" NOT NULL DEFAULT 'UNVERIFIED',
  ADD COLUMN "titleRef" TEXT,
  ADD COLUMN "titleVerificationNote" TEXT,
  ADD COLUMN "titleVerifiedAt" TIMESTAMP(3),
  ADD COLUMN "titleVerifiedById" TEXT;

-- CreateTable
CREATE TABLE "LandDocument" (
    "id" TEXT NOT NULL,
    "landId" TEXT NOT NULL,
    "type" "LandDocumentType" NOT NULL DEFAULT 'TITLE_DEED',
    "storageKey" TEXT NOT NULL,
    "originalName" TEXT,
    "mimeType" TEXT,
    "sizeBytes" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "LandDocument_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "LandDocument_landId_idx" ON "LandDocument"("landId");

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_titleVerifiedById_fkey" FOREIGN KEY ("titleVerifiedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandDocument" ADD CONSTRAINT "LandDocument_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE CASCADE ON UPDATE CASCADE;
