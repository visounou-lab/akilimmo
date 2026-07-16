-- CreateEnum
CREATE TYPE "LandStatus" AS ENUM ('AVAILABLE', 'RESERVED', 'SOLD', 'OFF_MARKET');

-- CreateEnum
CREATE TYPE "LandTitleType" AS ENUM ('TITRE_FONCIER', 'ACD', 'LETTRE_ATTRIBUTION', 'CONVENTION_VENTE', 'AUTRE');

-- CreateTable
CREATE TABLE "Land" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "country" "Country" NOT NULL,
    "city" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "price" DECIMAL(65,30) NOT NULL,
    "surface" INTEGER NOT NULL,
    "titleType" "LandTitleType" NOT NULL DEFAULT 'AUTRE',
    "serviced" BOOLEAN NOT NULL DEFAULT false,
    "status" "LandStatus" NOT NULL DEFAULT 'AVAILABLE',
    "imageUrl" TEXT,
    "images" TEXT[],
    "videoUrl" TEXT,
    "ownerId" TEXT NOT NULL,
    "submittedBy" TEXT,
    "publishStatus" TEXT NOT NULL DEFAULT 'pending_review',
    "adminNote" TEXT,
    "likesCount" INTEGER NOT NULL DEFAULT 0,
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "Land_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LandInquiry" (
    "id" TEXT NOT NULL,
    "landId" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientPhone" TEXT NOT NULL,
    "clientEmail" TEXT,
    "message" TEXT,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    CONSTRAINT "LandInquiry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Land_slug_key" ON "Land"("slug");

-- CreateIndex
CREATE INDEX "Land_status_publishStatus_idx" ON "Land"("status", "publishStatus");

-- CreateIndex
CREATE INDEX "Land_ownerId_idx" ON "Land"("ownerId");

-- CreateIndex
CREATE INDEX "Land_createdAt_idx" ON "Land"("createdAt");

-- CreateIndex
CREATE INDEX "LandInquiry_landId_idx" ON "LandInquiry"("landId");

-- CreateIndex
CREATE INDEX "LandInquiry_status_idx" ON "LandInquiry"("status");

-- CreateIndex
CREATE INDEX "LandInquiry_createdAt_idx" ON "LandInquiry"("createdAt");

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Land" ADD CONSTRAINT "Land_submittedBy_fkey" FOREIGN KEY ("submittedBy") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LandInquiry" ADD CONSTRAINT "LandInquiry_landId_fkey" FOREIGN KEY ("landId") REFERENCES "Land"("id") ON DELETE CASCADE ON UPDATE CASCADE;
