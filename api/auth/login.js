import { createClient } from "@supabase/supabase-js";

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

  const hashed = Buffer.from(password).toString("base64");

  const valid =
    user.password_hash === hashed ||
    user.encrypted_password === hashed;

  if (!valid) return res.status(400).json({ error: "Invalid credentials" });

  return res.status(200).json({ success: true, role: user.role });
}
