import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { FloatingActions } from "@/components/layout/FloatingActions";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aegis Maison de Beauté | Haute Haircare, Dermal Wellness & Bridal Artistry",
  description: "A sanctuary of modern luxury and feminine elegance. Offering bespoke haircare, Hydra-infusion dermal facials, couture bridal styling, and restorative spa rituals in SoHo.",
  keywords: ["luxury beauty salon", "haute haircare", "bridal makeup", "hydrafacial", "Russian manicure", "french balayage", "SoHo salon"],
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon.ico", sizes: "any" }
    ],
    apple: "/favicon.svg",
  },
  openGraph: {
    title: "Aegis Maison de Beauté — Where Care Feels Personal",
    description: "Modern luxury salon delivering high-definition beauty artistry, clinical dermal treatments, and curated bridal packages.",
    type: "website",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${playfair.variable} ${inter.variable} h-full antialiased`}>
      <body className="min-h-full flex flex-col bg-background text-foreground">
        <Navbar />
        <div className="flex-1">{children}</div>
        <Footer />
        <FloatingActions />
      </body>
    </html>
  );
}
