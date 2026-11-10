import Link from "next/link";
import { getDb } from "@/db";
import { stylists } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Star, Award, Calendar, ArrowRight } from "lucide-react";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Our Master Artisans & Stylists | Aegis Maison de Beauté",
  description: "Meet our celebrated team of European-trained creative colorists, certified dermal clinical aestheticians, and bridal beauty artists in SoHo.",
};

export default async function ExpertsPage() {
  const db = getDb();
  const allStylists = await db.select().from(stylists).where(eq(stylists.status, "ACTIVE"));

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">European Training · Global Acclaim</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">Our Master Artisans</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Our team represents decades of collective mastery across Paris, Milan, London, and New York fashion runways. Meet the dedicated hands shaping your experience.
          </p>
        </div>
      </section>

      {/* Artisans Grid */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
          {allStylists.map((stylist) => (
            <div
              key={stylist.id}
              className="group rounded-3xl border border-border bg-card p-6 shadow-xs hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <div className="relative aspect-[4/5] rounded-2xl overflow-hidden mb-6">
                  <img
                    src={stylist.avatarUrl || "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80"}
                    alt={stylist.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute top-4 right-4 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary flex items-center gap-1 shadow-xs">
                    <Star className="h-3 w-3 fill-amber-500 text-amber-500" />
                    <span>{stylist.rating}</span>
                  </div>
                  <div className="absolute bottom-4 left-4 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-xs text-white">
                    {stylist.experienceYears}+ Years Mastery
                  </div>
                </div>

                <div className="space-y-2">
                  <h2 className="font-serif text-2xl font-normal text-foreground group-hover:text-primary transition-colors">
                    {stylist.name}
                  </h2>
                  <p className="text-xs uppercase tracking-wider text-primary font-medium">{stylist.title}</p>
                  <div className="pt-2">
                    <span className="text-[10px] uppercase tracking-wider text-muted-foreground font-semibold block">Specialization:</span>
                    <p className="text-xs text-foreground font-medium">{stylist.specialization}</p>
                  </div>
                  <p className="pt-2 text-xs text-muted-foreground leading-relaxed">
                    {stylist.bio}
                  </p>
                </div>
              </div>

              <div className="mt-8 pt-4 border-t border-border flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Certified Master</span>
                <Link
                  href={`/booking/salon_soho_01`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-xs uppercase tracking-wider font-medium text-primary-foreground hover:bg-[#855333] transition"
                >
                  <Calendar className="h-3 w-3" />
                  <span>Book with {stylist.name.split(" ")[0]}</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

