
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

    // Use Supabase Admin for storage and DB operations
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
    const filePath = `promotion-screenshots/${userId}/${Date.now()}-${file.name}`;

    // Upload file to Supabase Storage
    const { error: uploadError } = await supabaseAdmin.storage
      .from("payment_screenshots")
      .upload(filePath, file);

    if (uploadError) {
      console.error("Storage Error:", uploadError);
      throw new Error(`Storage error: ${uploadError.message}`);
    }
    console.log("✓ File uploaded to storage");

    // Get public URL
    const { data: urlData } = supabaseAdmin.storage
      .from("payment_screenshots")
      .getPublicUrl(filePath);

    const screenshotUrl = urlData.publicUrl;
    console.log("✓ Public URL retrieved:", screenshotUrl);

    // Insert record into the database
    const { data, error: insertError } = await supabaseAdmin
      .from("payment_requests")
      .insert([
        {
          propertyId: propertyId,
          propertyTitle: propertyTitle || "Untitled",
          userId: userId,
          userEmail: userData.user.email,
          amount: weeks * 5,
          paymentScreenshot: screenshotUrl,
          status: "pending",
          promotionType: `Featured - ${weeks} week${weeks > 1 ? "s" : ""}`,
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
