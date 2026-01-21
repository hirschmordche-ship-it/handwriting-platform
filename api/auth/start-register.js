import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "./email-templates.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, lang } = req.body || {};
    if (!email || !password) {
      return res.status(400).json({ success: false });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    // 1️⃣ Check if user exists
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(409).json({ success: false, reason: "user_exists" });
    }

    // 2️⃣ Delete old codes
    await supabase.from("pending_registrations").delete().eq("email", email);

    // 3️⃣ Generate code
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 4️⃣ Store in Supabase - AWAIT this to ensure it saves
    const { error: dbError } = await supabase.from("pending_registrations").insert({
      email,
      password_hash: password,
      code,
      expires_at: expiresAt
    });

    if (dbError) throw dbError;

    // 5️⃣ Send Email - AWAIT this to ensure it sends
    const tpl = messages[lang === "he" ? "he" : "en"];
    
    await resend.emails.send({
      from: "Resend <onboarding@resend.dev>", // Keeping the default that worked for you
      to: email,
      subject: tpl.subject,
      html: tpl.html(code)
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("[start-register] Error:", err);
    // Return the error message so we can see why it's failing
    return res.status(500).json({ success: false, error: err.message });
  }
}
