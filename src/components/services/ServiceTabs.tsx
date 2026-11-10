"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Clock } from "lucide-react";

type Service = {
  id: string;
  name: string;
  description: string | null;
  durationMins: number;
  price: number;
  category: "HAIR" | "SKIN" | "MAKEUP" | "NAILS" | "GROOMING";
  imageUrl: string | null;
};

export function ServiceTabs({ initialServices }: { initialServices: Service[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");

  const categories = [
    { label: "All Rituals", value: "ALL" },
    { label: "Haute Haircare", value: "HAIR" },
    { label: "Skin & Clinical Facials", value: "SKIN" },
    { label: "Bridal & Party Makeup", value: "MAKEUP" },
    { label: "Nails & Artistry", value: "NAILS" },
    { label: "Beauty & Grooming", value: "GROOMING" },
  ];

  const filtered = activeCategory === "ALL"
    ? initialServices
    : initialServices.filter((s) => s.category === activeCategory);

  return (
    <div>
      {/* Category Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-14">
        {categories.map((cat) => (
          <button
            key={cat.value}
            onClick={() => setActiveCategory(cat.value)}
            className={`rounded-full px-6 py-2.5 text-xs uppercase tracking-widest font-medium transition-all ${
              activeCategory === cat.value
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-white border border-border text-muted-foreground hover:border-primary hover:text-foreground"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((service) => (
          <div
            key={service.id}
            id={service.category.toLowerCase()}
            className="group rounded-3xl border border-border bg-card p-5 shadow-xs hover:border-primary/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative aspect-[16/11] rounded-2xl overflow-hidden mb-5">
                <img
                  src={service.imageUrl || "https://images.unsplash.com/photo-1560066984-138dadb4c035?auto=format&fit=crop&w=800&q=80"}
                  alt={service.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <div className="absolute top-3 right-3 rounded-full bg-white/95 px-3 py-1 text-xs font-semibold text-primary shadow-xs">
                  ${service.price}
                </div>
                <div className="absolute bottom-3 left-3 flex items-center gap-1.5 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] text-white">
                  <Clock className="h-3 w-3" />
                  <span>{service.durationMins} mins</span>
                </div>
              </div>

              <div className="px-1">
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                  {service.category}
                </span>
                <h3 className="font-serif text-2xl font-normal mt-1 group-hover:text-primary transition-colors">
                  {service.name}
                </h3>
                <p className="mt-2.5 text-xs text-muted-foreground leading-relaxed">
                  {service.description}
                </p>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-border px-1 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase tracking-wider text-muted-foreground">Starting from</span>
                <p className="font-serif text-lg font-light text-foreground">${service.price} USD</p>
              </div>

              <Link
                href={`/booking/salon_soho_01`}
                className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 border border-primary/20 px-5 py-2 text-xs uppercase tracking-wider font-medium text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
              >
                <span>Book Now</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="py-20 text-center text-muted-foreground">
          No services found in this category.
        </div>
      )}
    </div>
  );
}

