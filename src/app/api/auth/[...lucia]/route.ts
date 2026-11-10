import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getDb } from "@/db";
import { createAuth } from "@/lib/auth";

export const runtime = "nodejs";

export async function GET() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("beauty_session")?.value;
  if (!sessionId) return NextResponse.json({ user: null, session: null }, { status: 401 });
  const result = await createAuth(getDb()).validateSession(sessionId);
  return NextResponse.json(result, { status: result.user ? 200 : 401 });
}

export async function DELETE() {
  const cookieStore = await cookies();
  const sessionId = cookieStore.get("beauty_session")?.value;
  if (sessionId) await createAuth(getDb()).invalidateSession(sessionId);
  const response = NextResponse.json({ success: true });
  response.cookies.delete("beauty_session");
  response.cookies.delete("session_role");
  return response;
}
