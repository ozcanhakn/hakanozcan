import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { adminGetSettings, adminSaveSettings, parseSettingsInput } from "@/lib/settings-admin";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const result = await adminGetSettings();
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return Response.json(result.data);
}

export async function PUT(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = parseSettingsInput(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const result = await adminSaveSettings(parsed.value);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  revalidatePath("/");
  revalidatePath("/blog");
  return Response.json({ settings: result.data });
}
