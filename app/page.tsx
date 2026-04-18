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

export const revalidate = 0;

export default async function Home() {
  const [totalBiens, availableBiens, biens] = await Promise.all([
    prisma.property.count(),
    prisma.property.count({ where: { status: "AVAILABLE" } }),
    prisma.property.findMany({
      where: { status: "AVAILABLE", publishStatus: "published" },
      orderBy: { createdAt: "desc" },
      take: 6,
      select: {
        id: true,
        slug: true,
        title: true,
        city: true,
        country: true,
        price: true,
        bedrooms: true,
        bathrooms: true,
        imageUrl: true,
        videoUrl: true,
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
                    {
                      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>,
                      label: "Email", value: "info@akilimmo.com",
                    },
                    {
                      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                      label: "Bénin", value: "+229 01 97 59 86 82",
                    },
                    {
                      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>,
                      label: "Côte d'Ivoire", value: "+225 07 10 25 91 46",
                    },
                    {
                      icon: <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.75}><path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>,
                      label: "Bureaux", value: "Abomey-Calavi, Bénin · Abidjan, CI",
                    },
                  ].map((item) => (
                    <div key={item.label} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-3">
                      <span className="text-[#0066CC] shrink-0">{item.icon}</span>
                      <div>
                        <p className="text-xs text-slate-400">{item.label}</p>
                        <p className="text-sm font-semibold text-slate-900">{item.value}</p>
                      </div>
                    </div>
                  ))}
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
