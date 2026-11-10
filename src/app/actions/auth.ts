"use server";

import { eq } from "drizzle-orm";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { z } from "zod";
import { getDb } from "@/db";
import { users } from "@/db/schema";
import { createAuth, verifyPassword } from "@/lib/auth";

const loginSchema = z.object({ email: z.string().email(), password: z.string().min(8) });

export async function loginAction(input: z.infer<typeof loginSchema>) {
  const parsed = loginSchema.safeParse(input);
  if (!parsed.success) return { success: false as const, error: "Enter a valid email and password." };

  const db = getDb();
  const user = await db.select().from(users).where(eq(users.email, parsed.data.email.toLowerCase())).limit(1);
  if (!user[0] || !(await verifyPassword(parsed.data.password, user[0].passwordHash))) {
    return { success: false as const, error: "Invalid email or password." };
  }

  const auth = createAuth(db);
  const session = await auth.createSession(user[0].id, {});
  const cookie = auth.createSessionCookie(session.id);
  const cookieStore = await cookies();
  cookieStore.set(cookie.name, cookie.value, cookie.attributes);
  cookieStore.set("session_role", user[0].role, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", path: "/" });
  return { success: true as const, role: user[0].role };
}

export async function logoutAction() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("beauty_session")?.value;
  if (sessionId) await createAuth(getDb()).invalidateSession(sessionId);
  cookieStore.delete("beauty_session");
  cookieStore.delete("session_role");
  redirect("/cms/login");
}
