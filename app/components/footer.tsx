export default function Footer() {
  return (
    <footer className="mt-24 border-t border-slate-200 bg-slate-950 text-slate-300">
      <div className="mx-auto max-w-7xl px-6 py-16 lg:px-8">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <a href="#" className="inline-flex items-center gap-3 text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-[#0066CC] font-bold text-white">A</span>
              <span className="text-lg font-bold">AKIL <span className="text-[#4da3ff]">IMMO</span></span>
            </a>
            <p className="max-w-xs text-sm leading-7 text-slate-400">
              Vous êtes loin, nous sommes là. Plateforme immobilière au Bénin et en Côte d'Ivoire.
            </p>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Services</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li><a href="#services" className="hover:text-white">Vente & Location</a></li>
              <li><a href="#services" className="hover:text-white">Gestion locative</a></li>
              <li><a href="#services" className="hover:text-white">Contrats & Documents</a></li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Bénin</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Akil Services</li>
              <li>Abomey-Calavi, Tokan</li>
              <li>+229 01 97 59 86 82</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-4 text-sm font-semibold uppercase tracking-widest text-white">Côte d&apos;Ivoire</h4>
            <ul className="space-y-3 text-sm text-slate-400">
              <li>Akil Immo CI</li>
              <li>Abidjan</li>
              <li>+225 07 10 25 91 46</li>
              <li><a href="mailto:info@akilimmo.com" className="hover:text-white">info@akilimmo.com</a></li>
            </ul>
          </div>
        </div>
        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-slate-800 pt-8 sm:flex-row">
          <p className="text-xs text-slate-500">© {new Date().getFullYear()} AKIL IMMO — Akil Services. Tous droits réservés.</p>
          <div className="flex gap-6">
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300">Mentions légales</a>
            <a href="#" className="text-xs text-slate-500 hover:text-slate-300">Confidentialité</a>
          </div>
        </div>
      </div>
    </footer>
  );
}