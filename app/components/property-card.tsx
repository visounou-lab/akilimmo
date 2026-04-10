interface PropertyCardProps {
  property: {
    id: number;
    title: string;
    location: string;
    country: string;
    price: string;
    status: string;
    bedrooms: number;
    bathrooms: number;
    area: string;
  };
}

export default function PropertyCard({ property }: PropertyCardProps) {
  const statusClass =
    property.status === "Réservé"
      ? "bg-[#0066CC]/10 text-[#0066CC]"
      : "bg-slate-100 text-slate-600";

  return (
    <article className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-white to-slate-50 shadow-lg transition-transform duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="bg-slate-100/80 p-6">
        <div className="mb-4 inline-flex rounded-full bg-[#0066CC]/10 px-3 py-1 text-sm font-semibold text-[#0066CC]">
          {property.country}
        </div>
        <h3 className="text-xl font-semibold text-slate-950">{property.title}</h3>
        <p className="mt-2 text-sm leading-6 text-slate-600">{property.location}</p>
      </div>
      <div className="space-y-4 border-t border-slate-200 p-6">
        <div className="flex items-center justify-between gap-4">
          <p className="text-lg font-semibold text-slate-950">{property.price}</p>
          <span className={`rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClass}`}>
            {property.status}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-3 text-sm text-slate-600 sm:grid-cols-4">
          <span>{property.bedrooms} chambres</span>
          <span>{property.bathrooms} salles de bain</span>
          <span>{property.area}</span>
          <span>{property.country}</span>
        </div>
      </div>
    </article>
  );
}
