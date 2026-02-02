import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body || {};
    if (!email || !code) {
      return res.status(200).json({ success: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1️⃣ Fetch pending registration
    const { data: rows, error: fetchError } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .limit(1);

    if (fetchError || !rows || rows.length === 0) {
      return res.status(200).json({ success: false, reason: "invalid_code" });
    }

    const pending = rows[0];

    // 2️⃣ Expiry check
    if (new Date(pending.expires_at) < new Date()) {
      await supabase.from("pending_registrations").delete().eq("email", email);
      return res.status(200).json({ success: false, reason: "expired" });
    }

    // 3️⃣ Base64 hash the password
    const hashed = Buffer.from(pending.password_hash).toString("base64");

    // 4️⃣ Insert into your custom users table
    const { error: insertError } = await supabase.from("users").insert({
      email: pending.email,
      password_hash: hashed,
      encrypted_password: hashed,
      role: "user"
    });

    if (insertError) {
      console.error("User insert error:", insertError);
      return res.status(200).json({ success: false, reason: "insert_failed" });
    }

    // 5️⃣ Cleanup pending record
    await supabase.from("pending_registrations").delete().eq("email", email);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[verify-register-catch]", err);
    return res.status(200).json({ success: false });
  }
}
