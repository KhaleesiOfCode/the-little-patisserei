import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase/client";

export const dynamic = "force-dynamic";

export async function GET() {
  const headers = { "Cache-Control": "no-store, must-revalidate" };
  const { data, error } = await supabase
    .from("store_settings")
    .select("*")
    .order("updated_at", { ascending: false })
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

  const hasDates = start && end;

  if (hasDates && now >= start && now <= end) {
    return NextResponse.json({
      open: false,
      reason: data.closure_reason || "",
      closesAt: data.closure_ends_at,
      closureType: "daily",
    }, { headers });
  }

  if (hasDates && now < start) {
    return NextResponse.json({ open: true }, { headers });
  }

  if (hasDates && now > end) {
    return NextResponse.json({ open: true }, { headers });
  }

  return NextResponse.json({
    open: false,
    reason: data.closure_reason || "",
    closureType: "manual",
  }, { headers });
}
