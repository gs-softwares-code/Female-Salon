"use server";

import { and, eq, gt, lt, ne } from "drizzle-orm";
import { z } from "zod";
import { getDb } from "@/db";
import { appointments, services, stylists } from "@/db/schema";
import { acquireSlotLock, deleteCache } from "@/lib/cache";
import { getCurrentSession } from "@/lib/auth";

const appointmentSchema = z.object({
  salonId: z.string().min(1),
  stylistId: z.string().min(1),
  serviceId: z.string().optional(),
  packageId: z.string().optional(),
  startTime: z.coerce.date(),
  customerName: z.string().min(2),
  customerEmail: z.string().email(),
  customerPhone: z.string().min(6),
  bookingNotes: z.string().optional(),
});

export async function createAppointment(input: z.infer<typeof appointmentSchema>) {
  const data = appointmentSchema.parse(input);
  const db = getDb();

  let durationMins = 60;
  let price = 0;

  if (data.serviceId) {
    const sRows = await db.select().from(services).where(and(eq(services.id, data.serviceId), eq(services.status, "ACTIVE"))).limit(1);
    if (!sRows[0]) throw new Error("Selected service is unavailable");
    durationMins = sRows[0].durationMins;
    price = sRows[0].price;
  }

  const [stylist] = await db.select().from(stylists).where(and(eq(stylists.id, data.stylistId), eq(stylists.status, "ACTIVE"))).limit(1);
  if (!stylist) throw new Error("The selected stylist is unavailable");

  const endTime = new Date(data.startTime.getTime() + durationMins * 60_000);

  // Overlap validation to prevent double booking
  const overlap = await db.select({ id: appointments.id }).from(appointments).where(
    and(
      eq(appointments.stylistId, data.stylistId),
      ne(appointments.status, "CANCELLED"),
      lt(appointments.startTime, endTime),
      gt(appointments.endTime, data.startTime)
    )
  ).limit(1);

  if (overlap[0]) throw new Error("That appointment slot has just been reserved. Please select another time.");

  const appointmentId = `apt_${crypto.randomUUID().slice(0, 8)}`;
  await db.insert(appointments).values({
    id: appointmentId,
    salonId: data.salonId,
    stylistId: data.stylistId,
    serviceId: data.serviceId ?? null,
    packageId: data.packageId ?? null,
    customerName: data.customerName,
    customerEmail: data.customerEmail,
    customerPhone: data.customerPhone,
    bookingNotes: data.bookingNotes ?? null,
    startTime: data.startTime,
    endTime,
    status: "CONFIRMED",
    totalPrice: price,
  });

  return { success: true, appointmentId, amount: price, customerName: data.customerName, startTime: data.startTime.toISOString() };
}
