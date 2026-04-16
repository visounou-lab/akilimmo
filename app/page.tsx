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
                  <a
                    href="https://wa.me/22901975982"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded-2xl bg-green-50 px-4 py-3 transition hover:bg-green-100"
                  >
                    <span className="text-green-600 shrink-0">
                      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347zM12 0C5.373 0 0 5.373 0 12c0 2.127.553 4.122 1.518 5.854L.057 23.882a.5.5 0 00.61.637l6.198-1.63A11.944 11.944 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 21.818a9.818 9.818 0 01-5.028-1.386l-.36-.213-3.722.979.999-3.646-.234-.375A9.818 9.818 0 1112 21.818z" />
                      </svg>
                    </span>
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
