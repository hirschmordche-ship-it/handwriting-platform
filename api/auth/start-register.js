const { Resend } = require('resend');
const { createClient } = require('@supabase/supabase-js');

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

const resend = new Resend(process.env.RESEND_API_KEY);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password, lang } = req.body;

  if (!email || !password || !lang) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // 1. Create Supabase user
    const { error: signUpError } = await supabase.auth.admin.createUser({
      email,
      password,
      email_confirm: false
    });

    if (signUpError && !signUpError.message.includes('already registered')) {
      throw signUpError;
    }

    // 2. Generate 6-digit code
    const code = Math.floor(100000 + Math.random() * 900000).toString();

    // 3. Store in email_verifications
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
    const { error: insertError } = await supabase
      .from('email_verifications')
      .insert([{ email, code, expires_at: expiresAt }]);

    if (insertError) throw insertError;

    // 4. Send email via Resend
    const subject =
      lang === 'he'
        ? process.env.VERIFICATION_EMAIL_SUBJECT_HE
        : process.env.VERIFICATION_EMAIL_SUBJECT_EN;

    const body =
      lang === 'he'
        ? `קוד האימות שלך הוא: ${code}\n\nאם לא ביקשת הרשמה, ניתן להתעלם מהמייל.`
        : `Your verification code is: ${code}\n\nIf you didn't request this, you can ignore this email.`;

    await resend.emails.send({
      from: process.env.VERIFICATION_EMAIL_FROM,
      to: email,
      subject,
      text: body
    });

    // 5. Done
    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('start-register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};
