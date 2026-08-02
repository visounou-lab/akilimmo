import { CATEGORIES } from "@/lib/blog";

type PostDefaults = {
  title?: string;
  slug?: string;
  excerpt?: string;
  category?: string;
  cover?: string | null;
  author?: string;
  body?: string;
  published?: boolean;
  featured?: boolean;
};

const input =
  "w-full rounded-lg border border-slate-200 px-3 py-2.5 text-sm text-slate-900 outline-none focus:border-[#C8922A] focus:ring-2 focus:ring-[#C8922A]/20 transition-colors";
const label = "block text-sm font-medium text-slate-700 mb-1.5";

export default function PostForm({
  action,
  post,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  post?: PostDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="space-y-5">
      <div>
        <label className={label} htmlFor="title">Titre</label>
        <input id="title" name="title" required defaultValue={post?.title} className={input} placeholder="Titre de l'article" />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="slug">Slug (URL) — optionnel</label>
          <input id="slug" name="slug" defaultValue={post?.slug} className={input} placeholder="genere-depuis-le-titre" />
        </div>
        <div>
          <label className={label} htmlFor="category">Catégorie</label>
          <select id="category" name="category" defaultValue={post?.category ?? "Conseils"} className={input}>
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className={label} htmlFor="excerpt">Résumé (accroche)</label>
        <textarea id="excerpt" name="excerpt" required rows={2} defaultValue={post?.excerpt} className={input} placeholder="Une phrase qui donne envie de lire l'article." />
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className={label} htmlFor="cover">Couverture (URL de l&apos;image)</label>
          <input id="cover" name="cover" defaultValue={post?.cover ?? ""} className={input} placeholder="/brand/blog/cover-default.jpg ou une URL Cloudinary" />
        </div>
        <div>
          <label className={label} htmlFor="author">Auteur</label>
          <input id="author" name="author" defaultValue={post?.author ?? "AKIL IMMO"} className={input} />
        </div>
      </div>

      <div>
        <label className={label} htmlFor="body">Contenu (Markdown)</label>
        <textarea
          id="body"
          name="body"
          required
          rows={18}
          defaultValue={post?.body}
          className={`${input} font-mono`}
          placeholder={"## Un sous-titre\n\nVotre texte…\n\n- Un point\n- Un autre\n\n> Une citation mise en avant."}
        />
        <p className="mt-1.5 text-xs text-slate-400">
          Markdown supporté : ## titres, **gras**, listes, &gt; citations, [liens](url), images.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-6">
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" name="published" defaultChecked={post?.published} className="h-4 w-4 accent-[#C8922A]" />
          Publier (visible sur le site)
        </label>
        <label className="flex items-center gap-2 text-sm text-slate-700 cursor-pointer">
          <input type="checkbox" name="featured" defaultChecked={post?.featured} className="h-4 w-4 accent-[#C8922A]" />
          Article vedette (en tête du Journal)
        </label>
      </div>

      <div className="pt-2">
        <button
          type="submit"
          className="rounded-lg bg-[#C8922A] px-6 py-2.5 text-sm font-semibold text-[#1C1917] hover:bg-[#A97620] transition-colors cursor-pointer"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
}
