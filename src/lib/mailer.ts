import nodemailer from "nodemailer";

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
