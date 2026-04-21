// TODO V2 : remplacer par vraies données Notification + Contract
// Ces activités sont générées à partir des noms de biens réels du propriétaire.

export type MockActivityItem = {
  type: "payment" | "tenant" | "photos";
  title: string;
  subtitle: string;
  daysAgo: number;
};

export function getMockActivity(propertyTitles: string[]): MockActivityItem[] {
  // TODO V2 : brancher sur le modèle Notification (category = PAYMENT | BOOKING | DOCUMENT)
  // avec un filtre WHERE userId = ownerId AND createdAt >= NOW() - INTERVAL '7 days'
  if (propertyTitles.length === 0) return [];

  const items: MockActivityItem[] = [];
  const [first, second] = propertyTitles;

  if (first) {
    items.push({ type: "payment", title: "Paiement encaissé", subtitle: first, daysAgo: 2 });
  }
  if (second) {
    items.push({ type: "tenant", title: "Nouveau locataire", subtitle: second, daysAgo: 5 });
  }
  if (first) {
    items.push({ type: "photos", title: "Photos mises à jour", subtitle: first, daysAgo: 7 });
  }

  return items;
}
