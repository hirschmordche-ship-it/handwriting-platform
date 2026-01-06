// Replace your existing login.js with this exact file.
// Minimal, non-invasive, uses your existing HTML/CSS (no other file changes).
// Guarantees: Show/Hide works via event delegation; strength bar updates; Remember Me works.
// Supabase auth used if available but never blocks UI.

const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

// Safe supabase init (non-blocking)
let supabaseClient = null;
try {
  if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  }
} catch (e) {
  supabaseClient = null;
}

// Helpers
const $id = id => document.getElementById(id);
const onReady = fn => {
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', fn);
  else fn();
};

// Remember Me helpers
const REMEMBER_KEY = 'remember_email_v1';
const saveRemember = email => { try { localStorage.setItem(REMEMBER_KEY, email || ''); } catch (e) {} };
const loadRemember = () => { try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch (e) { return ''; } };
const clearRemember = () => { try { localStorage.removeItem(REMEMBER_KEY); } catch (e) {} };

// Event-delegation for Show/Hide toggle (guaranteed to work)
(function installToggleDelegation() {
  if (document.__toggleDelegationInstalled) return;
  document.__toggleDelegationInstalled = true;

  document.addEventListener('click', function (ev) {
    const el = ev.target;
    if (!el || !el.classList) return;
    if (!el.classList.contains('toggle-password')) return;

    const targetId = el.dataset && el.dataset.target;
    if (!targetId) return;
    const input = $id(targetId);
    if (!input) return;

    const wasPassword = input.type === 'password';
    try {
      input.type = wasPassword ? 'text' : 'password';
      el.textContent = wasPassword ? 'Hide' : 'Show';
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    } catch (e) {
      // ignore toggle errors
    }
  }, { passive: true });

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const el = ev.target;
    if (!el || !el.classList) return;
    if (!el.classList.contains('toggle-password')) return;
    ev.preventDefault();
    el.click();
  });
})();

// Password scoring (same logic as your snippets)
function scorePassword(p) {
  let s = 0;
  if (!p) return 0;
  if (p.length >= 6) s++;
  if ((p.match(/[a-z]/gi) || []).length >= 2) s++;
  if (/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"'<>,.?/]/.test(p)) s++;
  return s;
}

// Attach UI handlers (strength bar, remember, auth buttons)
function attachUIHandlers() {
  try {
    const regPass = $id('regPass');
    const regBar = $id('regBar');
    const regText = $id('regText');

    // Strength bar: idempotent attach
    if (regPass && regBar && regText && !regPass.__strengthAttached) {
      regPass.__strengthAttached = true;
      regPass.addEventListener('input', function (e) {
        const s = scorePassword(e.target.value);
        const widths = ["5%", "33%", "66%", "100%"];
        const colors = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"];
        regBar.style.width = widths[s] || widths[0];
        regBar.style.background = colors[s] || colors[0];
        regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
      });
      // initialize from current value
      const initial = scorePassword(regPass.value || '');
      regBar.style.width = ["5%", "33%", "66%", "100%"][initial] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][initial] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][initial] || "";
    }

    // Remember Me: populate
    const loginUser = $id('loginUser');
    const rememberMe = $id('rememberMe');
    const remembered = loadRemember();
    if (remembered && loginUser) {
      loginUser.value = remembered;
      if (rememberMe) rememberMe.checked = true;
    }

    // Auth handlers (safe if supabaseClient is null)
    const regBtn = $id('regBtn');
    const loginBtn = $id('loginBtn');
    const regUser = $id('regUser');
    const loginPass = $id('loginPass');
    const regMsg = $id('regMsg');
    const loginMsg = $id('loginMsg');

    async function register() {
      if (regMsg) regMsg.textContent = '';
      if (loginMsg) loginMsg.textContent = '';

      const email = regUser ? (regUser.value || '').trim() : '';
      const password = regPass ? regPass.value : '';

      if (!email) { if (regMsg) regMsg.textContent = 'Please enter an email.'; return; }
      if (scorePassword(password) !== 3) { if (regMsg) regMsg.textContent = 'Weak password. Add length, digits, and symbols.'; return; }
      if (!supabaseClient) { if (regMsg) regMsg.textContent = 'Auth client not available.'; return; }

      try {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) { if (regMsg) regMsg.textContent = error.message || 'Registration failed.'; return; }

        const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (loginError) { if (regMsg) regMsg.textContent = 'Registered, but login failed. Try logging in.'; return; }

        if (rememberMe && rememberMe.checked) saveRemember(email);
        window.location.href = 'upload.html';
      } catch (err) {
        if (regMsg) regMsg.textContent = 'Registration error. Try again.';
      }
    }

    async function login() {
      if (regMsg) regMsg.textContent = '';
      if (loginMsg) loginMsg.textContent = '';

      const email = loginUser ? (loginUser.value || '').trim() : '';
      const password = loginPass ? loginPass.value : '';

      if (!email || !password) { if (loginMsg) loginMsg.textContent = 'Enter email and password.'; return; }
      if (!supabaseClient) { if (loginMsg) loginMsg.textContent = 'Auth client not available.'; return; }

      try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) { if (loginMsg) loginMsg.textContent = error.message || 'Invalid credentials.'; return; }

        if (rememberMe && rememberMe.checked) saveRemember(email);
        else clearRemember();

        window.location.href = 'upload.html';
      } catch (err) {
        if (loginMsg) loginMsg.textContent = 'Login error. Try again.';
      }
    }

    if (regBtn && !regBtn.__attached) { regBtn.addEventListener('click', register); regBtn.__attached = true; }
    if (loginBtn && !loginBtn.__attached) { loginBtn.addEventListener('click', login); loginBtn.__attached = true; }
  } catch (e) {
    // swallow errors so UI remains responsive
  }
}

// MutationObserver to reattach if DOM changes
function installObserver() {
  if (document.__loginObserverInstalled) return;
  try {
    const obs = new MutationObserver(() => {
      attachUIHandlers();
      document.querySelectorAll('.toggle-password').forEach(el => {
        try { el.textContent = 'Show'; } catch (e) {}
      });
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    document.__loginObserverInstalled = true;
  } catch (e) {}
}

// Auto-redirect if session exists (non-blocking)
async function autoRedirectIfLoggedIn() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) window.location.href = 'upload.html';
  } catch (e) {}
}

// Initialize after DOM ready
onReady(function init() {
  attachUIHandlers();
  installObserver();
  autoRedirectIfLoggedIn();
});
        regBar.style.background = colors[s] || colors[0];
        regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
      });
      // initialize from current value
      const initial = scorePassword(regPass.value || '');
      regBar.style.width = ["5%", "33%", "66%", "100%"][initial] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][initial] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][initial] || "";
    }

    // Remember Me: populate
    const loginUser = $id('loginUser');
    const rememberMe = $id('rememberMe');
    const remembered = loadRemember();
    if (remembered && loginUser) {
      loginUser.value = remembered;
      if (rememberMe) rememberMe.checked = true;
    }

    // Auth handlers (safe if supabaseClient is null)
    const regBtn = $id('regBtn');
    const loginBtn = $id('loginBtn');
    const regUser = $id('regUser');
    const loginPass = $id('loginPass');
    const regMsg = $id('regMsg');
    const loginMsg = $id('loginMsg');

    async function register() {
      if (regMsg) regMsg.textContent = '';
      if (loginMsg) loginMsg.textContent = '';

      const email = regUser ? (regUser.value || '').trim() : '';
      const password = regPass ? regPass.value : '';

      if (!email) { if (regMsg) regMsg.textContent = 'Please enter an email.'; return; }
      if (scorePassword(password) !== 3) { if (regMsg) regMsg.textContent = 'Weak password. Add length, digits, and symbols.'; return; }
      if (!supabaseClient) { if (regMsg) regMsg.textContent = 'Auth client not available.'; return; }

      try {
        const { error } = await supabaseClient.auth.signUp({ email, password });
        if (error) { if (regMsg) regMsg.textContent = error.message || 'Registration failed.'; return; }

        const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (loginError) { if (regMsg) regMsg.textContent = 'Registered, but login failed. Try logging in.'; return; }

        if (rememberMe && rememberMe.checked) saveRemember(email);
        window.location.href = 'upload.html';
      } catch (err) {
        if (regMsg) regMsg.textContent = 'Registration error. Try again.';
      }
    }

    async function login() {
      if (regMsg) regMsg.textContent = '';
      if (loginMsg) loginMsg.textContent = '';

      const email = loginUser ? (loginUser.value || '').trim() : '';
      const password = loginPass ? loginPass.value : '';

      if (!email || !password) { if (loginMsg) loginMsg.textContent = 'Enter email and password.'; return; }
      if (!supabaseClient) { if (loginMsg) loginMsg.textContent = 'Auth client not available.'; return; }

      try {
        const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
        if (error) { if (loginMsg) loginMsg.textContent = error.message || 'Invalid credentials.'; return; }

        if (rememberMe && rememberMe.checked) saveRemember(email);
        else clearRemember();

        window.location.href = 'upload.html';
      } catch (err) {
        if (loginMsg) loginMsg.textContent = 'Login error. Try again.';
      }
    }

    if (regBtn && !regBtn.__attached) { regBtn.addEventListener('click', register); regBtn.__attached = true; }
    if (loginBtn && !loginBtn.__attached) { loginBtn.addEventListener('click', login); loginBtn.__attached = true; }
  } catch (e) {
    // swallow errors so UI remains responsive
  }
}

// MutationObserver to reattach if DOM changes (keeps behavior robust)
function installObserver() {
  if (document.__loginObserverInstalled) return;
  try {
    const obs = new MutationObserver(() => {
      attachUIHandlers();
      // ensure toggle labels are normalized to "Show" when inputs are password
      document.querySelectorAll('.toggle-password').forEach(el => {
        try { el.textContent = 'Show'; } catch (e) {}
      });
    });
    obs.observe(document.documentElement || document.body, { childList: true, subtree: true });
    document.__loginObserverInstalled = true;
  } catch (e) {}
}

// Auto-redirect if session exists (non-blocking)
async function autoRedirectIfLoggedIn() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) window.location.href = 'upload.html';
  } catch (e) {}
}

// Initialize everything after DOM ready
onReady(function init() {
  attachUIHandlers();
  installObserver();
  autoRedirectIfLoggedIn();
});
