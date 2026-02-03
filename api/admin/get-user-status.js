import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { userId } = req.query;

    if (!userId) {
      return res.status(400).json({ error: "Missing userId" });
    }

    const { data, error } = await supabase
      .from("sessions")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch session" });
    }

    const lastLogin = data?.[0]?.created_at || null;
    const now = new Date();
    const last = lastLogin ? new Date(lastLogin) : null;

    const online =
      last && now - last < 15 * 60 * 1000 ? true : false;

    return res.status(200).json({
      success: true,
      online,
      lastLogin
    });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
