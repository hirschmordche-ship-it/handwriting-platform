import getRawBody from "raw-body";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("🔵 /api/auth/start-login invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse JSON safely
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
    console.log("STEP 1: Body received", body);
  } catch (e) {
    console.error("JSON parse failed:", e);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, password } = body;

  console.log("STEP 2: Initializing Supabase client");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("STEP 3: Attempting login");

  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    console.error("Login failed:", error);
    return res.status(400).json({ error: error.message });
  }

  console.log("STEP 4: Login successful");

  return res.status(200).json({ success: true, session: data.session });
}
