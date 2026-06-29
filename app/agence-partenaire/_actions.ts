"use server";

import { prisma } from "@/lib/prisma";
import { transporter } from "@/lib/mailer";

export async function submitAgentApplication(formData: FormData) {
  const agencyName   = (formData.get("agencyName") as string).trim();
  const contactName  = (formData.get("contactName") as string).trim();
  const email        = (formData.get("email") as string).trim().toLowerCase();
  const phone        = (formData.get("phone") as string).trim();
  const city         = (formData.get("city") as string).trim();
  const country      = formData.get("country") as "BENIN" | "COTE_D_IVOIRE";
  const documentType = formData.get("documentType") as string;
  const message      = ((formData.get("message") as string) ?? "").trim();

  if (!agencyName || !contactName || !email || !phone || !city || !country || !documentType) {
    return { success: false, error: "Tous les champs obligatoires doivent être remplis." };
  }

  const existing = await prisma.agentApplication.findFirst({ where: { email } });
  if (existing) {
    return { success: false, error: "Cette adresse email est déjà enregistrée sur la liste d'attente." };
  }

  await prisma.agentApplication.create({
    data: { agencyName, contactName, email, phone, city, country, documentType, message },
  });

  const docLabel = documentType === "registre_commerce" ? "Registre de commerce" : "Carte d'exercice de démarchage";

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: "david@akilimmo.com",
    subject: `Nouvelle candidature agent partenaire — ${agencyName}`,
    html: `
      <div style="font-family:sans-serif;max-width:600px;margin:0 auto;padding:32px">
        <p style="font-size:18px;font-weight:700;color:#1C1917;margin-bottom:20px">Nouvelle candidature agent partenaire</p>
        <table style="width:100%;border-collapse:collapse;font-size:14px">
          <tr><td style="padding:8px 0;color:#6B5E52;width:180px">Agence</td><td style="padding:8px 0;color:#1C1917;font-weight:600">${agencyName}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Responsable</td><td style="padding:8px 0;color:#1C1917">${contactName}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Email</td><td style="padding:8px 0;color:#1C1917">${email}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Téléphone</td><td style="padding:8px 0;color:#1C1917">${phone}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Ville</td><td style="padding:8px 0;color:#1C1917">${city}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Pays</td><td style="padding:8px 0;color:#1C1917">${country === "COTE_D_IVOIRE" ? "Côte d'Ivoire" : "Bénin"}</td></tr>
          <tr><td style="padding:8px 0;color:#6B5E52">Document</td><td style="padding:8px 0;color:#C8922A;font-weight:600">${docLabel}</td></tr>
          ${message ? `<tr><td style="padding:8px 0;color:#6B5E52;vertical-align:top">Message</td><td style="padding:8px 0;color:#1C1917">${message}</td></tr>` : ""}
        </table>
        <p style="margin-top:24px;font-size:13px;color:#94A3B8">Consultez toutes les candidatures dans le dashboard admin AKIL IMMO.</p>
      </div>
    `,
  });

  return { success: true };
}
