import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    console.log("=== API START ===");

    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;
    console.log("✓ User verified:", userId);

    const formData = await req.formData();
    const file = formData.get("file") as File;
    const propertyId = formData.get("propertyId") as string;
    const propertyTitle = formData.get("propertyTitle") as string;
    const weeks = parseInt(formData.get("weeks") as string);

    if (!file || !propertyId) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    console.log("✓ Form data parsed");

    // Convert file to base64
    const buffer = await file.arrayBuffer();
    const base64 = Buffer.from(buffer).toString("base64");
    const dataUrl = `data:${file.type};base64,${base64}`;

    console.log("✓ File converted to base64");

    // Insert directly to Supabase
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { data, error: insertError } = await supabaseAdmin
      .from("payment_requests")
      .insert([
        {
          property_id: propertyId,
          property_title: propertyTitle || "Untitled",
          user_id: userId,
          amount: weeks * 5,
          screenshot_url: dataUrl,
          status: "pending",
          type: `Featured - ${weeks} week${weeks > 1 ? "s" : ""}`,
          created_at: new Date().toISOString(),
        },
      ])
      .select();

    if (insertError) {
      console.error("DB Error:", insertError);
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("✓ Inserted to DB:", data?.[0]?.id);
    return NextResponse.json({ success: true, id: data?.[0]?.id });
  } catch (error: any) {
    console.error("✗ ERROR:", error.message);
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
