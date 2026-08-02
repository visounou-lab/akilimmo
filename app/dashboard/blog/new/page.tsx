import Link from "next/link";
import PostForm from "../_components/PostForm";
import { createPost } from "../_actions";

export const dynamic = "force-dynamic";

export default function NewPostPage() {
  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/blog" className="hover:text-[#C8922A] transition-colors">Journal</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">Nouvel article</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-slate-900">Nouvel article</h1>
          <p className="text-sm text-slate-400 mt-0.5">Rédigez en Markdown. Cochez « Publier » pour le rendre visible.</p>
        </div>
        <PostForm action={createPost} submitLabel="Créer l'article" />
      </div>
    </div>
  );
}
