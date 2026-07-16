import nodemailer from "nodemailer";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

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
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 16px;color:#0066CC;font-size:22px">Vérifiez votre adresse email</h2>
          <p style="color:#374151;margin:0 0 12px">Merci de vous être inscrit sur AKIL IMMO en tant que propriétaire.</p>
          <p style="color:#374151;margin:0 0 12px">Cliquez sur le bouton ci-dessous pour confirmer votre adresse email :</p>
          <a href="${url}" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
            Vérifier mon email
          </a>
          <p style="color:#9CA3AF;font-size:13px;margin-top:24px">Ce lien expire dans 24 heures. Si vous n'avez pas créé de compte, ignorez cet email.</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
          AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
        </p>
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
          <li><strong>Nom :</strong> ${escapeHtml(data.name)}</li>
          <li><strong>Email :</strong> ${escapeHtml(data.email)}</li>
          <li><strong>Pays :</strong> ${escapeHtml(data.country)}</li>
          <li><strong>Ville :</strong> ${escapeHtml(data.city)}</li>
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
          <li><strong>Propriétaire :</strong> ${escapeHtml(data.ownerName)}</li>
          <li><strong>Titre :</strong> ${escapeHtml(data.title)}</li>
          <li><strong>Ville :</strong> ${escapeHtml(data.city)}</li>
        </ul>
        <a href="https://www.akilimmo.com/dashboard/valider" style="display:inline-block;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
          Valider le bien
        </a>
      </div>
    `,
  });
}

export async function sendNewLandNotification(data: {
  ownerName: string;
  title: string;
  city: string;
  surface: number;
}) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "david@akilimmo.com",
    subject: "Nouveau terrain soumis — AKIL IMMO",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <h2 style="color:#0066CC">Nouveau terrain à valider</h2>
        <ul style="color:#374151;line-height:1.8">
          <li><strong>Propriétaire :</strong> ${escapeHtml(data.ownerName)}</li>
          <li><strong>Titre :</strong> ${escapeHtml(data.title)}</li>
          <li><strong>Ville :</strong> ${escapeHtml(data.city)}</li>
          <li><strong>Superficie :</strong> ${data.surface} m²</li>
        </ul>
        <a href="https://www.akilimmo.com/dashboard/terrains/valider" style="display:inline-block;background:#0066CC;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;margin-top:16px">
          Valider le terrain
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
        <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
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
        <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
        <p style="color:#374151">Votre bien <strong>${escapeHtml(title)}</strong> n'a pas pu être publié pour la raison suivante :</p>
        <blockquote style="border-left:4px solid #DC2626;padding:12px 16px;margin:16px 0;background:#FEF2F2;color:#374151">
          ${escapeHtml(note)}
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

export async function sendLandApprovedEmail(to: string, firstName: string, title: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Votre terrain "${title}" est en ligne — AKIL IMMO`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#0066CC">Votre terrain est publié ! 🎉</h2>
        <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
        <p style="color:#374151">Votre terrain <strong>${escapeHtml(title)}</strong> est maintenant en ligne sur AKIL IMMO et visible par tous les acheteurs potentiels.</p>
        <a href="https://www.akilimmo.com/terrains" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Voir sur le site
        </a>
        <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
      </div>
    `,
  });
}

export async function sendLandRejectedEmail(to: string, firstName: string, title: string, note: string) {
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: `Votre terrain "${title}" — Révision nécessaire`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:48px;margin-bottom:24px" />
        <h2 style="color:#DC2626">Terrain non publié</h2>
        <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
        <p style="color:#374151">Votre terrain <strong>${escapeHtml(title)}</strong> n'a pas pu être publié pour la raison suivante :</p>
        <blockquote style="border-left:4px solid #DC2626;padding:12px 16px;margin:16px 0;background:#FEF2F2;color:#374151">
          ${escapeHtml(note)}
        </blockquote>
        <p style="color:#374151">Vous pouvez modifier votre terrain et le resoumettre depuis votre espace propriétaire.</p>
        <a href="https://www.akilimmo.com/owner/dashboard/terrains" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
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
        <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
        <p style="color:#374151">Cliquez sur le bouton ci-dessous pour réinitialiser votre mot de passe. Ce lien expire dans <strong>1 heure</strong>.</p>
        <a href="${url}" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
          Réinitialiser mon mot de passe
        </a>
        <p style="color:#9CA3AF;font-size:13px;margin-top:24px">Si vous n'avez pas demandé cela, ignorez cet email. Votre mot de passe ne sera pas modifié.</p>
      </div>
    `,
  });
}

export async function sendWelcomeEmail(
  to: string,
  firstName: string,
  accountType: "propriétaire" | "agent" = "propriétaire",
) {
  const accountMessage =
    accountType === "agent"
      ? "Votre compte agent est maintenant <strong>actif</strong>. Vos justificatifs ont été validés et votre badge agent peut désormais être affiché."
      : "Votre compte propriétaire est maintenant <strong>actif</strong>. Vous pouvez dès à présent vous connecter et soumettre vos biens à la location.";
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Bienvenue sur AKIL IMMO — Votre compte est activé !",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 16px;color:#0066CC;font-size:22px">Bienvenue sur AKIL IMMO !</h2>
          <p style="color:#374151;margin:0 0 12px">Bonjour ${escapeHtml(firstName)},</p>
          <p style="color:#374151;margin:0 0 12px">${accountMessage}</p>
          <a href="https://www.akilimmo.com/login" style="display:inline-block;background:#0066CC;color:white;padding:14px 28px;border-radius:8px;text-decoration:none;font-weight:600;margin:16px 0">
            Se connecter
          </a>
          <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
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
          <p style="color:#374151;margin:0 0 20px">Bonjour ${escapeHtml(firstName)},</p>
          <div style="color:#374151;line-height:1.7;white-space:pre-wrap">${escapeHtml(body)}</div>
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

          <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
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

export async function sendTenantAccessEmail(to: string, name: string, token: string) {
  const firstName = name.split(" ")[0];
  const url = `https://www.akilimmo.com/reset-password?token=${token}`;
  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to,
    subject: "Vos accès AKIL IMMO — Activez votre compte",
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#0066CC;padding:24px 32px;border-radius:12px 12px 0 0">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#ffffff;padding:32px;border:1px solid #E5E7EB;border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 16px;color:#0066CC;font-size:22px">Bienvenue sur AKIL IMMO !</h2>
          <p style="color:#374151;margin:0 0 12px">Bonjour ${escapeHtml(firstName)},</p>
          <p style="color:#374151;margin:0 0 12px">
            Votre compte locataire a été créé sur la plateforme AKIL IMMO.<br />
            Voici vos informations de connexion :
          </p>
          <div style="background:#F0F7FF;border-radius:10px;padding:16px 20px;margin:20px 0">
            <p style="margin:0 0 8px;color:#374151"><strong>Email :</strong> ${to}</p>
            <p style="margin:0;color:#374151"><strong>Site :</strong> <a href="https://www.akilimmo.com/login" style="color:#0066CC">www.akilimmo.com/login</a></p>
          </div>
          <p style="color:#374151;margin:0 0 20px">
            Cliquez sur le bouton ci-dessous pour créer votre mot de passe et accéder à votre espace locataire :
          </p>
          <div style="text-align:center;margin:24px 0">
            <a href="${url}" style="display:inline-block;background:#0066CC;color:white;padding:14px 32px;border-radius:8px;text-decoration:none;font-weight:700;font-size:15px">
              Créer mon mot de passe →
            </a>
          </div>
          <p style="color:#9CA3AF;font-size:13px;margin-top:20px">Ce lien expire dans 1 heure. Si vous avez des questions, contactez-nous à <a href="mailto:info@akilimmo.com" style="color:#0066CC">info@akilimmo.com</a>.</p>
          <p style="color:#374151;margin-top:24px">L'équipe AKIL IMMO</p>
        </div>
        <p style="text-align:center;font-size:12px;color:#9CA3AF;margin-top:16px">
          AKIL IMMO — <a href="https://www.akilimmo.com" style="color:#9CA3AF">www.akilimmo.com</a>
        </p>
      </div>
    `,
  });
}

export async function sendNewReservationEmail(data: {
  clientName:   string;
  clientPhone:  string;
  propertyTitle: string;
  propertyCity: string;
  checkIn:      Date;
  checkOut:     Date;
  duration:     number;
  locationType: string;
  totalPrice:   number;
  message?:     string | null;
  reservationId: string;
}): Promise<void> {
  const fmtDate = (d: Date) =>
    new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "short", year: "numeric" }).format(d);
  const fmtPrice = (n: number) => new Intl.NumberFormat("fr-FR").format(n);
  const durationLabel = `${data.duration} ${data.locationType}${data.duration > 1 ? "s" : ""}`;
  const waUrl = `https://wa.me/${data.clientPhone.replace(/\D/g, "")}`;

  await transporter.sendMail({
    from:    process.env.SMTP_FROM,
    to:      "david@akilimmo.com",
    subject: `Nouvelle réservation — ${data.propertyTitle}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto">
        <div style="background:#1C1917;padding:24px 32px;border-radius:12px 12px 0 0;border-bottom:3px solid #C8922A">
          <img src="https://www.akilimmo.com/logo.png" alt="AKIL IMMO" style="height:40px" />
        </div>
        <div style="background:#FDFCF8;padding:32px;border:1.5px solid rgba(200,146,42,0.2);border-top:none;border-radius:0 0 12px 12px">
          <h2 style="margin:0 0 4px;color:#1C1917;font-size:20px">Nouvelle demande de réservation</h2>
          <p style="margin:0 0 24px;color:#6B5E52;font-size:14px">À traiter dans les meilleurs délais</p>

          <div style="background:#fff;border:1.5px solid rgba(200,146,42,0.2);border-radius:10px;padding:20px;margin-bottom:20px">
            <p style="margin:0 0 12px;font-size:11px;font-weight:700;letter-spacing:0.12em;text-transform:uppercase;color:#C8922A">BIEN</p>
            <p style="margin:0;font-size:16px;font-weight:700;color:#1C1917">${escapeHtml(data.propertyTitle)}</p>
            <p style="margin:4px 0 0;color:#6B5E52;font-size:14px">${escapeHtml(data.propertyCity)}</p>
          </div>

          <table style="width:100%;border-collapse:collapse;background:#fff;border:1.5px solid rgba(200,146,42,0.2);border-radius:10px;overflow:hidden;margin-bottom:20px">
            <tbody>
              <tr style="border-bottom:1px solid rgba(200,146,42,0.1)">
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px;width:140px">Client</td>
                <td style="padding:10px 16px;color:#1C1917;font-weight:600">${escapeHtml(data.clientName)}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(200,146,42,0.1)">
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px">Téléphone</td>
                <td style="padding:10px 16px">
                  <a href="${waUrl}" style="color:#16A34A;font-weight:600;text-decoration:none">${escapeHtml(data.clientPhone)} (WhatsApp)</a>
                </td>
              </tr>
              <tr style="border-bottom:1px solid rgba(200,146,42,0.1)">
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px">Arrivée</td>
                <td style="padding:10px 16px;color:#1C1917">${fmtDate(data.checkIn)}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(200,146,42,0.1)">
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px">Départ</td>
                <td style="padding:10px 16px;color:#1C1917">${fmtDate(data.checkOut)}</td>
              </tr>
              <tr style="border-bottom:1px solid rgba(200,146,42,0.1)">
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px">Durée</td>
                <td style="padding:10px 16px;color:#1C1917">${escapeHtml(durationLabel)}</td>
              </tr>
              <tr>
                <td style="padding:10px 16px;color:#6B5E52;font-size:13px">Total estimé</td>
                <td style="padding:10px 16px;color:#C8922A;font-weight:700;font-size:16px">${fmtPrice(data.totalPrice)} XOF</td>
              </tr>
            </tbody>
          </table>

          ${data.message ? `
          <div style="background:#fff;border-left:3px solid #C8922A;padding:12px 16px;border-radius:4px;margin-bottom:20px">
            <p style="margin:0 0 6px;font-size:11px;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;color:#C8922A">MESSAGE DU CLIENT</p>
            <p style="margin:0;color:#3D3530;white-space:pre-wrap;line-height:1.6;font-size:14px">${escapeHtml(data.message)}</p>
          </div>` : ""}

          <div style="display:flex;gap:12px;flex-wrap:wrap">
            <a href="https://www.akilimmo.com/dashboard/reservations"
               style="display:inline-block;background:#1C1917;color:#FDFCF8;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Voir dans le dashboard →
            </a>
            <a href="${waUrl}"
               style="display:inline-block;background:#16A34A;color:white;padding:12px 24px;border-radius:8px;text-decoration:none;font-weight:600;font-size:14px">
              Contacter sur WhatsApp
            </a>
          </div>
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
      <td style="padding:8px 12px;font-weight:600;color:#374151;white-space:nowrap;width:140px;vertical-align:top">${escapeHtml(label)}</td>
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
            ${row("Nom", escapeHtml(data.nom))}
            ${row("Email", `<a href="mailto:${escapeHtml(data.email)}" style="color:#0066CC">${escapeHtml(data.email)}</a>`)}
            ${data.telephone ? row("Téléphone", `<a href="tel:${escapeHtml(data.telephone)}" style="color:#0066CC">${escapeHtml(data.telephone)}</a>`) : ""}
            ${data.pays ? row("Pays", escapeHtml(data.pays)) : ""}
            ${row("Sujet", escapeHtml(data.sujet))}
          </tbody>
        </table>
        <div style="margin-top:20px;padding:16px;background:#F0F7FF;border-left:4px solid #0066CC;border-radius:4px">
          <p style="margin:0 0 6px;font-weight:600;color:#374151">Message :</p>
          <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6">${escapeHtml(data.message)}</p>
        </div>
        <p style="margin-top:24px;font-size:13px;color:#6B7280">
          Répondre à ce message répondra directement à <a href="mailto:${escapeHtml(data.email)}" style="color:#0066CC">${escapeHtml(data.email)}</a>.
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

          <p style="color:#374151">Bonjour ${escapeHtml(firstName)},</p>
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
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151;width:160px">Propriétaire</td><td style="padding:8px 12px;color:#374151">${escapeHtml(data.ownerName)}</td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Email</td><td style="padding:8px 12px;color:#374151"><a href="mailto:${escapeHtml(data.ownerEmail)}" style="color:#0066CC">${escapeHtml(data.ownerEmail)}</a></td></tr>
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Type</td><td style="padding:8px 12px;color:#374151">${escapeHtml(label)}</td></tr>
            ${data.propertyTitle ? `<tr><td style="padding:8px 12px;font-weight:600;color:#374151">Bien</td><td style="padding:8px 12px;color:#374151">${escapeHtml(data.propertyTitle)}</td></tr>` : ""}
            <tr><td style="padding:8px 12px;font-weight:600;color:#374151">Référence</td><td style="padding:8px 12px;color:#374151;font-family:monospace;font-size:13px">${escapeHtml(data.requestId)}</td></tr>
          </tbody>
        </table>
        ${data.message ? `
        <div style="margin-top:20px;padding:16px;background:#F0F7FF;border-left:4px solid #0066CC;border-radius:4px">
          <p style="margin:0 0 6px;font-weight:600;color:#374151">Message :</p>
          <p style="margin:0;color:#374151;white-space:pre-wrap;line-height:1.6">${escapeHtml(data.message)}</p>
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

const LISTING_REPORT_REASON_LABELS: Record<string, string> = {
  FAKE_LISTING: "Logement potentiellement inexistant",
  SCAM_REQUEST: "Demande d'argent ou tentative d'arnaque",
  WRONG_INFORMATION: "Informations ou photos trompeuses",
  UNAVAILABLE: "Logement durablement indisponible",
  OTHER: "Autre problème",
};

export async function sendListingReportAlert(data: {
  reportId: string;
  reason: string;
  details: string;
  priority: string;
  propertyTitle: string;
  propertySlug: string;
  reporterEmail: string | null;
}): Promise<void> {
  const reason = LISTING_REPORT_REASON_LABELS[data.reason] ?? data.reason;
  const urgent = data.priority === "HIGH";
  const listingUrl = `https://www.akilimmo.com/biens/${encodeURIComponent(data.propertySlug)}`;
  const dashboardUrl = "https://www.akilimmo.com/dashboard/signalements";
  const recipient = process.env.ADMIN_ALERT_EMAIL || "info@akilimmo.com";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: recipient,
    replyTo: data.reporterEmail || undefined,
    subject: `${urgent ? "[URGENT] " : ""}Nouveau signalement — ${data.propertyTitle}`,
    html: `
      <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#292524">
        <div style="background:#1C1917;padding:22px 28px;border-radius:12px 12px 0 0">
          <strong style="color:#ffffff;font-size:20px">AKIL IMMO — Sécurité</strong>
        </div>
        <div style="padding:28px;border:1px solid #E7E5E4;border-top:0;border-radius:0 0 12px 12px">
          <p style="display:inline-block;margin:0 0 18px;padding:6px 10px;border-radius:999px;background:${urgent ? "#FEE2E2" : "#FEF3C7"};color:${urgent ? "#B91C1C" : "#92400E"};font-weight:700;font-size:12px">
            ${urgent ? "PRIORITÉ HAUTE" : "À EXAMINER"}
          </p>
          <h1 style="margin:0 0 18px;font-size:22px">${escapeHtml(reason)}</h1>
          <table style="width:100%;border-collapse:collapse;background:#FAFAF9;border-radius:10px">
            <tr><td style="padding:10px 12px;font-weight:700;width:130px">Annonce</td><td style="padding:10px 12px">${escapeHtml(data.propertyTitle)}</td></tr>
            <tr><td style="padding:10px 12px;font-weight:700">Déclarant</td><td style="padding:10px 12px">${data.reporterEmail ? escapeHtml(data.reporterEmail) : "Non renseigné"}</td></tr>
            <tr><td style="padding:10px 12px;font-weight:700">Référence</td><td style="padding:10px 12px;font-family:monospace">${escapeHtml(data.reportId)}</td></tr>
          </table>
          <div style="margin-top:18px;padding:16px;border-left:4px solid #DC2626;background:#FEF2F2;white-space:pre-wrap;line-height:1.6">${escapeHtml(data.details)}</div>
          <p style="margin:24px 0 0">
            <a href="${dashboardUrl}" style="display:inline-block;background:#B91C1C;color:#fff;padding:12px 18px;border-radius:8px;text-decoration:none;font-weight:700">Examiner le signalement</a>
            <a href="${listingUrl}" style="display:inline-block;margin-left:8px;color:#1B4D3E;padding:12px 8px;font-weight:700">Voir l'annonce</a>
          </p>
          <p style="margin-top:22px;color:#78716C;font-size:13px">Ne suspendez pas automatiquement un compte : vérifiez les éléments avant toute décision.</p>
        </div>
      </div>
    `,
    text: [
      `${urgent ? "URGENT — " : ""}Nouveau signalement AKIL IMMO`,
      "",
      `Annonce : ${data.propertyTitle}`,
      `Motif : ${reason}`,
      `Déclarant : ${data.reporterEmail || "Non renseigné"}`,
      `Référence : ${data.reportId}`,
      "",
      data.details,
      "",
      `Annonce : ${listingUrl}`,
      `Modération : ${dashboardUrl}`,
    ].join("\n"),
  });
}
