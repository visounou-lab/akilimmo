import Link from "next/link";

export default function NotFound() {
  return (
    <div className="container-boreal flex min-h-[50vh] flex-col items-center justify-center py-20 text-center">
      <span className="font-serif text-6xl font-semibold text-muted-foreground/30">
        404
      </span>
      <h1 className="mt-4 font-serif text-2xl font-semibold">
        Page introuvable · Page not found
      </h1>
      <p className="mt-2 max-w-md text-muted-foreground">
        La page demandée n&apos;existe pas ou a été déplacée. · The page you are
        looking for doesn&apos;t exist or has moved.
      </p>
      <div className="mt-6 flex gap-3">
        <Link
          href="/fr"
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Accueil
        </Link>
        <Link
          href="/en"
          className="rounded-md border px-4 py-2 text-sm font-medium hover:bg-accent"
        >
          Home
        </Link>
      </div>
    </div>
  );
}
