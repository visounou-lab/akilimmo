-- Add owner-submitted property fields
ALTER TABLE "Property"
  ADD COLUMN IF NOT EXISTS "submittedBy"   TEXT REFERENCES "User"(id) ON DELETE SET NULL,
  ADD COLUMN IF NOT EXISTS "publishStatus" TEXT NOT NULL DEFAULT 'published',
  ADD COLUMN IF NOT EXISTS "adminNote"     TEXT;
