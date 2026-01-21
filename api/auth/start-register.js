import bcrypt from "bcryptjs";
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

  const { email, password, lang } = req.body;

  if (!email || !password) {
    return res.status(400).json({ success: false });
  }

  try {
    /* ----------------------------------------------------
       1. Check if VERIFIED user already exists
    ---------------------------------------------------- */
    const { data: existingUser, error: userErr } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (userErr) throw userErr;

    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: "Account already exists. Please log in."
      });
    }

    /* ----------------------------------------------------
       2. Delete ANY previous pending registration
       (restart is allowed)
    ---------------------------------------------------- */
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    /* ----------------------------------------------------
       3. Create new pending registration
    ---------------------------------------------------- */
    const passwordHash = await bcrypt.hash(password, 10);
    const code = crypto.randomInt(100000, 999999).toString();

    const expiresAt = new Date(Date.now() + 3 * 60 * 1000); // 3 minutes

    const { error: insertErr } = await supabase
      .from("pending_registrations")
      .insert({
        email,
        password_hash: passwordHash,
        code,
        expires_at: expiresAt
      });

    if (insertErr) throw insertErr;

    /* ----------------------------------------------------
       4. Send email
    ---------------------------------------------------- */
    await sendVerificationEmail(email, code, lang);

    return res.json({ success: true });
  } catch (err) {
    console.error("start-register error:", err);
    return res.status(500).json({
      success: false,
      error: "Registration failed"
    });
  }
}
