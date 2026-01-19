export const config = {
  api: {
    bodyParser: true
  }
};
import { Resend } from "resend";
import { createClient } from "@supabase/supabase-js";

export default async function handler(req, res) {
  console.log("🔵 Handler invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    console.log("STEP 1: Body received", req.body);

    const { email, password, lang } = req.body;

    if (!email || !password || !lang) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    console.log("STEP 2: Creating Supabase client");
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    console.log("STEP 3: Creating user");
    const { data: user, error: userError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (userError) {
      console.error("🔴 Supabase error:", userError);
      return res.status(500).json({ error: "Failed to create user" });
    }

    console.log("STEP 4: Generating verification code");
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    console.log("STEP 5: Storing verification code");
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

    console.log("STEP 6: Preparing email");
    const resend = new Resend(process.env.RESEND_API_KEY);

    const subject =
      lang === "he"
        ? process.env.VERIFICATION_EMAIL_SUBJECT_HE
        : process.env.VERIFICATION_EMAIL_SUBJECT_EN;

    console.log("STEP 7: Sending email");
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

    console.log("STEP 8: Registration complete");
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔴 Unexpected error:", err);
    return res.status(500).json({ error: "Unexpected server error" });
  }
}
