import nodemailer from "nodemailer";

if (!process.env.SMTP_PASS) {
  console.warn("[contact] SMTP_PASS not set — emails will fail silently");
}

export const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: Number(process.env.SMTP_PORT ?? 465),
  secure: true,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(to: string, token: string) {
  const url = `https://www.akilimmo.com/verify?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Vérifiez votre adresse email — AKIL IMMO",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#0066CC;margin-bottom:8px">Vérifiez votre adresse email</h2>
        <p style="color:#374151">Merci de vous être inscrit sur AKIL IMMO en tant que propriétaire.</p>
        <p style="color:#374151">Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :</p>
        <a href="${url}" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Vérifier mon email
        </a>
        <p style="color:#9CA3AF;font-size:13px;margin-top:24px">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
      </div>
    `,
  });
}

export async function sendNewOwnerNotification(data: {
  name: string;
  email: string;
  country: string;
  city: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "david@akilimmo.com",
    subject: "Nouveau propriétaire inscrit — AKIL IMMO",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#0066CC">Nouveau propriétaire inscrit</h2>
        <ul style="color:#374151;line-height:1.8">
          <li><strong>Nom :</strong> ${data.name}</li>
          <li><strong>Email :</strong> ${data.email}</li>
          <li><strong>Pays :</strong> ${data.country}</li>
          <li><strong>Ville :</strong> ${data.city}</li>
        </ul>
        <a href="https://www.akilimmo.com/dashboard/proprietaires" style="display:inline-block;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
          Gérer les propriétaires
        </a>
      </div>
    `,
  });
}

export async function sendNewPropertyNotification(data: {
  ownerName: string;
  title: string;
  city: string;
  propertyId: string;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "david@akilimmo.com",
    subject: "Nouveau bien soumis — AKIL IMMO",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#0066CC">Nouveau bien à valider</h2>
        <ul style="color:#374151;line-height:1.8">
          <li><strong>Propriétaire :</strong> ${data.ownerName}</li>
          <li><strong>Titre :</strong> ${data.title}</li>
          <li><strong>Ville :</strong> ${data.city}</li>
        </ul>
        <a href="https://www.akilimmo.com/dashboard/valider" style="display:inline-block;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
          Valider le bien
        </a>
      </div>
    `,
  });
}

export async function sendPropertyApprovedEmail(to: string, firstName: string, title: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Votre bien "${title}" est en ligne — AKIL IMMO`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#0066CC">Votre bien est publié ! 🎉</h2>
        <p style="color:#374151">Bonjour ${firstName},</p>
        <p style="color:#374151">Votre bien <strong>${title}</strong> est maintenant en ligne sur AKIL IMMO et visible par tous les visiteurs.</p>
        <a href="https://www.akilimmo.com/biens" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Voir sur le site
        </a>
        <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
      </div>
    `,
  });
}

export async function sendPropertyRejectedEmail(to: string, firstName: string, title: string, note: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Votre bien "${title}" — Révision nécessaire`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#DC2626">Bien non publié</h2>
        <p style="color:#374151">Bonjour ${firstName},</p>
        <p style="color:#374151">Votre bien <strong>${title}</strong> n'a pas pu être publié pour la raison suivante :</p>
        <blockquote style="border-left:4px solid #DC2626;padding:12px 16px;margin:16px 0;background:#FEF2F2;color:#374151">
          ${note}
        </blockquote>
        <p style="color:#374151">Vous pouvez modifier votre bien et le resoumettre depuis votre espace propriétaire.</p>
        <a href="https://www.akilimmo.com/owner/dashboard/biens" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Mon espace
        </a>
        <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
      </div>
    `,
  });
}

export async function sendPasswordResetEmail(to: string, firstName: string, token: string) {
  const url = `https://www.akilimmo.com/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Réinitialisation de votre mot de passe — AKIL IMMO",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#0066CC;margin-bottom:8px">Réinitialisation de votre mot de passe</h2>
        <p style="color:#374151">Bonjour ${firstName},</p>
        <p style="color:#374151">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans <strong>1 heure</strong>.</p>
        <a href="${url}" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Réinitialiser mon mot de passe
        </a>
        <p style="color:#9CA3AF;font-size:13px;margin-top:24px">Si vous n'avez pas demandé cela, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(to: string, firstName: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Bienvenue sur AKIL IMMO — Votre compte est activé !",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#0066CC">Bienvenue sur AKIL IMMO !</h2>
        <p style="color:#374151">Bonjour ${firstName},</p>
        <p style="color:#374151">Votre compte propriétaire AKIL IMMO est maintenant <strong>actif</strong>.</p>
        <p style="color:#374151">Vous pouvez vous connecter et soumettre vos biens à la location.</p>
        <a href="https://www.akilimmo.com/login" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Se connecter
        </a>
        <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
      </div>
    `,
  });
}

export async function sendAdminMessageEmail(to: string, firstName: string, subject: string, body: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `${subject} — AKIL IMMO`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <p style="color:#374151;margin:0 0 20px">Bonjour ${firstName},</p>
          <div style="color:#374151;line-height:1.7;white-space:pre-wrap">${body}</div>
          <hr style="border:none;border-top:1px solid #E5E7EB;margin:28px 0" />
          <p style="color:#374151;margin:0">L'équipe AKIL IMMO</p>
          <p style="color:#6B7280;font-size:13px;margin:4px 0 0">
            <a href="mailto:info@akilimmo.com" style="color:#0066CC">info@akilimmo.com</a> —
            <a href="https://www.akilimmo.com" style="color:#0066CC">www.akilimmo.com</a>
          </p>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
          AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
        </p>
      </div>
    `,
  });
}

export async function sendPropertySubmitReminderEmail(to: string, firstName: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Déposez votre premier bien sur AKIL IMMO 🏠",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 8px;color:#0066CC;font-size:22px">Votre compte est prêt, ${firstName} !</h2>
          <p style="margin:0 0 24px;color:#6B7280;font-size:14px">Il ne reste plus qu'une étape : déposer votre premier bien.</p>

          <p style="color:#374151">Bonjour ${firstName},</p>
          <p style="color:#374151">
            Votre espace propriétaire AKIL IMMO est actif. Des milliers de locataires potentiels
            cherchent un logement en Côte d'Ivoire et au Bénin — votre bien peut être en ligne
            <strong>dès aujourd'hui</strong>.
          </p>

          <div style="background:#F0F7FF;border-radius:10px;padding:20px 24px;margin:24px 0">
            <p style="margin:0 0 12px;font-weight:700;color:#0066CC;font-size:15px">Ce que vous obtenez avec AKIL IMMO :</p>
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:7px 0;vertical-align:top;width:28px;color:#0066CC;font-size:18px">✅</td>
                <td style="padding:7px 0;color:#374151"><strong>Visibilité immédiate</strong> — votre bien affiché sur notre plateforme dès validation (24-48h)</td>
              </tr>
              <tr>
                <td style="padding:7px 0;vertical-align:top;color:#0066CC;font-size:18px">✅</td>
                <td style="padding:7px 0;color:#374151"><strong>Gestion simplifiée</strong> — contrats, paiements et documents au même endroit</td>
              </tr>
              <tr>
                <td style="padding:7px 0;vertical-align:top;color:#0066CC;font-size:18px">✅</td>
                <td style="padding:7px 0;color:#374151"><strong>Locataires sérieux</strong> — uniquement des profils vérifiés sur notre plateforme</td>
              </tr>
              <tr>
                <td style="padding:7px 0;vertical-align:top;color:#0066CC;font-size:18px">✅</td>
                <td style="padding:7px 0;color:#374151"><strong>Suivi des loyers</strong> — encaissements enregistrés, notifications automatiques</td>
              </tr>
              <tr>
                <td style="padding:7px 0;vertical-align:top;color:#0066CC;font-size:18px">✅</td>
                <td style="padding:7px 0;color:#374151"><strong>Support dédié</strong> — notre équipe vous accompagne à chaque étape</td>
              </tr>
            </table>
          </div>

          <p style="color:#374151">La soumission prend moins de <strong>5 minutes</strong>. Ajoutez le titre, la description, quelques photos et le prix — notre équipe s'occupe du reste.</p>

          <div style="text-align:center;margin:28px 0">
            <a href="https://www.akilimmo.com/owner/dashboard/soumettre"
               style="display:inline-block;background:#0066CC;color:white;padding:16px 36px;border-radius:10px;text-decoration:none;font-weight:700;font-size:16px;letter-spacing:0.3px">
              Déposer mon premier bien →
            </a>
          </div>

          <p style="color:#6B7280;font-size:13px;text-align:center">
            Des questions ? Répondez à cet email ou écrivez-nous à
            <a href="mailto:info@akilimmo.com" style="color:#0066CC">info@akilimmo.com</a>
          </p>

          <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
          AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
        </p>
      </div>
    `,
  });
}

export async function sendContactRequest(data: {
  nom: string;
  email: string;
  telephone?: string;
  pays?: string;
  sujet: string;
  message: string;
}): Promise<void> {
  const row = (label: string, value: string) =>
    `<tr>
      <td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap;width:140px;vertical-align:top">${label}</td>
      <td style="padding:8px 12px;color:#374151;word-break:break-word">${value}</td>
    </tr>`;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="margin:0 0 20px;color:#0066CC;font-size:20px">Nouveau message de contact</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
          <tbody style="background:#F9FAFB">
            ${row("Nom", data.nom)}
            ${row("Email", `<a href="mailto:${data.email}" style="color:#0066CC">${data.email}</a>`)}
            ${data.telephone ? row("Téléphone", `<a href="tel:${data.telephone}" style="color:#0066CC">${data.telephone}</a>`) : ""}
            ${data.pays ? row("Pays", data.pays) : ""}
            ${row("Sujet", data.sujet)}
          </tbody>
        </table>
        <div style="margin-top:20px;padding:16px;background:#F0F7FF;border-left:4px solid #0066CC;border-radius:4px">
          <p style="margin:0 0 6px;font-weight:600;color:#374151">Message :</p>
          <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6">${data.message}</p>
        </div>
        <p style="margin-top:24px;font-size:13px;color:#6B7280">
          Répondre à ce message répondra directement à <a href="mailto:${data.email}" style="color:#0066CC">${data.email}</a>.
        </p>
      </div>
      <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
        AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
      </p>
    </div>
  `;

  const text = [
    `Nouveau message de contact — AKIL IMMO`,
    ``,
    `Nom        : ${data.nom}`,
    `Email      : ${data.email}`,
    data.telephone ? `Téléphone  : ${data.telephone}` : null,
    data.pays      ? `Pays       : ${data.pays}`      : null,
    `Sujet      : ${data.sujet}`,
    ``,
    `Message :`,
    data.message,
    ``,
    `---`,
    `AKIL IMMO — www.akilimmo.com`,
  ]
    .filter((l) => l !== null)
    .join("\n");

  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to:      "info@akilimmo.com",
    cc:      "david@akilimmo.com",
    replyTo: `${data.nom} <${data.email}>`,
    subject: `Nouveau contact AKIL IMMO — ${data.sujet}`,
    html,
    text,
  });
}

export async function sendPaymentConfirmedEmail(data: {
  ownerEmail:    string;
  ownerName:     string;
  propertyTitle: string;
  amount:        number;
  paymentMethod: string | null;
  reference:     string | null;
  paidAt:        Date;
}) {
  const methodLabels: Record<string, string> = {
    wave:         "Wave",
    orange_money: "Orange Money",
    free_money:   "Free Money",
    virement:     "Virement bancaire",
    especes:      "Espèces",
    autre:        "Autre",
  };
  const methodStr  = data.paymentMethod ? (methodLabels[data.paymentMethod] ?? data.paymentMethod) : "Non précisé";
  const amountStr  = new Intl.NumberFormat("fr-FR").format(data.amount) + " FCFA";
  const dateStr    = new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(data.paidAt);
  const firstName  = data.ownerName.split(" ").at(-1) ?? data.ownerName;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to:      data.ownerEmail,
    subject: `Paiement encaissé — ${data.propertyTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 4px;color:#16A34A;font-size:20px">Loyer encaissé ✓</h2>
          <p style="margin:0 0 24px;color:#6B7280;font-size:14px">Confirmation de paiement</p>

          <p style="color:#374151">Bonjour ${firstName},</p>
          <p style="color:#374151">Le loyer de votre bien <strong>${data.propertyTitle}</strong> a bien été encaissé par AKIL IMMO.</p>

          <div style="background:#F0FDF4;border:1px solid #BBF7D0;border-radius:10px;padding:20px;margin:20px 0">
            <table style="width:100%;border-collapse:collapse">
              <tr>
                <td style="padding:6px 0;color:#6B7280;font-size:14px;width:50%">Montant encaissé</td>
                <td style="padding:6px 0;color:#374151;font-weight:700;font-size:18px;text-align:right">${amountStr}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6B7280;font-size:14px;border-top:1px solid #D1FAE5">Votre part (94%)</td>
                <td style="padding:6px 0;color:#16A34A;font-weight:600;font-size:14px;text-align:right;border-top:1px solid #D1FAE5">
                  ${new Intl.NumberFormat("fr-FR").format(Math.round(data.amount * 0.94))} FCFA
                </td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6B7280;font-size:14px">Mode de paiement</td>
                <td style="padding:6px 0;color:#374151;font-size:14px;text-align:right">${methodStr}</td>
              </tr>
              <tr>
                <td style="padding:6px 0;color:#6B7280;font-size:14px">Date</td>
                <td style="padding:6px 0;color:#374151;font-size:14px;text-align:right">${dateStr}</td>
              </tr>
              ${data.reference ? `
              <tr>
                <td style="padding:6px 0;color:#6B7280;font-size:14px">Référence</td>
                <td style="padding:6px 0;color:#374151;font-size:14px;font-family:monospace;text-align:right">${data.reference}</td>
              </tr>` : ""}
            </table>
          </div>

          <p style="color:#6B7280;font-size:13px">La commission AKIL IMMO de 6 % est déduite du montant brut.</p>

          <a href="https://www.akilimmo.com/owner/dashboard/paiements"
             style="display:inline-block;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:8px">
            Voir mes paiements
          </a>

          <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
          AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
        </p>
      </div>
    `,
  });
}

const DOC_TYPE_LABELS: Record<string, string> = {
  quittance:   "Quittance de loyer",
  contrat:     "Contrat de location",
  attestation: "Attestation de propriété",
};

export async function sendDocumentRequest(data: {
  ownerName:    string;
  ownerEmail:   string;
  type:         string;
  propertyTitle?: string;
  message?:     string;
  requestId:    string;
}): Promise<void> {
  const label = DOC_TYPE_LABELS[data.type] ?? data.type;

  const html = `
    <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
      <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
      </div>
      <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
        <h2 style="margin:0 0 20px;color:#0066CC;font-size:20px">Nouvelle demande de document</h2>
        <table style="width:100%;border-collapse:collapse;border:1px solid #E5E7EB;border-radius:8px;overflow:hidden">
          <tbody style="background:#F9FAFB">
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;width:160px">Propriétaire</td><td style="padding:8px 12px;color:#374151">${data.ownerName}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Email</td><td style="padding:8px 12px;color:#374151"><a href="mailto:${data.ownerEmail}" style="color:#0066CC">${data.ownerEmail}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Type</td><td style="padding:8px 12px;color:#374151">${label}</td></tr>
            ${data.propertyTitle ? `<tr><td style="padding:8px 12px;font-weight:600;color:#374151">Bien</td><td style="padding:8px 12px;color:#374151">${data.propertyTitle}</td></tr>` : ""}
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Référence</td><td style="padding:8px 12px;color:#374151;font-family:monospace;font-size:13px">${data.requestId}</td></tr>
          </tbody>
        </table>
        ${data.message ? `
        <div style="margin-top:20px;padding:16px;background:#F0F7FF;border-left:4px solid #0066CC;border-radius:4px">
          <p style="margin:0 0 6px;font-weight:600;color:#374151">Message :</p>
          <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6">${data.message}</p>
        </div>` : ""}
        <a href="https://www.akilimmo.com/dashboard" style="display:inline-block;margin-top:24px;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600">
          Traiter la demande
        </a>
      </div>
    </div>
  `;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to:      "info@akilimmo.com",
    cc:      "david@akilimmo.com",
    replyTo: `${data.ownerName} <${data.ownerEmail}>`,
    subject: `Demande de document — ${label} (${data.ownerName})`,
    html,
    text: [
      `Demande de document — AKIL IMMO`,
      ``,
      `Propriétaire : ${data.ownerName}`,
      `Email        : ${data.ownerEmail}`,
      `Type         : ${label}`,
      data.propertyTitle ? `Bien         : ${data.propertyTitle}` : null,
      `Référence    : ${data.requestId}`,
      data.message ? `\nMessage :\n${data.message}` : null,
    ].filter(Boolean).join("\n"),
  });
}
