const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function attachPasswordToggles() {
  const toggles = document.querySelectorAll('.toggle-password');
  toggles.forEach(el => {
    el.addEventListener('click', () => {
      const input = document.getElementById(el.dataset.target);
      if (!input) return;
      const hidden = input.type === 'password';
      input.type = hidden ? 'text' : 'password';
      el.textContent = hidden ? 'Hide' : 'Show';
    });
  });
}

async function init() {
  attachPasswordToggles();

  const loginBtn = document.getElementById('loginBtn');
  const loginUser = document.getElementById('loginUser');
  const loginPass = document.getElementById('loginPass');
  const loginMsg = document.getElementById('loginMsg');

  loginBtn.addEventListener('click', async () => {
    loginMsg.textContent = '';
    const email = loginUser.value.trim();
    const password = loginPass.value;

    if (!email || !password) {
      loginMsg.textContent = 'Enter email and password.';
      return;
    }

    const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
    if (error) {
      loginMsg.textContent = error.message || 'Login failed.';
      return;
    }

    window.location.href = "upload.html";
  });
}

document.addEventListener('DOMContentLoaded', init);

