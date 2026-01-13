console.log("🔵 [START-REGISTER] File loaded");

const { Resend } = require('resend');
console.log("🟣 Resend imported");

const { createClient } = require('@supabase/supabase-js');
console.log("🟣 Supabase imported");

// Log environment variables (safe ones only)
console.log("🟡 ENV CHECK:", {
  SUPABASE_URL: process.env.SUPABASE_URL ? "OK" : "MISSING",
  SERVICE_ROLE: process.env.SUPABASE_SERVICE_ROLE_KEY ? "OK" : "MISSING",
  RESEND_API_KEY: process.env.RESEND_API_KEY ? "OK" : "MISSING",
  EMAIL_FROM: process.env.VERIFICATION_EMAIL_FROM ? "OK" : "MISSING",
  SUBJECT_EN: process.env.VERIFICATION_EMAIL_SUBJECT_EN ? "OK" : "MISSING",
  SUBJECT_HE: process.env.VERIFICATION_EMAIL_SUBJECT_HE ? "OK" : "MISSING"
});

let supabase;
try {
  supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
  console.log("🟢 Supabase client created");
} catch (err) {
  console.error("🔴 Supabase client FAILED:", err);
}

let resend;
try {
  resend = new Resend(process.env.RESEND_API_KEY);
  console.log("🟢 Resend client created");
} catch (err) {
  console.error("🔴 Resend client FAILED:", err);
}

module.exports = async function handler(req, res) {
  console.log("🔵 Handler invoked");
  console.log("🔵 Method:", req.method);

  if (req.method !== 'POST') {
    console.log("🟠 Rejecting non-POST request");
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log("🟣 Parsing body:", req.body);

  const { email, password, lang } = req.body || {};
  console.log("🟣 Extracted fields:", { email, password, lang });

  if (!email || !password || !lang) {
    console.log("🔴 Missing fields");
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    console.log("🟣 Creating Supabase user…");
    const { error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (signUpError) {
      console.error("🔴 Supabase signup error:", signUpError);
      throw signUpError;
    }

    console.log("🟢 User created or already exists");

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    console.log("🟣 Generated code:", code);

    const expiresAt = new Date(Date.now() + 15 * 60 * 1000);
    console.log("🟣 Expires at:", expiresAt);

    console.log("🟣 Inserting verification row…");
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert([{ email, code, expires_at: expiresAt }]);

    if (insertError) {
      console.error("🔴 Insert error:", insertError);
      throw insertError;
    }

    console.log("🟢 Verification row inserted");

    const subject =
      lang === 'he'
        ? process.env.VERIFICATION_EMAIL_SUBJECT_HE
        : process.env.VERIFICATION_EMAIL_SUBJECT_EN;

    const body =
      lang === 'he'
        ? `קוד האימות שלך הוא: ${code}`
        : `Your verification code is: ${code}`;

    console.log("🟣 Sending email…");

    await resend.emails.send({
      from: process.env.VERIFICATION_EMAIL_FROM,
      to: email,
      subject,
      text: body
    });

    console.log("🟢 Email sent");

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("🔴 FINAL ERROR:", err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
