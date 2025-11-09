import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

function json(status: number, body: any) {
  return NextResponse.json(body, { status });
}

export async function POST(req: NextRequest) {
  try {
    const auth = req.headers.get("authorization") || "";
    const token = auth.startsWith("Bearer ") ? auth.slice(7) : null;
    if (!token) {
      return json(401, { error: "Missing bearer token" });
    }

    const { data: userData, error: userErr } = await supabaseAdmin.auth.getUser(token);
    if (userErr || !userData?.user) {
      return json(401, { error: "Invalid or expired token" });
    }

    const userId = userData.user.id;
    const body = (await req.json()) as any;

    if (!body?.propertyId || !body?.screenshotUrl) {
      return json(400, { error: "propertyId and screenshotUrl are required" });
    }

    const weeks = Math.max(1, Math.min(52, Number(body.weeks ?? 1) || 1));

    // Insert into payment_requests table
    const { data, error } = await supabaseAdmin
      .from("payment_requests")
      .insert({
        property_id: body.propertyId,
        property_title: body.propertyTitle || null,
        user_id: userId,
        screenshot_url: body.screenshotUrl,
        status: "pending",
        weeks: weeks,
        type: "promotion",
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return json(500, { error: "Failed to save promotion request", details: error.message });
    }

    return json(200, { ok: true, data });
  } catch (err: any) {
    console.error("Server error:", err);
    return json(500, { error: "Unexpected server error", details: err.message });
  }
}
