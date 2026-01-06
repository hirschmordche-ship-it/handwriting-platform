// login.js — non-invasive, preserves your HTML/layout but fixes toggle timing and errors

// Supabase config (keeps your original keys)
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

// Create supabase client only if the global is available to avoid throwing
let supabaseClient = null;
if (typeof supabase !== 'undefined' && supabase && supabase.createClient) {
  try {
    supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    // fail silently — we still want the rest of the script to run
    console.warn('Supabase client init failed', e);
    supabaseClient = null;
  }
}

// Safe DOM query helper
function $q(sel) {
  try { return document.querySelector(sel); } catch (e) { return null; }
}
function $qa(sel) {
  try { return Array.from(document.querySelectorAll(sel)); } catch (e) { return []; }
}

// Attach password toggle handlers (safe, id matching required)
function attachPasswordToggles() {
  const toggles = $qa('.toggle-password');
  if (!toggles.length) return;
  toggles.forEach(el => {
    // make accessible
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-pressed', 'false');

    const handler = () => {
      const targetId = el.dataset && el.dataset.target;
      if (!targetId) return;
      const input = document.getElementById(targetId);
      if (!input) return;
      const wasPassword = input.type === 'password';
      input.type = wasPassword ? 'text' : 'password';
      // update visible label text but do not change layout
      try { el.textContent = wasPassword ? 'Hide' : 'Show'; } catch (e) {}
      el.setAttribute('aria-pressed', wasPassword ? 'true' : 'false');
      input.focus();
    };

    // Avoid attaching duplicate handlers
    if (!el.__toggleAttached) {
      el.addEventListener('click', handler);
      el.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handler();
        }
      });
      el.__toggleAttached = true;
    }
  });
}

// Password strength scoring (unchanged behavior)
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

// Wire up registration and login handlers without changing markup
function attachAuthHandlers() {
  const regUser = document.getElementById("regUser");
  const regPass = document.getElementById("regPass");
  const regBar = document.getElementById("regBar");
  const regText = document.getElementById("regText");
  const regMsg = document.getElementById("regMsg");

  const loginUser = document.getElementById("loginUser");
  const loginPass = document.getElementById("loginPass");
  const loginMsg = document.getElementById("loginMsg");

  // Strength bar update (if elements exist)
  if (regPass && regBar && regText) {
    regPass.addEventListener("input", e => {
      const s = score(e.target.value);
      regBar.style.width = ["5%", "33%", "66%", "100%"][s] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][s] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
    });
  }

  // Register function (safe: checks supabaseClient)
  async function register() {
    if (regMsg) regMsg.textContent = "";
    if (loginMsg) loginMsg.textContent = "";

    const email = regUser ? (regUser.value || "").trim() : "";
    const password = regPass ? regPass.value : "";

    if (!email) {
      if (regMsg) regMsg.textContent = "Please enter an email.";
      return;
    }

    if (score(password) !== 3) {
      if (regMsg) regMsg.textContent = "Weak password. Add length, digits, and symbols.";
      return;
    }

    if (!supabaseClient) {
      if (regMsg) regMsg.textContent = "Auth client not available.";
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signUp({ email, password });
      if (error) {
        if (regMsg) regMsg.textContent = error.message || "Registration failed.";
        return;
      }

      const { error: loginError } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (loginError) {
        if (regMsg) regMsg.textContent = "Registered, but login failed. Try logging in.";
        return;
      }

      window.location.href = "upload.html";
    } catch (err) {
      console.error('Register error', err);
      if (regMsg) regMsg.textContent = "Registration error. Check console.";
    }
  }

  // Login function
  async function login() {
    if (regMsg) regMsg.textContent = "";
    if (loginMsg) loginMsg.textContent = "";

    const email = loginUser ? (loginUser.value || "").trim() : "";
    const password = loginPass ? loginPass.value : "";

    if (!email || !password) {
      if (loginMsg) loginMsg.textContent = "Enter email and password.";
      return;
    }

    if (!supabaseClient) {
      if (loginMsg) loginMsg.textContent = "Auth client not available.";
      return;
    }

    try {
      const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
      if (error) {
        if (loginMsg) loginMsg.textContent = error.message || "Invalid credentials.";
        return;
      }
      window.location.href = "upload.html";
    } catch (err) {
      console.error('Login error', err);
      if (loginMsg) loginMsg.textContent = "Login error. Check console.";
    }
  }

  // Attach click handlers if buttons exist
  const regBtn = document.getElementById("regBtn");
  const loginBtn = document.getElementById("loginBtn");
  if (regBtn && !regBtn.__authAttached) {
    regBtn.addEventListener("click", register);
    regBtn.__authAttached = true;
  }
  if (loginBtn && !loginBtn.__authAttached) {
    loginBtn.addEventListener("click", login);
    loginBtn.__authAttached = true;
  }
}

// Auto-redirect check (safe)
async function autoRedirectIfLoggedIn() {
  if (!supabaseClient) return;
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) {
      window.location.href = "upload.html";
    }
  } catch (e) {
    console.warn('autoRedirectIfLoggedIn error', e);
  }
}

// Initialize everything after DOM is ready
function initLoginScript() {
  attachPasswordToggles();
  attachAuthHandlers();
  autoRedirectIfLoggedIn();
}

// Ensure we run after DOM is ready and avoid throwing if script loaded early
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginScript);
} else {
  initLoginScript();
}

