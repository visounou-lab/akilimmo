type VerificationSummary = {
  type: string;
  status: string;
  expiresAt: Date | string | null;
};

function isCurrentApproval(item: VerificationSummary, now = new Date()): boolean {
  return (
    item.status === "APPROVED" &&
    (!item.expiresAt || new Date(item.expiresAt).getTime() > now.getTime())
  );
}

export function derivePropertyTrust({
  ownerRole,
  ownerVerifications,
  propertyVerifications,
}: {
  ownerRole: string;
  ownerVerifications: VerificationSummary[];
  propertyVerifications: VerificationSummary[];
}) {
  const identityVerified = ownerVerifications.some(
    (item) => item.type === "IDENTITY" && isCurrentApproval(item),
  );
  const professionalVerified = ownerVerifications.some(
    (item) => item.type === "PROFESSIONAL" && isCurrentApproval(item),
  );

  return {
    listingReviewed: propertyVerifications.some(
      (item) => item.type === "LISTING_REVIEW" && isCurrentApproval(item),
    ),
    physicalVisitVerified: propertyVerifications.some(
      (item) => item.type === "PHYSICAL_VISIT" && isCurrentApproval(item),
    ),
    publisherIdentityVerified: identityVerified,
    publisherProfessionalVerified:
      ownerRole === "AGENT" && identityVerified && professionalVerified,
  };
}
