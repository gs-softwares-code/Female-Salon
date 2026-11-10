import Link from "next/link";
import { Sparkles, Shield, Heart, Award, CheckCircle2, ArrowRight } from "lucide-react";

export const metadata = {
  title: "About The Maison | Aegis Maison de Beauté",
  description: "Learn about the heritage, philosophy, rigorous hygiene protocols, and artisan team behind Aegis Maison de Beauté in SoHo, New York.",
};

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Philosophy & Heritage</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">The Aegis Sanctuary</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Founded on the conviction that personal care should never feel transactional, Aegis Maison was conceived as an architectural oasis for restorative beauty and uncompromising artistry.
          </p>
        </div>
      </section>

      {/* Story & Founders Vision */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div className="relative">
            <div className="aspect-[4/5] rounded-3xl overflow-hidden shadow-xl border border-border">
              <img
                src="https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?auto=format&fit=crop&w=1000&q=80"
                alt="Aegis Atelier Experience"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-6 -right-6 rounded-2xl bg-white p-6 shadow-xl border border-border max-w-xs hidden sm:block">
              <p className="font-serif text-lg font-light text-foreground">"True beauty is an intimate dialogue, not a quick service."</p>
              <p className="text-xs text-primary font-medium mt-2">— Eleanor Vance, Founder</p>
            </div>
          </div>

          <div className="space-y-6">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Our Story</span>
            <h2 className="font-serif text-3xl sm:text-4xl font-light">Created in SoHo, Inspired by European Couture</h2>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              Nestled on Broome Street among historic cast-iron facades, Aegis Maison unites the quiet discipline of French hairdressing, clinical Swiss dermal science, and minimalist aesthetic design.
            </p>
            <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
              We eliminated the typical salon chaos—loud chatter, chemical odors, rushed chairs—and replaced it with an acoustically balanced haven of curved Venetian plaster, natural linen, and bespoke espresso rituals.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6 border-t border-border">
              <div>
                <p className="font-serif text-3xl text-primary font-light">100%</p>
                <p className="text-xs text-muted-foreground mt-1">Non-toxic, ammonia-free hair dyes and cruelty-free botanicals.</p>
              </div>
              <div>
                <p className="font-serif text-3xl text-primary font-light">1:1</p>
                <p className="text-xs text-muted-foreground mt-1">Dedicated artisan attention without overlapping client slots.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Hygiene & Customer-Care Standards */}
      <section className="py-20 bg-[#F5EFEB] border-y border-border">
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Uncompromising Protocol</span>
            <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light">Hospital-Grade Cleanliness Standards</h2>
            <p className="mt-3 text-sm text-muted-foreground">
              Your well-being is sacred. We operate with strict clinical sterilization standards that exceed New York State Board guidelines.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <Shield className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-serif text-xl font-medium">Medical Autoclave Sterilization</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                All stainless steel instruments undergo multi-stage ultrasonic cleansing followed by hospital-grade autoclave sterilization in sealed, tamper-evident envelopes opened in your presence.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <CheckCircle2 className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-serif text-xl font-medium">Single-Use Biodegradables</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Nail files, buffers, waxing spatulas, and foot bath liners are strictly single-use and manufactured from certified eco-friendly biodegradable materials.
              </p>
            </div>

            <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
              <Sparkles className="h-8 w-8 text-primary mb-4" />
              <h3 className="font-serif text-xl font-medium">HEPA H13 Air Purification</h3>
              <p className="mt-2 text-xs text-muted-foreground leading-relaxed">
                Medical-grade air circulation filters volatile organic compounds (VOCs) and airborne particles every 12 minutes, keeping the atelier aroma soothing and pristinely clean.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Interior Showcase */}
      <section className="py-24 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs uppercase tracking-[0.25em] text-primary font-medium">Atelier Architectural Design</span>
          <h2 className="mt-2 font-serif text-3xl sm:text-4xl font-light">The Salon Interior Showcase</h2>
          <p className="mt-3 text-sm text-muted-foreground">
            A harmonious blend of champagne travertine, brushed brass, fluted glass, and soft ambient illumination.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border group relative">
            <img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"
              alt="Main Styling Hall"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="text-white font-serif text-lg">The Main Styling Hall</p>
            </div>
          </div>

          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border group relative">
            <img
              src="https://images.unsplash.com/photo-1540555700478-4be289fbecef?auto=format&fit=crop&w=800&q=80"
              alt="Dermal Facial Suite"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="text-white font-serif text-lg">Private Dermal Facial Sanctum</p>
            </div>
          </div>

          <div className="aspect-[4/5] rounded-2xl overflow-hidden border border-border group relative">
            <img
              src="https://images.unsplash.com/photo-1519014816548-bf5fe059798b?auto=format&fit=crop&w=800&q=80"
              alt="Champagne Pedicure Lounge"
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
              <p className="text-white font-serif text-lg">Champagne Pedicure Lounge</p>
            </div>
          </div>
        </div>

        <div className="mt-14 text-center">
          <Link
            href="/booking/salon_soho_01"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-8 py-3.5 text-xs uppercase tracking-widest font-medium text-primary-foreground hover:bg-[#855333] transition"
          >
            <span>Experience The Atelier Firsthand</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>
    </main>
  );
}

