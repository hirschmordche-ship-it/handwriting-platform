// api/auth/start-register.js
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  const debug = [];
  const log = (...args) => {
    try { debug.push(args.join(" ")); } catch (e) {}
  };

  log("START-REGISTER: route hit");

  try {
    if (req.method !== "POST") {
      log("Invalid method:", req.method);
      return res.status(405).json({ success: false, error: "Method not allowed", debug });
    }

    const { email, password, lang } = req.body || {};
    log("Received payload:", JSON.stringify({ email, lang }));

    if (!email || typeof email !== "string") {
      log("Missing or invalid email");
      return res.status(400).json({ success: false, error: "Email is required", debug });
    }

    // Generate a 6-digit verification code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString(); // 10 minutes

    // Insert into pending_registrations (or your chosen table)
    const { data, error } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        language: lang || "en",
        code,
        created_at: new Date().toISOString(),
        expires_at: expiresAt
      })
      .select()
      .single();

    if (error) {
      log("Supabase insert error:", JSON.stringify(error));
      return res.status(500).json({ success: false, error: "Database error", debug });
    }

    log("Inserted pending registration for:", email);

    // Optionally also insert into email_verifications table if you use it
    // await supabase.from("email_verifications").insert({ email, code, expires_at: expiresAt });

    // NOTE: Do not send SMTP credentials here. Email sending should use env vars on the server.
    // Return success (do not return sensitive data in production)
    return res.status(200).json({
      success: true,
      next: "verify",
      email,
      debug
    });
  } catch (err) {
    log("Exception:", err && err.toString ? err.toString() : String(err));
    return res.status(500).json({ success: false, error: "Server error", debug });
  }
}
