import { getDb } from "@/db";
import { customerInquiries } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { Mail, Phone, Calendar, CheckCircle2 } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InquiriesManagementPage() {
  const db = getDb();
  const allInquiries = await db.select().from(customerInquiries).orderBy(desc(customerInquiries.createdAt));

  async function markStatus(formData: FormData) {
    "use server";
    const id = formData.get("id") as string;
    const status = formData.get("status") as "UNREAD" | "REPLIED" | "ARCHIVED";
    if (id && status) {
      await getDb().update(customerInquiries).set({ status }).where(eq(customerInquiries.id, id));
      revalidatePath("/cms/inquiries");
      revalidatePath("/cms/dashboard");
    }
  }

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.25em] text-primary font-semibold">Guest Relations</p>
        <h1 className="mt-1 font-serif text-4xl font-light">Customer Inquiries ({allInquiries.length})</h1>
        <p className="mt-1 text-xs text-muted-foreground">Manage incoming requests from the contact page and direct bridal consultation inquiries.</p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {allInquiries.map((inq) => (
          <div
            key={inq.id}
            className={`rounded-3xl border p-6 sm:p-8 bg-card shadow-xs space-y-4 ${
              inq.status === "UNREAD" ? "border-primary/60 bg-[#FAF7F2]/50" : "border-border"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/80 pb-4">
              <div>
                <span className="text-[10px] uppercase tracking-widest text-primary font-semibold">
                  {inq.subject || "General Inquiry"}
                </span>
                <h3 className="font-serif text-2xl font-normal text-foreground mt-0.5">{inq.name}</h3>
              </div>
              <div className="flex items-center gap-3">
                <span
                  className={`inline-block rounded-full px-3 py-1 text-[10px] uppercase tracking-wider font-semibold ${
                    inq.status === "UNREAD"
                      ? "bg-amber-50 text-amber-800 border border-amber-200"
                      : inq.status === "REPLIED"
                      ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
                      : "bg-neutral-100 text-neutral-600"
                  }`}
                >
                  {inq.status}
                </span>

                <form action={markStatus} className="flex gap-2">
                  <input type="hidden" name="id" value={inq.id} />
                  {inq.status !== "REPLIED" && (
                    <button
                      name="status"
                      value="REPLIED"
                      className="rounded-lg bg-emerald-50 border border-emerald-300 px-3 py-1 text-xs text-emerald-800 hover:bg-emerald-100 transition"
                    >
                      Mark Replied
                    </button>
                  )}
                  {inq.status !== "ARCHIVED" && (
                    <button
                      name="status"
                      value="ARCHIVED"
                      className="rounded-lg border border-border px-3 py-1 text-xs text-muted-foreground hover:bg-muted transition"
                    >
                      Archive
                    </button>
                  )}
                </form>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-primary" />
                <a href={`mailto:${inq.email}`} className="text-foreground hover:underline">
                  {inq.email}
                </a>
              </div>
              {inq.phone && (
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 text-primary" />
                  <a href={`tel:${inq.phone}`} className="text-foreground hover:underline">
                    {inq.phone}
                  </a>
                </div>
              )}
            </div>

            <div className="rounded-2xl bg-muted/60 p-4 text-xs text-foreground leading-relaxed">
              {inq.message}
            </div>

            <p className="text-[10px] text-muted-foreground">
              Submitted: {new Date(inq.createdAt).toLocaleString()}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

