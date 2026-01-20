// api/auth/verify-register.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const debug = [];
  const log = (...a) => debug.push(a.join(" "));

  log("VERIFY-REGISTER: route hit");

  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false, error: "Method not allowed", debug });
    }

    const { email, code } = req.body || {};
    log("Email:", email);
    log("Code:", code);

    if (!email || !code) {
      log("Missing email or code");
      return res.status(400).json({ success: false, error: "Email and code are required", debug });
    }

    const cleanCode = String(code).trim();
    log("Clean code:", cleanCode);

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // ------------------------------------------------------------
    // 🔥 AUTO‑CLEANUP (non‑blocking)
    // ------------------------------------------------------------

    // 1. Delete expired codes
    supabase
      .from("pending_registrations")
      .delete()
      .lt("expires_at", new Date().toISOString())
      .then(() => log("Cleanup: expired codes removed"))
      .catch((err) => log("Cleanup error (expired):", err.toString()));

    // 2. Delete codes older than 3 months
    const threeMonthsAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString();

    supabase
      .from("pending_registrations")
      .delete()
      .lt("created_at", threeMonthsAgo)
      .then(() => log("Cleanup: codes older than 3 months removed"))
      .catch((err) => log("Cleanup error (3 months):", err.toString()));

    // 3. Cleanup duplicate rows (keep newest)
    supabase.rpc("cleanup_duplicates_pending_registrations")
      .then(() => log("Cleanup: duplicate rows removed"))
      .catch(() => log("Cleanup: duplicate function missing (safe to ignore)"));

    // ------------------------------------------------------------
    // 🔍 LOOKUP VALID CODE
    // ------------------------------------------------------------

    const { data: rows, error: fetchError } = await supabase
      .from("pending_registrations")
      .select("*")
      .eq("email", email)
      .eq("code", cleanCode)
      .eq("used", false)
      .gt("expires_at", new Date().toISOString())
      .limit(1);

    if (fetchError) {
      log("Supabase fetch error:", JSON.stringify(fetchError));
      return res.status(500).json({ success: false, error: "Database error", debug });
    }

    const record = rows?.[0];

    if (!record) {
      log("No matching record found");
      return res.status(400).json({ success: false, error: "Invalid or expired code", debug });
    }

    log("Verification record found:", JSON.stringify(record));

    // ------------------------------------------------------------
    // 🔒 MARK CODE AS USED
    // ------------------------------------------------------------

    const { error: updateError } = await supabase
      .from("pending_registrations")
      .update({ used: true })
      .eq("id", record.id);

    if (updateError) {
      log("Update error:", JSON.stringify(updateError));
      return res.status(500).json({ success: false, error: "Failed to update code", debug });
    }

    log("Marked code as used");

    // ------------------------------------------------------------
    // 👤 INSERT USER
    // ------------------------------------------------------------

    const { error: insertError } = await supabase
      .from("users")
      .insert({ email 
              password_hash: null, role: "user"
              });

    if (insertError) {
      log("User insert error:", JSON.stringify(insertError));
      return res.status(500).json({ success: false, error: "User creation failed", debug });
    }

    log("Inserted into users");

    return res.status(200).json({ success: true, next: "login", debug });

  } catch (err) {
    log("Exception:", err.toString());
    return res.status(500).json({ success: false, error: "Server error", debug });
  }
}
