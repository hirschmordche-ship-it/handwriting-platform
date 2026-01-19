import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { email, password } = await req.json();

  if (!email || !password) {
    return res.status(400).json({ success: false, error: 'Missing fields' });
  }

  try {
    // Attempt to sign in
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password
    });

    if (error || !data.user) {
      return res.status(400).json({ success: false, error: 'Invalid login' });
    }

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error('login error:', err);
    return res.status(500).json({ success: false, error: 'Internal server error' });
  }
}

