import getRawBody from "raw-body";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

export default async function handler(req, res) {
  console.log("🔵 /api/auth/start-register invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse JSON safely on Vercel
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
    console.log("STEP 1: Body received", body);
  } catch (e) {
    console.error("JSON parse failed:", e);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, password, lang } = body;

  console.log("STEP 2: Initializing Supabase client");

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  console.log("STEP 3: Creating user in Supabase");

  const { data: user, error: userError } = await supabase.auth.admin.createUser({
    email,
    password,
    email_confirm: false,
  });

  if (userError) {
    console.error("User creation failed:", userError);
    return res.status(400).json({ error: userError.message });
  }

  console.log("STEP 4: Inserting verification code");

  const code = Math.floor(100000 + Math.random() * 900000).toString();

  const { error: insertError } = await supabase
    .from("email_verification_codes")
    .insert({
      email,
      code,
      created_at: new Date().toISOString(),
    });

  if (insertError) {
    console.error("Insert failed:", insertError);
    return res.status(500).json({ error: "Failed to store verification code" });
  }

  console.log("STEP 5: Sending verification email");

  const resend = new Resend(process.env.RESEND_API_KEY);

  const subject =
    lang === "he"
      ? process.env.VERIFICATION_EMAIL_SUBJECT_HE
      : process.env.VERIFICATION_EMAIL_SUBJECT_EN;

  const { error: emailError } = await resend.emails.send({
    from: process.env.VERIFICATION_EMAIL_FROM,
    to: email,
    subject,
    html: `<p>Your verification code is: <strong>${code}</strong></p>`,
  });

  if (emailError) {
    console.error("Email failed:", emailError);
    return res.status(500).json({ error: "Failed to send verification email" });
  }

  console.log("STEP 6: Registration start complete");

  return res.status(200).json({ success: true });
}
