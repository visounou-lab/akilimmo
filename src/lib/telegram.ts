const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

function esc(text: string): string {
  return text.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

async function send(text: string): Promise<void> {
  if (!TOKEN || !CHAT_ID) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID non configuré");
    return;
  }
  try {
    const res = await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
    if (!res.ok) {
      const body = await res.json().catch(() => ({}));
      console.error("[Telegram] Erreur API:", res.status, JSON.stringify(body));
    }
  } catch (e) {
    console.error("[Telegram] Erreur réseau:", e);
  }
}

export async function notifyNewOwner(data: {
  name: string;
  email: string;
  country: string;
  city: string;
}) {
  const flag = data.country === "COTE_D_IVOIRE" ? "🇨🇮" : "🇧🇯";
  await send(
    `🏠 <b>Nouveau propriétaire inscrit</b>\n\n` +
    `👤 ${esc(data.name)}\n` +
    `📧 ${esc(data.email)}\n` +
    `${flag} ${esc(data.city)}\n\n` +
    `👉 https://www.akilimmo.com/dashboard/proprietaires`
  );
}

export async function notifyNewAgentApplication(data: {
  agencyName: string;
  contactName: string;
  email: string;
  city: string;
  country: string;
  documentType: string;
}) {
  const flag = data.country === "COTE_D_IVOIRE" ? "🇨🇮" : "🇧🇯";
  const doc  = data.documentType === "registre_commerce" ? "Registre de commerce" : "Carte d'exercice";
  await send(
    `🤝 <b>Nouvelle candidature agent partenaire</b>\n\n` +
    `🏢 ${esc(data.agencyName)}\n` +
    `👤 ${esc(data.contactName)}\n` +
    `📧 ${esc(data.email)}\n` +
    `${flag} ${esc(data.city)}\n` +
    `📄 ${doc}`
  );
}

export async function notifyNewReservation(data: {
  bienTitle: string;
  clientName: string;
  clientPhone: string;
  checkIn: string;
  checkOut: string;
  totalPrice: number;
}) {
  await send(
    `📅 <b>Nouvelle demande de réservation</b>\n\n` +
    `🏠 ${esc(data.bienTitle)}\n` +
    `👤 ${esc(data.clientName)} — ${esc(data.clientPhone)}\n` +
    `📆 ${data.checkIn} → ${data.checkOut}\n` +
    `💰 ${new Intl.NumberFormat("fr-FR").format(data.totalPrice)} XOF\n\n` +
    `👉 https://www.akilimmo.com/dashboard/reservations`
  );
}

export async function notifyPropertySubmitted(data: {
  title: string;
  ownerName: string;
  city: string;
}) {
  await send(
    `📋 <b>Bien soumis à valider</b>\n\n` +
    `🏠 ${esc(data.title)}\n` +
    `👤 ${esc(data.ownerName)}\n` +
    `📍 ${esc(data.city)}\n\n` +
    `👉 https://www.akilimmo.com/dashboard/valider`
  );
}

export async function notifyLandSubmitted(data: {
  title: string;
  ownerName: string;
  city: string;
  surface: number;
}) {
  await send(
    `🌍 <b>Terrain soumis à valider</b>\n\n` +
    `📐 ${esc(data.title)} — ${data.surface} m²\n` +
    `👤 ${esc(data.ownerName)}\n` +
    `📍 ${esc(data.city)}\n\n` +
    `👉 https://www.akilimmo.com/dashboard/terrains/valider`
  );
}

export async function notifyNewLandInquiry(data: {
  landTitle: string;
  clientName: string;
  clientPhone: string;
}) {
  await send(
    `📩 <b>Nouvelle demande — Terrain</b>\n\n` +
    `🌍 ${esc(data.landTitle)}\n` +
    `👤 ${esc(data.clientName)}\n` +
    `📞 ${esc(data.clientPhone)}\n\n` +
    `👉 https://www.akilimmo.com/dashboard/terrains/demandes`
  );
}

const REPORT_REASON_LABELS: Record<string, string> = {
  FAKE_LISTING: "Logement potentiellement inexistant",
  SCAM_REQUEST: "Demande d'argent ou tentative d'arnaque",
  WRONG_INFORMATION: "Informations ou photos trompeuses",
  UNAVAILABLE: "Logement durablement indisponible",
  OTHER: "Autre problème",
};

export async function notifyListingReport(data: {
  reportId: string;
  reason: string;
  details: string;
  priority: string;
  propertyTitle: string;
  propertySlug: string;
  reporterEmail: string | null;
}) {
  const urgency = data.priority === "HIGH" ? "URGENT" : "À examiner";
  const reason = REPORT_REASON_LABELS[data.reason] ?? data.reason;
  const reporter = data.reporterEmail
    ? `\nContact : ${esc(data.reporterEmail)}`
    : "\nContact : non renseigné";

  await send(
    `<b>${urgency} — Nouveau signalement</b>\n\n` +
    `Bien : ${esc(data.propertyTitle)}\n` +
    `Motif : ${esc(reason)}\n` +
    `Détails : ${esc(data.details)}${reporter}\n\n` +
    `Annonce : https://www.akilimmo.com/biens/${encodeURIComponent(data.propertySlug)}\n` +
    `Modération : https://www.akilimmo.com/dashboard/signalements\n` +
    `Référence : ${esc(data.reportId)}`,
  );
}
