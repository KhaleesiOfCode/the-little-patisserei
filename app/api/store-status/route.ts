import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store, must-revalidate" };
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .limit(1)
    .maybeSingle();

  if (error || !data) {
    return NextResponse.json({ open: true }, { headers });
  }

  if (!data.manual_closed) {
    return NextResponse.json({ open: true }, { headers });
  }

  const now = new Date();
  const start = data.closure_starts_at ? new Date(data.closure_starts_at) : null;
  const end = data.closure_ends_at ? new Date(data.closure_ends_at) : null;

  if (start && end && now >= start && now <= end) {
    return NextResponse.json({
      open: false,
      reason: data.closure_reason || "Store is currently closed",
      closesAt: data.closure_ends_at,
    }, { headers });
  }

  if (start && now < start) {
    return NextResponse.json({ open: true }, { headers });
  }

  if (end && now > end) {
    return NextResponse.json({ open: true }, { headers });
  }

  return NextResponse.json({ open: !data.manual_closed }, { headers });
}
