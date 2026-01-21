import { getSupabaseClient } from "../_supabase.js";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, code } = req.body;

    if (!email || !code) {
      return res.status(400).json({ error: "Missing data" });
    }

    const supabase = getSupabaseClient();

    // 1️⃣ Find pending registration
    const { data: pending, error: pendingErr } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .maybeSingle();

    if (pendingErr) throw pendingErr;

    if (!pending) {
      return res
        .status(400)
        .json({ success: false, error: "Invalid code" });
    }

    // 2️⃣ Check expiration
    if (new Date(pending.expires_at).getTime() < Date.now()) {
      return res
        .status(400)
        .json({ success: false, error: "Code expired" });
    }

    // 3️⃣ Create user account
    const { error: insertUserErr } = await supabase
      .from("users")
      .insert({
        email
      });

    if (insertUserErr) throw insertUserErr;

    // 4️⃣ Delete pending registration
    const { error: deleteErr } = await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    if (deleteErr) throw deleteErr;

    return res.json({ success: true });
  } catch (err) {
    console.error("verify-register error:", err);
    return res.status(500).json({ success: false });
  }
}
