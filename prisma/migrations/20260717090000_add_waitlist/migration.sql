-- CreateTable
CREATE TABLE "WaitlistEntry" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "source" TEXT NOT NULL DEFAULT 'sejours',
    "country" "Country",
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "WaitlistEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "WaitlistEntry_source_createdAt_idx" ON "WaitlistEntry"("source", "createdAt");

-- CreateIndex
CREATE UNIQUE INDEX "WaitlistEntry_email_source_key" ON "WaitlistEntry"("email", "source");
