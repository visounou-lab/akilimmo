import { BadgeCheck, ClipboardCheck, MapPinCheck, ScrollText } from "lucide-react";

export type TrustBadgeKind =
  | "listing-reviewed"
  | "identity-verified"
  | "agent-verified"
  | "physical-visit"
  | "title-verified";

const CONFIG = {
  "title-verified": {
    label: "Titre vérifié",
    description: "Le titre de propriété de ce terrain a été contrôlé sur pièce par AKIL IMMO.",
    icon: ScrollText,
  },
  "listing-reviewed": {
    label: "Annonce contrôlée",
    description: "Le contenu, les photos et les informations de cette annonce ont été examinés.",
    icon: ClipboardCheck,
  },
  "identity-verified": {
    label: "Identité vérifiée",
    description: "L’identité de l’auteur a été contrôlée par AKIL IMMO.",
    icon: BadgeCheck,
  },
  "agent-verified": {
    label: "Agent vérifié",
    description: "L’identité et les justificatifs professionnels de cet agent ont été contrôlés.",
    icon: BadgeCheck,
  },
  "physical-visit": {
    label: "Visite terrain effectuée",
    description: "Une visite physique du bien a été enregistrée par AKIL IMMO.",
    icon: MapPinCheck,
  },
} satisfies Record<
  TrustBadgeKind,
  { label: string; description: string; icon: typeof BadgeCheck }
>;

export default function TrustBadge({
  kind,
  compact = false,
}: {
  kind: TrustBadgeKind;
  compact?: boolean;
}) {
  const item = CONFIG[kind];
  const Icon = item.icon;

  return (
    <span
      className={`inline-flex min-h-8 items-center gap-1.5 rounded-full border border-[#1B4D3E]/25 bg-[#EAF3EF] font-semibold text-[#12382D] ${
        compact ? "px-2.5 py-1 text-[0.7rem]" : "px-3 py-1.5 text-xs"
      }`}
      title={item.description}
      aria-label={`${item.label}. ${item.description}`}
    >
      <Icon size={compact ? 13 : 15} strokeWidth={2} aria-hidden="true" />
      {item.label}
    </span>
  );
}
