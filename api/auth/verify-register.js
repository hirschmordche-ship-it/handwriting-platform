import bcrypt from "bcryptjs";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, code } = req.body || {};
  if (!email || !code) {
    return res.status(400).json({ error: "Missing fields" });
  }

  const { data, error } = await supabase
    .from("pending_registrations")
    .select("*")
    .eq("email", email)
    .eq("code", code)
    .single();

  if (error || !data) {
    return res.status(400).json({ error: "Invalid code" });
  }

  if (new Date(data.expires_at) < new Date()) {
    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    return res.status(400).json({ error: "Expired" });
  }

  const hash = await bcrypt.hash(data.password_hash, 10);

  const { error: insertUserError } = await supabase
    .from("users")
    .insert({
      email,
      password_hash: hash
    });

  if (insertUserError) {
    console.error(insertUserError);
    return res.status(500).json({ error: "User create failed" });
  }

  await supabase
    .from("pending_registrations")
    .delete()
    .eq("email", email);

  return res.status(200).json({ success: true });
}
