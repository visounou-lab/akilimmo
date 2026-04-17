-- AlterTable: add owner registration fields to User
ALTER TABLE "User"
  ADD COLUMN IF NOT EXISTS "phone"         TEXT,
  ADD COLUMN IF NOT EXISTS "country"       "Country",
  ADD COLUMN IF NOT EXISTS "city"          TEXT,
  ADD COLUMN IF NOT EXISTS "isVerified"    BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS "verifyToken"   TEXT,
  ADD COLUMN IF NOT EXISTS "verifyExpires" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "status"        TEXT NOT NULL DEFAULT 'pending';

-- CreateIndex
CREATE UNIQUE INDEX IF NOT EXISTS "User_verifyToken_key" ON "User"("verifyToken");
