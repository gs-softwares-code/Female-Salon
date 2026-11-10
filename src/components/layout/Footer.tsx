import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-[#E8DDD5] bg-[#F5EFEB] text-foreground">
      <div className="mx-auto max-w-7xl px-6 py-16 md:px-8 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-5">
          {/* Brand Intro */}
          <div className="lg:col-span-2">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-white font-serif text-lg text-primary">
                A
              </span>
              <span className="font-serif text-2xl tracking-wider uppercase font-medium">
                Aegis Maison
              </span>
            </div>
            <p className="mt-4 max-w-sm text-sm leading-relaxed text-muted-foreground">
              A luxury sanctuary honoring individual beauty, high-performance clean formulations, and timeless aesthetic mastery in SoHo, New York.
            </p>
            <div className="mt-6 flex items-center gap-4 text-xs tracking-wider text-muted-foreground">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-600"></span>
              <span>Accepting private reservations for the 2026 bridal & couture season</span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-wider text-foreground mb-4">
              Rituals & Menu
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/services#hair" className="hover:text-primary transition">
                  Haute Haircare & Balayage
                </Link>
              </li>
              <li>
                <Link href="/services#skin" className="hover:text-primary transition">
                  Hydra-Infusion Facials
                </Link>
              </li>
              <li>
                <Link href="/services#makeup" className="hover:text-primary transition">
                  Bridal & Gala Makeup
                </Link>
              </li>
              <li>
                <Link href="/services#nails" className="hover:text-primary transition">
                  Russian E-File & BIAB
                </Link>
              </li>
              <li>
                <Link href="/packages" className="hover:text-primary transition">
                  Curated Bridal Packages
                </Link>
              </li>
            </ul>
          </div>

          {/* Maison & Studio */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-wider text-foreground mb-4">
              The Maison
            </h4>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary transition">
                  Philosophy & Heritage
                </Link>
              </li>
              <li>
                <Link href="/experts" className="hover:text-primary transition">
                  Artisans & Stylists
                </Link>
              </li>
              <li>
                <Link href="/gallery" className="hover:text-primary transition">
                  Before & After Transformations
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary transition">
                  Location & Private Suites
                </Link>
              </li>
              <li>
                <Link href="/cms/login" className="hover:text-primary transition">
                  Salon Management Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Hours & Concierge */}
          <div>
            <h4 className="font-serif text-base uppercase tracking-wider text-foreground mb-4">
              Concierge Hours
            </h4>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>Monday – Saturday</p>
              <p className="font-medium text-foreground">9:00 AM – 8:00 PM</p>
              <p className="pt-2">Sunday</p>
              <p className="font-medium text-foreground">10:00 AM – 6:00 PM</p>
              <div className="pt-3">
                <a
                  href="tel:+12125550198"
                  className="font-medium text-primary hover:underline text-sm"
                >
                  +1 (212) 555-0198
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-14 border-t border-border/80 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-muted-foreground gap-4">
          <p>© 2026 Aegis Maison de Beauté. All rights reserved. Crafted with precision & luxury aesthetics.</p>
          <div className="flex gap-6">
            <Link href="/about" className="hover:text-foreground">Hygiene Standards</Link>
            <Link href="/contact" className="hover:text-foreground">Privacy Protocol</Link>
            <Link href="/booking/salon_soho_01" className="text-primary font-medium hover:underline">Book Online</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

