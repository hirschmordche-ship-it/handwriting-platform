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

    const { email, code } = req.body || {};

    if (!email || !code) {
      return res.status(400).json({ success: false, error: "Missing fields" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Find pending registration
    const { data: pending } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .maybeSingle();

    if (!pending) {
      return res.status(400).json({ success: false, error: "Invalid or expired code" });
    }

    // 2. Mark pending registration as used
    await supabase
      .from("pending_registrations")
      .update({ used: true })
      .eq("id", pending.id);

    // 3. Create user
    const { error: userError } = await supabase
      .from("users")
      .insert({
        email,
        language: pending.language,
        created_at: new Date().toISOString()
      });

    if (userError) {
      return res.status(500).json({ success: false, error: "User creation failed" });
    }

    return res.status(200).json({ success: true });

  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
