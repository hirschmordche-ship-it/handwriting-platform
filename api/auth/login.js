import { createClient } from "@supabase/supabase-js";
import bcrypt from "bcryptjs";
import { randomUUID } from "crypto";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  const { data: user, error } = await supabase
    .from("users")
    .select("*")
    .eq("email", email)
    .single();

  if (error || !user) return res.status(400).json({ error: "Invalid credentials" });

  const valid =
    (user.password_hash && await bcrypt.compare(password, user.password_hash)) ||
    (user.encrypted_password && await bcrypt.compare(password, user.encrypted_password));

  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  const token = randomUUID();
  const expires_at = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString();

  await supabase.from("sessions").insert({
    user_id: user.id,
    token,
    expires_at
  });

  return res.status(200).json({ success: true, token, role: user.role });
}
