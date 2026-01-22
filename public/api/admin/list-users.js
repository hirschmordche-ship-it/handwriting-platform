import { supabase } from "../../supabaseClient.js";

export default async function handler(req, res) {
  try {
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

    // 3. Fetch all users
    const { data: users } = await supabase
      .from("users")
      .select("id, email, role")
      .order("email");

    return res.json({ success: true, users });

  } catch (err) {
    return res.status(500).json({ success: false, error: "Server error" });
  }
}
