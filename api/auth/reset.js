export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  try {
    const { email, lang } = req.body;
    if (!email || !lang) return res.status(400).json({ success: false });

    // continue with your logic...
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { action } = req.query;

  // ---------------------------
  // START RESET
  // ---------------------------
  if (action === "start") {
    const { email } = req.body;

    const { error } = await supabase
      .from("pending_resets")
      .insert({ email });

    if (error) return res.status(500).json({ error: "Failed" });

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // VERIFY RESET
  // ---------------------------
  if (action === "verify") {
    const { email, code } = req.body;

    const { data, error } = await supabase
      .from("pending_resets")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (error || !data)
      return res.status(400).json({ error: "Invalid code" });

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // RESET PASSWORD
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
