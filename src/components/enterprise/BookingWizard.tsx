"use client";

import { useState } from "react";
import { createAppointment } from "@/app/actions/booking";

type Option = { id: string; name: string; durationMins?: number; price?: number };

export function BookingWizard({ salonId, services, stylists }: { salonId: string; services: Option[]; stylists: Option[] }) {
  const [step, setStep] = useState(0);
  const [serviceId, setServiceId] = useState(services[0]?.id ?? "");
  const [stylistId, setStylistId] = useState(stylists[0]?.id ?? "");
  const [startTime, setStartTime] = useState("");
  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");
  const [bookingNotes, setBookingNotes] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedId, setConfirmedId] = useState<string | null>(null);

  const labels = ["Select Ritual", "Master Stylist", "Date & Hour", "Guest Details"];

  const handleBooking = async () => {
    if (!startTime || !customerName || !customerEmail || !customerPhone) {
      setMessage("Please complete all guest details and select your preferred date & hour.");
      return;
    }
    setIsSubmitting(true);
    setMessage("");
    try {
      const result = await createAppointment({
        salonId,
        serviceId,
        stylistId,
        startTime: new Date(startTime),
        customerName,
        customerEmail,
        customerPhone,
        bookingNotes,
      });
      setConfirmedId(result.appointmentId);
      setMessage(`Appointment ${result.appointmentId} confirmed. We look forward to welcoming you.`);
    } catch (error) {
      setMessage(error instanceof Error ? error.message : "Unable to reserve this appointment time.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (confirmedId) {
    return (
      <div className="max-w-xl rounded-2xl border border-border bg-card p-8 text-center shadow-lg">
        <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-[#f4ebe6] text-primary">
          <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <p className="mt-4 text-xs uppercase tracking-[0.25em] text-primary">Reservation Confirmed</p>
        <h2 className="mt-2 font-serif text-3xl">Aura of Elegance Awaits</h2>
        <p className="mt-3 text-sm text-muted-foreground">
          Reference: <span className="font-mono font-medium text-foreground">{confirmedId}</span>
        </p>
        <p className="mt-2 text-sm text-muted-foreground">
          A confirmation with pre-treatment instructions and concierge contact has been dispatched to {customerEmail}.
        </p>
        <div className="mt-6 flex justify-center gap-4">
          <button
            onClick={() => {
              setConfirmedId(null);
              setStep(0);
            }}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Book Another Ritual
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-xl rounded-2xl border border-border bg-card p-6 md:p-8 shadow-sm">
      <div className="mb-6 flex gap-2">
        {labels.map((label, index) => (
          <div key={label} className={`h-1.5 flex-1 rounded-full transition-all ${index <= step ? "bg-primary" : "bg-muted"}`} />
        ))}
      </div>
      <p className="text-xs uppercase tracking-[0.2em] text-primary">Step {step + 1} of 4</p>
      <h2 className="mt-1 font-serif text-3xl">{labels[step]}</h2>

      {step === 0 && (
        <div className="mt-6 space-y-3">
          {services.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setServiceId(item.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                serviceId === item.id ? "border-primary bg-[#faf6f3] shadow-sm" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg">{item.name}</span>
                <span className="text-sm font-medium text-primary">${item.price}</span>
              </div>
              {item.durationMins && (
                <p className="mt-1 text-xs text-muted-foreground">{item.durationMins} minutes ritual</p>
              )}
            </button>
          ))}
        </div>
      )}

      {step === 1 && (
        <div className="mt-6 space-y-3">
          {stylists.map((item) => (
            <button
              type="button"
              key={item.id}
              onClick={() => setStylistId(item.id)}
              className={`w-full rounded-xl border p-4 text-left transition ${
                stylistId === item.id ? "border-primary bg-[#faf6f3] shadow-sm" : "border-border hover:border-primary/50"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-serif text-lg">{item.name}</span>
                <span className="text-xs uppercase tracking-wider text-muted-foreground">Certified Master</span>
              </div>
            </button>
          ))}
        </div>
      )}

      {step === 2 && (
        <div className="mt-6 space-y-4">
          <label className="block text-sm font-medium text-foreground">Select Date & Time</label>
          <input
            type="datetime-local"
            value={startTime}
            onChange={(event) => setStartTime(event.target.value)}
            className="w-full rounded-xl border border-input bg-background p-3.5 text-sm focus:border-primary focus:outline-none"
          />
          <p className="text-xs text-muted-foreground">Salon hours: Monday through Saturday 9:00 AM – 8:00 PM | Sunday 10:00 AM – 6:00 PM</p>
        </div>
      )}

      {step === 3 && (
        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Full Name *</label>
            <input
              type="text"
              required
              placeholder="e.g. Eleanor Vance"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Email Address *</label>
              <input
                type="email"
                required
                placeholder="eleanor@vance.com"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Phone Number *</label>
              <input
                type="tel"
                required
                placeholder="+1 (555) 728-2831"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none"
              />
            </div>
          </div>
          <div>
            <label className="block text-xs uppercase tracking-wider text-muted-foreground mb-1">Special Preferences or Notes (Optional)</label>
            <textarea
              rows={2}
              placeholder="Allergies, bridal notes, beverage preference..."
              value={bookingNotes}
              onChange={(e) => setBookingNotes(e.target.value)}
              className="w-full rounded-xl border border-input bg-background p-3 text-sm focus:border-primary focus:outline-none"
            />
          </div>
        </div>
      )}

      <div className="mt-8 flex justify-between items-center">
        <button
          type="button"
          disabled={step === 0 || isSubmitting}
          onClick={() => setStep((value) => value - 1)}
          className="rounded-full border border-border px-5 py-2.5 text-sm disabled:opacity-40 hover:bg-muted"
        >
          Back
        </button>
        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep((value) => value + 1)}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            Continue
          </button>
        ) : (
          <button
            type="button"
            disabled={isSubmitting}
            onClick={handleBooking}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            {isSubmitting ? "Securing Appointment..." : "Confirm Reservation"}
          </button>
        )}
      </div>

      {message && <p className="mt-5 text-sm text-primary">{message}</p>}
    </div>
  );
}
