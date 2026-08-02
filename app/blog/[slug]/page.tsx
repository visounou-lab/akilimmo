import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Navbar from "../../../components/v3/Navbar";
import Footer from "../../../components/v3/Footer";
import BlogCard from "../../../components/v3/blog/BlogCard";
import { JsonLd } from "../../../components/seo/JsonLd";
import { getAllSlugs, getPost, getRelatedPosts, CATEGORY_META } from "@/lib/blog";

const SITE = "https://www.akilimmo.com";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return getAllSlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) return { title: "Article introuvable — AKIL IMMO" };
  const url = `${SITE}/blog/${post.slug}`;
  const cover = post.cover || "/brand/blog/cover-default.jpg";
  return {
    title: post.title,
    description: post.excerpt,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      title: post.title,
      description: post.excerpt,
      url,
      images: [{ url: cover, width: 1200, height: 675, alt: post.title }],
      publishedTime: post.isoDate,
      authors: [post.author ?? "AKIL IMMO"],
    },
    twitter: { card: "summary_large_image", title: post.title, description: post.excerpt, images: [cover] },
  };
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = await getPost(slug);
  if (!post) notFound();

  const cat = CATEGORY_META[post.category] ?? { label: post.category, color: "#C8922A" };
  const url = `${SITE}/blog/${post.slug}`;
  const cover = post.cover || "/brand/blog/cover-default.jpg";
  const related = getRelatedPosts(post.slug, post.category);

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    image: [`${SITE}${cover}`],
    datePublished: post.isoDate,
    dateModified: post.isoDate,
    inLanguage: "fr",
    author: { "@type": "Organization", name: post.author ?? "AKIL IMMO", url: SITE },
    publisher: { "@id": `${SITE}/#organization` },
    mainEntityOfPage: { "@type": "WebPage", "@id": url },
  };
  const breadcrumbLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Accueil", item: SITE },
      { "@type": "ListItem", position: 2, name: "Journal", item: `${SITE}/blog` },
      { "@type": "ListItem", position: 3, name: post.title, item: url },
    ],
  };

  const waShare = `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${url}`)}`;
  const fbShare = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;

  return (
    <>
      <JsonLd data={articleLd} />
      <JsonLd data={breadcrumbLd} />
      <Navbar />
      <main id="main-content" style={{ backgroundColor: "#FDFCF8" }}>
        <article className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 pt-24 pb-16">
          {/* Fil d'Ariane */}
          <nav
            aria-label="Fil d'Ariane"
            className="mb-6 flex items-center gap-2 text-xs"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#8A7F73" }}
          >
            <a href="/" className="hover:underline cursor-pointer">Accueil</a>
            <span aria-hidden="true">/</span>
            <a href="/blog" className="hover:underline cursor-pointer">Journal</a>
          </nav>

          {/* Catégorie + titre + méta */}
          <span
            className="inline-block rounded-full px-3 py-1 text-xs font-medium"
            style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: cat.color, color: "#FDFCF8", letterSpacing: "0.04em" }}
          >
            {cat.label}
          </span>
          <h1
            className="mt-4"
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(1.9rem, 4.5vw, 3rem)",
              color: "#1C1917",
              lineHeight: 1.18,
              letterSpacing: "-0.015em",
            }}
          >
            {post.title}
          </h1>
          <div
            className="mt-4 flex flex-wrap items-center gap-2 text-sm"
            style={{ fontFamily: "var(--font-inter), sans-serif", color: "#6B5E52" }}
          >
            <span style={{ fontWeight: 500 }}>{post.author}</span>
            <span aria-hidden="true">·</span>
            <time dateTime={post.isoDate}>{post.displayDate}</time>
            <span aria-hidden="true">·</span>
            <span>{post.readingMinutes} min de lecture</span>
          </div>

          {/* Couverture */}
          <div className="mt-8 overflow-hidden rounded-2xl" style={{ border: "1px solid #E8DDD0" }}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={cover} alt={post.title} className="w-full h-auto" style={{ aspectRatio: "16 / 9", objectFit: "cover" }} />
          </div>

          {/* Corps */}
          <div
            className="blog-prose mt-10"
            dangerouslySetInnerHTML={{ __html: post.html }}
          />

          {/* Partage */}
          <div
            className="mt-12 flex flex-wrap items-center gap-3 border-t pt-6"
            style={{ borderColor: "#E8DDD0", fontFamily: "var(--font-inter), sans-serif" }}
          >
            <span style={{ fontSize: "0.85rem", color: "#6B5E52", fontWeight: 500 }}>Partager :</span>
            <a href={waShare} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 text-sm cursor-pointer transition-colors" style={{ backgroundColor: "#1B4D3E", color: "#FDFCF8" }}>WhatsApp</a>
            <a href={fbShare} target="_blank" rel="noopener noreferrer" className="rounded-full px-4 py-2 text-sm cursor-pointer transition-colors" style={{ backgroundColor: "#1C1917", color: "#FDFCF8" }}>Facebook</a>
          </div>
        </article>

        {/* CTA */}
        <section className="px-4 py-14 text-center" style={{ backgroundColor: "#1B4D3E" }}>
          <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "clamp(1.5rem, 3.5vw, 2.2rem)", color: "#FDFCF8", marginBottom: "0.75rem" }}>
            Un projet de logement ?
          </h2>
          <p className="mx-auto mb-6 max-w-xl" style={{ fontFamily: "var(--font-inter), sans-serif", fontWeight: 300, color: "rgba(253,252,248,0.8)" }}>
            Parcourez nos biens meublés vérifiés à Abidjan, Cotonou et Abomey-Calavi.
          </p>
          <a href="/biens" className="inline-block rounded-lg px-7 py-3.5 text-sm font-semibold cursor-pointer transition-transform" style={{ fontFamily: "var(--font-inter), sans-serif", backgroundColor: "#C8922A", color: "#1C1917" }}>
            Voir les biens disponibles
          </a>
        </section>

        {/* Articles liés */}
        {related.length > 0 && (
          <section className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14">
            <h2 style={{ fontFamily: "var(--font-playfair), serif", fontWeight: 700, fontSize: "1.6rem", color: "#1C1917", marginBottom: "1.5rem" }}>
              À lire aussi
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  );
}
