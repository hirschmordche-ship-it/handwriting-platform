// api/auth/resend-register.js

export const config = {
  runtime: "nodejs"
};

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "./email-templates.js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { email, lang } = req.body || {};

    if (!email) {
      return res.status(400).json({ success: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Enforce cooldown (3 minutes)
    const { data: last } = await supabase
      .from("pending_registrations")
      .select("created_at")
      .eq("email", email)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (last) {
      const diff = Date.now() - new Date(last.created_at).getTime();
      if (diff < 3 * 60 * 1000) {
        return res.status(429).json({
          success: false,
          error: "Please wait before resending"
        });
      }
    }

    // Delete old attempts
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    // Generate new code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase
      .from("pending_registrations")
      .insert({
        email,
        code,
        language: lang || "en",
        expires_at: expiresAt,
        created_at: new Date().toISOString()
      });

    const resend = new Resend(process.env.RESEND_API_KEY);
    const msg = messages[lang] || messages.en;

    await resend.emails.send({
      from: "Handwriting Platform <onboarding@resend.dev>",
      to: email,
      subject: msg.subject,
      html: msg.html(code)
    });

    res.status(200).json({ success: true });

  } catch (err) {
    console.error("RESEND ERROR:", err);
    res.status(500).json({ success: false });
  }
}
