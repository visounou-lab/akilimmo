export function PageHeader({
  title,
  subtitle,
}: {
  title: string;
  subtitle?: string;
}) {
  return (
    <section className="relative overflow-hidden border-b">
      <div className="aurora-veil absolute inset-0 -z-10 opacity-60" />
      <div className="container-boreal py-14 sm:py-16">
        <h1 className="max-w-3xl text-balance text-4xl font-semibold sm:text-5xl">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-4 max-w-2xl text-pretty text-lg text-muted-foreground">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}
