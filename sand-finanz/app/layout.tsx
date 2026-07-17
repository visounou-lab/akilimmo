import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  // Plain title only. The per-locale title + template live in app/[locale]/layout
  // so that the localised home page does not get the site name appended twice.
  title: "SAND FINANZ GRUPPE",
  description: "SAND FINANZ GRUPPE — Finanzierung, die zu Ihrem Vorhaben passt.",
  robots: { index: true, follow: true },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return children;
}
