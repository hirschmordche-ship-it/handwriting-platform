import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  const { action } = req.query;

  // ---------------------------
  // 1. GET GLYPH COUNTS
  // ---------------------------
  if (action === "glyph-counts") {
    const { userId } = req.query;

    const { data, error } = await supabase
      .from("glyphs")
      .select("language")
      .eq("user_id", userId);

    if (error) return res.status(500).json({ error: "Failed" });

    const counts = { en: 0, he: 0 };
    data.forEach((g) => {
      if (g.language === "en") counts.en++;
      if (g.language === "he") counts.he++;
    });

    return res.status(200).json({ success: true, counts });
  }

  // ---------------------------
  // 2. GET USER STATUS
  // ---------------------------
  if (action === "user-status") {
    const { userId } = req.query;

    const { data, error } = await supabase
      .from("sessions")
      .select("created_at")
      .eq("user_id", userId)
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) return res.status(500).json({ error: "Failed" });

    const lastLogin = data?.[0]?.created_at || null;
    const now = new Date();
    const last = lastLogin ? new Date(lastLogin) : null;

    const online = last && now - last < 15 * 60 * 1000;

    return res.status(200).json({ success: true, online, lastLogin });
  }

  // ---------------------------
  // 3. DELETE GLYPH
  // ---------------------------
  if (action === "delete-glyph") {
    const { glyphId } = req.body;

    const { error } = await supabase
      .from("glyphs")
      .delete()
      .eq("id", glyphId);

    if (error) return res.status(500).json({ error: "Failed" });

    return res.status(200).json({ success: true });
  }

  return res.status(400).json({ error: "Invalid action" });
}
