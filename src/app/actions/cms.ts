"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { getDb } from "@/db";
import { salons, services, stylists, users } from "@/db/schema";
import { getCurrentSession } from "@/lib/auth";

const salonSchema = z.object({
  name: z.string().min(2), slug: z.string().regex(/^[a-z0-9-]+$/), address: z.string().min(5),
  lat: z.coerce.number().gte(-90).lte(90), lng: z.coerce.number().gte(-180).lte(180), brandId: z.string().min(1),
});
const stylistSchema = z.object({ salonId: z.string().min(1), userId: z.string().min(1), name: z.string().min(2), bio: z.string().max(1000).optional(), commissionRate: z.coerce.number().min(0).max(100) });
const serviceSchema = z.object({
  salonId: z.string().min(1),
  name: z.string().min(2),
  description: z.string().max(1000).optional(),
  durationMins: z.coerce.number().int().positive(),
  price: z.coerce.number().int().nonnegative(),
  currency: z.string().length(3).default("USD"),
  category: z.enum(["HAIR", "SKIN", "MAKEUP", "NAILS", "GROOMING"]),
  imageUrl: z.string().optional(),
});

async function requireRole(roles: string[]) {
  const { user } = await getCurrentSession();
  if (!user || !roles.includes(user.id ? (await getRole(user.id)) : "")) throw new Error("Unauthorized");
  return user;
}

async function getRole(userId: string) {
  const row = await getDb().select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
  return row[0]?.role ?? null;
}

async function canManageSalon(userId: string, salonId: string) {
  const role = await getRole(userId);
  if (role === "CORPORATE_ADMIN") return true;
  if (role === "FRANCHISEE") {
    const rows = await getDb().select({ id: salons.id }).from(salons).where(and(eq(salons.id, salonId), eq(salons.franchiseeId, userId))).limit(1);
    return Boolean(rows[0]);
  }
  if (role === "SALON_MANAGER") {
    const rows = await getDb().select({ id: stylists.id }).from(stylists).where(and(eq(stylists.salonId, salonId), eq(stylists.userId, userId))).limit(1);
    return Boolean(rows[0]);
  }
  return false;
}

export async function createSalonAction(input: z.infer<typeof salonSchema>) {
  const data = salonSchema.parse(input);
  const user = await requireRole(["CORPORATE_ADMIN", "FRANCHISEE"]);
  const role = await getRole(user.id);
  await getDb().insert(salons).values({ id: crypto.randomUUID(), ...data, franchiseeId: role === "FRANCHISEE" ? user.id : null, status: "DRAFT" });
  revalidatePath("/cms/salons");
  return { success: true };
}

export async function createStylistAction(input: z.infer<typeof stylistSchema>) {
  const data = stylistSchema.parse(input);
  const { user } = await getCurrentSession();
  if (!user || !(await canManageSalon(user.id, data.salonId))) throw new Error("You cannot manage this salon");
  await getDb().insert(stylists).values({ id: crypto.randomUUID(), ...data, status: "ACTIVE" });
  revalidatePath("/cms/stylists");
  return { success: true };
}

export async function createServiceAction(input: z.infer<typeof serviceSchema>) {
  const data = serviceSchema.parse(input);
  const { user } = await getCurrentSession();
  if (!user || !(await canManageSalon(user.id, data.salonId))) throw new Error("You cannot manage this salon");
  await getDb().insert(services).values({
    id: crypto.randomUUID(),
    salonId: data.salonId,
    name: data.name,
    description: data.description,
    durationMins: data.durationMins,
    price: data.price,
    currency: data.currency,
    category: data.category,
    imageUrl: data.imageUrl,
    status: "ACTIVE",
  });
  revalidatePath(`/booking/${data.salonId}`);
  return { success: true };
}
