"use server";

import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect("/login");
  const user = session.user as { id: string; role?: string };
  if (user.role !== "ADMIN") redirect("/login");
}

function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

function dataFromForm(fd: FormData) {
  const title = ((fd.get("title") as string) || "").trim();
  const slugRaw = ((fd.get("slug") as string) || "").trim();
  const published = fd.get("published") === "on";
  const cover = ((fd.get("cover") as string) || "").trim();
  return {
    title,
    slug: slugify(slugRaw || title),
    excerpt: ((fd.get("excerpt") as string) || "").trim(),
    category: ((fd.get("category") as string) || "Conseils").trim(),
    cover: cover || null,
    body: ((fd.get("body") as string) || "").replace(/\r\n/g, "\n"),
    author: ((fd.get("author") as string) || "AKIL IMMO").trim(),
    featured: fd.get("featured") === "on",
    published,
  };
}

export async function createPost(formData: FormData) {
  await requireAdmin();
  const data = dataFromForm(formData);
  await prisma.post.create({
    data: { ...data, publishedAt: data.published ? new Date() : null },
  });
  revalidatePath("/blog");
  revalidatePath("/dashboard/blog");
  redirect("/dashboard/blog");
}

export async function updatePost(id: string, formData: FormData) {
  await requireAdmin();
  const data = dataFromForm(formData);
  const existing = await prisma.post.findUnique({ where: { id }, select: { publishedAt: true } });
  await prisma.post.update({
    where: { id },
    data: {
      ...data,
      publishedAt: data.published ? existing?.publishedAt ?? new Date() : null,
    },
  });
  revalidatePath("/blog");
  revalidatePath(`/blog/${data.slug}`);
  revalidatePath("/dashboard/blog");
  redirect("/dashboard/blog");
}

export async function deletePost(id: string) {
  await requireAdmin();
  const post = await prisma.post.findUnique({ where: { id }, select: { slug: true } });
  await prisma.post.delete({ where: { id } });
  revalidatePath("/blog");
  if (post) revalidatePath(`/blog/${post.slug}`);
  revalidatePath("/dashboard/blog");
}
