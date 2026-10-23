import { cookies } from "next/headers";

import { SESSION_COOKIE, originAllowed } from "@/lib/admin-auth";

export async function POST(request: Request) {
  if (!originAllowed(request)) return Response.json({ error: "Forbidden" }, { status: 403 });
  const store = await cookies();
  store.delete(SESSION_COOKIE);
  return Response.json({ ok: true });
}
