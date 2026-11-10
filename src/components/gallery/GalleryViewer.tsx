"use client";

import { useState } from "react";
import { X, ZoomIn, ArrowLeft, ArrowRight, Sparkles } from "lucide-react";
import { BeforeAfterSlider } from "@/components/home/BeforeAfterSlider";

type GalleryItem = {
  id: string;
  title: string;
  category: "HAIR" | "MAKEUP" | "NAILS" | "INTERIOR" | "BEFORE_AFTER";
  imageUrl: string;
  beforeImageUrl: string | null;
  afterImageUrl: string | null;
  description: string | null;
  stylistName: string | null;
};

export function GalleryViewer({ items }: { items: GalleryItem[] }) {
  const [activeCategory, setActiveCategory] = useState<string>("ALL");
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null);

  const categories = [
    { label: "All Works", value: "ALL" },
    { label: "Hair & Balayage", value: "HAIR" },
    { label: "Makeup Artistry", value: "MAKEUP" },
    { label: "Nails & BIAB", value: "NAILS" },
    { label: "Salon Interiors", value: "INTERIOR" },
    { label: "Before & After", value: "BEFORE_AFTER" },
  ];

  const filtered = activeCategory === "ALL"
    ? items
    : items.filter((item) => item.category === activeCategory);

  return (
    <div>
      {/* Category Filter Pills */}
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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filtered.map((item) => (
          <div
            key={item.id}
            className="group rounded-3xl border border-border bg-card p-4 shadow-xs hover:border-primary/50 hover:shadow-xl transition-all duration-300"
          >
            {item.category === "BEFORE_AFTER" && item.beforeImageUrl && item.afterImageUrl ? (
              <div className="space-y-4">
                <BeforeAfterSlider
                  beforeImage={item.beforeImageUrl}
                  afterImage={item.afterImageUrl}
                />
                <div className="px-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                      Before & After
                    </span>
                    {item.stylistName && (
                      <span className="text-[11px] text-muted-foreground font-mono">{item.stylistName}</span>
                    )}
                  </div>
                  <h3 className="font-serif text-xl font-normal mt-1">{item.title}</h3>
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed">{item.description}</p>
                </div>
              </div>
            ) : (
              <div
                onClick={() => setSelectedItem(item)}
                className="cursor-pointer space-y-4"
              >
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <img
                    src={item.imageUrl}
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/90 text-primary shadow-lg">
                      <ZoomIn className="h-5 w-5" />
                    </div>
                  </div>
                  <div className="absolute top-3 left-3 rounded-full bg-black/60 backdrop-blur-xs px-3 py-1 text-[11px] text-white uppercase tracking-wider">
                    {item.category}
                  </div>
                </div>

                <div className="px-2">
                  <div className="flex items-center justify-between">
                    <h3 className="font-serif text-xl font-normal group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                  </div>
                  {item.stylistName && (
                    <p className="text-xs text-primary font-medium mt-0.5">By {item.stylistName}</p>
                  )}
                  <p className="mt-2 text-xs text-muted-foreground leading-relaxed line-clamp-2">
                    {item.description}
                  </p>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Interactive Lightbox Modal */}
      {selectedItem && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 sm:p-8 animate-in fade-in duration-200"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="relative max-w-4xl w-full bg-[#FAF7F2] text-[#221B19] rounded-3xl overflow-hidden shadow-2xl border border-[#E8DDD5]"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setSelectedItem(null)}
              className="absolute top-4 right-4 z-20 flex h-10 w-10 items-center justify-center rounded-full bg-black/70 text-white hover:bg-black transition shadow-md"
              aria-label="Close modal"
            >
              <X className="h-5 w-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-12 max-h-[85vh]">
              <div className="md:col-span-7 bg-[#1A1412] flex items-center justify-center p-2">
                <img
                  src={selectedItem.imageUrl}
                  alt={selectedItem.title}
                  className="max-h-[75vh] w-full object-contain rounded-xl"
                />
              </div>
              <div className="md:col-span-5 p-6 sm:p-8 flex flex-col justify-between bg-[#FAF7F2] overflow-y-auto">
                <div className="space-y-4">
                  <div className="inline-block">
                    <span className="text-[11px] uppercase tracking-[0.2em] text-[#9C6644] font-semibold bg-[#EFE8E1] px-3 py-1 rounded-full border border-[#E8DDD5]">
                      {selectedItem.category}
                    </span>
                  </div>

                  <h3 className="font-serif text-3xl font-light text-[#221B19] leading-tight">
                    {selectedItem.title}
                  </h3>

                  {selectedItem.stylistName && (
                    <div className="flex items-center gap-2 text-xs text-[#5C4D47] font-medium">
                      <span>Artisan Specialist:</span>
                      <span className="font-semibold text-[#9C6644]">{selectedItem.stylistName}</span>
                    </div>
                  )}

                  <div className="pt-2 border-t border-[#E8DDD5]">
                    <p className="text-xs text-[#6B5E58] leading-relaxed">
                      {selectedItem.description}
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#E8DDD5] mt-6">
                  <a
                    href="/booking/salon_soho_01"
                    className="w-full text-center block rounded-full bg-[#9C6644] py-3 text-xs uppercase tracking-widest font-medium text-[#FFFBF7] hover:bg-[#855333] transition-all duration-300 shadow-md hover:shadow-lg"
                  >
                    Book A Similar Look
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
