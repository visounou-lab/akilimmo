import Footer from "./components/footer";
import Navbar from "./components/navbar";
import PropertyList from "./components/property-list";

const services = [
  {
    title: "Vente & location",
    description:
      "Recherche, acquisition et gestion de biens immobiliers haut de gamme au Bénin et en Côte d'Ivoire.",
  },
  {
    title: "Gestion locative",
    description:
      "Optimisation des revenus, suivi des paiements et service client dédié pour propriétaires et locataires.",
  },
  {
    title: "Contrats & documents",
    description:
      "Génération sécurisée de contrats PDF, factures et documents de location conformes aux normes locales.",
  },
];

const values = [
  {
    title: "Professionnalisme local",
    description:
      "Des équipes dédiées au Bénin et en Côte d'Ivoire pour accompagner chaque transaction immobilière.",
  },
  {
    title: "Technologie moderne",
    description:
      "Plateforme sécurisée avec suivi des paiements, notifications et gestion des contrats en temps réel.",
  },
  {
    title: "Support 24/7",
    description:
      "Service client réactif pour répondre aux demandes de réservation, de réparation et de documentation.",
  },
];

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 pt-28">
      <Navbar />

      <main className="mx-auto max-w-7xl px-6 py-10 lg:px-8">
        <section className="grid gap-10 rounded-[32px] bg-gradient-to-br from-[#E9F2FF] via-white to-white p-8 shadow-[0_30px_80px_-40px_rgba(0,102,204,0.35)] ring-1 ring-slate-200/70 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
          <div className="space-y-6">
            <span className="inline-flex rounded-full bg-[#0066CC]/10 px-4 py-1 text-sm font-semibold text-[#0066CC]">
              AKIL IMMO — Bénin & Côte d'Ivoire
            </span>
            <h1 className="text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Immobilier moderne et gestion locative 100 % professionnelle.
            </h1>
            <p className="max-w-2xl text-lg leading-8 text-slate-600">
              Découvrez des biens premium, des contrats sécurisés et un suivi de paiement simplifié pour propriétaires et locataires.
            </p>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a
                href="#properties"
                className="inline-flex items-center justify-center rounded-full bg-[#0066CC] px-6 py-3 text-sm font-semibold text-white shadow-lg transition duration-200 hover:bg-[#0054a3]"
              >
                Voir les biens disponibles
              </a>
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition duration-200 hover:border-slate-300 hover:bg-slate-50"
              >
                Contactez-nous
              </a>
            </div>
          </div>

          <div className="overflow-hidden rounded-[32px] border border-slate-200 bg-gradient-to-br from-[#E6F0FF] via-white to-white p-6 shadow-lg">
            <div className="space-y-4">
              <div className="h-72 rounded-3xl bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-[#0066CC]/25 via-transparent to-transparent p-6 shadow-inner">
                <div className="flex h-full flex-col justify-end rounded-3xl bg-white/90 p-6 backdrop-blur-sm">
                  <span className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0066CC]">Bien à la une</span>
                  <h2 className="mt-4 text-2xl font-semibold text-slate-950">Appartement de prestige à Cotonou</h2>
                  <p className="mt-3 text-sm leading-6 text-slate-600">
                    3 chambres, 2 salles de bain, piscine, proche de la plage et du centre-ville.
                  </p>
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-3xl bg-[#0066CC] p-5 text-white shadow-lg">
                  <span className="text-sm uppercase tracking-[0.24em] text-slate-200">Rôles</span>
                  <p className="mt-3 text-2xl font-semibold">Admin, Propriétaire, Locataire</p>
                </div>
                <div className="rounded-3xl bg-slate-100 p-5 text-slate-950 shadow-lg">
                  <span className="text-sm uppercase tracking-[0.24em] text-[#0066CC]">Notifications</span>
                  <p className="mt-3 text-2xl font-semibold">Réservations instantanées</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-20" id="services">
          <div className="mb-10 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0066CC]">Services</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Une expertise complète pour chaque profil</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Une plateforme pensée pour les propriétaires, locataires et administrateurs du Bénin et de la Côte d'Ivoire.
            </p>
          </div>
          <div className="grid gap-6 md:grid-cols-3">
            {services.map((service) => (
              <article
                key={service.title}
                className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
              >
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#0066CC]/10 text-[#0066CC] shadow-sm">
                  <span className="font-bold">•</span>
                </div>
                <h3 className="text-xl font-semibold text-slate-950">{service.title}</h3>
                <p className="mt-4 text-slate-600">{service.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="mt-20" id="properties">
          <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0066CC]">Biens</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Biens disponibles par pays</h2>
            </div>
            <p className="max-w-2xl text-sm leading-6 text-slate-600">
              Explorez des appartements, villas et maisons disponibles au Bénin et en Côte d'Ivoire avec un filtre pays rapide.
            </p>
          </div>
          <PropertyList />
        </section>

        <section className="mt-20 rounded-3xl bg-[#0066CC] px-8 py-14 text-white shadow-xl">
          <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
            <div>
              <h2 className="text-3xl font-semibold">AKIL IMMO accompagne votre prochain projet immobilier.</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-100/90">
                Simplifiez vos démarches avec un espace dédié aux propriétaires, locataires et équipes administratives.
              </p>
            </div>
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.24em] text-slate-200">Contact rapide</p>
              <p className="text-2xl font-semibold">hello@akilimmo.com</p>
            </div>
          </div>
        </section>

        <section className="mt-20 grid gap-8 lg:grid-cols-3">
          {values.map((value) => (
            <article
              key={value.title}
              className="rounded-3xl border border-slate-200 bg-white p-8 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.2)] transition duration-300 hover:-translate-y-1 hover:shadow-2xl"
            >
              <h3 className="text-xl font-semibold text-slate-950">{value.title}</h3>
              <p className="mt-4 text-slate-600">{value.description}</p>
            </article>
          ))}
        </section>

        <section className="mt-20 rounded-3xl bg-white p-8 shadow-sm" id="contact">
          <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr] lg:items-center">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0066CC]">Contact</p>
              <h2 className="mt-3 text-3xl font-semibold text-slate-950">Prêt à lancer votre projet immobilier ?</h2>
              <p className="mt-4 max-w-2xl text-base leading-8 text-slate-600">
                Envoyez-nous un message et un expert AKIL IMMO vous recontacte rapidement pour un audit personnalisé.
              </p>
            </div>
            <div className="space-y-4 rounded-3xl bg-[#F8FBFF] p-6">
              <div>
                <p className="text-sm font-semibold text-slate-500">Email</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">contact@akilimmo.com</p>
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-500">Téléphone</p>
                <p className="mt-1 text-lg font-semibold text-slate-900">+229 90 00 00 00</p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
