import { NextRequest, NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase-admin";

type SubmitBody = {
  propertyId: string;
  propertyTitle?: string;
  weeks?: number;
  screenshotUrl: string;
};

function json(status: number, body: unknown) {
  return new NextResponse(JSON.stringify(body), {
    status,
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "no-store",
    },
  });
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
    const body = (await req.json()) as SubmitBody;

    if (!body?.propertyId || !body?.screenshotUrl) {
      return json(400, { error: "propertyId and screenshotUrl are required" });
    }

    const weeks = Math.max(1, Math.min(52, Number(body.weeks ?? 1) || 1));

    // Prepare candidate payload variants for different possible schemas
    const base = {
      status: "pending",
      weeks,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    } as Record<string, unknown>;

    const variants: Array<{ table: string; row: Record<string, unknown> }> = [
      {
        table: "promotions",
        row: {
          ...base,
          property_id: body.propertyId,
          property_title: body.propertyTitle ?? null,
          agent_id: userId,
          screenshot_url: body.screenshotUrl,
        },
      },
      {
        table: "promotion_requests",
        row: {
          ...base,
          property_id: body.propertyId,
          property_title: body.propertyTitle ?? null,
          user_id: userId,
          screenshot_url: body.screenshotUrl,
        },
      },
      {
        table: "payment_requests",
        row: {
          ...base,
          type: "promotion",
          property_id: body.propertyId,
          property_title: body.propertyTitle ?? null,
          user_id: userId,
          screenshot_url: body.screenshotUrl,
        },
      },
    ];

    let lastErr: unknown = null;
    for (const v of variants) {
      try {
        const { data, error } = await supabaseAdmin.from(v.table).insert(v.row).select().single();
        if (error) throw error;
        return json(200, { ok: true, table: v.table, data });
      } catch (e: any) {
        lastErr = e;
        // Try next candidate table on relation/column errors, otherwise stop early.
        const code = e?.code ?? e?.details ?? "";
        const msg = String(e?.message || "");
        const relationOrColumnIssue =
          code.includes("42P01") || // undefined_table
          code.includes("42703") || // undefined_column
          msg.includes("does not exist") ||
          msg.includes("column") && msg.includes("does not exist");
        if (!relationOrColumnIssue) break;
      }
    }

    return json(500, { error: "Failed to create promotion request", details: String(lastErr) });
  } catch (err) {
    return json(500, { error: "Unexpected server error", details: String(err) });
  }
}

