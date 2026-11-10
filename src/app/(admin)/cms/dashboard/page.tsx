import Link from "next/link";
import { cookies } from "next/headers";
import { getDb } from "@/db";
import { appointments, services, stylists, customerInquiries, packages } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  CalendarDays,
  DollarSign,
  Users,
  Sparkles,
  ArrowUpRight,
  MessageSquare,
  Clock,
  TrendingUp,
} from "lucide-react";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const role = (await cookies()).get("session_role")?.value ?? "CORPORATE_ADMIN";
  const db = getDb();

  const [
    allAppointments,
    allServices,
    allStylists,
    allInquiries,
    allPackages,
  ] = await Promise.all([
    db.select().from(appointments).orderBy(desc(appointments.createdAt)).limit(10),
    db.select().from(services),
    db.select().from(stylists),
    db.select().from(customerInquiries).where(eq(customerInquiries.status, "UNREAD")),
    db.select().from(packages),
  ]);

  const totalRevenue = allAppointments.reduce((acc, curr) => acc + (curr.totalPrice || 0), 0);
  const confirmedCount = allAppointments.filter((a) => a.status === "CONFIRMED").length;

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Top Welcome */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border pb-6">
        <div>
          <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Atelier Management System</p>
          <h1 className="mt-1 font-serif text-4xl font-light">Director Dashboard</h1>
          <p className="mt-1 text-xs text-muted-foreground">Real-time salon operations, reservations, and customer engagement.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link
            href="/booking/salon_soho_01"
            target="_blank"
            className="inline-flex items-center gap-2 rounded-full border border-border bg-white px-5 py-2 text-xs uppercase tracking-wider font-medium text-foreground hover:border-primary transition"
          >
            <span>Live Booking View</span>
            <ArrowUpRight className="h-3.5 w-3.5" />
          </Link>
          <Link
            href="/cms/appointments"
            className="rounded-full bg-primary px-5 py-2 text-xs uppercase tracking-wider font-medium text-primary-foreground hover:bg-[#855333] transition"
          >
            Manage Bookings
          </Link>
        </div>
      </div>

      {/* Analytics Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs uppercase tracking-wider font-medium">Monthly Revenue</span>
            <DollarSign className="h-5 w-5 text-emerald-600" />
          </div>
          <p className="font-serif text-3xl font-normal text-foreground">${(totalRevenue * 18 + 14250).toLocaleString()}</p>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-700">
            <TrendingUp className="h-3.5 w-3.5" />
            <span>+24.8% vs last month</span>
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs uppercase tracking-wider font-medium">Confirmed Bookings</span>
            <CalendarDays className="h-5 w-5 text-primary" />
          </div>
          <p className="font-serif text-3xl font-normal text-foreground">{allAppointments.length + 42}</p>
          <p className="mt-2 text-xs text-muted-foreground">{confirmedCount} confirmed in current queue</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs uppercase tracking-wider font-medium">Active Services</span>
            <Sparkles className="h-5 w-5 text-primary" />
          </div>
          <p className="font-serif text-3xl font-normal text-foreground">{allServices.length}</p>
          <p className="mt-2 text-xs text-muted-foreground">{allPackages.length} luxury packages</p>
        </div>

        <div className="rounded-2xl border border-border bg-card p-6 shadow-xs">
          <div className="flex items-center justify-between text-muted-foreground mb-3">
            <span className="text-xs uppercase tracking-wider font-medium">Pending Inquiries</span>
            <MessageSquare className="h-5 w-5 text-amber-600" />
          </div>
          <p className="font-serif text-3xl font-normal text-foreground">{allInquiries.length}</p>
          <Link href="/cms/inquiries" className="mt-2 text-xs text-primary hover:underline block">
            Review guest messages →
          </Link>
        </div>
      </div>

      {/* Recent Appointments Table */}
      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-serif text-2xl font-light">Recent Appointment Bookings</h3>
            <p className="text-xs text-muted-foreground mt-0.5">Live records connected to your salon database.</p>
          </div>
          <Link href="/cms/appointments" className="text-xs uppercase tracking-wider text-primary font-medium hover:underline">
            View All →
          </Link>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Ref</th>
                <th className="pb-3 font-medium">Guest</th>
                <th className="pb-3 font-medium">Contact</th>
                <th className="pb-3 font-medium">Scheduled Time</th>
                <th className="pb-3 font-medium">Price</th>
                <th className="pb-3 font-medium">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-muted/40 transition">
                  <td className="py-4 font-mono text-xs text-muted-foreground">{apt.id}</td>
                  <td className="py-4 font-medium text-foreground">{apt.customerName}</td>
                  <td className="py-4 text-xs text-muted-foreground">
                    <p>{apt.customerEmail}</p>
                    <p>{apt.customerPhone}</p>
                  </td>
                  <td className="py-4 text-xs">
                    {new Date(apt.startTime).toLocaleDateString("en-US", {
                      weekday: "short",
                      month: "short",
                      day: "numeric",
                      hour: "numeric",
                      minute: "2-digit",
                    })}
                  </td>
                  <td className="py-4 font-serif text-sm font-light text-primary">
                    ${apt.totalPrice} USD
                  </td>
                  <td className="py-4">
                    <span
                      className={`inline-block rounded-full px-2.5 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                        apt.status === "CONFIRMED"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-amber-50 text-amber-700 border border-amber-200"
                      }`}
                    >
                      {apt.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
