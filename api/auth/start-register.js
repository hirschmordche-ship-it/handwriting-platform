import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import { messages } from "./email-templates";

export default async function handler(req, res) {
  const debug = [];
  const log = (...a) => debug.push(a.join(" "));

  log("START-REGISTER: route hit");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed", debug });
    }

    const { email, lang } = req.body || {};
    log("Received payload:", JSON.stringify({ email, lang }));

    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, error: "Email is required", debug });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Reject if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingError) { log("Existing user lookup error:", JSON.stringify(existingError)); }

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email is already registered.",
        debug
      });
    }

    // 2. Cooldown: reject if code sent within last 3 minutes
    const threeMinutesAgo = new Date(Date.now() - 3 * 60 * 1000).toISOString();

    const { data: recent } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .gt("created_at", threeMinutesAgo)
      .eq("used", false)
      .limit(1);

    if (recent && recent.length > 0) {
      return res.status(429).json({
        success: false,
        error: "Please wait 3 minutes before requesting another code.",
        debug
      });
    }

    // 3. Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4. Insert pending registration
    const insert = await supabase
      .from("pending_registrations")
      .insert({
        email,
        language: lang || "en",
        code,
        created_at: new Date().toISOString(),
        expires_at: expiresAt,
        used: false
      })
      .select()
      .single();

    if (insert.error) {
      log("Supabase insert error:", JSON.stringify(insert.error));
      return res.status(500).json({ success: false, error: "Database error", debug });
    }

    log("Inserted pending registration for:", email);

    // 5. Send email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const msg = messages[lang] || messages.en;

    log("EMAIL: about to send", email, code);

    const { error: emailError } = await resend.emails.send({
      from: "Handwriting Platform <noreply@yourdomain.com>",
      to: email,
      subject: msg.subject,
      html: msg.html(code, email)
    });

    if (emailError) {
      log("Email error:", JSON.stringify(emailError));
      return res.status(500).json({ success: false, error: "Email delivery failed", debug });
    }

    log("Email sent successfully");

    return res.status(200).json({
      success: true,
      next: "verify",
      email,
      debug
    });

  } catch (err) {
    log("Exception:", err.toString());
    return res.status(500).json({ success: false, error: "Server error", debug });
  }
}
