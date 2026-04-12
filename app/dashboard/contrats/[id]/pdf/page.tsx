import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

function formatPrice(price: unknown) {
  return new Intl.NumberFormat("fr-FR").format(Number(price)) + " XOF";
}

function formatDate(date: Date) {
  return new Intl.DateTimeFormat("fr-FR", { day: "2-digit", month: "long", year: "numeric" }).format(date);
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function ContratPdfPage({ params }: Props) {
  const { id } = await params;

  const contract = await prisma.contract.findUnique({
    where: { id },
    include: {
      property: true,
      tenant:   { select: { name: true, email: true } },
      owner:    { select: { name: true, email: true } },
    },
  });

  if (!contract) notFound();

  const months = Math.round(
    (contract.endDate.getTime() - contract.startDate.getTime()) / (1000 * 60 * 60 * 24 * 30)
  );
  const total = Number(contract.rentAmount) * months;

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "En attente", ACTIVE: "Actif", TERMINATED: "Résilié",
  };

  return (
    <html lang="fr">
      <head>
        <meta charSet="utf-8" />
        <title>Contrat — {contract.property.title}</title>
        <style>{`
          @page { size: A4; margin: 2cm; }
          * { box-sizing: border-box; }
          body { font-family: Georgia, serif; color: #1e293b; line-height: 1.6; }
          .print-btn {
            position: fixed; top: 1rem; right: 1rem;
            background: #0066CC; color: #fff; border: none;
            padding: 0.5rem 1.2rem; border-radius: 8px;
            font-family: sans-serif; font-size: 14px; cursor: pointer;
          }
          @media print { .print-btn { display: none; } }
          .header { text-align: center; border-bottom: 3px solid #0066CC; padding-bottom: 1.5rem; margin-bottom: 2rem; }
          .header h1 { font-size: 28px; color: #0066CC; letter-spacing: 2px; margin: 0 0 0.25rem; }
          .header p { color: #64748b; font-style: italic; margin: 0; }
          .badge {
            display: inline-block; padding: 3px 12px; border-radius: 20px;
            font-family: sans-serif; font-size: 12px; font-weight: 600;
            background: #f0f9ff; color: #0066CC; border: 1px solid #bae6fd;
          }
          .section { margin-bottom: 2rem; }
          .section h2 {
            font-family: sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px;
            text-transform: uppercase; color: #64748b;
            border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1rem;
          }
          .grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
          .field p { margin: 0; }
          .field .label { font-family: sans-serif; font-size: 11px; color: #94a3b8; }
          .field .value { font-size: 15px; font-weight: 600; }
          .highlight { color: #0066CC; }
          .parties { display: grid; grid-template-columns: 1fr 1fr; gap: 2rem; }
          .party { background: #f8fafc; border-radius: 8px; padding: 1rem; }
          .party .role { font-family: sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #94a3b8; margin-bottom: 0.5rem; }
          .party .name { font-size: 16px; font-weight: 700; }
          .party .email { font-family: sans-serif; font-size: 12px; color: #64748b; }
          .signatures { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; margin-top: 3rem; }
          .sig-box { border-top: 1px solid #cbd5e1; padding-top: 0.5rem; text-align: center; }
          .sig-box p { font-family: sans-serif; font-size: 12px; color: #94a3b8; margin: 0; }
          .footer { margin-top: 3rem; text-align: center; font-family: sans-serif; font-size: 11px; color: #94a3b8; }
        `}</style>
      </head>
      <body>
        <button className="print-btn" onClick={() => window.print()}>
          Imprimer / Enregistrer PDF
        </button>

        <div className="header">
          <img src="/logo.png" alt="Akil Immo" width="80" style={{ margin: "0 auto 0.75rem" }} />
          <h1>AKIL IMMO</h1>
          <p>Contrat de location</p>
        </div>

        <div className="section">
          <h2>Bien immobilier</h2>
          <p style={{ fontSize: "18px", fontWeight: "bold", marginBottom: "0.5rem" }}>{contract.property.title}</p>
          <p style={{ color: "#64748b", marginTop: 0 }}>{contract.property.address}, {contract.property.city}</p>
        </div>

        <div className="section">
          <h2>Parties</h2>
          <div className="parties">
            <div className="party">
              <div className="role">Bailleur (Propriétaire)</div>
              <div className="name">{contract.owner.name ?? "—"}</div>
              <div className="email">{contract.owner.email}</div>
            </div>
            <div className="party">
              <div className="role">Locataire</div>
              <div className="name">{contract.tenant.name ?? "—"}</div>
              <div className="email">{contract.tenant.email}</div>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Conditions du contrat</h2>
          <div className="grid">
            <div className="field">
              <p className="label">Date de début</p>
              <p className="value">{formatDate(contract.startDate)}</p>
            </div>
            <div className="field">
              <p className="label">Date de fin</p>
              <p className="value">{formatDate(contract.endDate)}</p>
            </div>
            <div className="field">
              <p className="label">Durée</p>
              <p className="value">{months} mois</p>
            </div>
            <div className="field">
              <p className="label">Loyer mensuel</p>
              <p className="value highlight">{formatPrice(contract.rentAmount)}</p>
            </div>
            <div className="field">
              <p className="label">Montant total</p>
              <p className="value">{formatPrice(total)}</p>
            </div>
            <div className="field">
              <p className="label">Statut</p>
              <p className="value"><span className="badge">{STATUS_LABEL[contract.status]}</span></p>
            </div>
          </div>
        </div>

        <div className="section">
          <h2>Clauses générales</h2>
          <p>Le locataire s&apos;engage à payer le loyer le 5 de chaque mois. Tout retard de paiement supérieur à 15 jours entraînera des pénalités. Le bien doit être restitué dans l&apos;état initial à la fin du contrat.</p>
          <p>Le bailleur s&apos;engage à mettre le logement en bon état de réparation à usage locatif et à ne pas perturber la jouissance paisible du locataire pendant toute la durée du contrat.</p>
        </div>

        <div className="signatures">
          <div className="sig-box">
            <p>Signature du Bailleur</p>
            <p>{contract.owner.name ?? "—"}</p>
          </div>
          <div className="sig-box">
            <p>Signature du Locataire</p>
            <p>{contract.tenant.name ?? "—"}</p>
          </div>
        </div>

        <div className="footer">
          <p>Document généré par AKIL IMMO — {new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </body>
    </html>
  );
}
