// --- Minimal, non-invasive patch ---
// Paste this at the very top of login.js (before any other code).
// It uses event-delegation so Show/Hide always works and attaches the strength bar handler after DOM ready.
// It is idempotent and will not change your HTML or CSS.

(function () {
  if (window.__login_patch_installed) return;
  window.__login_patch_installed = true;

  const $id = id => document.getElementById(id);

  // Event-delegation for Show/Hide (works even if other code errors or runs early)
  function toggleHandler(ev) {
    const el = ev.target;
    if (!el || !el.classList) return;
    if (!el.classList.contains('toggle-password')) return;
    const targetId = el.dataset && el.dataset.target;
    if (!targetId) return;
    const input = $id(targetId);
    if (!input) return;
    const wasPassword = input.type === 'password';
    input.type = wasPassword ? 'text' : 'password';
    try { el.textContent = wasPassword ? 'Hide' : 'Show'; } catch (e) {}
    try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
  }

  // Strength bar updater (safe attach)
  function attachStrength() {
    const regPass = $id('regPass');
    const regBar = $id('regBar');
    const regText = $id('regText');
    if (!regPass || !regBar || !regText) return;

    function score(p) {
      let s = 0;
      if (!p) return 0;
      if (p.length >= 6) s++;
      if ((p.match(/[a-z]/gi) || []).length >= 2) s++;
      if (/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"'<>,.?/]/.test(p)) s++;
      return s;
    }

    // avoid attaching twice
    if (regPass.__strengthAttached) return;
    regPass.__strengthAttached = true;

    regPass.addEventListener('input', function (e) {
      const s = score(e.target.value);
      regBar.style.width = ["5%", "33%", "66%", "100%"][s] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][s] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
    });
  }

  // Ensure initial toggle labels reflect input type (Show)
  function normalizeToggleLabels() {
    document.querySelectorAll('.toggle-password').forEach(el => {
      try { el.textContent = 'Show'; } catch (e) {}
    });
  }

  function initPatch() {
    normalizeToggleLabels();
    attachStrength();
    // attach delegation once
    if (!document.__toggleDelegation) {
      document.addEventListener('click', toggleHandler, { passive: true });
      document.addEventListener('keydown', function (ev) {
        if (ev.key !== 'Enter' && ev.key !== ' ') return;
        const el = ev.target;
        if (!el || !el.classList) return;
        if (!el.classList.contains('toggle-password')) return;
        ev.preventDefault();
        el.click();
      });
      document.__toggleDelegation = true;
    }
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initPatch);
  else initPatch();
})();
// Robust login.js for Vercel + Supabase
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

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
const REMEMBER_KEY = 'remember_email_v1';
const saveRemember = email => { try { localStorage.setItem(REMEMBER_KEY, email || ''); } catch (e) {} };
const loadRemember = () => { try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch (e) { return ''; } };
const clearRemember = () => { try { localStorage.removeItem(REMEMBER_KEY); } catch (e) {} };

// Event delegation for Show/Hide toggle (guaranteed to work)
function enableToggleDelegation() {
  document.addEventListener('click', function (ev) {
    const el = ev.target;
    if (!el || !el.classList) return;
    if (!el.classList.contains('toggle-password')) return;
    const targetId = el.dataset && el.dataset.target;
    if (!targetId) return;
    const input = $id(targetId);
    if (!input) return;
    const wasPassword = input.type === 'password';
    input.type = wasPassword ? 'text' : 'password';
    try { el.textContent = wasPassword ? 'Hide' : 'Show'; } catch (e) {}
    try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
  }, { passive: true });

  document.addEventListener('keydown', function (ev) {
    if (ev.key !== 'Enter' && ev.key !== ' ') return;
    const el = ev.target;
    if (!el || !el.classList) return;
    if (!el.classList.contains('toggle-password')) return;
    ev.preventDefault();
    el.click();
  });
}

// Password strength scoring
function score(p) {
  let s = 0;
  if (!p) return 0;
  if (p.length >= 6) s++;
  if ((p.match(/[a-z]/gi) || []).length >= 2) s++;
  if (/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"'<>,.?/]/.test(p)) s++;
  return s;
}

// Attach auth handlers and UI wiring
function attachAuthHandlers() {
  const regUser = $id("regUser");
  const regPass = $id("regPass");
  const regBar = $id("regBar");
  const regText = $id("regText");
  const regMsg = $id("regMsg");

  const loginUser = $id("loginUser");
  const loginPass = $id("loginPass");
  const loginMsg = $id("loginMsg");
  const rememberMe = $id("rememberMe");

  const remembered = loadRemember();
  if (remembered && loginUser) { loginUser.value = remembered; if (rememberMe) rememberMe.checked = true; }

  if (regPass && regBar && regText) {
    regPass.addEventListener('input', e => {
      const s = score(e.target.value);
      regBar.style.width = ["5%", "33%", "66%", "100%"][s] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][s] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
    });
  }

  async function register() {
    if (regMsg) regMsg.textContent = "";
    if (loginMsg) loginMsg.textContent = "";

    const email = regUser ? (regUser.value || "").trim() : "";
    const password = regPass ? regPass.value : "";

    if (!email) { if (regMsg) regMsg.textContent = "Please enter an email."; return; }
    if (score(password) !== 3) { if (regMsg) regMsg.textContent = "Weak password. Add length, digits, and symbols."; return; }
    if (!supabaseClient) { if (regMsg) regMsg.textContent = "Auth client not available."; return; }

    try {
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) { if (regMsg) regMsg.textContent = error.message || "Registration failed."; return; }

      const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (loginError) { if (regMsg) regMsg.textContent = "Registered, but login failed. Try logging in."; return; }

      if (rememberMe && rememberMe.checked) saveRemember(email);
      window.location.href = "upload.html";
    } catch (err) {
      if (regMsg) regMsg.textContent = "Registration error. Check console.";
    }
  }

  async function login() {
    if (regMsg) regMsg.textContent = "";
    if (loginMsg) loginMsg.textContent = "";

    const email = loginUser ? (loginUser.value || "").trim() : "";
    const password = loginPass ? loginPass.value : "";

    if (!email || !password) { if (loginMsg) loginMsg.textContent = "Enter email and password."; return; }
    if (!supabaseClient) { if (loginMsg) loginMsg.textContent = "Auth client not available."; return; }

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) { if (loginMsg) loginMsg.textContent = error.message || "Invalid credentials."; return; }

      if (rememberMe && rememberMe.checked) saveRemember(email);
      else clearRemember();

      window.location.href = "upload.html";
    } catch (err) {
      if (loginMsg) loginMsg.textContent = "Login error. Check console.";
    }
  }

  const regBtn = $id("regBtn");
  const loginBtn = $id("loginBtn");
  if (regBtn && !regBtn.__attached) { regBtn.addEventListener('click', register); regBtn.__attached = true; }
  if (loginBtn && !loginBtn.__attached) { loginBtn.addEventListener('click', login); loginBtn.__attached = true; }
}

// Auto-redirect if already logged in
async function autoRedirectIfLoggedIn() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) window.location.href = "upload.html";
  } catch (e) {}
}

// Initialize
function initLogin() {
  enableToggleDelegation();
  attachAuthHandlers();
  autoRedirectIfLoggedIn();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', initLogin);
else initLogin();
