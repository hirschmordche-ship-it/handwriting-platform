import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ error: "Method not allowed" });
    }

    const { glyphId } = req.body;

    if (!glyphId) {
      return res.status(400).json({ error: "Missing glyphId" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { error } = await supabase
      .from("glyphs")
      .delete()
      .eq("id", glyphId);

    if (error) {
      return res.status(500).json({ error: "Failed to delete glyph" });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ error: "Server error" });
  }
}
