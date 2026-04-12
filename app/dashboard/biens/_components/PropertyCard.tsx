import Link from "next/link";
import Image from "next/image";
import DeleteButton from "./DeleteButton";

const COUNTRY_LABEL: Record<string, string> = {
  BENIN:         "Bénin",
  COTE_D_IVOIRE: "Côte d'Ivoire",
};

const STATUS_CONFIG: Record<string, { label: string; classes: string }> = {
  AVAILABLE:   { label: "Disponible",  classes: "bg-emerald-50 text-emerald-700" },
  RESERVED:    { label: "Réservé",     classes: "bg-[#0066CC]/10 text-[#0066CC]" },
  RENTED:      { label: "Loué",        classes: "bg-red-50 text-red-600" },
  OFF_MARKET:  { label: "Hors marché", classes: "bg-slate-100 text-slate-500" },
  MAINTENANCE: { label: "Maintenance", classes: "bg-orange-50 text-orange-600" },
};

interface PropertyCardProps {
  property: {
    id: string;
    title: string;
    city: string;
    country: string;
    price: unknown;
    status: string;
    bedrooms: number;
    bathrooms: number;
    imageUrl: string | null;
    owner: { name: string | null };
  };
}

export default function PropertyCard({ property: p }: PropertyCardProps) {
  const status = STATUS_CONFIG[p.status] ?? STATUS_CONFIG.OFF_MARKET;
  const price  = new Intl.NumberFormat("fr-FR").format(Number(p.price));

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden group flex flex-col">
      {/* Image */}
      <div className="relative h-44 bg-slate-100 overflow-hidden shrink-0">
        {p.imageUrl ? (
          <Image
            src={p.imageUrl}
            alt={p.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 33vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-10 h-10 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        )}
        {/* Badge statut */}
        <span className={`absolute top-3 right-3 inline-flex px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${status.classes}`}>
          {status.label}
        </span>
      </div>

      {/* Contenu */}
      <div className="p-5 flex flex-col flex-1">
        <div className="flex-1">
          <p className="font-semibold text-slate-800 truncate">{p.title}</p>
          <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
            <svg className="w-3 h-3 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {p.city} · {COUNTRY_LABEL[p.country] ?? p.country}
          </p>

          <div className="flex items-end justify-between mt-3">
            <div>
              <p className="text-lg font-bold text-[#0066CC] leading-none">{price}</p>
              <p className="text-xs text-slate-400 mt-0.5">XOF / mois</p>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <svg className="w-3.5 h-3.5 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                {p.bedrooms} ch.
              </span>
              <span className="text-slate-300">·</span>
              <span>{p.bathrooms} sdb</span>
            </div>
          </div>

          <p className="text-xs text-slate-400 mt-2 truncate">
            Propriétaire : {p.owner.name ?? "—"}
          </p>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
          <Link
            href={`/dashboard/biens/${p.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors"
          >
            <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
            Modifier
          </Link>
          <DeleteButton id={p.id} />
        </div>
      </div>
    </div>
  );
}
