export default function Footer() {
  return (
    <footer className="bg-slate-950 py-12 text-slate-300">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
        <div className="space-y-3">
          <p className="text-base font-semibold text-white">AKIL IMMO</p>
          <p className="max-w-md text-sm text-slate-400">Immo professionnel pour le Bénin et la Côte d'Ivoire.</p>
        </div>
        <div className="flex flex-col gap-2 text-sm text-slate-400 sm:flex-row sm:items-center sm:gap-6">
          <span>hello@akilimmo.com</span>
          <span>+229 90 00 00 00</span>
          <span>© {new Date().getFullYear()} AKIL IMMO</span>
        </div>
      </div>
    </footer>
  );
}
