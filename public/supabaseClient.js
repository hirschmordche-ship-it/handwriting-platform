// supabaseClient.js
// Load AFTER the Supabase CDN in each HTML file:
// <script src="https://unpkg.com/@supabase/supabase-js@2"></script>
// <script src="supabaseClient.js"></script>

const SUPABASE_URL = 'https://fohzmnvqgtbwglapojuo.supabase.co';
const SUPABASE_ANON_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImZvaHptbnZxZ3Rid2dsYXBvanVvIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY1OTM0MzUsImV4cCI6MjA4MjE2OTQzNX0.H5yr04r7bVATUz1TE1FSYPgoLPZ7edQ3iD8Ey2N6lQs';

const _supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

/**
 * Get current user based on our own sessions table.
 * Assumes:
 * - localStorage['session_token'] holds the session token
 * - public.sessions(token, user_id, expires_at) exists
 * - public.users(id, email, role, created_at) exists
 */
async function getCurrentUser() {
  const token = localStorage.getItem('session_token');
  if (!token) return null;

  const { data: session, error: sessionError } = await _supabase
    .from('sessions')
    .select('user_id, expires_at')
    .eq('token', token)
    .maybeSingle();

  if (sessionError || !session) {
    console.warn('No valid session found', sessionError);
    return null;
  }

  if (session.expires_at && new Date(session.expires_at) < new Date()) {
    console.warn('Session expired');
    return null;
  }

  const { data: user, error: userError } = await _supabase
    .from('users')
    .select('id, email, role, created_at')
    .eq('id', session.user_id)
    .maybeSingle();

  if (userError || !user) {
    console.warn('User not found for session', userError);
    return null;
  }

  return user;
}

/**
 * Require auth for protected pages.
 * If no user → redirect to login (index.html).
 */
async function requireAuth() {
  const user = await getCurrentUser();
  if (!user) {
    window.location.href = 'index.html';
    return null;
  }
  return user;
}

/**
 * Helper: call RPC safely with basic logging.
 */
async function callRpc(fnName, params) {
  const { data, error } = await _supabase.rpc(fnName, params);
  if (error) {
    console.error(`RPC ${fnName} error`, error);
    throw error;
  }
  return data;
}

window.supabaseClient = {
  supabase: _supabase,
  getCurrentUser,
  requireAuth,
  callRpc,
};