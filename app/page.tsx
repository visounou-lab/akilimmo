import { prisma } from "@/lib/prisma";
import Navbar from "./components/navbar";
import Footer from "./components/footer";
import ContactForm from "./components/contact-form";
import HeroSection from "./components/HeroSection";
import StatsSection from "./components/StatsSection";
import PropertiesSection from "./components/PropertiesSection";
import ServicesSection from "./components/ServicesSection";
import TestimonialsSection from "./components/TestimonialsSection";
import WhatsAppButton from "./components/WhatsAppButton";

export default async function Home() {
  const [totalBiens, availableBiens, biens] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "AVAILABLE" } }),
    prisma.property.findMany({
      where: { status: "AVAILABLE" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        title: true,
        city: true,
        country: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        imageUrl: true,
      },
    }),
  ]);

  // Prisma Decimal → plain number for client component serialisation
  const biensPlain = biens.map((b) => ({ ...b, price: Number(b.price) }));

  return (
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900">
      <Navbar />

      {/* Hero — full screen */}
      <HeroSection />

      {/* Stats */}
      <StatsSection totalBiens={totalBiens} availableBiens={availableBiens} />

      {/* Biens avec filtres */}
      <PropertiesSection biens={biensPlain} />

      {/* Services */}
      <ServicesSection />

      {/* Témoignages */}
      <TestimonialsSection />

      {/* CTA + Contact */}
      <section className="py-20 bg-white">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          {/* CTA banner */}
          <div className="rounded-3xl bg-[#0066CC] px-8 py-14 text-white shadow-xl mb-20">
            <div className="grid gap-8 lg:grid-cols-[1.4fr_0.6fr] lg:items-center">
              <div>
                <h2 className="text-3xl font-bold">
                  AKIL IMMO accompagne votre prochain projet immobilier.
                </h2>
                <p className="mt-4 text-slate-100/90">
                  Vous êtes loin, nous sommes là — pour chaque étape de votre projet.
                </p>
              </div>
              <div className="space-y-3">
                <p className="text-xs uppercase tracking-widest text-slate-200">Contact rapide</p>
                <p className="text-xl font-semibold">info@akilimmo.com</p>
                <a
                  href="#contact"
                  className="inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-[#0066CC] transition hover:bg-slate-100"
                >
                  Nous écrire
                </a>
              </div>
            </div>
          </div>

          {/* Contact form */}
          <div id="contact" className="rounded-3xl bg-white p-8 shadow-sm ring-1 ring-slate-200/70">
            <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr] lg:items-start">
              <div>
                <p className="text-sm font-semibold uppercase tracking-widest text-[#0066CC]">Contact</p>
                <h2 className="mt-3 text-3xl font-bold text-slate-900">Prêt à lancer votre projet ?</h2>
                <p className="mt-4 text-slate-500">Un expert AKIL IMMO vous répond rapidement.</p>
                <div className="mt-8 space-y-3">
                  {[
                    { icon: "📧", label: "Email",          value: "info@akilimmo.com" },
                    { icon: "📞", label: "Bénin",          value: "+229 01 97 59 86 82" },
                    { icon: "📞", label: "Côte d'Ivoire",  value: "+225 07 10 25 91 46" },
                    { icon: "📍", label: "Bureaux",        value: "Abomey-Calavi, Bénin · Abidjan, CI" },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-xl">{item.icon}</span>
                      <div>
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
                  <a
                    href="https://wa.me/22901975982"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 transition hover:bg-green-100"
                  >
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
          </div>
        </div>
      </section>

      <Footer />

      {/* Floating WhatsApp */}
      <WhatsAppButton />
    </div>
  );
}
