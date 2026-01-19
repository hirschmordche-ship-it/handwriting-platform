import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("🔵 Handler invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, password, lang } = req.body;

    if (!email || !password || !lang) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("🟣 Creating Supabase client");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("🟣 Creating user in Supabase");
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (userError) {
      console.error("🔴 Supabase error:", userError);
      return res.status(500).json({ error: "Failed to create user" });
    }

    console.log("🟣 Generating verification code");
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("🟣 Storing verification code");
    const { error: insertError } = await supabase
      .from("email_verification_codes")
      .insert({
        user_id: user.user.id,
        code,
        email,
        created_at: new Date().toISOString()
      });

    if (insertError) {
      console.error("🔴 Insert error:", insertError);
      return res.status(500).json({ error: "Failed to store verification code" });
    }

    console.log("🟣 Preparing email");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject =
      lang === "he"
        ? process.env.VERIFICATION_EMAIL_SUBJECT_HE
        : process.env.VERIFICATION_EMAIL_SUBJECT_EN;

    console.log("🟣 Sending email");
    const { error: emailError } = await resend.emails.send({
      from: process.env.VERIFICATION_EMAIL_FROM,
      to: email,
      subject,
      html: `<p>Your verification code is: <strong>${code}</strong></p>`
    });

    if (emailError) {
      console.error("🔴 Email error:", emailError);
      return res.status(500).json({ error: "Failed to send verification email" });
    }

    console.log("🟢 Registration flow complete");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔴 Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
