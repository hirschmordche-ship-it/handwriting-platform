import getRawBody from "raw-body";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("🔵 /api/auth/verify-register invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse JSON safely
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
    console.log("STEP 1: Body received", body);
  } catch (e) {
    console.error("JSON parse failed:", e);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, code } = body;

  console.log("STEP 2: Initializing Supabase client");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("STEP 3: Checking verification code");

  const { data: record, error: lookupError } = await supabase
    .from("email_verification_codes")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single();

  if (lookupError || !record) {
    console.error("Invalid code:", lookupError);
    return res.status(400).json({ error: "Invalid verification code" });
  }

  console.log("STEP 4: Marking user as verified");

  const { error: updateError } = await supabase.auth.admin.updateUserByEmail(
    email,
    { email_confirm: true }
  );

  if (updateError) {
    console.error("Update failed:", updateError);
    return res.status(500).json({ error: "Failed to verify user" });
  }

  console.log("STEP 5: Verification complete");

  return res.status(200).json({ success: true });
}
