// api/auth/login.js

import { createClient } from "@supabase/supabase-js";
import { nanoid } from "nanoid";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ error: "Email is required" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // Check if user exists
    const { data: user, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .single();

    if (userError || !user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Create session token
    const token = nanoid();

    const { error: sessionError } = await supabase
      .from("sessions")
      .insert({
        user_id: user.id,
        token,
      });

    if (sessionError) {
      return res.status(500).json({ error: "Session creation failed" });
    }

    return res.status(200).json({ success: true, token });
  } catch (err) {
    console.error("Login error:", err);
    return res.status(500).json({ error: "Server error" });
  }
}
