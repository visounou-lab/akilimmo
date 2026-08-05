import Link from "next/link";
import { ShieldX } from "lucide-react";

export default function ForbiddenPage() {
  return (
    <div className="flex min-h-[50vh] flex-col items-center justify-center text-center">
      <span className="inline-flex size-14 items-center justify-center rounded-full bg-destructive/10 text-destructive">
        <ShieldX className="size-7" />
      </span>
      <h1 className="mt-5 font-serif text-2xl font-semibold">Accès refusé</h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        Votre rôle ne dispose pas des permissions nécessaires pour accéder à cette
        section.
      </p>
      <Link
        href="/admin"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
      >
        Retour au tableau de bord
      </Link>
    </div>
  );
}
