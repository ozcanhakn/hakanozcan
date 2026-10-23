import { cookies } from "next/headers";

import {
  SESSION_COOKIE,
  adminConfigured,
  createSessionToken,
  originAllowed,
  passwordMatches,
  sessionCookieOptions,
} from "@/lib/admin-auth";

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 8;
const attempts = new Map<string, { count: number; resetAt: number }>();

export async function POST(request: Request) {
  if (!originAllowed(request)) return Response.json({ error: "Forbidden" }, { status: 403 });
  if (!adminConfigured()) {
    return Response.json({ error: "Admin is not configured on this deployment." }, { status: 503 });
  }

  const ip = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  const now = Date.now();
  const entry = attempts.get(ip);
  if (entry && entry.resetAt > now && entry.count >= MAX_ATTEMPTS) {
    return Response.json({ error: "Too many attempts. Try again later." }, { status: 429 });
  }

  const body: unknown = await request.json().catch(() => null);
  const password =
    typeof body === "object" && body !== null && typeof (body as { password?: unknown }).password === "string"
      ? (body as { password: string }).password
      : "";

  if (!passwordMatches(password)) {
    const current = entry && entry.resetAt > now ? entry : { count: 0, resetAt: now + WINDOW_MS };
    attempts.set(ip, { count: current.count + 1, resetAt: current.resetAt });
    await new Promise((resolve) => setTimeout(resolve, 600));
    return Response.json({ error: "Incorrect password." }, { status: 401 });
  }

  attempts.delete(ip);
  const store = await cookies();
  store.set(SESSION_COOKIE, createSessionToken(), sessionCookieOptions);
  return Response.json({ ok: true });
}
