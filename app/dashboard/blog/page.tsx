import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { deletePost } from "./_actions";

export const dynamic = "force-dynamic";

export default async function DashboardBlogPage() {
  const posts = await prisma.post.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="p-6 lg:p-8 max-w-4xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-bold text-slate-900">Journal</h1>
          <p className="text-sm text-slate-400 mt-0.5">Rédigez et publiez les articles du blog AKIL IMMO.</p>
        </div>
        <Link
          href="/dashboard/blog/new"
          className="rounded-lg bg-[#C8922A] px-4 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#A97620] transition-colors"
        >
          + Nouvel article
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-10 text-center">
          <p className="text-sm text-slate-500">
            Aucun article en base. Deux articles « starter » restent visibles sur le site
            tant que vous n&apos;avez rien publié ici. Cliquez sur « Nouvel article » pour commencer.
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-slate-100 text-left text-xs uppercase tracking-wide text-slate-400">
                <th className="px-5 py-3 font-medium">Titre</th>
                <th className="px-5 py-3 font-medium">Catégorie</th>
                <th className="px-5 py-3 font-medium">Statut</th>
                <th className="px-5 py-3 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {posts.map((p) => (
                <tr key={p.id} className="border-b border-slate-50 last:border-0">
                  <td className="px-5 py-3">
                    <span className="font-medium text-slate-900">{p.title}</span>
                    {p.featured && <span className="ml-2 text-xs text-[#C8922A]">★ vedette</span>}
                  </td>
                  <td className="px-5 py-3 text-slate-500">{p.category}</td>
                  <td className="px-5 py-3">
                    {p.published ? (
                      <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-medium text-emerald-700">Publié</span>
                    ) : (
                      <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-500">Brouillon</span>
                    )}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center justify-end gap-3">
                      <Link href={`/dashboard/blog/${p.id}/edit`} className="text-[#C8922A] hover:underline">Éditer</Link>
                      <form action={deletePost.bind(null, p.id)}>
                        <button type="submit" className="text-red-600 hover:underline cursor-pointer">Supprimer</button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
