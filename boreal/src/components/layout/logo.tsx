import { cn } from "@/lib/utils";

/** Boreal mark: an abstract aurora arc over a northern horizon. */
export function BorealMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden="true"
      className={cn("size-8", className)}
    >
      <rect width="32" height="32" rx="9" fill="var(--primary)" />
      <path
        d="M6 21c3.5-8 6.5-8 10-8s6.5 0 10 8"
        stroke="var(--aurora)"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M9 24c2.4-5 4.6-5 7-5s4.6 0 7 5"
        stroke="var(--glacier)"
        strokeWidth="2"
        strokeLinecap="round"
        opacity="0.8"
      />
      <circle cx="16" cy="9" r="1.6" fill="var(--gold)" />
    </svg>
  );
}

export function Wordmark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        "font-serif text-lg font-semibold tracking-tight leading-none",
        className,
      )}
    >
      Boreal<span className="text-glacier"> Finance</span>
    </span>
  );
}
