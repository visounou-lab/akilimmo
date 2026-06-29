const TOKEN   = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

async function send(text: string): Promise<void> {
  if (!TOKEN || !CHAT_ID) {
    console.warn("[Telegram] TELEGRAM_BOT_TOKEN ou TELEGRAM_CHAT_ID non configuré");
    return;
  }
  try {
    await fetch(`https://api.telegram.org/bot${TOKEN}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chat_id: CHAT_ID, text, parse_mode: "HTML" }),
    });
  } catch (e) {
    console.error("[Telegram] Erreur envoi:", e);
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
    `👤 ${data.name}\n` +
    `📧 ${data.email}\n` +
    `${flag} ${data.city}\n\n` +
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
    `🏢 ${data.agencyName}\n` +
    `👤 ${data.contactName}\n` +
    `📧 ${data.email}\n` +
    `${flag} ${data.city}\n` +
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
    `🏠 ${data.bienTitle}\n` +
    `👤 ${data.clientName} — ${data.clientPhone}\n` +
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
    `🏠 ${data.title}\n` +
    `👤 ${data.ownerName}\n` +
    `📍 ${data.city}\n\n` +
    `👉 https://www.akilimmo.com/dashboard/valider`
  );
}
