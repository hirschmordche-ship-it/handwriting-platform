import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "../email-templates.js"; // ← FIX THIS PATH

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, lang } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ success: false, reason: "user_exists" });
    }

    await supabase.from("pending_registrations").delete().eq("email", email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    const hashed = Buffer.from(password).toString("base64");

    const { error: dbError } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        password_hash: hashed,
        code,
        expires_at: expiresAt
      });

    if (dbError) throw dbError;

    const tpl = messages[lang === "he" ? "he" : "en"];

    await resend.emails.send({
      from: "Resend <onboarding@resend.dev>",
      to: email,
      subject: tpl.subject,
      html: tpl.html(code)
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[start-register] Error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
}
