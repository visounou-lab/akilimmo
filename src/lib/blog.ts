import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";
import { prisma } from "@/lib/prisma";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogCategory = "Sécurité" | "Conseils" | "Marché" | "Événements";

export interface BlogFrontmatter {
  title: string;
  excerpt: string;
  date: string;
  category: BlogCategory;
  cover?: string;
  author?: string;
  featured?: boolean;
  published?: boolean;
  tags?: string[];
}

export interface BlogPostMeta {
  slug: string;
  title: string;
  excerpt: string;
  category: BlogCategory;
  cover?: string;
  author: string;
  date: string;
  featured: boolean;
  readingMinutes: number;
  isoDate: string;
  displayDate: string;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

function frenchDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", { day: "numeric", month: "long", year: "numeric" }).format(new Date(iso));
  } catch {
    return iso;
  }
}

async function renderMarkdown(md: string): Promise<string> {
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(md);
  return processed.toString();
}

function metaFrom(opts: {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  cover?: string | null;
  author?: string | null;
  date: string;
  featured?: boolean;
  body: string;
}): BlogPostMeta {
  return {
    slug: opts.slug,
    title: opts.title,
    excerpt: opts.excerpt,
    category: opts.category as BlogCategory,
    cover: opts.cover ?? undefined,
    author: opts.author ?? "AKIL IMMO",
    date: opts.date,
    featured: !!opts.featured,
    readingMinutes: Math.max(1, Math.round(readingTime(opts.body).minutes)),
    isoDate: new Date(opts.date).toISOString(),
    displayDate: frenchDate(opts.date),
  };
}

// ── Source fichiers (articles « starter », repli si base vide) ──────────
function fileSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs.readdirSync(BLOG_DIR).filter((f) => /\.mdx?$/.test(f)).map((f) => f.replace(/\.mdx?$/, ""));
}
function loadFile(slug: string) {
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.existsSync(md) ? md : path.join(BLOG_DIR, `${slug}.mdx`);
  const { data, content } = matter(fs.readFileSync(file, "utf8"));
  return { data: data as BlogFrontmatter, content };
}
function filePosts(): BlogPostMeta[] {
  return fileSlugs()
    .map((slug) => ({ slug, ...loadFile(slug) }))
    .filter((p) => p.data.published !== false)
    .map((p) => metaFrom({ ...p.data, slug: p.slug, category: p.data.category, body: p.content }));
}

// ── Source base de données (éditable depuis le dashboard) ───────────────
type DbPost = {
  slug: string; title: string; excerpt: string; category: string;
  cover: string | null; author: string; body: string; featured: boolean;
  publishedAt: Date | null; createdAt: Date;
};
function dbMeta(p: DbPost): BlogPostMeta {
  return metaFrom({
    slug: p.slug, title: p.title, excerpt: p.excerpt, category: p.category,
    cover: p.cover, author: p.author, featured: p.featured, body: p.body,
    date: (p.publishedAt ?? p.createdAt).toISOString(),
  });
}
async function dbPosts(): Promise<BlogPostMeta[]> {
  try {
    const rows = await prisma.post.findMany({ where: { published: true }, orderBy: { publishedAt: "desc" } });
    return rows.map((r) => dbMeta(r as DbPost));
  } catch {
    return [];
  }
}

// ── API publique (base d'abord, fichiers en repli, dédoublonnage par slug) ─
export async function getAllPosts(): Promise<BlogPostMeta[]> {
  const db = await dbPosts();
  const seen = new Set(db.map((p) => p.slug));
  const merged = [...db, ...filePosts().filter((m) => !seen.has(m.slug))];
  return merged.sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export async function getAllSlugs(): Promise<string[]> {
  return (await getAllPosts()).map((p) => p.slug);
}

export async function getPost(slug: string): Promise<BlogPost | null> {
  try {
    const row = await prisma.post.findUnique({ where: { slug } });
    if (row && row.published) {
      return { ...dbMeta(row as DbPost), html: await renderMarkdown(row.body) };
    }
  } catch {
    /* base indisponible → repli fichiers */
  }
  if (fileSlugs().includes(slug)) {
    const { data, content } = loadFile(slug);
    if (data.published === false) return null;
    return {
      ...metaFrom({ ...data, slug, category: data.category, body: content }),
      html: await renderMarkdown(content),
    };
  }
  return null;
}

export async function getRelatedPosts(slug: string, category: BlogCategory, limit = 3): Promise<BlogPostMeta[]> {
  const all = (await getAllPosts()).filter((p) => p.slug !== slug);
  const same = all.filter((p) => p.category === category);
  const rest = all.filter((p) => p.category !== category);
  return [...same, ...rest].slice(0, limit);
}

export const CATEGORY_META: Record<BlogCategory, { label: string; color: string }> = {
  "Sécurité": { label: "Sécurité", color: "#B45309" },
  "Conseils": { label: "Conseils", color: "#1B4D3E" },
  "Marché": { label: "Marché", color: "#0369A1" },
  "Événements": { label: "Événements", color: "#C8922A" },
};

export const CATEGORIES: BlogCategory[] = ["Conseils", "Sécurité", "Marché", "Événements"];
