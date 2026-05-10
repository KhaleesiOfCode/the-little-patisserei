import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin-client";

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

    const ext = file.name.split(".").pop() || "jpg";
    const filePath = `${menuItemId}/${Date.now()}.${ext}`;

    const { data, error } = await adminSupabase.storage
      .from("menu-images")
      .upload(filePath, file);

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    const { data: urlData } = adminSupabase.storage
      .from("menu-images")
      .getPublicUrl(data.path);

    return NextResponse.json({ url: urlData.publicUrl });
  } catch {
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}
