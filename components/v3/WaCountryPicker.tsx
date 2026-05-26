"use client";

import { useState, useRef, useEffect } from "react";

export const WA = {
  BENIN:        { number: "2290197598682", flag: "🇧🇯", label: "Bénin",         phone: "+229 01 97 59 86 82" },
  COTE_D_IVOIRE:{ number: "2250710259146", flag: "🇨🇮", label: "Côte d'Ivoire", phone: "+225 07 10 25 91 46" },
} as const;

export type WaCountry = keyof typeof WA;

export function waUrl(country: WaCountry, text?: string): string {
  const num = WA[country].number;
  return text
    ? `https://wa.me/${num}?text=${encodeURIComponent(text)}`
    : `https://wa.me/${num}`;
}

interface WaCountryPickerProps {
  /** Message pre-filled in WhatsApp */
  message?: string;
  /** Button content */
  children: React.ReactNode;
  className?: string;
  style?: React.CSSProperties;
  onMouseEnter?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onMouseLeave?: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

export default function WaCountryPicker({
  message = "Bonjour, je souhaite en savoir plus sur AKIL IMMO",
  children,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
}: WaCountryPickerProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    if (open) document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, [open]);

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={className}
        style={style}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
        aria-haspopup="true"
        aria-expanded={open}
      >
        {children}
      </button>

      {open && (
        <div
          className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 flex flex-col gap-1.5 z-50 min-w-max"
          role="menu"
        >
          {(Object.values(WA) as typeof WA[WaCountry][]).map((c) => (
            <a
              key={c.number}
              href={`https://wa.me/${c.number}?text=${encodeURIComponent(message)}`}
              target="_blank"
              rel="noopener noreferrer"
              role="menuitem"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2.5 rounded-xl px-4 py-2.5 text-sm font-medium whitespace-nowrap transition-colors"
              style={{
                backgroundColor: "#FDFCF8",
                border: "1.5px solid rgba(200,146,42,0.3)",
                color: "#1C1917",
                boxShadow: "0 4px 16px rgba(28,25,23,0.12)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = "rgba(200,146,42,0.08)";
                e.currentTarget.style.borderColor = "#C8922A";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = "#FDFCF8";
                e.currentTarget.style.borderColor = "rgba(200,146,42,0.3)";
              }}
            >
              <span className="text-base">{c.flag}</span>
              <span>{c.label}</span>
              <svg className="w-3.5 h-3.5 ml-1" fill="currentColor" viewBox="0 0 24 24" style={{ color: "#16A34A" }}>
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.122 1.518 5.854L.057 23.882a.5.5 0 00.61.637l6.198-1.63A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.386l-.36-.213-3.722.979.999-3.646-.234-.375A9.818 9.818 0 1112 21.818z" />
              </svg>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
