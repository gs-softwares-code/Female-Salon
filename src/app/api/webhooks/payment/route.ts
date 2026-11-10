import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { appointments, transactions } from "@/db/schema";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = await request.json() as { appointmentId?: string; amount?: number; providerReference?: string };
  if (!body.appointmentId) return NextResponse.json({ error: "appointmentId is required" }, { status: 400 });
  const db = getDb();
  const appointment = await db.select().from(appointments).where(eq(appointments.id, body.appointmentId)).limit(1);
  if (!appointment[0]) return NextResponse.json({ error: "Appointment not found" }, { status: 404 });
  await db.update(appointments).set({ status: "CONFIRMED", updatedAt: new Date() }).where(and(eq(appointments.id, body.appointmentId), eq(appointments.status, "PENDING")));
  await db.insert(transactions).values({ id: crypto.randomUUID(), appointmentId: body.appointmentId, amount: body.amount ?? 0, paymentStatus: "SUCCEEDED", providerReference: body.providerReference ?? `mock_${crypto.randomUUID()}` });
  revalidatePath(`/booking/${appointment[0].salonId}`);
  revalidatePath("/locator");
  return NextResponse.json({ success: true, paymentStatus: "SUCCEEDED", appointmentStatus: "CONFIRMED" });
}
