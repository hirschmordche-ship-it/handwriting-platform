import { createClient } from "@supabase/supabase-js";

/**
 * Unified Admin API
 * All admin actions are routed via ?action=
 */

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    const { action } = req.query;

    if (!action) {
      return res.status(400).json({ success: false, error: "Missing action" });
    }

    switch (action) {
      case "list-users":
        return listUsers(req, res);

      case "get-user-status":
        return getUserStatus(req, res);

      case "get-glyphs":
        return getGlyphs(req, res);

      case "get-glyph-counts":
        return getGlyphCounts(req, res);

      case "delete-glyph":
        return deleteGlyph(req, res);

      default:
        return res.status(400).json({ success: false, error: "Unknown action" });
    }
  } catch (err) {
    console.error("Admin API error:", err);
    return res.status(500).json({ success: false, error: "Server error" });
  }
}

/* ===============================
   ACTIONS
================================ */

async function listUsers(req, res) {
  const { data, error } = await supabase
    .from("users")
    .select("id, email, role")
    .order("email");

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  return res.json({ success: true, users: data });
}

async function getUserStatus(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false, error: "Missing userId" });
  }

  const { data, error } = await supabase
    .from("sessions")
    .select("created_at")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1);

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  const lastLogin = data?.[0]?.created_at || null;
  const online =
    lastLogin &&
    Date.now() - new Date(lastLogin).getTime() < 15 * 60 * 1000;

  return res.json({
    success: true,
    online,
    lastLogin
  });
}

async function getGlyphs(req, res) {
  const { userId, language } = req.query;

  if (!userId || !language) {
    return res.status(400).json({ success: false });
  }

  const { data, error } = await supabase
    .from("glyphs")
    .select("id, letter, created_at")
    .eq("user_id", userId)
    .eq("language", language)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  return res.json({ success: true, glyphs: data });
}

async function getGlyphCounts(req, res) {
  const { userId } = req.query;

  if (!userId) {
    return res.status(400).json({ success: false });
  }

  const { data, error } = await supabase
    .from("glyphs")
    .select("language")
    .eq("user_id", userId);

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  const counts = { en: 0, he: 0 };
  data.forEach(g => {
    if (g.language === "en") counts.en++;
    if (g.language === "he") counts.he++;
  });

  return res.json({ success: true, counts });
}

async function deleteGlyph(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ success: false });
  }

  const { glyphId } = req.body;

  if (!glyphId) {
    return res.status(400).json({ success: false });
  }

  const { error } = await supabase
    .from("glyphs")
    .delete()
    .eq("id", glyphId);

  if (error) {
    console.error(error);
    return res.status(500).json({ success: false });
  }

  return res.json({ success: true });
}
