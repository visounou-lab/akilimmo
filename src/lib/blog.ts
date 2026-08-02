import fs from "node:fs";
import path from "node:path";
import matter from "gray-matter";
import { remark } from "remark";
import remarkGfm from "remark-gfm";
import remarkHtml from "remark-html";
import readingTime from "reading-time";

const BLOG_DIR = path.join(process.cwd(), "content", "blog");

export type BlogCategory =
  | "Sécurité"
  | "Conseils"
  | "Marché"
  | "Événements";

export interface BlogFrontmatter {
  title: string;
  excerpt: string;
  date: string; // ISO
  category: BlogCategory;
  cover?: string;
  author?: string;
  featured?: boolean;
  published?: boolean;
  tags?: string[];
}

export interface BlogPostMeta extends BlogFrontmatter {
  slug: string;
  readingMinutes: number;
  isoDate: string;
  displayDate: string;
}

export interface BlogPost extends BlogPostMeta {
  html: string;
}

function frenchDate(iso: string): string {
  try {
    return new Intl.DateTimeFormat("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    }).format(new Date(iso));
  } catch {
    return iso;
  }
}

function readSlugs(): string[] {
  if (!fs.existsSync(BLOG_DIR)) return [];
  return fs
    .readdirSync(BLOG_DIR)
    .filter((f) => f.endsWith(".md") || f.endsWith(".mdx"))
    .map((f) => f.replace(/\.mdx?$/, ""));
}

function loadRaw(slug: string) {
  const md = path.join(BLOG_DIR, `${slug}.md`);
  const file = fs.existsSync(md) ? md : path.join(BLOG_DIR, `${slug}.mdx`);
  const raw = fs.readFileSync(file, "utf8");
  const { data, content } = matter(raw);
  return { data: data as BlogFrontmatter, content };
}

function toMeta(slug: string, data: BlogFrontmatter, content: string): BlogPostMeta {
  return {
    slug,
    ...data,
    author: data.author ?? "AKIL IMMO",
    readingMinutes: Math.max(1, Math.round(readingTime(content).minutes)),
    isoDate: new Date(data.date).toISOString(),
    displayDate: frenchDate(data.date),
  };
}

/** Toutes les fiches (publiées), triées du plus récent au plus ancien. */
export function getAllPosts(): BlogPostMeta[] {
  return readSlugs()
    .map((slug) => {
      const { data, content } = loadRaw(slug);
      return toMeta(slug, data, content);
    })
    .filter((p) => p.published !== false)
    .sort((a, b) => +new Date(b.date) - +new Date(a.date));
}

export function getAllSlugs(): string[] {
  return getAllPosts().map((p) => p.slug);
}

/** Un article complet (HTML rendu). null si introuvable / non publié. */
export async function getPost(slug: string): Promise<BlogPost | null> {
  if (!readSlugs().includes(slug)) return null;
  const { data, content } = loadRaw(slug);
  if (data.published === false) return null;
  const processed = await remark().use(remarkGfm).use(remarkHtml).process(content);
  return { ...toMeta(slug, data, content), html: processed.toString() };
}

/** Articles liés : même catégorie d'abord, complétés par les plus récents. */
export function getRelatedPosts(slug: string, category: BlogCategory, limit = 3): BlogPostMeta[] {
  const others = getAllPosts().filter((p) => p.slug !== slug);
  const sameCat = others.filter((p) => p.category === category);
  const rest = others.filter((p) => p.category !== category);
  return [...sameCat, ...rest].slice(0, limit);
}

export const CATEGORY_META: Record<BlogCategory, { label: string; color: string }> = {
  "Sécurité": { label: "Sécurité", color: "#B45309" },
  "Conseils": { label: "Conseils", color: "#1B4D3E" },
  "Marché": { label: "Marché", color: "#0369A1" },
  "Événements": { label: "Événements", color: "#C8922A" },
};
