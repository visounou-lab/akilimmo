import { prisma } from "@/lib/prisma";

export function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

export async function uniquePropertySlug(
  title: string,
  city: string,
  excludeId?: string
): Promise<string> {
  const base = slugify(`${title}-${city}`);
  let candidate = base;
  let n = 2;

  while (true) {
    const existing = await prisma.property.findUnique({
      where: { slug: candidate },
      select: { id: true },
    });

    if (!existing || existing.id === excludeId) return candidate;
    candidate = `${base}-${n++}`;
  }
}
