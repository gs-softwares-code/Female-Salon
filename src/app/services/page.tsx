import Link from "next/link";
import { getDb } from "@/db";
import { services } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Clock, ArrowRight, Sparkles } from "lucide-react";
import { ServiceTabs } from "@/components/services/ServiceTabs";

export const dynamic = "force-dynamic";

export const metadata = {
  title: "Services & Rituals Directory | Aegis Maison de Beauté",
  description: "Browse our complete menu of luxury services: Haute Haircare, Hydra-Infusion Facials, Bridal & Party Makeup, Russian Manicures, and Body Polishing in SoHo.",
};

export default async function ServicesPage() {
  const db = getDb();
  const allServices = await db.select().from(services).where(eq(services.status, "ACTIVE"));

  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Bespoke Treatments</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">Services & Rituals Menu</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            Curated across Hair, Skin, Makeup, Nails, and Grooming. Filter by discipline and reserve your dedicated artisan slot.
          </p>
        </div>
      </section>

      {/* Services Grid with Interactive Filter Tabs */}
      <section className="py-16 px-6 lg:px-8 max-w-7xl mx-auto">
        <ServiceTabs initialServices={allServices} />
      </section>
    </main>
  );
}

