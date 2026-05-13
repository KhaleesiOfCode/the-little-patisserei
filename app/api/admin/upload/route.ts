import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin-client";

const BUCKET = "menu-images";
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/gif", "video/mp4", "video/webm"];

async function ensureBucket(): Promise<string | null> {
  const { data: buckets } = await adminSupabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET)) return null;
  const { error } = await adminSupabase.storage.createBucket(BUCKET, { public: true });
  return error?.message || null;
}

export async function POST(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    const menuItemId = formData.get("menuItemId") as string | null;

    if (!file || !menuItemId) {
      return NextResponse.json({ error: "Missing file or menuItemId" }, { status: 400 });
    }

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Invalid file type. Allowed: JPEG, PNG, WebP, GIF, MP4, WebM" }, { status: 400 });
    }

    if (file.size > MAX_SIZE) {
      return NextResponse.json({ error: `File too large. Maximum size is ${MAX_SIZE / 1024 / 1024}MB` }, { status: 400 });
    }

    const bucketErr = await ensureBucket();
    if (bucketErr) {
      console.error("Bucket setup error:", bucketErr);
      return NextResponse.json({ error: bucketErr }, { status: 500 });
    }

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${menuItemId}/${Date.now()}.${ext}`;

    const storage = adminSupabase.storage.from(BUCKET);

    const { data, error } = await storage.upload(filePath, file, {
      cacheControl: "3600",
      upsert: false,
    });

    if (error) {
      console.error("Upload error:", error);
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = storage.getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl, path: data.path });
  } catch (err) {
    console.error("Upload exception:", err);
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
