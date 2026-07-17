export function StatusBadge({ status }: { status: string }) {
  const tone: Record<string, string> = {
    SUBMITTED: "#2666eb", DOCUMENTS_PENDING: "#b45309", UNDER_REVIEW: "#7c3aed",
    OFFER_PREPARED: "#0891b2", APPROVED: "#15803d", DECLINED: "#b91c1c",
    COMPLETED: "#15803d", FRAUD_REVIEW: "#b91c1c",
  };
  const color = tone[status] ?? "#55617a";
  return (
    <span style={{ display: "inline-block", padding: "0.2rem 0.6rem", borderRadius: "99px", fontSize: "0.78rem", fontWeight: 600, color, background: `${color}18` }}>
      {status}
    </span>
  );
}
