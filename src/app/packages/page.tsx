import Link from "next/link";
import { getDb } from "@/db";
import { packages } from "@/db/schema";
import { Check, Sparkles, ArrowRight, Calendar, HeartHandshake } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Bridal & Special Packages | Aegis Maison de Beauté",
  description: "Experience our bridal and party-ready packages in private luxury suites: The Sovereign Bridal Crown, Pre-Bridal Radiance, and Custom Bespoke Rituals.",
};

export default async function PackagesPage() {
  const db = getDb();
  const allPackages = await db.select().from(packages);

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Couture Celebrations</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">Bridal & Special Packages</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            From complete wedding morning bridal suites to pre-event dermal radiance journeys. All packages feature dedicated private atelier suites and champagne hospitality.
          </p>
        </div>
      </section>

      {/* Packages Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {allPackages.map((pkg) => {
            const inclusions = pkg.includes ? JSON.parse(pkg.includes) : [];
            return (
              <div
                key={pkg.id}
                className="rounded-3xl border border-border bg-card p-8 md:p-10 flex flex-col justify-between shadow-xs hover:border-primary/50 hover:shadow-xl transition-all relative overflow-hidden"
              >
                {pkg.badge && (
                  <div className="absolute top-6 right-6 rounded-full bg-primary/10 border border-primary/30 px-3.5 py-1 text-xs font-semibold text-primary">
                    {pkg.badge}
                  </div>
                )}

                <div>
                  <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mb-6">
                    <img
                      src={pkg.imageUrl || "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1000&q=80"}
                      alt={pkg.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute bottom-3 left-3 rounded-full bg-black/60 px-3 py-1 text-xs text-white">
                      {pkg.durationMins} Minutes Sanctuary
                    </div>
                  </div>

                  <h2 className="font-serif text-3xl font-normal text-foreground">{pkg.name}</h2>
                  <p className="text-xs uppercase tracking-wider text-primary font-medium mt-1">{pkg.subtitle}</p>
                  <p className="text-xs text-muted-foreground mt-3 leading-relaxed">{pkg.description}</p>

                  <div className="my-6 py-5 border-y border-border flex items-baseline justify-between">
                    <div>
                      <span className="text-[10px] uppercase tracking-wider text-muted-foreground block">Curated Price</span>
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-4xl font-light text-foreground">${pkg.price}</span>
                        <span className="text-sm text-muted-foreground line-through font-mono">${pkg.originalPrice}</span>
                      </div>
                    </div>
                    <span className="text-xs text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-200">
                      Save ${(pkg.originalPrice - pkg.price)} USD
                    </span>
                  </div>

                  <div className="space-y-3 mb-8">
                    <p className="text-xs uppercase tracking-widest font-semibold text-foreground">Package Inclusions:</p>
                    <ul className="space-y-2.5">
                      {inclusions.map((inc: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-xs text-muted-foreground">
                          <Check className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="pt-4 border-t border-border flex items-center justify-between gap-4">
                  <Link
                    href={`https://wa.me/12125550198?text=Hello%20Aegis%20Maison,%20I%20am%20interested%20in%20reserving%20the%20${encodeURIComponent(pkg.name)}.`}
                    target="_blank"
                    className="text-xs uppercase tracking-wider text-muted-foreground hover:text-foreground underline underline-offset-4"
                  >
                    Inquire for Group
                  </Link>

                  <Link
                    href="/booking/salon_soho_01"
                    className="inline-flex items-center gap-2 rounded-full bg-primary px-7 py-3 text-xs uppercase tracking-widest font-medium text-primary-foreground hover:bg-[#855333] transition shadow-xs"
                  >
                    <span>Reserve Package</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Bridal Party Consultation Banner */}
      <section className="py-20 bg-[#FAF7F2] border-t border-border text-center px-6">
        <div className="max-w-2xl mx-auto space-y-4">
          <HeartHandshake className="h-8 w-8 text-primary mx-auto" />
          <h3 className="font-serif text-3xl font-light">Custom Bridal Entourages & Destination Events</h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Hosting a bridal party of four or more? Our creative directors will coordinate a bespoke timeline, private champagne catering, and on-location hair & makeup team.
          </p>
          <div className="pt-2">
            <Link
              href="/contact"
              className="inline-flex items-center gap-2 rounded-full border border-primary px-8 py-3 text-xs uppercase tracking-widest font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
            >
              <span>Connect with Bridal Concierge</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}

