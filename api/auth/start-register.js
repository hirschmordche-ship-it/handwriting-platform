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
