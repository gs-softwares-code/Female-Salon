"use client";

import { useState } from "react";
import { submitContactInquiry } from "@/app/actions/contact";
import { CheckCircle2, Send } from "lucide-react";

export function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [subject, setSubject] = useState("Private Bridal / Group Reservation");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg("");
    try {
      await submitContactInquiry({ name, email, phone, subject, message });
      setSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || "Failed to submit inquiry. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 md:p-10 text-center shadow-xs">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-[#f4ebe6] text-primary">
          <CheckCircle2 className="h-7 w-7" />
        </div>
        <h3 className="font-serif text-2xl font-light mt-4">Inquiry Received</h3>
        <p className="mt-2 text-xs sm:text-sm text-muted-foreground max-w-md mx-auto">
          Thank you, {name}. Our Head of Concierge will review your request and get back to you within 4 hours.
        </p>
        <button
          onClick={() => {
            setSubmitted(false);
            setMessage("");
          }}
          className="mt-6 text-xs uppercase tracking-wider text-primary font-medium hover:underline"
        >
          Send Another Message
        </button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="rounded-3xl border border-border bg-card p-8 md:p-10 shadow-xs space-y-5">
      <div>
        <h3 className="font-serif text-2xl font-light">Send an Inquiry</h3>
        <p className="text-xs text-muted-foreground mt-1">
          For private suite bookings, bridal consultations, or styling queries.
        </p>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Full Name *</label>
        <input
          type="text"
          required
          placeholder="e.g. Lady Genevieve"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Email Address *</label>
          <input
            type="email"
            required
            placeholder="genevieve@sterling.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
        <div>
          <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Phone (Optional)</label>
          <input
            type="tel"
            placeholder="+1 (212) 555-0198"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Inquiry Topic</label>
        <select
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
        >
          <option>Private Bridal / Group Reservation</option>
          <option>French Balayage & Color Consultation</option>
          <option>Dermal Hydra-Infusion Treatment Advice</option>
          <option>Press & Editorial Collaboration</option>
          <option>Other Special Request</option>
        </select>
      </div>

      <div>
        <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1.5">Your Message *</label>
        <textarea
          required
          rows={4}
          placeholder="Share details of your ideal date, desired treatments, or event specifications..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
        />
      </div>

      {errorMsg && <p className="text-xs text-destructive">{errorMsg}</p>}

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full inline-flex items-center justify-center gap-2 rounded-full bg-primary py-3.5 text-xs uppercase tracking-widest font-medium text-primary-foreground hover:bg-[#855333] transition shadow-xs disabled:opacity-50"
      >
        <Send className="h-3.5 w-3.5" />
        <span>{isSubmitting ? "Submitting..." : "Send Message to Concierge"}</span>
      </button>
    </form>
  );
}

