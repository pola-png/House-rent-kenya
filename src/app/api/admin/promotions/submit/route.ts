import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function POST(req: Request) {
  try {
    console.log("=== API ENDPOINT HIT ===");

    // Get auth token
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.replace("Bearer ", "");

    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify user
    const supabase = createClient(supabaseUrl, supabaseAnonKey, {
      auth: { persistSession: false },
    });

    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError || !userData?.user) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }

    const userId = userData.user.id;
    console.log("User verified:", userId);

    // Parse form data
    const formData = await req.formData();
    const file = formData.get("file") as File;
    const propertyId = formData.get("propertyId") as string;
    const propertyTitle = formData.get("propertyTitle") as string;
    const weeks = parseInt(formData.get("weeks") as string);

    if (!file || !propertyId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    console.log("File:", file.name, file.size);

    // Upload file to Wasabi
    const wasabiUrl = process.env.NEXT_PUBLIC_WASABI_URL!;
    const wasabiAccessKey = process.env.WASABI_ACCESS_KEY!;
    const wasabiSecretKey = process.env.WASABI_SECRET_KEY!;
    const wasabiBucket = process.env.WASABI_BUCKET!;

    const key = `promotions/${userId}/${Date.now()}-${file.name}`;
    const buffer = await file.arrayBuffer();

    console.log("Uploading to Wasabi...");

    const uploadResponse = await fetch(`${wasabiUrl}/${wasabiBucket}/${key}`, {
      method: "PUT",
      headers: {
        "Content-Type": file.type,
      },
      body: buffer,
    });

    if (!uploadResponse.ok) {
      throw new Error(`Wasabi upload failed: ${uploadResponse.statusText}`);
    }

    const screenshotUrl = `${wasabiUrl}/${wasabiBucket}/${key}`;
    console.log("Upload successful:", screenshotUrl);

    // Insert to Supabase
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);

    const { error: insertError } = await supabaseAdmin
      .from("payment_requests")
      .insert([
        {
          property_id: propertyId,
          property_title: propertyTitle || "Untitled",
          user_id: userId,
          amount: weeks * 5,
          screenshot_url: screenshotUrl,
          status: "pending",
          type: `Featured - ${weeks} week${weeks > 1 ? "s" : ""}`,
          created_at: new Date().toISOString(),
        },
      ]);

    if (insertError) {
      throw new Error(`Database error: ${insertError.message}`);
    }

    console.log("=== SUCCESS ===");
    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("=== API ERROR ===", error);
    return NextResponse.json(
      { error: error?.message || "Server error" },
      { status: 500 }
    );
  }
}
