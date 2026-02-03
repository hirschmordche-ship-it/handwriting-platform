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

    // 3️⃣ Create user in Supabase Auth (The "Real" Registration)
    // This allows the user to actually sign in via supabase.auth.signInWithPassword
    const { data: authData, error: authError } = await supabase.auth.admin.createUser({
      email: pending.email,
      password: pending.password_hash, // Pass the text you stored earlier
      email_confirm: true // This marks them as verified immediately
    });

    if (authError) {
      console.error("Auth creation error:", authError.message);
      return res.status(200).json({ success: false, reason: authError.message });
    }

    // 4️⃣ (Optional) Insert into your public users table if you need extra profile data
    await supabase.from("users").insert({
      id: authData.user.id, // Link to the Auth ID
      email: pending.email,
      password_hash: pending.password_hash // Only if you strictly need it here too
    });

    // 5️⃣ Cleanup pending record
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[verify-register-catch]", err);
    return res.status(200).json({ success: false });
  }
}
