"use client";
import { useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const [loading, setLoading]   = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signIn("credentials", { email, password, redirect: false });

    if (result?.error) {
      setError("Email ou mot de passe incorrect");
      setLoading(false);
      return;
    }

    const session = await getSession();
    const user = session?.user as { role?: string; status?: string } | undefined;

    if (user?.role === "ADMIN") {
      router.push("/dashboard");
    } else if (user?.role === "OWNER") {
      router.push("/owner/dashboard");
    } else {
      router.push("/dashboard");
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/logo.png" alt="AKIL IMMO" className="h-12 mx-auto"
              style={{ filter: "brightness(0) saturate(100%) invert(19%) sepia(88%) saturate(1500%) hue-rotate(200deg)" }} />
          </Link>
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Connexion</h1>
          <p className="mt-1 text-sm text-slate-500">Accédez à votre espace AKIL IMMO</p>
        </div>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 p-8">
          {error && (
            <div className="mb-4 rounded-xl bg-red-50 border border-red-100 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Email</label>
              <input
                type="email" required placeholder="votre@email.com"
                value={email} onChange={e => setEmail(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1.5">Mot de passe</label>
              <input
                type="password" required placeholder="••••••••"
                value={password} onChange={e => setPassword(e.target.value)}
                className="w-full rounded-xl border border-slate-200 px-4 py-3 text-sm text-slate-800 focus:outline-none focus:border-[#0066CC] focus:ring-2 focus:ring-[#0066CC]/20 transition bg-white"
              />
            </div>
            <button
              type="submit" disabled={loading}
              className="w-full inline-flex items-center justify-center rounded-full bg-[#0066CC] hover:bg-[#004499] disabled:opacity-60 text-white px-6 py-3.5 text-sm font-semibold transition-colors shadow-sm"
            >
              {loading ? "Connexion…" : "Se connecter"}
            </button>
          </form>
          <p className="mt-4 text-center text-sm text-slate-500">
            Pas encore de compte ?{" "}
            <Link href="/inscription" className="text-[#0066CC] hover:underline font-medium">
              Devenir propriétaire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
