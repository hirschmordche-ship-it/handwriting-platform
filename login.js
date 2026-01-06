// login.js — wires the UI to Supabase auth and Remember Me
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

// Initialize supabase client safely
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase && typeof supabase.createClient === 'function') {
  try { supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY); }
  catch (e) { console.warn('Supabase init failed', e); supabaseClient = null; }
}

// Helpers
const $id = id => document.getElementById(id);
const $qa = sel => Array.from(document.querySelectorAll(sel));

// Toggle handler
function attachPasswordToggles() {
  const toggles = $qa('.toggle-password');
  toggles.forEach(el => {
    if (el.__attached) return;
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');

    const toggle = () => {
      const targetId = el.dataset && el.dataset.target;
      if (!targetId) return;
      const input = $id(targetId);
      if (!input) return;
      const wasPassword = input.type === 'password';
      input.type = wasPassword ? 'text' : 'password';
      try { el.textContent = wasPassword ? 'Hide' : 'Show'; } catch (e) {}
      el.setAttribute('aria-pressed', wasPassword ? 'true' : 'false');
      try { input.focus({ preventScroll: true }); } catch (e) { input.focus(); }
    };

    el.addEventListener('click', toggle);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
    });

    el.__attached = true;
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

// Remember Me helpers
const REMEMBER_KEY = 'remember_email_v1';
function saveRemember(email) {
  try { localStorage.setItem(REMEMBER_KEY, email || ''); } catch (e) {}
}
function loadRemember() {
  try { return localStorage.getItem(REMEMBER_KEY) || ''; } catch (e) { return ''; }
}
function clearRemember() {
  try { localStorage.removeItem(REMEMBER_KEY); } catch (e) {}
}

// Attach auth handlers and strength bar
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

  // Populate remembered email if present
  const remembered = loadRemember();
  if (remembered) {
    if (loginUser) loginUser.value = remembered;
    if (rememberMe) rememberMe.checked = true;
  }

  // Strength bar
  if (regPass && regBar && regText) {
    regPass.addEventListener("input", e => {
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

      // Auto-login after sign up
      const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (loginError) { if (regMsg) regMsg.textContent = "Registered, but login failed. Try logging in."; return; }

      // Remember email if checkbox checked
      if (rememberMe && rememberMe.checked) saveRemember(email);

      window.location.href = "upload.html";
    } catch (err) {
      console.error('Register error', err);
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

      // Remember email if checked, otherwise clear
      if (rememberMe && rememberMe.checked) saveRemember(email);
      else clearRemember();

      window.location.href = "upload.html";
    } catch (err) {
      console.error('Login error', err);
      if (loginMsg) loginMsg.textContent = "Login error. Check console.";
    }
  }

  const regBtn = $id("regBtn");
  const loginBtn = $id("loginBtn");
  if (regBtn && !regBtn.__attached) { regBtn.addEventListener("click", register); regBtn.__attached = true; }
  if (loginBtn && !loginBtn.__attached) { loginBtn.addEventListener("click", login); loginBtn.__attached = true; }
}

// Auto-redirect if already logged in
async function autoRedirectIfLoggedIn() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) window.location.href = "upload.html";
  } catch (e) { console.warn('autoRedirect error', e); }
}

// Initialize after DOM ready
function init() {
  attachPasswordToggles();
  attachAuthHandlers();
  autoRedirectIfLoggedIn();
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init);
else init();

