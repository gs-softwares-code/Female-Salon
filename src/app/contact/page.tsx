import { MapPin, Phone, Mail, Clock, MessageCircle, Instagram, Sparkles } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";

export const metadata = {
  title: "Contact & Concierge | Aegis Maison de Beauté",
  description: "Connect with the Aegis Maison concierge in SoHo, New York. Find our address, direct WhatsApp line, opening hours, and submit private inquiries.",
};

export default function ContactPage() {
  return (
    <main className="min-h-screen bg-background">
      {/* Header Banner */}
      <section className="relative py-20 px-6 bg-gradient-to-b from-[#F5EFEB] to-background border-b border-border">
        <div className="max-w-4xl mx-auto text-center space-y-4">
          <p className="text-xs uppercase tracking-[0.3em] text-primary font-medium">Concierge & Visit</p>
          <h1 className="font-serif text-5xl sm:text-6xl font-light">Contact The Maison</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto text-base sm:text-lg leading-relaxed">
            We invite you to reach out for appointments, bespoke bridal reservations, or private suite inquiries. Our concierge desk is dedicated to your comfort.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20 px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Contact Details & Maps Info */}
          <div className="lg:col-span-5 space-y-8">
            <div className="rounded-3xl border border-border bg-card p-8 shadow-xs space-y-6">
              <h2 className="font-serif text-2xl font-light">Flagship Atelier</h2>

              <div className="space-y-4 text-sm">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Aegis Maison de Beauté</p>
                    <p className="text-muted-foreground">482 Broome Street, SoHo</p>
                    <p className="text-muted-foreground">New York, NY 10013, USA</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Direct Atelier Phone</p>
                    <a href="tel:+12125550198" className="font-medium text-foreground hover:text-primary transition">
                      +1 (212) 555-0198
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Mail className="h-5 w-5 text-primary shrink-0" />
                  <div>
                    <p className="text-xs text-muted-foreground">Concierge Desk</p>
                    <a href="mailto:soho@aegisbeauty.com" className="font-medium text-foreground hover:text-primary transition">
                      soho@aegisbeauty.com
                    </a>
                  </div>
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <Clock className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                  <div>
                    <p className="font-medium text-foreground">Atelier Opening Hours</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Monday – Saturday: 9:00 AM – 8:00 PM</p>
                    <p className="text-xs text-muted-foreground">Sunday: 10:00 AM – 6:00 PM</p>
                  </div>
                </div>
              </div>

              {/* Direct WhatsApp Callout */}
              <div className="pt-4 border-t border-border">
                <a
                  href="https://wa.me/12125550198?text=Hello%20Aegis%20Maison,%20I%20would%20like%20to%20inquire%20about%20an%20appointment."
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between rounded-2xl bg-[#EFE8E1] p-4 text-foreground hover:bg-[#E8DDD5] transition"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#25D366] text-white">
                      <MessageCircle className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs font-semibold">Instant WhatsApp Concierge</p>
                      <p className="text-[11px] text-muted-foreground">Typical response time: under 5 minutes</p>
                    </div>
                  </div>
                  <span className="text-xs text-primary font-medium">Chat →</span>
                </a>
              </div>
            </div>

            {/* Google Maps Visual Embed */}
            <div className="rounded-3xl border border-border overflow-hidden shadow-xs bg-muted">
              <iframe
                title="Aegis Maison SoHo Map"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3023.630043867623!2d-74.00236162354702!3d40.72288303674683!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c2598be6f44357%3A0x6b49dc3ec75f560e!2sBroome%20St%2C%20New%20York%2C%20NY!5e0!3m2!1sen!2sus!4v1715000000000!5m2!1sen!2sus"
                width="100%"
                height="280"
                style={{ border: 0 }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>
          </div>

          {/* Contact Inquiry Form */}
          <div className="lg:col-span-7">
            <ContactForm />
          </div>
        </div>
      </section>
    </main>
  );
}

