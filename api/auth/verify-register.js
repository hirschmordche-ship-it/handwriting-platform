import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ success: false });
  }

  try {
    /* ----------------------------------------------------
       1. Load pending registration
    ---------------------------------------------------- */
    const { data: pending, error } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .maybeSingle();

    if (error || !pending) {
      return res.status(400).json({ success: false });
    }

    if (new Date(pending.expires_at) < new Date()) {
      await supabase
        .from("pending_registrations")
        .delete()
        .eq("email", email);

      return res.status(400).json({ success: false });
    }

    /* ----------------------------------------------------
       2. Create user account
    ---------------------------------------------------- */
    const { error: createErr } = await supabase
      .from("users")
      .insert({
        email,
        password_hash: pending.password_hash
      });

    if (createErr) throw createErr;

    /* ----------------------------------------------------
       3. Remove pending registration
    ---------------------------------------------------- */
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    return res.json({ success: true });
  } catch (err) {
    console.error("verify-register error:", err);
    return res.status(500).json({ success: false });
  }
}
