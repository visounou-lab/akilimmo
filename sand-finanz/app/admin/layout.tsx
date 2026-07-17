import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Administration · SAND FINANZ GRUPPE",
  robots: { index: false, follow: false },
};

export default function AdminRootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-DE">
      <body style={{ background: "var(--color-sand-bg)" }}>{children}</body>
    </html>
  );
}
