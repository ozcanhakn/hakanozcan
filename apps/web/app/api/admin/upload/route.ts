import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "site-media";
const MAX_BYTES = 5 * 1024 * 1024;
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
};

/** Creates the public bucket the first time an image is uploaded. An existing bucket is fine. */
async function ensureBucket(base: string, headers: Record<string, string>) {
  await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  }).catch(() => undefined);
}

export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const base = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return Response.json({ error: "Supabase is not configured." }, { status: 503 });

  const form = await request.formData().catch(() => null);
  const file = form?.get("file");
  if (!(file instanceof File)) return Response.json({ error: "No file was sent." }, { status: 400 });

  const extension = TYPES[file.type];
  if (!extension) return Response.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image." }, { status: 400 });
  if (file.size > MAX_BYTES) return Response.json({ error: "The image is larger than 5 MB." }, { status: 400 });

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  await ensureBucket(base, headers);

  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  const res = await fetch(`${base}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": file.type, "Cache-Control": "public, max-age=31536000" },
    body: await file.arrayBuffer(),
  });
  if (!res.ok) {
    console.error("Image upload failed:", res.status, await res.text().catch(() => ""));
    return Response.json({ error: "The image could not be uploaded." }, { status: 502 });
  }

  return Response.json({ url: `${base}/storage/v1/object/public/${BUCKET}/${path}` });
}
