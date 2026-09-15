import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import PostForm from "../../_components/PostForm";
import { updatePost } from "../../_actions";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await prisma.post.findUnique({ where: { id } });
  if (!post) notFound();

  return (
    <div className="p-6 lg:p-8 max-w-3xl">
      <div className="flex items-center gap-2 text-sm text-slate-400 mb-6">
        <Link href="/dashboard/blog" className="hover:text-[#C8922A] transition-colors">Journal</Link>
        <span className="text-slate-300">/</span>
        <span className="text-slate-600">Éditer</span>
      </div>
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Éditer l&apos;article</h1>
            <p className="text-sm text-slate-400 mt-0.5">{post.title}</p>
          </div>
          {post.published && (
            <Link href={`/blog/${post.slug}`} target="_blank" className="text-sm text-[#C8922A] hover:underline">
              Voir en ligne ↗
            </Link>
          )}
        </div>
        <PostForm action={updatePost.bind(null, post.id)} post={post} submitLabel="Enregistrer" />
      </div>
    </div>
  );
}
