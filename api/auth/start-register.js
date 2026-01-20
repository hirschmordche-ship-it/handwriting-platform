// api/auth/start-register.js

export const config = {
  runtime: "nodejs"
};

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "./email-templates.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed" });
    }

    const { email, lang } = req.body || {};

    if (!email || typeof email !== "string") {
      return res.status(400).json({ success: false, error: "Email is required" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1. Check if user already exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "This email is already registered."
      });
    }

    // 2. Delete any previous pending registrations for this email
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    // 3. Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4. Insert new pending registration
    const { error: insertError } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        language: lang || "en",
        code,
        expires_at: expiresAt
      });

    if (insertError) {
      return res.status(500).json({ success: false, error: "Database error" });
    }

    // 5. Send email
    const resend = new Resend(process.env.RESEND_API_KEY);
    const msg = messages[lang] || messages.en;

    const { error: emailError } = await resend.emails.send({
      from: "Handwriting Platform <noreply@handwriting-platform.vercel.app>",
      to: email,
      subject: msg.subject,
      html: msg.html(code, email)
    });

    if (emailError) {
      return res.status(500).json({ success: false, error: "Email delivery failed" });
    }

    return res.status(200).json({
      success: true,
      next: "verify",
      email
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
