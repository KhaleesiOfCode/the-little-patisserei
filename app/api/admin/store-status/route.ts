import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { adminSupabase } from "@/lib/supabase/admin-client";

export async function GET() {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data, error } = await adminSupabase
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (error && error.code !== "PGRST116") {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json(data || { manual_closed: false });
}

export async function PUT(request: Request) {
  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { manual_closed, closure_starts_at, closure_ends_at, closure_reason } = body;

    const { data: existing } = await adminSupabase
      .from("store_settings")
      .select("id")
      .limit(1)
      .maybeSingle();

    const payload: Record<string, unknown> = {
      manual_closed,
      closure_starts_at: closure_starts_at || null,
      closure_ends_at: closure_ends_at || null,
      closure_reason: closure_reason || null,
      updated_at: new Date().toISOString(),
      updated_by: "admin",
    };

    if (existing?.id) {
      payload.id = existing.id;
    }

    const { data, error } = await adminSupabase
      .from("store_settings")
      .upsert(payload)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json(data);
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
