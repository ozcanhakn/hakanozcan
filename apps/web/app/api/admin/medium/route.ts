import { requireAdmin } from "@/lib/admin-auth";
import { getMediumPosts } from "@/lib/medium";

export async function GET(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  return Response.json({ posts: await getMediumPosts() });
}
