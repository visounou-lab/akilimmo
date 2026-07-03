-- Existing published listings passed through the historical admin publication flow.
-- Record that review explicitly so the public badge remains evidence-based.
INSERT INTO "VerificationCase" (
  "id",
  "type",
  "status",
  "subjectUserId",
  "propertyId",
  "submittedAt",
  "reviewedAt",
  "createdAt",
  "updatedAt"
)
SELECT
  CONCAT('listing_', MD5(RANDOM()::text || p."id")),
  'LISTING_REVIEW'::"VerificationType",
  'APPROVED'::"VerificationStatus",
  p."ownerId",
  p."id",
  p."createdAt",
  NOW(),
  NOW(),
  NOW()
FROM "Property" p
WHERE p."publishStatus" = 'published'
  AND NOT EXISTS (
    SELECT 1
    FROM "VerificationCase" vc
    WHERE vc."propertyId" = p."id"
      AND vc."type" = 'LISTING_REVIEW'::"VerificationType"
  );
