// api/cron/cleanup-pending.js
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const cutoff = new Date(
    Date.now() - 6 * 30 * 24 * 60 * 60 * 1000
  ).toISOString();

  await supabase
    .from("pending_registrations")
    .delete()
    .lt("expires_at", cutoff);

  console.log("[CRON] cleaned pending_registrations");

  res.status(200).json({ success: true });
}

