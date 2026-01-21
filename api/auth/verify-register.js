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

    // 1️⃣ Fetch pending registration deterministically
    const { data: rows, error } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .limit(1);

    if (error || !rows || rows.length === 0) {
      return res.status(200).json({ success: false });
    }

    const pending = rows[0];

    // 2️⃣ Expiry check
    if (new Date(pending.expires_at) < new Date()) {
      await supabase
        .from("pending_registrations")
        .delete()
        .eq("email", email);

      return res.status(200).json({ success: false });
    }

    // 3️⃣ Create user
    await supabase.from("users").insert({
      email: pending.email,
      password_hash: pending.password_hash
    });

    // 4️⃣ Cleanup pending record
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[verify-register]", err);
    return res.status(200).json({ success: false });
  }
}
