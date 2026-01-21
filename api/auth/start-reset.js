import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import resetMessages from "./reset-templates.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  try {
    const { email, lang } = req.body;
    const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

    // Verify user exists in the auth system
    const { data: { users }, error: listError } = await supabase.auth.admin.listUsers();
    const userExists = users.find(u => u.email === email);
    
    if (!userExists) {
        return res.status(200).json({ success: true }); // Security: don't reveal if email exists
    }

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from("password_resets").upsert({ email, code, expires_at: expiresAt });

    const tpl = resetMessages[lang === "he" ? "he" : "en"];
    await resend.emails.send({
      from: "Resend <onboarding@resend.dev>",
      to: email,
      subject: tpl.subject,
      html: tpl.html(code)
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
}
