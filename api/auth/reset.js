import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { action } = req.query;

  // ---------------------------
  // START RESET
  // ---------------------------
  if (action === "start") {
    const { email, lang } = req.body;
    if (!email || !lang) return res.status(400).json({ success: false });

    // generate a 6‑digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // expires in 15 minutes
    const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

    const { error } = await supabase
      .from("password_resets")
      .insert({ email, code, expires_at });

    if (error) {
      console.error("RESET START ERROR:", error);
      return res.status(500).json({ error: "Failed" });
    }

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // VERIFY RESET
  // ---------------------------
  if (action === "verify") {
    const { email, code } = req.body;

    const { data, error } = await supabase
      .from("password_resets")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (error || !data) return res.status(400).json({ error: "Invalid code" });

    if (new Date(data.expires_at) < new Date())
      return res.status(400).json({ error: "Expired" });

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // FINISH RESET
  // ---------------------------
  if (action === "finish") {
    const { email, newPassword } = req.body;

    const { error } = await supabase
      .from("users")
      .update({ encrypted_password: newPassword })
      .eq("email", email);

    if (error) return res.status(500).json({ error: "Failed" });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Invalid action" });
}
