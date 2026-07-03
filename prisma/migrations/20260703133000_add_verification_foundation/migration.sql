-- Extend account roles without changing existing users.
ALTER TYPE "Role" ADD VALUE IF NOT EXISTS 'AGENT';

-- Verification workflow enums.
DO $$ BEGIN
  CREATE TYPE "VerificationStatus" AS ENUM (
    'NOT_SUBMITTED', 'PENDING', 'APPROVED', 'REJECTED', 'EXPIRED', 'SUSPENDED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "VerificationType" AS ENUM (
    'IDENTITY', 'PROFESSIONAL', 'OWNER_AUTHORITY', 'AGENT_MANDATE',
    'LISTING_REVIEW', 'PHYSICAL_VISIT'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "VerificationDocumentType" AS ENUM (
    'IDENTITY_DOCUMENT', 'PROFESSIONAL_CARD', 'BUSINESS_REGISTRATION',
    'TAX_REGISTRATION', 'PROFESSIONAL_INSURANCE', 'OWNERSHIP_EVIDENCE',
    'MANAGEMENT_MANDATE', 'AGENT_MANDATE', 'ADDRESS_EVIDENCE', 'OTHER'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  CREATE TYPE "ReferralQualificationStatus" AS ENUM (
    'LOCKED', 'ELIGIBLE', 'APPROVED', 'PAID', 'REJECTED', 'CANCELLED'
  );
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "requestedRole" "Role";

-- Some production environments received the referral schema before migrations
-- were introduced. Create the base table when it is absent so the migration is
-- safe for both fresh and drifted databases.
CREATE TABLE IF NOT EXISTS "ReferralEarning" (
  "id" TEXT NOT NULL,
  "referrerId" TEXT NOT NULL,
  "referredId" TEXT NOT NULL,
  "paymentId" TEXT,
  "amount" DECIMAL(65,30) NOT NULL,
  "percentage" DECIMAL(65,30) NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "ReferralEarning_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "ReferralEarning"
  ADD COLUMN IF NOT EXISTS "qualificationStatus" "ReferralQualificationStatus" NOT NULL DEFAULT 'LOCKED',
  ADD COLUMN IF NOT EXISTS "qualifiedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "lockedUntil" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "approvedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rejectedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "rejectionReason" TEXT;

CREATE TABLE "VerificationCase" (
  "id" TEXT NOT NULL,
  "type" "VerificationType" NOT NULL,
  "status" "VerificationStatus" NOT NULL DEFAULT 'NOT_SUBMITTED',
  "subjectUserId" TEXT NOT NULL,
  "propertyId" TEXT,
  "reviewedById" TEXT,
  "submittedAt" TIMESTAMP(3),
  "reviewedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "rejectionReason" TEXT,
  "suspendedReason" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationDocument" (
  "id" TEXT NOT NULL,
  "verificationCaseId" TEXT NOT NULL,
  "type" "VerificationDocumentType" NOT NULL,
  "storageKey" TEXT NOT NULL,
  "originalName" TEXT,
  "mimeType" TEXT,
  "sizeBytes" INTEGER,
  "checksum" TEXT,
  "issuedAt" TIMESTAMP(3),
  "expiresAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "VerificationDocument_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "VerificationAuditLog" (
  "id" TEXT NOT NULL,
  "verificationCaseId" TEXT,
  "actorId" TEXT,
  "action" TEXT NOT NULL,
  "fromStatus" "VerificationStatus",
  "toStatus" "VerificationStatus",
  "reason" TEXT,
  "metadata" JSONB,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "VerificationAuditLog_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ReferralEarning_qualificationStatus_idx"
  ON "ReferralEarning"("qualificationStatus");
CREATE INDEX IF NOT EXISTS "ReferralEarning_referrerId_idx"
  ON "ReferralEarning"("referrerId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_referredId_idx"
  ON "ReferralEarning"("referredId");
CREATE INDEX IF NOT EXISTS "ReferralEarning_status_idx"
  ON "ReferralEarning"("status");
CREATE INDEX "VerificationCase_subjectUserId_type_status_idx"
  ON "VerificationCase"("subjectUserId", "type", "status");
CREATE INDEX "VerificationCase_propertyId_type_status_idx"
  ON "VerificationCase"("propertyId", "type", "status");
CREATE INDEX "VerificationCase_reviewedById_idx"
  ON "VerificationCase"("reviewedById");
CREATE INDEX "VerificationCase_expiresAt_idx"
  ON "VerificationCase"("expiresAt");
CREATE INDEX "VerificationDocument_verificationCaseId_idx"
  ON "VerificationDocument"("verificationCaseId");
CREATE INDEX "VerificationDocument_type_idx"
  ON "VerificationDocument"("type");
CREATE INDEX "VerificationDocument_expiresAt_idx"
  ON "VerificationDocument"("expiresAt");
CREATE INDEX "VerificationAuditLog_verificationCaseId_createdAt_idx"
  ON "VerificationAuditLog"("verificationCaseId", "createdAt");
CREATE INDEX "VerificationAuditLog_actorId_idx"
  ON "VerificationAuditLog"("actorId");
CREATE INDEX "VerificationAuditLog_action_idx"
  ON "VerificationAuditLog"("action");

ALTER TABLE "ReferralEarning"
  ADD CONSTRAINT "ReferralEarning_referrerId_fkey"
  FOREIGN KEY ("referrerId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "ReferralEarning"
  ADD CONSTRAINT "ReferralEarning_referredId_fkey"
  FOREIGN KEY ("referredId") REFERENCES "User"("id")
  ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "VerificationCase"
  ADD CONSTRAINT "VerificationCase_subjectUserId_fkey"
  FOREIGN KEY ("subjectUserId") REFERENCES "User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationCase"
  ADD CONSTRAINT "VerificationCase_propertyId_fkey"
  FOREIGN KEY ("propertyId") REFERENCES "Property"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationCase"
  ADD CONSTRAINT "VerificationCase_reviewedById_fkey"
  FOREIGN KEY ("reviewedById") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationDocument"
  ADD CONSTRAINT "VerificationDocument_verificationCaseId_fkey"
  FOREIGN KEY ("verificationCaseId") REFERENCES "VerificationCase"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "VerificationAuditLog"
  ADD CONSTRAINT "VerificationAuditLog_verificationCaseId_fkey"
  FOREIGN KEY ("verificationCaseId") REFERENCES "VerificationCase"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "VerificationAuditLog"
  ADD CONSTRAINT "VerificationAuditLog_actorId_fkey"
  FOREIGN KEY ("actorId") REFERENCES "User"("id")
  ON DELETE SET NULL ON UPDATE CASCADE;
