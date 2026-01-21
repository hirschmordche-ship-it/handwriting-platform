import crypto from "crypto";
import { getSupabaseClient } from "../_supabase.js";
import { sendVerificationEmail } from "./email-templates.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, lang } = req.body;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email" });
    }

    const supabase = getSupabaseClient();

    // 1️⃣ Check if user already exists (registered & verified)
    const { data: existingUser, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userErr) throw userErr;

    if (existingUser) {
      return res
        .status(409)
        .json({ error: "Account already exists" });
    }

    // 2️⃣ Check for existing pending registration
    const { data: pending, error: pendingErr } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .maybeSingle();

    if (pendingErr) throw pendingErr;

    let code;

    if (pending) {
      // 🔁 RESEND FLOW
      // Reuse existing code if still valid
      const expiresAt = new Date(pending.expires_at).getTime();
      const now = Date.now();

      if (expiresAt > now) {
        code = pending.code;
      } else {
        // Expired → generate new code & update
        code = crypto.randomInt(100000, 999999).toString();

        const { error: updateErr } = await supabase
          .from("pending_registrations")
          .update({
            code,
            expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
          })
          .eq("email", email);

        if (updateErr) throw updateErr;
      }
    } else {
      // 🆕 FIRST REGISTER FLOW
      code = crypto.randomInt(100000, 999999).toString();

      const { error: insertErr } = await supabase
        .from("pending_registrations")
        .insert({
          email,
          code,
          expires_at: new Date(Date.now() + 15 * 60 * 1000).toISOString()
        });

      if (insertErr) throw insertErr;
    }

    // 3️⃣ Send email (always)
    await sendVerificationEmail({
      to: email,
      code,
      lang: lang === "he" ? "he" : "en"
    });

    return res.json({ success: true });
  } catch (err) {
    console.error("start-register error:", err);
    return res.status(500).json({ error: "Internal error" });
  }
}
