// api/auth/start-register.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const debug = [];
  const log = (...a) => debug.push(a.join(" "));

  log("START-REGISTER: route hit");

  try {
    if (req.method !== "POST") {
      log("Invalid method:", req.method);
      return res.status(405).json({ success: false, debug });
    }

    const { email, language } = req.body;
    log("Received email:", email);
    log("Received language:", language);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    log("Generated code:", code);

    const expires = new Date(Date.now() + 1000 * 60 * 10).toISOString();
    log("Expires at:", expires);

    const { error } = await supabase
      .from("email_verifications")
      .insert({ email, code, expires_at: expires });

    if (error) {
      log("Supabase insert error:", JSON.stringify(error));
      return res.status(500).json({ success: false, debug });
    }

    log("Inserted into email_verifications");

    return res.status(200).json({
      success: true,
      debug
    });

  } catch (err) {
    log("Exception:", err.toString());
    return res.status(500).json({ success: false, debug });
  }
}


// api/auth/start-register.js

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email, language } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    // Initialize Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Generate a 6‑digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // Store pending registration
    const { data, error } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        language: language || "en",
        code,
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      console.error("Supabase insert error:", error);
      return res.status(500).json({ error: "Database error" });
    }

    // Return structured response
    return res.status(200).json({
      success: true,
      next: "verify",
      email,
      code, // for now we return it directly (same as before)
    });
  } catch (err) {
    console.error("Unexpected error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
