-- AlterTable
ALTER TABLE "Application" ADD COLUMN     "bankName" TEXT,
ADD COLUMN     "bic" TEXT,
ADD COLUMN     "iban" TEXT,
ADD COLUMN     "insuranceAmount" DOUBLE PRECISION,
ADD COLUMN     "paymentStartDate" TEXT,
ADD COLUMN     "transferDate" TEXT;

-- AlterTable
ALTER TABLE "Customer" ADD COLUMN     "city" TEXT,
ADD COLUMN     "occupation" TEXT,
ADD COLUMN     "postalCode" TEXT;

-- CreateTable
CREATE TABLE "CompanySettings" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "legalName" TEXT NOT NULL DEFAULT 'SAND FINANZ GRUPPE',
    "address" TEXT,
    "registration" TEXT,
    "vatId" TEXT,
    "shareCapital" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "bankName" TEXT,
    "iban" TEXT,
    "bic" TEXT,
    "representative" TEXT,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedById" TEXT,

    CONSTRAINT "CompanySettings_pkey" PRIMARY KEY ("id")
);
