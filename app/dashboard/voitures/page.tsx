import Link from "next/link";
import { prisma } from "@/lib/prisma";
import DeleteVehicleButton from "./_components/DeleteVehicleButton";

export default async function VoituresAdminPage() {
  const vehicles = await prisma.vehicle.findMany({
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="p-6 lg:p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Véhicules</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            {vehicles.length} véhicule{vehicles.length !== 1 ? "s" : ""} enregistré{vehicles.length !== 1 ? "s" : ""}
          </p>
        </div>
        <Link
          href="/dashboard/voitures/new"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-semibold text-white transition-colors"
          style={{ backgroundColor: "#C8922A" }}
        >
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
          </svg>
          Ajouter un véhicule
        </Link>
      </div>

      {vehicles.length === 0 ? (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-16 text-center">
          <div className="text-4xl mb-4">🚗</div>
          <h2 className="text-lg font-semibold text-slate-700 mb-2">Aucun véhicule</h2>
          <p className="text-sm text-slate-400 mb-6">Ajoutez votre premier véhicule disponible à la location.</p>
          <Link
            href="/dashboard/voitures/new"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white"
            style={{ backgroundColor: "#C8922A" }}
          >
            Ajouter un véhicule
          </Link>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {vehicles.map((v) => (
            <div
              key={v.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col"
            >
              {/* Image */}
              <div className="relative h-44 bg-slate-100">
                {v.imageUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={v.imageUrl} alt={v.name} className="h-full w-full object-cover" />
                ) : (
                  <div className="h-full flex items-center justify-center text-5xl">🚗</div>
                )}
                <span
                  className="absolute top-3 right-3 rounded-full px-2.5 py-0.5 text-xs font-semibold"
                  style={{
                    backgroundColor: v.available ? "rgba(16,185,129,0.15)" : "rgba(239,68,68,0.12)",
                    color: v.available ? "#059669" : "#DC2626",
                    border: `1px solid ${v.available ? "rgba(16,185,129,0.3)" : "rgba(239,68,68,0.3)"}`,
                  }}
                >
                  {v.available ? "Disponible" : "Indisponible"}
                </span>
                {v.images.length > 1 && (
                  <span className="absolute bottom-3 right-3 rounded-full px-2 py-0.5 text-xs font-medium bg-black/50 text-white">
                    {v.images.length} photos
                  </span>
                )}
              </div>

              {/* Content */}
              <div className="p-4 flex-1 flex flex-col">
                <div className="flex items-start justify-between gap-2 mb-1">
                  <h2 className="text-base font-bold text-slate-900 leading-tight">{v.name}</h2>
                  <span className="shrink-0 text-xs text-slate-400 mt-0.5">{v.variant}</span>
                </div>
                <p className="text-sm text-slate-500 mb-3">
                  {v.color} · {v.seats} places · {v.fuel}
                </p>

                <div className="flex gap-3 text-sm mb-4">
                  <div>
                    <span className="text-xs text-slate-400">Court séjour</span>
                    <p className="font-semibold text-slate-800">{v.priceDay.toLocaleString("fr-FR")} XOF/j</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400">Long séjour</span>
                    <p className="font-semibold text-slate-800">{v.priceLong.toLocaleString("fr-FR")} XOF/j</p>
                  </div>
                </div>

                {v.features.length > 0 && (
                  <div className="flex flex-wrap gap-1 mb-4">
                    {v.features.slice(0, 4).map((f) => (
                      <span
                        key={f}
                        className="rounded-full px-2 py-0.5 text-xs"
                        style={{ backgroundColor: "rgba(200,146,42,0.1)", color: "#A97620" }}
                      >
                        {f}
                      </span>
                    ))}
                    {v.features.length > 4 && (
                      <span className="text-xs text-slate-400 px-1 py-0.5">+{v.features.length - 4}</span>
                    )}
                  </div>
                )}

                {/* Actions */}
                <div className="mt-auto flex items-center gap-2">
                  <Link
                    href={`/dashboard/voitures/${v.id}/edit`}
                    className="flex-1 text-center rounded-lg border border-slate-200 px-3 py-2 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors"
                  >
                    Modifier
                  </Link>
                  <DeleteVehicleButton id={v.id} name={v.name} />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
