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

const printStyles = `
  @media print {
    aside, header, nav, .print-btn-bar { display: none !important; }
    main { margin: 0 !important; padding: 0 !important; }
    body { background: white !important; }
  }
  @page { size: A4; margin: 2cm; }
  * { box-sizing: border-box; }
  .contract-doc { font-family: Georgia, serif; color: #1e293b; line-height: 1.6; max-width: 700px; margin: 0 auto; }
  .doc-header { text-align: center; border-bottom: 3px solid #0066CC; padding-bottom: 1.5rem; margin-bottom: 2rem; }
  .doc-header h1 { font-size: 26px; color: #0066CC; letter-spacing: 2px; margin: 0 0 0.25rem; }
  .doc-header p { color: #64748b; font-style: italic; margin: 0; }
  .badge { display: inline-block; padding: 3px 12px; border-radius: 20px; font-family: sans-serif; font-size: 12px; font-weight: 600; background: #f0f9ff; color: #0066CC; border: 1px solid #bae6fd; }
  .section { margin-bottom: 2rem; }
  .section h2 { font-family: sans-serif; font-size: 11px; font-weight: 700; letter-spacing: 1px; text-transform: uppercase; color: #64748b; border-bottom: 1px solid #e2e8f0; padding-bottom: 0.5rem; margin-bottom: 1rem; }
  .grid2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
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
  .doc-footer { margin-top: 3rem; text-align: center; font-family: sans-serif; font-size: 11px; color: #94a3b8; }
`;

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

  const months = Math.max(1,
    (contract.endDate.getFullYear() - contract.startDate.getFullYear()) * 12 +
    (contract.endDate.getMonth() - contract.startDate.getMonth())
  );
  const total = Number(contract.rentAmount) * months;

  const STATUS_LABEL: Record<string, string> = {
    PENDING: "En attente", ACTIVE: "Actif", TERMINATED: "Résilié",
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: printStyles }} />

      {/* Barre d'impression — masquée à l'impression */}
      <div className="print-btn-bar flex items-center justify-between px-6 py-3 bg-white border-b border-slate-100 mb-6">
        <p className="text-sm text-slate-500">Aperçu du contrat — {contract.property.title}</p>
        <button
          id="print-btn"
          className="inline-flex items-center gap-2 bg-[#0066CC] hover:bg-[#004499] text-white px-5 py-2 rounded-full text-sm font-semibold transition"
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
          </svg>
          Imprimer / Enregistrer PDF
        </button>
      </div>

      <script dangerouslySetInnerHTML={{ __html: `document.getElementById('print-btn').addEventListener('click',function(){window.print();});` }} />

      {/* Contenu du contrat */}
      <div className="contract-doc px-6 pb-12">

        <div className="doc-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src="/logo.png" alt="Akil Immo" width={70} style={{ margin: "0 auto 0.75rem", display: "block" }} />
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
          <div className="grid2">
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

        <div className="doc-footer">
          <p>Document généré par AKIL IMMO — {new Date().toLocaleDateString("fr-FR")}</p>
        </div>
      </div>
    </>
  );
}
