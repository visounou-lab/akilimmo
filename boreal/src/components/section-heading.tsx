import { cn } from "@/lib/utils";

export function SectionHeading({
  eyebrow,
  title,
  subtitle,
  align = "center",
  className,
}: {
  eyebrow?: string;
  title: string;
  subtitle?: string;
  align?: "center" | "left";
  className?: string;
}) {
  return (
    <div
      className={cn(
        "max-w-2xl",
        align === "center" && "mx-auto text-center",
        className,
      )}
    >
      {eyebrow && (
        <p className="text-sm font-semibold uppercase tracking-wide text-glacier">
          {eyebrow}
        </p>
      )}
      <h2 className="mt-2 text-3xl font-semibold sm:text-4xl">{title}</h2>
      {subtitle && (
        <p className="mt-4 text-pretty text-muted-foreground">{subtitle}</p>
      )}
    </div>
  );
}
