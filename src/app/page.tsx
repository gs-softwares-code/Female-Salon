import Link from "next/link";
import { getDb } from "@/db";
import { services, packages, stylists, galleryItems, specialOffers } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import { Sparkles, Calendar, Clock, ArrowRight, ShieldCheck, HeartHandshake, Award, Star, Check } from "lucide-react";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const db = getDb();

  const [
    featuredServices,
    bestSellers,
    signaturePackages,
    featuredStylists,
    beforeAfterTransformations,
    offers,
  ] = await Promise.all([
    db.select().from(services).where(eq(services.isFeatured, true)).limit(6),
    db.select().from(services).where(eq(services.isBestSeller, true)).limit(4),
    db.select().from(packages).where(eq(packages.isFeatured, true)).limit(3),
    db.select().from(stylists).where(eq(stylists.status, "ACTIVE")).limit(4),
    db.select().from(galleryItems).where(
      or(eq(galleryItems.id, "gal_05"), eq(galleryItems.id, "gal_08"))
    ).limit(2),
    db.select().from(specialOffers).where(eq(specialOffers.isActive, true)).limit(2),
  ]);

  return (
    <main className="min-h-screen bg-background text-foreground">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden px-6 lg:px-12 bg-gradient-to-b from-[#FAF7F2] via-[#F6EFEB] to-[#FAF7F2]">
        {/* Soft atmospheric gradient glow */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-[radial-gradient(circle_at_center,rgba(216,178,169,0.25)_0%,transparent_70%)] pointer-events-none blur-3xl animate-shimmer"></div>

        <div className="mx-auto max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-12 items-center py-16">
          <div className="lg:col-span-7 space-y-6 animate-fade-in-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-white/70 px-4 py-1.5 backdrop-blur-sm transition-all duration-300 hover:border-primary">
              <Sparkles className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">
                Haute Coiffure & Dermal Sanctum · SoHo
              </span>
            </div>

            <h1 className="font-serif text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-[1.02] tracking-tight text-foreground font-light">
              Where Beauty Meets <span className="italic font-normal text-primary">High Art.</span>
            </h1>

            <p className="max-w-xl text-lg sm:text-xl text-muted-foreground font-light leading-relaxed">
              Step into an intimate sanctuary designed for the modern connoisseur. Bespoke French balayage, cellular Hydra-facials, and couture bridal styling tailored to your distinct essence.
            </p>

            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                href="/booking/salon_soho_01"
                className="group inline-flex items-center gap-3 rounded-full bg-primary px-8 py-4 text-xs uppercase tracking-widest font-medium text-primary-foreground shadow-md transition-all duration-300 hover:bg-[#855333] hover:shadow-xl hover:translate-y-[-2px]"
              >
                <span>Reserve Appointment</span>
                <ArrowRight className="h-4 w-4 transition duration-300 group-hover:translate-x-1.5" />
              </Link>
              <Link
                href="/services"
                className="inline-flex items-center rounded-full border border-border bg-white/80 px-8 py-4 text-xs uppercase tracking-widest font-medium text-foreground transition-all duration-300 hover:border-primary hover:bg-white hover:shadow-sm"
              >
                Explore Ritual Menu
              </Link>
            </div>

            {/* Quick Metrics Bar */}
            <div className="pt-8 border-t border-border/80 grid grid-cols-3 gap-6 max-w-lg">
              <div className="transition-transform duration-300 hover:translate-y-[-2px]">
                <p className="font-serif text-3xl font-light text-foreground">14+</p>
                <p className="text-xs text-muted-foreground mt-0.5">Years of Artistry</p>
              </div>
              <div className="transition-transform duration-300 hover:translate-y-[-2px]">
                <p className="font-serif text-3xl font-light text-foreground">4.98★</p>
                <p className="text-xs text-muted-foreground mt-0.5">Verified Client Trust</p>
              </div>
              <div className="transition-transform duration-300 hover:translate-y-[-2px]">
                <p className="font-serif text-3xl font-light text-foreground">100%</p>
                <p className="text-xs text-muted-foreground mt-0.5">Bespoke Formulations</p>
              </div>
            </div>
          </div>

          {/* Hero Visual Imagery */}
          <div className="lg:col-span-5 relative">
            <div className="relative mx-auto max-w-md lg:max-w-none">
              <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white transition-all duration-700 hover:shadow-primary/20">
                <img
                  src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=1000&q=85"
                  alt="Aegis Maison Salon Interior & Styling Experience"
                  className="w-full h-full object-cover transition-transform duration-1000 hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                <div className="absolute bottom-6 left-6 right-6 text-white p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20">
                  <p className="text-xs uppercase tracking-widest text-[#F5EFEB]">Private Atelier</p>
                  <p className="font-serif text-lg font-light mt-0.5">482 Broome Street, SoHo</p>
                </div>
              </div>

              {/* Floating Award Pill */}
              <div className="absolute -top-4 -left-4 sm:-left-8 rounded-2xl bg-white p-4 shadow-xl border border-[#E8DDD5] flex items-center gap-3 animate-float">
                <div className="h-10 w-10 rounded-full bg-[#FAF7F2] flex items-center justify-center text-primary">
                  <Award className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-foreground">Best Luxury Salon</p>
                  <p className="text-[11px] text-muted-foreground">New York Beauty Choice 2026</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. SPECIAL OFFERS & FIRST-VISIT PROMOTION */}
      {offers.length > 0 && (
        <section className="bg-[#221B19] text-[#FFFBF7] py-8 px-6 relative overflow-hidden">
          <div className="mx-auto max-w-7xl flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div className="flex items-center gap-4">
              <div className="h-12 w-12 rounded-full bg-primary/30 border border-primary/50 flex items-center justify-center shrink-0">
                <Sparkles className="h-6 w-6 text-[#E2CFBF]" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-[0.2em] text-[#C79A7F] font-semibold">Special Privilege</span>
                <h3 className="font-serif text-xl sm:text-2xl font-light">{offers[0].title}</h3>
                <p className="text-xs sm:text-sm text-[#EFE8E1]/80 max-w-xl">{offers[0].description}</p>
              </div>
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <div className="rounded-lg border border-[#C79A7F]/40 bg-[#342522] px-4 py-2 font-mono text-xs tracking-widest text-[#E2CFBF]">
                CODE: {offers[0].code}
              </div>
              <Link
                href="/booking/salon_soho_01"
                className="rounded-full bg-[#9C6644] px-6 py-2.5 text-xs uppercase tracking-widest font-medium text-white hover:bg-[#855333] transition-all duration-300 hover:shadow-lg hover:scale-105"
              >
                Claim Now
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 3. FEATURED BEAUTY SERVICES */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Curated Menu</p>
          <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-light">Featured Beauty Rituals</h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            Every treatment is uniquely tailored by master artisans using cruelty-free, clinical-grade formulations.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredServices.map((service) => (
            <div
              key={service.id}
              className="group relative rounded-3xl border border-border bg-card p-4 transition-all duration-500 hover:border-primary/60 hover:shadow-xl hover:translate-y-[-4px] flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[16/11] rounded-2xl overflow-hidden mb-5">
                  <img
                    src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-108"
                  />
                  <div className="absolute top-3 right-3 rounded-full bg-white/90 backdrop-blur-xs px-3 py-1 text-xs font-medium text-primary shadow-xs">
                    ${service.price}
                  </div>
                  <div className="absolute bottom-3 left-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] text-white">
                    {service.durationMins} mins
                  </div>
                </div>

                <div className="px-2">
                  <span className="text-[10px] uppercase tracking-widest text-primary font-medium">
                    {service.category}
                  </span>
                  <h3 className="font-serif text-xl font-normal mt-1 group-hover:text-primary transition-colors duration-300">
                    {service.name}
                  </h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {service.description}
                  </p>
                </div>
              </div>

              <div className="mt-6 pt-4 border-t border-border/60 px-2 flex items-center justify-between">
                <span className="text-xs text-muted-foreground font-mono">From ${service.price} USD</span>
                <Link
                  href={`/booking/salon_soho_01`}
                  className="inline-flex items-center gap-1.5 text-xs uppercase tracking-wider font-medium text-primary hover:text-[#855333] transition"
                >
                  <span>Book Now</span>
                  <ArrowRight className="h-3.5 w-3.5 transition duration-300 group-hover:translate-x-1.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/services"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/40 px-8 py-3 text-xs uppercase tracking-widest font-medium text-foreground hover:bg-secondary hover:border-primary transition duration-300 hover:shadow-sm"
          >
            <span>View Complete Service Directory</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* 4. BEFORE & AFTER TRANSFORMATIONS WITH NANO BANANA WEBP IMAGES */}
      <section className="py-24 bg-[#F5EFEB] border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Verified Metamorphosis</p>
              <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-light">Before & After Real Results</h2>
            </div>
            <p className="max-w-md text-sm text-muted-foreground">
              Witness the authentic difference of French balayage ribboning and clinical Hydra-Infusion dermal sculpting. Slide to inspect.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            {beforeAfterTransformations.map((item) => (
              <div
                key={item.id}
                className="rounded-3xl border border-border bg-card p-6 shadow-sm hover:shadow-md transition-all duration-300"
              >
                <div className="mb-4 flex items-center justify-between">
                  <div>
                    <h3 className="font-serif text-xl font-medium">{item.title}</h3>
                    <p className="text-xs text-muted-foreground mt-0.5">Artisan: {item.stylistName || "Maison Master"}</p>
                  </div>
                  <span className="text-[11px] uppercase tracking-wider text-primary border border-primary/30 px-3 py-1 rounded-full">
                    {item.category.replace("_", " ")}
                  </span>
                </div>

                <BeforeAfterSlider
                  beforeImage={item.beforeImageUrl || "/transformations/hair_before.webp"}
                  afterImage={item.afterImageUrl || "/transformations/hair_after.webp"}
                />

                <p className="mt-4 text-xs text-muted-foreground leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link
              href="/gallery"
              className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-primary hover:underline transition"
            >
              <span>Explore Gallery with Interactive Lightbox</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 5. BRIDAL & SIGNATURE PACKAGES */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Bespoke Luxury</p>
          <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-light">Bridal & Special Packages</h2>
          <p className="mt-4 text-muted-foreground text-sm sm:text-base">
            Comprehensive beauty journeys thoughtfully designed for your most memorable occasions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {signaturePackages.map((pkg) => {
            const inclusions = pkg.includes ? JSON.parse(pkg.includes) : [];
            return (
              <div
                key={pkg.id}
                className="rounded-3xl border border-border bg-card p-8 flex flex-col justify-between shadow-xs hover:border-primary/60 hover:shadow-xl hover:translate-y-[-4px] transition-all duration-500 relative overflow-hidden"
              >
                {pkg.badge && (
                  <div className="absolute top-5 right-5 rounded-full bg-primary/10 border border-primary/30 px-3 py-1 text-[11px] font-medium text-primary">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground font-medium">
                    {pkg.durationMins} Min Experience
                  </span>
                  <h3 className="font-serif text-2xl font-normal mt-2">{pkg.name}</h3>
                  <p className="text-xs text-primary font-medium mt-1">{pkg.subtitle}</p>

                  <div className="my-6 pb-6 border-b border-border">
                    <div className="flex items-baseline gap-2">
                      <span className="font-serif text-4xl font-light text-foreground">${pkg.price}</span>
                      <span className="text-sm text-muted-foreground line-through font-mono">
                        ${pkg.originalPrice}
                      </span>
                    </div>
                    <p className="text-[11px] text-muted-foreground mt-1">Inclusive of full private suite & refreshments</p>
                  </div>

                  <ul className="space-y-3 mb-8">
                    {inclusions.slice(0, 4).map((inc: string, idx: number) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                        <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                        <span>{inc}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  href="/booking/salon_soho_01"
                  className="w-full text-center rounded-full bg-primary py-3.5 text-xs uppercase tracking-widest font-medium text-primary-foreground hover:bg-[#855333] transition duration-300 shadow-xs hover:shadow-md"
                >
                  Reserve Package
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* 6. WHY CHOOSE US */}
      <section className="py-20 bg-[#FAF7F2] border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">The Aegis Standard</p>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light">Why Discerning Clients Choose Us</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-primary mb-4">
                <ShieldCheck className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-lg font-medium">Hospital-Grade Sterilization</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Every metal instrument is sealed and medical-autoclaved. Single-use biodegradable files for each individual guest.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-primary mb-4">
                <Award className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-lg font-medium">Master Certified Artisans</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                European-trained creative directors and licensed dermal clinical specialists with over a decade of mastery.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-primary mb-4">
                <HeartHandshake className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-lg font-medium">Clean & Ethical Products</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Formulations strictly free of ammonia, parabens, and harsh sulfates. 100% cruelty-free, sustainable luxury.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-white p-6 shadow-xs hover:shadow-lg hover:border-primary/40 transition-all duration-300">
              <div className="h-12 w-12 rounded-full bg-[#FAF7F2] flex items-center justify-center text-primary mb-4">
                <Sparkles className="h-6 w-6" />
              </div>
              <h4 className="font-serif text-lg font-medium">Private VIP Suites</h4>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Acoustically insulated suites with artisanal espresso, curated champagne, and total privacy for high-profile guests.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 7. OUR EXPERTS PREVIEW */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Master Artisans</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-light">Meet Our Beauty Specialists</h2>
          </div>
          <Link
            href="/experts"
            className="inline-flex items-center gap-2 text-xs uppercase tracking-widest font-medium text-primary hover:underline"
          >
            <span>View All Profiles & Portfolios</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {featuredStylists.map((st) => (
            <div
              key={st.id}
              className="group rounded-2xl overflow-hidden border border-border bg-card p-4 transition-all duration-300 hover:shadow-xl hover:border-primary/40"
            >
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-4">
                <img
                  src={st.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                  alt={st.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/90 px-2.5 py-0.5 text-[11px] font-semibold text-primary">
                  ★ {st.rating}
                </div>
              </div>
              <h3 className="font-serif text-xl font-medium">{st.name}</h3>
              <p className="text-xs text-primary font-medium mt-0.5">{st.title}</p>
              <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{st.specialization}</p>
              <div className="mt-4 pt-3 border-t border-border flex items-center justify-between">
                <span className="text-[11px] text-muted-foreground">{st.experienceYears}+ Yrs Exp</span>
                <Link
                  href={`/booking/salon_soho_01`}
                  className="text-xs uppercase tracking-wider font-medium text-primary hover:underline"
                >
                  Book with {st.name.split(" ")[0]}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 8. CLIENT TESTIMONIALS */}
      <section className="py-24 bg-[#FAF7F2] border-t border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Guest Reflections</p>
            <h2 className="mt-2 font-serif text-4xl sm:text-5xl font-light">Enduring Impressions</h2>
            <div className="mt-4 flex items-center justify-center gap-1 text-amber-500">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="h-4 w-4 fill-amber-500" />
              ))}
              <span className="ml-2 text-xs font-semibold text-foreground">4.98 out of 5 based on 340+ verified guests</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-3xl border border-border bg-white p-8 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm italic text-foreground leading-relaxed">
                "Clara Dubois created the most immaculate lived-in French Balayage I have ever experienced. Six months later, my color still looks deliberate and sunlit without any brassiness. The SoHo atelier is unmatched."
              </p>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#EFE8E1] flex items-center justify-center font-serif text-sm font-medium text-foreground">
                  GS
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Genevieve Sterling</p>
                  <p className="text-[11px] text-muted-foreground">Balayage & Hair Spa · Google Review</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm italic text-foreground leading-relaxed">
                "I booked the Sovereign Bridal Crown experience for my wedding weekend. Having the private suite with champagne and Elena doing my airbrush makeup was pure serenity. The look stayed flawless through 14 hours of tears and dancing."
              </p>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#EFE8E1] flex items-center justify-center font-serif text-sm font-medium text-foreground">
                  AL
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Audrey Laurent-Bisset</p>
                  <p className="text-[11px] text-muted-foreground">Bridal Crown Package · Verified Client</p>
                </div>
              </div>
            </div>

            <div className="rounded-3xl border border-border bg-white p-8 shadow-xs hover:shadow-lg transition-all duration-300">
              <div className="flex text-amber-500 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-amber-500" />
                ))}
              </div>
              <p className="text-sm italic text-foreground leading-relaxed">
                "Sofia’s Hydra-Infusion facial gave me actual glass skin before my editorial shoot. Her lymphatic massage technique completely contoured my jawline. I am now on a monthly standing reservation."
              </p>
              <div className="mt-6 pt-4 border-t border-border flex items-center gap-3">
                <div className="h-9 w-9 rounded-full bg-[#EFE8E1] flex items-center justify-center font-serif text-sm font-medium text-foreground">
                  VK
                </div>
                <div>
                  <p className="text-xs font-semibold text-foreground">Victoria Kensington</p>
                  <p className="text-[11px] text-muted-foreground">Dermal Clinical Facial · Google Review</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 9. INSTAGRAM GALLERY FEED */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
          <div>
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">@AegisMaisonDeBeaute</span>
            <h2 className="font-serif text-3xl font-light mt-1">Curated Instagram Journal</h2>
          </div>
          <a
            href="https://instagram.com"
            target="_blank"
            rel="noopener noreferrer"
            className="rounded-full border border-border px-5 py-2 text-xs uppercase tracking-widest text-foreground hover:border-primary transition"
          >
            Follow on Instagram
          </a>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { img: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=600&q=80", tag: "Dermal Radiance" },
            { img: "/transformations/hair_after.webp", tag: "Couture Balayage" },
            { img: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?auto=format&fit=crop&w=600&q=80", tag: "Bridal Glow" },
            { img: "/transformations/skin_after.webp", tag: "Hydra Glass Skin" },
          ].map((post, idx) => (
            <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden shadow-xs">
              <img
                src={post.img}
                alt={post.tag}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                <span className="text-white text-xs font-serif uppercase tracking-wider text-center">
                  #{post.tag.replace(" ", "")}
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 10. FINAL INVITATION CTA */}
      <section className="py-24 bg-gradient-to-r from-[#221B19] via-[#342522] to-[#221B19] text-[#FFFBF7] px-6 text-center relative overflow-hidden">
        <div className="max-w-3xl mx-auto space-y-6 relative z-10">
          <p className="text-xs uppercase tracking-[0.3em] text-[#C79A7F] font-semibold">Private Appointments</p>
          <h2 className="font-serif text-4xl sm:text-6xl font-light">Claim Your Sacred Moment</h2>
          <p className="text-sm sm:text-base text-[#EFE8E1]/80 max-w-xl mx-auto leading-relaxed">
            Reserve your private consultation with our master stylists and experience the personalized beauty care you deserve.
          </p>
          <div className="pt-4 flex flex-wrap justify-center gap-4">
            <Link
              href="/booking/salon_soho_01"
              className="rounded-full bg-[#9C6644] px-8 py-4 text-xs uppercase tracking-widest font-medium text-white hover:bg-[#855333] transition duration-300 shadow-lg hover:shadow-2xl hover:scale-105"
            >
              Book An Appointment
            </Link>
            <Link
              href="/contact"
              className="rounded-full border border-[#C79A7F]/40 bg-white/5 px-8 py-4 text-xs uppercase tracking-widest font-medium text-[#FFFBF7] hover:bg-white/10 transition"
            >
              Concierge Inquiry
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
