const navItems = [
  { label: "Accueil", href: "#" },
  { label: "Services", href: "#services" },
  { label: "Biens", href: "/biens" },
  { label: "Contact", href: "#contact" },
];

export default function Navbar() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-[#0054a3]/20 bg-[#0066CC]/95 shadow-lg shadow-[#0066CC]/15 backdrop-blur-xl">
      <nav className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-6 py-4 lg:px-8">
        <a href="#" className="inline-flex items-center gap-3 text-lg font-semibold tracking-tight text-white">
          <span className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-white/15 text-white shadow-sm">
            A
          </span>
          <span>
            <span className="font-bold text-white">AKIL</span> IMMO
          </span>
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <a
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-white/85 transition hover:text-white"
            >
              {item.label}
            </a>
          ))}
        </div>

        <a
          href="#contact"
          className="inline-flex items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100"
        >
          Contact
        </a>
      </nav>
    </header>
  );
}
