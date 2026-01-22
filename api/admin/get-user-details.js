import { supabase } from "../../supabaseClient.js";
import pg from "pg";

const pool = new pg.Pool({
  connectionString: process.env.SUPABASE_DB_URL
});

export default async function handler(req, res) {
  try {
    const { userId } = req.body;

    // 1. Verify logged-in user
    const { data: { user } } = await supabase.auth.getUser(req);

    if (!user) {
      return res.status(401).json({ success: false, error: "Not logged in" });
    }

    // 2. Verify admin role
    const { data: profile } = await supabase
      .from("users")
      .select("role")
      .eq("id", user.id)
      .single();

    if (!profile || profile.role !== "admin") {
      return res.status(403).json({ success: false, error: "Not admin" });
    }

    // 3. Fetch user profile
    const { data: userProfile } = await supabase
      .from("users")
      .select("*")
      .eq("id", userId)
      .single();

    // 4. Decrypt password using SQL
    const result = await pool.query(
      `SELECT pgp_sym_decrypt(encrypted_password::bytea, $1) AS password
       FROM users
       WHERE id = $2`,
      [process.env.ADMIN_ENCRYPTION_KEY, userId]
    );

    const decryptedPassword = result.rows[0]?.password || null;

    // 5. Fetch glyph uploads
    const { data: glyphs } = await supabase
      .from("glyphs")
      .select("*")
      .eq("user_id", userId);

    return res.json({
      success: true,
      user: userProfile,
      decryptedPassword,
      glyphs
    });

  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
