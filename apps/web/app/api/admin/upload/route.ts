import { requireAdmin } from "@/lib/admin-auth";

const BUCKET = "site-media";
const IMAGE_LIMIT = 10 * 1024 * 1024;
const VIDEO_LIMIT = 40 * 1024 * 1024; // Supabase Storage accepts up to 50 MB per file by default.
const TYPES: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
  "image/avif": "avif",
  "video/mp4": "mp4",
  "video/webm": "webm",
};

/** Creates the public bucket the first time a file is uploaded. An existing bucket is fine. */
async function ensureBucket(base: string, headers: Record<string, string>) {
  await fetch(`${base}/storage/v1/bucket`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: JSON.stringify({ id: BUCKET, name: BUCKET, public: true }),
  }).catch(() => undefined);
}

/**
 * Hands the browser a one-time signed address to upload to. The file itself goes straight to
 * Supabase Storage, so it is not limited by the size a serverless request body can have.
 * Body: { type: "image/png", size: 12345 }. Answer: { uploadUrl, url }.
 */
export async function POST(request: Request) {
  const denied = await requireAdmin(request);
  if (denied) return denied;

  const base = process.env.NEXT_PUBLIC_SUPABASE_API_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!base || !key) return Response.json({ error: "Supabase is not configured." }, { status: 503 });

  const body = (await request.json().catch(() => null)) as { type?: unknown; size?: unknown } | null;
  const type = typeof body?.type === "string" ? body.type : "";
  const size = typeof body?.size === "number" ? body.size : 0;

  const extension = TYPES[type];
  if (!extension) {
    return Response.json({ error: "Use a JPG, PNG, WebP, GIF or AVIF image, or an MP4 or WebM video." }, { status: 400 });
  }
  const isVideo = type.startsWith("video/");
  if (size > (isVideo ? VIDEO_LIMIT : IMAGE_LIMIT)) {
    return Response.json({ error: isVideo ? "The video is larger than 40 MB." : "The image is larger than 10 MB." }, { status: 400 });
  }

  const headers = { apikey: key, Authorization: `Bearer ${key}` };
  await ensureBucket(base, headers);

  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${extension}`;
  const res = await fetch(`${base}/storage/v1/object/upload/sign/${BUCKET}/${path}`, {
    method: "POST",
    headers: { ...headers, "Content-Type": "application/json" },
    body: "{}",
  });
  const signed = (await res.json().catch(() => null)) as { url?: string } | null;
  if (!res.ok || !signed?.url) {
    console.error("Could not sign upload:", res.status, JSON.stringify(signed));
    return Response.json({ error: "The upload could not be started." }, { status: 502 });
  }

  return Response.json({
    uploadUrl: `${base}/storage/v1${signed.url.replace(/^\/storage\/v1/, "")}`,
    url: `${base}/storage/v1/object/public/${BUCKET}/${path}`,
  });
}
