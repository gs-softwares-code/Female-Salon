"use client";

import Link from "next/link";
import { MessageCircle, Calendar } from "lucide-react";

export function FloatingActions() {
  return (
    <>
      {/* Floating WhatsApp Quick Concierge */}
      <a
        href="https://wa.me/12125550198?text=Hello%20Aegis%20Maison,%20I%20would%20like%20to%20inquire%20about%20booking%20a%20luxury%20beauty%20ritual."
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Concierge"
        className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-xl transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none"
      >
        <MessageCircle className="h-7 w-7 fill-white" />
        <span className="sr-only">Chat on WhatsApp</span>
      </a>

      {/* Sticky Bottom Book Appointment Banner for Mobile Devices */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-md border-t border-[#E8DDD5] p-3 md:hidden flex items-center justify-between shadow-lg">
        <div>
          <p className="text-xs font-serif font-medium text-foreground">Aegis Maison de Beauté</p>
          <p className="text-[10px] text-muted-foreground">SoHo Flagship · New York</p>
        </div>
        <Link
          href="/booking/salon_soho_01"
          className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-xs font-medium uppercase tracking-wider text-primary-foreground shadow-sm"
        >
          <Calendar className="h-3.5 w-3.5" />
          <span>Book Now</span>
        </Link>
      </div>
    </>
  );
}

