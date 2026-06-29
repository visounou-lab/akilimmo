import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PropertyForm from "../../_components/PropertyForm";
import { updateProperty, approveAllPropertyImages } from "../../_actions";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditBienPage({ params }: Props) {
  const { id } = await params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: { images: { orderBy: { order: "asc" } } },
  });

  if (!property) notFound();

  const pendingCount = (property as any).images?.filter((img: any) => img.status === "PENDING").length ?? 0;

  const boundAction = updateProperty.bind(null, id);
  const boundApprove = approveAllPropertyImages.bind(null, id);

  return (
    <div className="p-8 max-w-3xl">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/biens" className="hover:text-[#C8922A] transition-colors">
          Biens
        </Link>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600 truncate max-w-[200px]">{property.title}</span>
        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
        </svg>
        <span className="text-slate-600">Modifier</span>
      </div>

      {/* Alerte photos en attente */}
      {pendingCount > 0 && (
        <div className="mb-6 flex items-center justify-between gap-4 rounded-xl border border-amber-200 bg-amber-50 px-5 py-4">
          <p className="text-sm font-medium text-amber-800">
            ⚠️ {pendingCount} photo{pendingCount > 1 ? "s" : ""} en attente de validation — non visibles sur le site public.
          </p>
          <form action={boundApprove}>
            <button
              type="submit"
              className="shrink-0 rounded-lg bg-amber-500 px-4 py-2 text-sm font-semibold text-white hover:bg-amber-600 transition-colors"
            >
              Valider les photos
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Modifier le bien</h1>
          <p className="text-sm text-slate-400 mt-0.5 truncate">{property.title}</p>
        </div>
        <PropertyForm
          action={boundAction}
          submitLabel="Enregistrer les modifications"
          propertyId={id}
          defaultValues={{
            title:       property.title,
            description: property.description,
            country:     property.country,
            city:        property.city,
            address:     property.address,
            price:       Number(property.price),
            status:      property.status,
            bedrooms:    property.bedrooms,
            bathrooms:   property.bathrooms,
            imageUrl:    property.imageUrl,
            videoUrl:    property.videoUrl,
            images:      (property as any).images ?? [],
          }}
        />
      </div>
    </div>
  );
}
