import crypto from "crypto";
import { createClient } from "@supabase/supabase-js";
import { sendVerificationEmail } from "./email-templates.js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { email, lang } = req.body;

  if (!email) {
    return res.status(400).json({ success: false });
  }

  try {
    const code = crypto.randomInt(100000, 999999).toString();
    const expiresAt = new Date(Date.now() + 3 * 60 * 1000);

    await supabase
      .from("pending_registrations")
      .update({
        code,
        expires_at: expiresAt
      })
      .eq("email", email);

    await sendVerificationEmail(email, code, lang);

    res.json({ success: true });
  } catch (err) {
    console.error("resend-register error:", err);
    res.status(500).json({ success: false });
  }
}
