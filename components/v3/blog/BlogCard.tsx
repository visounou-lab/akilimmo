import type { BlogPostMeta } from "@/lib/blog";
import { CATEGORY_META } from "@/lib/blog";

const COVER_FALLBACK = "/brand/blog/cover-default.jpg";

export default function BlogCard({ post, featured = false }: { post: BlogPostMeta; featured?: boolean }) {
  const cat = CATEGORY_META[post.category] ?? { label: post.category, color: "#C8922A" };
  return (
    <a
      href={`/blog/${post.slug}`}
      className="group flex flex-col overflow-hidden rounded-2xl cursor-pointer transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C8922A]"
      style={{
        backgroundColor: "#FFFFFF",
        border: "1px solid #E8DDD0",
        boxShadow: "0 2px 12px rgba(28,25,23,0.05)",
      }}
    >
      <div style={{ position: "relative", aspectRatio: featured ? "16 / 8" : "16 / 9", overflow: "hidden" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={post.cover || COVER_FALLBACK}
          alt={post.title}
          loading="lazy"
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
        />
        <span
          className="absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-medium"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            backgroundColor: cat.color,
            color: "#FDFCF8",
            letterSpacing: "0.04em",
          }}
        >
          {cat.label}
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3
          style={{
            fontFamily: "var(--font-playfair), serif",
            fontWeight: 700,
            fontSize: featured ? "1.6rem" : "1.2rem",
            color: "#1C1917",
            lineHeight: 1.25,
            letterSpacing: "-0.01em",
            marginBottom: "0.5rem",
          }}
        >
          {post.title}
        </h3>
        <p
          className="flex-1"
          style={{
            fontFamily: "var(--font-inter), sans-serif",
            fontWeight: 300,
            fontSize: "0.9rem",
            color: "#5C544C",
            lineHeight: 1.6,
          }}
        >
          {post.excerpt}
        </p>
        <div
          className="mt-4 flex items-center gap-2 text-xs"
          style={{ fontFamily: "var(--font-inter), sans-serif", color: "#8A7F73" }}
        >
          <span>{post.displayDate}</span>
          <span aria-hidden="true">·</span>
          <span>{post.readingMinutes} min de lecture</span>
        </div>
      </div>
    </a>
  );
}
