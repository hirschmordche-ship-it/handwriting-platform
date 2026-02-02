import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).end();

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { email, password, language } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing fields" });

  // Base64 hash
  const password_hash = Buffer.from(password).toString("base64");

  const code = Math.floor(100000 + Math.random() * 900000).toString();
  const expires_at = new Date(Date.now() + 15 * 60 * 1000).toISOString();

  const { error } = await supabase.from("pending_registrations").insert({
    email,
    language,
    code,
    expires_at,
    password_hash
  });

  if (error) return res.status(500).json({ error: "Failed" });

  return res.status(200).json({ success: true });
}
