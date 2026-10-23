import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { adminDeletePost, adminUpdatePost, isValidId, parsePostInput } from "@/lib/blog-admin";

interface Context {
  params: Promise<{ id: string }>;
}

export async function PUT(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidId(id)) return Response.json({ error: "Invalid id." }, { status: 400 });

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const result = await adminUpdatePost(id, parsed.value);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  revalidatePath("/blog");
  revalidatePath(`/blog/${result.data.slug}`);
  return Response.json({ post: result.data });
}

export async function DELETE(request: Request, { params }: Context) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const { id } = await params;
  if (!isValidId(id)) return Response.json({ error: "Invalid id." }, { status: 400 });

  const result = await adminDeletePost(id);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  revalidatePath("/blog");
  revalidatePath(`/blog/${result.data.slug}`);
  return Response.json({ ok: true });
}
