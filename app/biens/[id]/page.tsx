import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function BienLegacyRedirect({ params }: Props) {
  const { id } = await params;

  const property = await prisma.property.findUnique({
    where: { id },
    select: { slug: true },
  });

  if (!property) notFound();

  redirect(`/biens/${property.slug}`);
}
