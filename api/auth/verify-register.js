// api/auth/verify-register.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const debug = [];
  const log = (...a) => debug.push(a.join(" "));

  log("VERIFY-REGISTER: route hit");

  try {
    const { email, code } = req.body;
    log("Email:", email);
    log("Code:", code);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: record, error } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .single();

    if (error || !record) {
      log("Verification lookup failed:", JSON.stringify(error));
      return res.status(400).json({ success: false, debug });
    }

    log("Verification record found:", JSON.stringify(record));

    await supabase
      .from("email_verifications")
      .update({ used: true })
      .eq("id", record.id);

    log("Marked code as used");

    await supabase
      .from("users")
      .insert({ email });

    log("Inserted into users");

    return res.status(200).json({ success: true, debug });

  } catch (err) {
    log("Exception:", err.toString());
    return res.status(500).json({ success: false, debug });
  }
}


// api/auth/verify-register.js

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Email and code are required" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check for valid, unused code
    const { data: verification, error: fetchError } = await supabase
      .from("email_verifications")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .eq("used", false)
      .lt("expires_at", new Date().toISOString())
      .single();

    if (fetchError || !verification) {
      return res.status(400).json({ error: "Invalid or expired code" });
    }

    // Mark code as used
    await supabase
      .from("email_verifications")
      .update({ used: true })
      .eq("id", verification.id);

    // Insert verified user
    const { error: insertError } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: null, // optional, depending on your flow
      });

    if (insertError) {
      return res.status(500).json({ error: "User creation failed" });
    }

    return res.status(200).json({ success: true, next: "login" });
  } catch (err) {
    console.error("Verify error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
