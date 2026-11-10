import { eq, lt } from "drizzle-orm";
import { Lucia, TimeSpan, type Adapter, type DatabaseSession, type DatabaseUser } from "lucia";
import { getDb, type BeautyDatabase } from "@/db";
import { authKeys, sessions, users } from "@/db/schema";
import { cookies } from "next/headers";

export type UserRole = "CONSUMER" | "STYLIST" | "SALON_MANAGER" | "FRANCHISEE" | "CORPORATE_ADMIN";

function createDrizzleAdapter(db: BeautyDatabase): Adapter {
  return {
    async getSessionAndUser(sessionId) {
      const result = await db.select({ session: sessions, user: users }).from(sessions).innerJoin(users, eq(sessions.userId, users.id)).where(eq(sessions.id, sessionId)).limit(1);
      if (!result[0]) return [null, null];
      const { session, user } = result[0];
      const databaseSession: DatabaseSession = { id: session.id, userId: session.userId, expiresAt: session.expiresAt, attributes: {} };
      const databaseUser: DatabaseUser = { id: user.id, attributes: {} };
      return [databaseSession, databaseUser];
    },
    async getUserSessions(userId) {
      const rows = await db.select().from(sessions).where(eq(sessions.userId, userId));
      return rows.map((row) => ({ id: row.id, userId: row.userId, expiresAt: row.expiresAt, attributes: {} }));
    },
    async setSession(session) {
      await db.insert(sessions).values({ id: session.id, userId: session.userId, expiresAt: session.expiresAt });
    },
    async updateSessionExpiration(sessionId, expiresAt) {
      await db.update(sessions).set({ expiresAt, updatedAt: new Date() }).where(eq(sessions.id, sessionId));
    },
    async deleteSession(sessionId) { await db.delete(sessions).where(eq(sessions.id, sessionId)); },
    async deleteUserSessions(userId) { await db.delete(sessions).where(eq(sessions.userId, userId)); },
    async deleteExpiredSessions() { await db.delete(sessions).where(lt(sessions.expiresAt, new Date())); },
  };
}

export function createAuth(db: BeautyDatabase) {
  return new Lucia(createDrizzleAdapter(db), {
    sessionExpiresIn: new TimeSpan(30, "d"),
    sessionCookie: { name: "beauty_session", attributes: { secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/" } },
    getUserAttributes: (attributes) => attributes,
  });
}

export async function hashPassword(password: string) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120_000, hash: "SHA-256" }, key, 256);
  return `${toBase64Url(salt)}.${toBase64Url(new Uint8Array(bits))}`;
}

export async function verifyPassword(password: string, stored: string) {
  const [saltEncoded, hashEncoded] = stored.split(".");
  if (!saltEncoded || !hashEncoded) return false;
  const salt = fromBase64Url(saltEncoded);
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", salt, iterations: 120_000, hash: "SHA-256" }, key, 256);
  return toBase64Url(new Uint8Array(bits)) === hashEncoded;
}

export async function getCurrentSession() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("beauty_session")?.value;
  if (!sessionId) return { user: null, session: null };
  return createAuth(getDb()).validateSession(sessionId);
}

function toBase64Url(bytes: Uint8Array) { return btoa(String.fromCharCode(...bytes)).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, ""); }
function fromBase64Url(value: string) { const normalized = value.replace(/-/g, "+").replace(/_/g, "/"); return Uint8Array.from(atob(normalized), (char) => char.charCodeAt(0)); }

export { authKeys, getDb, users };
