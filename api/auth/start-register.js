import crypto from "crypto";
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, password, lang } = req.body || {};
  if (!email || !password) {
    return res.status(400).json({ error: "Missing fields" });
  }

  // Invalidate any previous pending registrations for this email
  await supabase
    .from("pending_registrations")
    .delete()
    .eq("email", email);

  const code = crypto.randomInt(100000, 999999).toString();
  const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

  const { error: insertError } = await supabase
    .from("pending_registrations")
    .insert({
      email,
      password_hash: password, // hashed later on verify
      code,
      expires_at: expiresAt
    });

  if (insertError) {
    console.error(insertError);
    return res.status(500).json({ error: "DB error" });
  }

  const subject =
    lang === "he" ? "קוד אימות" : "Your verification code";

  const html =
    lang === "he"
      ? `<p>קוד האימות שלך:</p><h2>${code}</h2><p>בתוקף ל-3 דקות</p>`
      : `<p>Your verification code:</p><h2>${code}</h2><p>Valid for 3 minutes</p>`;

  const { error: mailError } = await resend.emails.send({
    from: process.env.VERIFICATION_EMAIL_FROM,
    to: email,
    subject,
    html
  });

  if (mailError) {
    console.error(mailError);
    return res.status(500).json({ error: "Email failed" });
  }

  return res.status(200).json({ success: true });
}
