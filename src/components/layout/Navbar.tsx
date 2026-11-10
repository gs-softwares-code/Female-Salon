"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { usePathname } from "next/navigation";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  // If in CMS admin section, render clean top indicator or standard bar
  const isCms = pathname.startsWith("/cms");

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "About", href: "/about" },
    { name: "Services", href: "/services" },
    { name: "Bridal & Packages", href: "/packages" },
    { name: "Our Experts", href: "/experts" },
    { name: "Gallery", href: "/gallery" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        scrolled
          ? "bg-[#FAF7F2]/95 backdrop-blur-md border-b border-[#E8DDD5] shadow-sm py-4"
          : "bg-[#FAF7F2]/80 backdrop-blur-sm py-5"
      }`}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 md:px-8">
        {/* Brand Logo */}
        <Link href="/" className="group flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-full border border-primary/40 bg-white font-serif text-lg font-light text-primary shadow-xs transition group-hover:border-primary">
            A
          </span>
          <div className="flex flex-col">
            <span className="font-serif text-xl tracking-wider text-foreground font-medium uppercase md:text-2xl">
              Aegis Maison
            </span>
            <span className="text-[10px] uppercase tracking-[0.28em] text-primary -mt-1 font-sans">
              De Beauté
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-8 text-sm tracking-wide">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 relative py-1 ${
                  isActive
                    ? "text-primary font-medium after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-primary after:rounded-full"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Action CTAs */}
        <div className="hidden sm:flex items-center gap-4">
          <Link
            href="/cms/login"
            className="text-xs uppercase tracking-widest text-muted-foreground hover:text-foreground transition px-3 py-2"
          >
            Staff Portal
          </Link>
          <Link
            href="/booking/salon_soho_01"
            className="group relative inline-flex items-center justify-center overflow-hidden rounded-full bg-primary px-6 py-2.5 text-xs font-medium uppercase tracking-widest text-primary-foreground shadow-sm transition-all duration-300 hover:bg-[#855333] hover:shadow-md"
          >
            <span>Book Ritual</span>
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="lg:hidden p-2 text-foreground focus:outline-none"
          aria-label="Toggle menu"
        >
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-b border-border bg-[#FAF7F2] px-6 py-6 shadow-xl transition-all">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`text-base font-serif tracking-wide ${
                  pathname === link.href ? "text-primary font-medium" : "text-foreground"
                }`}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 border-t border-border flex flex-col gap-3">
              <Link
                href="/booking/salon_soho_01"
                onClick={() => setMobileMenuOpen(false)}
                className="w-full text-center rounded-full bg-primary py-3 text-xs uppercase tracking-widest font-medium text-primary-foreground"
              >
                Book Appointment
              </Link>
              <Link
                href="/cms/login"
                onClick={() => setMobileMenuOpen(false)}
                className="text-center text-xs uppercase tracking-widest text-muted-foreground py-2"
              >
                Staff Portal
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}

