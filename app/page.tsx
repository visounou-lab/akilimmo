import Footer from "./components/footer";
import Navbar from "./components/navbar";
import PropertyList from "./components/property-list";
import ContactForm from "./components/contact-form";

const services = [
  { icon: "🏠", title: "Vente & location", description: "Recherche, acquisition et gestion de biens immobiliers haut de gamme au Bénin et en Côte d'Ivoire." },
  { icon: "📋", title: "Gestion locative", description: "Optimisation des revenus, suivi des paiements et service client dédié pour propriétaires et locataires." },
  { icon: "📄", title: "Contrats & documents", description: "Génération sécurisée de contrats PDF, factures et documents de location conformes aux normes locales." },
];

const values = [
  { icon: "🤝", title: "Professionnalisme local", description: "Des équipes dédiées au Bénin et en Côte d'Ivoire pour accompagner chaque transaction immobilière." },
  { icon: "💻", title: "Technologie moderne", description: "Plateforme sécurisée avec suivi des paiements, notifications et gestion des contrats en temps réel." },
  { icon: "🕐", title: "Support 24/7", description: "Service client réactif pour répondre aux demandes de réservation, de réparation et de documentation." },
];

const stats = [
  { label: "Biens gérés", value: "120+" },
  { label: "Clients satisfaits", value: "300+" },
  { label: "Pays couverts", value: "2" },
  { label: "Années d'expérience", value: "5+" },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 pt-28">
      <Navbar />
      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">

        <section className="grid gap-10 rounded-[32px] bg-gradient-to-br from-[#E8F4FD] via-white to-white p-8 shadow-[0_30px_80px_-40px_rgba(0,102,204,0.35)] ring-1 ring-slate-200/70 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-[#0066CC]/10 px-4 py-1 text-sm font-semibold text-[#0066CC]">
              AKIL IMMO — Bénin 🇧🇯 & Côte d'Ivoire 🇨🇮
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-[#333333] sm:text-5xl">
              Vous êtes loin,<br />nous sommes là.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Plateforme immobilière professionnelle au Bénin et en Côte d'Ivoire. Gestion locative, contrats sécurisés et suivi des paiements simplifié.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#properties" className="inline-flex items-center justify-center rounded-full bg-[#0066CC] px-6 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-[#004499]">Voir les biens disponibles</a>
              <a href="#contact" className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50">Contactez-nous</a>
            </div>
          </div>
          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-white p-6 shadow-lg">
            <div className="space-y-4">
              <div className="h-64 rounded-3xl bg-gradient-to-br from-[#E8F4FD] to-white p-6 flex flex-col justify-end">
                <span className="text-sm font-semibold uppercase tracking-widest text-[#0066CC]">Bien à la une</span>
                <h2 className="mt-3 text-xl font-semibold text-[#333333]">Appartement de prestige à Cotonou</h2>
                <p className="mt-2 text-sm text-slate-500">3 ch. · 2 SdB · Piscine · Vue mer</p>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#0066CC] p-4 text-white">
                  <p className="text-xs uppercase tracking-widest text-slate-200">Rôles</p>
                  <p className="mt-2 text-sm font-semibold">Admin · Propriétaire · Locataire</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-4">
                  <p className="text-xs uppercase tracking-widest text-[#0066CC]">Notifications</p>
                  <p className="mt-2 text-sm font-semibold text-slate-900">Réservations instantanées</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {stats.map((s) => (
            <div key={s.label} className="rounded-3xl border border-slate-200 bg-white p-6 text-center shadow-sm">
              <p className="text-3xl font-bold text-[#0066CC]">{s.value}</p>
              <p className="mt-1 text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </section>

        <section className="mt-20" id="services">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC]">Services</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#333333]">Une expertise complète pour chaque profil</h2>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((s) => (
              <article key={s.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
                <div className="mb-5 text-3xl">{s.icon}</div>
                <h3 className="text-xl font-semibold text-[#333333]">{s.title}</h3>
                <p className="mt-3 text-slate-600">{s.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20" id="properties">
          <div className="mb-10">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC]">Biens</p>
            <h2 className="mt-3 text-3xl font-semibold text-[#333333]">Biens disponibles par pays</h2>
          </div>
          <PropertyList />
        </section>

        <section className="mt-20 rounded-3xl bg-[#0066CC] px-8 py-14 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">AKIL IMMO accompagne votre prochain projet immobilier.</h2>
              <p className="mt-4 text-slate-100/90">Vous êtes loin, nous sommes là — pour chaque étape de votre projet.</p>
            </div>
            <div className="space-y-3">
              <p className="text-xs uppercase tracking-widest text-slate-200">Contact rapide</p>
              <p className="text-xl font-semibold">info@akilimmo.com</p>
              <a href="#contact" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100">Nous écrire</a>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-3">
          {values.map((v) => (
            <article key={v.title} className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm transition hover:-translate-y-1 hover:shadow-xl">
              <div className="mb-4 text-3xl">{v.icon}</div>
              <h3 className="text-xl font-semibold text-[#333333]">{v.title}</h3>
              <p className="mt-3 text-slate-600">{v.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/70" id="contact">
          <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
            <div>
              <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC]">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold text-[#333333]">Prêt à lancer votre projet ?</h2>
              <p className="mt-4 text-slate-600">Un expert AKIL IMMO vous répond rapidement.</p>
              <div className="mt-8 space-y-3">
                {[
                  { icon: "📧", label: "Email", value: "info@akilimmo.com" },
                  { icon: "📞", label: "Bénin", value: "+229 01 97 59 86 82" },
                  { icon: "📞", label: "Côte d'Ivoire", value: "+225 07 10 25 91 46" },
                  { icon: "📍", label: "Bureaux", value: "Abomey-Calavi, Bénin · Abidjan, CI" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="text-xs text-slate-400">{item.label}</p>
                      <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                    </div>
                  </div>
                ))}
                <a href="https://wa.me/22901975986 82" target="_blank" rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 transition hover:bg-green-100">
                  <span className="text-xl">💬</span>
                  <div>
                    <p className="text-xs text-slate-400">WhatsApp</p>
                    <p className="text-sm font-semibold text-green-700">Discuter sur WhatsApp</p>
                  </div>
                </a>
              </div>
            </div>
            <ContactForm />
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}