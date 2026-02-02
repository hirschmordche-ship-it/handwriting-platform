import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { action } = req.query;

  // ---------------------------
  // START REGISTER
  // ---------------------------
  if (action === "start") {
    const { email } = req.body;

    const { error } = await supabase
      .from("pending_registrations")
      .insert({ email });

    if (error) return res.status(500).json({ error: "Failed" });

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // VERIFY REGISTER
  // ---------------------------
  if (action === "verify") {
    const { email, code } = req.body;

    const { data, error } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", code)
      .single();

    if (error || !data)
      return res.status(400).json({ error: "Invalid code" });

    return res.status(200).json({ success: true });
  }

  // ---------------------------
  // RESEND REGISTER CODE
  // ---------------------------
  if (action === "resend") {
    const { email } = req.body;

    // Your resend logic here

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Invalid action" });
}
