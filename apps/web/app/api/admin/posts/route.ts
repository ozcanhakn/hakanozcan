import { revalidatePath } from "next/cache";

import { requireAdmin } from "@/lib/admin-auth";
import { adminCreatePost, adminListPosts, parsePostInput } from "@/lib/blog-admin";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const result = await adminListPosts();
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });
  return Response.json(result.data);
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const parsed = parsePostInput(await request.json().catch(() => null));
  if (!parsed.ok) return Response.json({ error: parsed.error }, { status: 400 });

  const result = await adminCreatePost(parsed.value);
  if (!result.ok) return Response.json({ error: result.error }, { status: result.status });

  revalidatePath("/blog");
  revalidatePath(`/blog/${result.data.slug}`);
  return Response.json({ post: result.data }, { status: 201 });
}
