import { getDb } from "@/db";
import { appointments, stylists, services } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export const dynamic = "force-dynamic";

export default async function AppointmentsManagementPage() {
  const db = getDb();
  const allAppointments = await db.select().from(appointments).orderBy(desc(appointments.startTime));

  async function updateStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const newStatus = formData.get("status") as "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    if (id && newStatus) {
      await getDb().update(appointments).set({ status: newStatus }).where(eq(appointments.id, id));
      revalidatePath("/cms/appointments");
      revalidatePath("/cms/dashboard");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Concierge Operations</p>
        <h1 className="mt-1 font-serif text-4xl font-light">Appointment Management</h1>
        <p className="mt-1 text-xs text-muted-foreground">Review, reschedule, confirm, or cancel client appointments with real-time slot conflict prevention.</p>
      </div>

      <div className="rounded-3xl border border-border bg-card p-6 sm:p-8 shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-[11px] uppercase tracking-wider text-muted-foreground">
                <th className="pb-3 font-medium">Booking ID</th>
                <th className="pb-3 font-medium">Guest Details</th>
                <th className="pb-3 font-medium">Appointment Slot</th>
                <th className="pb-3 font-medium">Notes & Requests</th>
                <th className="pb-3 font-medium">Total</th>
                <th className="pb-3 font-medium">Status & Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {allAppointments.map((apt) => (
                <tr key={apt.id} className="hover:bg-muted/30 transition">
                  <td className="py-4 font-mono text-xs text-muted-foreground">{apt.id}</td>
                  <td className="py-4">
                    <p className="font-medium text-foreground">{apt.customerName}</p>
                    <p className="text-xs text-muted-foreground">{apt.customerEmail}</p>
                    <p className="text-xs text-muted-foreground">{apt.customerPhone}</p>
                  </td>
                  <td className="py-4 text-xs">
                    <p className="font-medium text-foreground">
                      {new Date(apt.startTime).toLocaleDateString("en-US", {
                        weekday: "short",
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                    <p className="text-muted-foreground">
                      {new Date(apt.startTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                      {" – "}
                      {new Date(apt.endTime).toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" })}
                    </p>
                  </td>
                  <td className="py-4 text-xs text-muted-foreground max-w-xs">
                    {apt.bookingNotes || <span className="italic">No special notes</span>}
                  </td>
                  <td className="py-4 font-serif text-base font-light text-primary">
                    ${apt.totalPrice} USD
                  </td>
                  <td className="py-4">
                    <form action={updateStatus} className="flex items-center gap-2">
                      <input type="hidden" name="id" value={apt.id} />
                      <select
                        name="status"
                        defaultValue={apt.status}
                        className="rounded-lg border border-border bg-background px-2.5 py-1.5 text-xs text-foreground focus:outline-none focus:border-primary"
                      >
                        <option value="CONFIRMED">CONFIRMED</option>
                        <option value="COMPLETED">COMPLETED</option>
                        <option value="CANCELLED">CANCELLED</option>
                        <option value="PENDING">PENDING</option>
                      </select>
                      <button
                        type="submit"
                        className="rounded-lg bg-primary/10 border border-primary/20 px-3 py-1.5 text-[11px] font-medium text-primary hover:bg-primary hover:text-primary-foreground transition"
                      >
                        Update
                      </button>
                    </form>
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

