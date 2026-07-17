export function AuthCard({ children }: { children: React.ReactNode }) {
  return (
    <main style={{ minHeight: "100vh", display: "grid", placeItems: "center", padding: "1.5rem" }}>
      <div className="sand-card" style={{ padding: "2rem", width: "100%", maxWidth: "420px" }}>
        {children}
      </div>
    </main>
  );
}
