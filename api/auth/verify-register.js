// api/auth/verify-register.js
export const config = {
  runtime: "nodejs"
};

import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { code } = req.body || {};
    if (!code) {
      return res.status(400).json({ success: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: pending } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("code", code)
      .maybeSingle();

    if (!pending) {
      return res.status(400).json({ success: false });
    }

    if (new Date(pending.expires_at) < new Date()) {
      await supabase
        .from("pending_registrations")
        .delete()
        .eq("code", code);

      return res.status(400).json({ success: false });
    }

    await supabase.from("users").insert({
      email: pending.email,
      language: pending.language,
      created_at: new Date().toISOString()
    });

    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", pending.email);

    // --- Analytics ---
    console.log("[ANALYTICS] verification_success", pending.email);

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error(err);
    return res.status(400).json({ success: false });
  }
}
