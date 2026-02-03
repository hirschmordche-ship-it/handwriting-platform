// verify-reset.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, code } = req.body;
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    const { data: record } = await supabase
      .from("password_resets")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (!record || new Date(record.expires_at) < new Date()) {
      return res.status(400).json({ success: false, reason: "Invalid or expired code" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
