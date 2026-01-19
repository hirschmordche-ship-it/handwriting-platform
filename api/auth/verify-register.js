import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, code } = await req.json();

  if (!email || !code) {
    return res.status(400).json({ error: 'Missing fields' });
  }

  try {
    // 1. Find matching code
    const { data, error } = await supabase
      .from('email_verifications')
      .select('*')
      .eq('email', email)
      .eq('code', code)
      .eq('used', false)
      .limit(1)
      .single();

    if (error || !data) {
      return res.status(400).json({ success: false, error: 'Invalid code' });
    }

    // 2. Check expiration
    const now = new Date();
    const expires = new Date(data.expires_at);

    if (now > expires) {
      return res.status(400).json({ success: false, error: 'Code expired' });
    }

    // 3. Mark code as used
    await supabase
      .from('email_verifications')
      .update({ used: true })
      .eq('id', data.id);

    // 4. Mark user as verified
    await supabase.auth.admin.updateUserByEmail(email, {
      email_confirm: true
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('verify-register error:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
}

