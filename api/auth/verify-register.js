// api/auth/verify-register.js

export const config = {
  runtime: "nodejs"
};

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { code } = req.body || {};

    if (!code) {
      return res.status(400).json({ success: false, error: "Code is required" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Find valid pending registration
    const { data: pending } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("code", code)
      .gt("expires_at", new Date().toISOString())
      .maybeSingle();

    if (!pending) {
      return res.status(400).json({
        success: false,
        error: "Invalid or expired code"
      });
    }

    // 2. Create user
    const { error: userError } = await supabase
      .from("users")
      .insert({
        email: pending.email,
        language: pending.language,
        created_at: new Date().toISOString()
      });

    if (userError) {
      console.error(userError);
      return res.status(500).json({ success: false, error: "User creation failed" });
    }

    // 3. Cleanup all pending attempts for this email
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", pending.email);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error("VERIFY ERROR:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
