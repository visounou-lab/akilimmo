import type { Metadata } from "next";
import Navbar from "../../components/v3/Navbar";
import Footer from "../../components/v3/Footer";
import BlogCard from "../../components/v3/blog/BlogCard";
import { getAllPosts } from "@/lib/blog";
import { JsonLd } from "../../components/seo/JsonLd";

export const metadata: Metadata = {
  title: "Journal — Conseils, sécurité & marché immobilier",
  description:
    "Le journal AKIL IMMO : conseils pour louer et investir en Côte d'Ivoire et au Bénin, prévention des arnaques, tendances du marché et actualités de la diaspora.",
  alternates: { canonical: "https://www.akilimmo.com/blog" },
  openGraph: {
    title: "Journal AKIL IMMO",
    description:
      "Conseils immobiliers, prévention des arnaques et marché en Côte d'Ivoire et au Bénin.",
    url: "https://www.akilimmo.com/blog",
    images: ["/brand/blog/cover-default.jpg"],
  },
};

export default async function BlogIndexPage() {
  const posts = await getAllPosts();
  const featured = posts.find((p) => p.featured) ?? posts[0];
  const rest = posts.filter((p) => p.slug !== featured?.slug);

  const blogLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Journal AKIL IMMO",
    url: "https://www.akilimmo.com/blog",
    inLanguage: "fr",
    publisher: { "@id": "https://www.akilimmo.com/#organization" },
    blogPost: posts.slice(0, 20).map((p) => ({
      "@type": "BlogPosting",
      headline: p.title,
      url: `https://www.akilimmo.com/blog/${p.slug}`,
      datePublished: p.isoDate,
    })),
  };

  return (
    <>
      <JsonLd data={blogLd} />
      <Navbar />
      <main id="main-content" style={{ backgroundColor: "#FDFCF8" }}>
        {/* En-tête */}
        <header className="pt-28 pb-14 px-4 text-center" style={{ backgroundColor: "#1C1917" }}>
          <div className="mx-auto mb-5 flex items-center justify-center gap-3" aria-hidden="true">
            <span style={{ width: 44, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
            <span style={{ width: 7, height: 7, backgroundColor: "#C8922A", borderRadius: "50%" }} />
            <span style={{ width: 44, height: 1, backgroundColor: "#C8922A", opacity: 0.6 }} />
          </div>
          <h1
            style={{
              fontFamily: "var(--font-playfair), serif",
              fontWeight: 700,
              fontSize: "clamp(2rem, 5vw, 3.2rem)",
              color: "#FDFCF8",
              letterSpacing: "-0.01em",
            }}
          >
            Le Journal AKIL IMMO
          </h1>
          <p
            className="mx-auto mt-3 max-w-2xl"
            style={{
              fontFamily: "var(--font-inter), sans-serif",
              fontWeight: 300,
              fontSize: "1.05rem",
              color: "rgba(253,252,248,0.72)",
              lineHeight: 1.7,
            }}
          >
            Conseils, prévention des arnaques et regards sur l&apos;immobilier en Côte d&apos;Ivoire
            et au Bénin — pour décider sereinement, où que vous soyez.
          </p>
        </header>

        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          {posts.length === 0 && (
            <p style={{ fontFamily: "var(--font-inter), sans-serif", color: "#5C544C", textAlign: "center" }}>
              Les premiers articles arrivent très bientôt.
            </p>
          )}

          {featured && (
            <section className="mb-12">
              <BlogCard post={featured} featured />
            </section>
          )}

          {rest.length > 0 && (
            <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {rest.map((post) => (
                <BlogCard key={post.slug} post={post} />
              ))}
            </section>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}
