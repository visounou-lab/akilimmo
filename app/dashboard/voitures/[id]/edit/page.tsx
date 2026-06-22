import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import VehicleForm from "../../_components/VehicleForm";
import { updateVehicle } from "../../_actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditVehiclePage({ params }: Props) {
  const { id } = await params;

  const vehicle = await prisma.vehicle.findUnique({ where: { id } });
  if (!vehicle) notFound();

  const boundUpdate = updateVehicle.bind(null, id);

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/voitures" className="hover:text-[#C8922A] transition-colors">
          Voitures
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Modifier — {vehicle.name}</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Modifier le véhicule</h1>
          <p className="text-sm text-slate-400 mt-0.5">{vehicle.name} · {vehicle.color}</p>
        </div>
        <VehicleForm
          action={boundUpdate}
          defaultValues={{
            name:      vehicle.name,
            variant:   vehicle.variant,
            color:     vehicle.color,
            seats:     vehicle.seats,
            fuel:      vehicle.fuel,
            features:  vehicle.features,
            priceDay:  vehicle.priceDay,
            priceLong: vehicle.priceLong,
            available: vehicle.available,
            images:    vehicle.images,
          }}
          submitLabel="Enregistrer les modifications"
          vehicleId={id}
        />
      </div>
    </div>
  );
}
