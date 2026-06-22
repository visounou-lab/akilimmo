import Link from "next/link";
import VehicleForm from "../_components/VehicleForm";
import { createVehicle } from "../_actions";

export default function NewVehiclePage() {
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
        <span className="text-slate-600">Nouveau véhicule</span>
      </div>

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Ajouter un véhicule</h1>
          <p className="text-sm text-slate-400 mt-0.5">
            Renseignez les informations du véhicule disponible à la location.
          </p>
        </div>
        <VehicleForm action={createVehicle} submitLabel="Créer le véhicule" />
      </div>
    </div>
  );
}
