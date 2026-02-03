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
      .from("glyphs")
      .select("language")
      .eq("user_id", userId);

    if (error) {
      return res.status(500).json({ error: "Failed to fetch glyphs" });
    }

    const counts = { en: 0, he: 0 };
    data.forEach((g) => {
      if (g.language === "en") counts.en++;
      else if (g.language === "he") counts.he++;
    });

    return res.status(200).json({ success: true, counts });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
