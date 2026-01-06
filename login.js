// login.js — complete, replace existing file

// --- Supabase setup (UMD global client) ---
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Element references (resolved on DOM ready) ---
let regUser, regPass, regBar, regText, regMsg;
let loginUser, loginPass, loginMsg;

// --- Password strength scoring ---
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

// --- Attach accessible password toggles ---
function attachPasswordToggles() {
  const toggles = document.querySelectorAll('.toggle-password');
  if (!toggles) return;
  toggles.forEach(el => {
    el.setAttribute('role', 'button');
    el.setAttribute('tabindex', '0');
    el.setAttribute('aria-pressed', 'false');

    const handler = () => {
      const targetId = el.dataset.target;
      if (!targetId) {
        console.warn('toggle-password missing data-target', el);
        return;
      }
      const input = document.getElementById(targetId);
      if (!input) {
        console.warn('toggle-password target not found:', targetId);
        return;
      }
      const isHidden = input.type === 'password';
      input.type = isHidden ? 'text' : 'password';
      el.textContent = isHidden ? 'Hide' : 'Show';
      el.setAttribute('aria-pressed', isHidden ? 'true' : 'false');
      input.focus();
    };

    el.addEventListener('click', handler);
    el.addEventListener('keydown', e => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        handler();
      }
    });
  });
}

// --- Initialize page after DOM ready ---
function initLoginPage() {
  regUser = document.getElementById("regUser");
  regPass = document.getElementById("regPass");
  regBar = document.getElementById("regBar");
  regText = document.getElementById("regText");
  regMsg = document.getElementById("regMsg");

  loginUser = document.getElementById("loginUser");
  loginPass = document.getElementById("loginPass");
  loginMsg = document.getElementById("loginMsg");

  attachPasswordToggles();

  if (regPass && regBar && regText) {
    regPass.addEventListener("input", e => {
      const s = score(e.target.value);
      regBar.style.width = ["5%", "33%", "66%", "100%"][s] || "5%";
      regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][s] || "#eee";
      regText.textContent = ["", "Weak", "Medium", "Strong"][s] || "";
    });
  }

  const regBtn = document.getElementById("regBtn");
  const loginBtn = document.getElementById("loginBtn");
  if (regBtn) regBtn.addEventListener("click", register);
  if (loginBtn) loginBtn.addEventListener("click", login);

  autoRedirectIfLoggedIn();
}

// --- Registration handler ---
async function register() {
  if (regMsg) regMsg.textContent = "";
  if (loginMsg) loginMsg.textContent = "";

  const email = regUser ? regUser.value.trim() : "";
  const password = regPass ? regPass.value : "";

  if (!email) {
    if (regMsg) regMsg.textContent = "Please enter an email.";
    return;
  }

  if (score(password) !== 3) {
    if (regMsg) regMsg.textContent = "Weak password. Add length, digits, and symbols.";
    return;
  }

  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    if (regMsg) regMsg.textContent = error.message || "Registration failed.";
    return;
  }

  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    if (regMsg) regMsg.textContent = "Registered, but login failed. Try logging in.";
    return;
  }

  window.location.href = "upload.html";
}

// --- Login handler ---
async function login() {
  if (regMsg) regMsg.textContent = "";
  if (loginMsg) loginMsg.textContent = "";

  const email = loginUser ? loginUser.value.trim() : "";
  const password = loginPass ? loginPass.value : "";

  if (!email || !password) {
    if (loginMsg) loginMsg.textContent = "Enter email and password.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    if (loginMsg) loginMsg.textContent = error.message || "Invalid credentials.";
    return;
  }

  window.location.href = "upload.html";
}

// --- Auto redirect if already logged in ---
async function autoRedirectIfLoggedIn() {
  try {
    const { data } = await supabaseClient.auth.getSession();
    if (data && data.session) {
      window.location.href = "upload.html";
    }
  } catch (e) {
    console.warn('autoRedirectIfLoggedIn error', e);
  }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initLoginPage);
} else {
  initLoginPage();
}

