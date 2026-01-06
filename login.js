// --- Supabase setup (UMD global client) ---
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_ANON_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

// IMPORTANT: UMD exposes "supabase" directly, not window.supabase
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

// --- Elements ---
const regUser = document.getElementById("regUser");
const regPass = document.getElementById("regPass");
const regBar = document.getElementById("regBar");
const regText = document.getElementById("regText");
const regMsg = document.getElementById("regMsg");

const loginUser = document.getElementById("loginUser");
const loginPass = document.getElementById("loginPass");
const loginMsg = document.getElementById("loginMsg");

// --- Password toggle ---
document.querySelectorAll(".toggle-password").forEach(el => {
  el.addEventListener("click", () => {
    const target = document.getElementById(el.dataset.target);
    if (!target) return;
    const isHidden = target.type === "password";
    target.type = isHidden ? "text" : "password";
    el.textContent = isHidden ? "Hide" : "Show";
  });
});

// --- Strength scoring ---
function score(p) {
  let s = 0;
  if (p.length >= 6) s++;
  if ((p.match(/[a-z]/gi) || []).length >= 2) s++;
  if (/[!@#$%^&*()_\-+=

\[\]

{}|\\:;"'<>,.?/]/.test(p)) s++;
  return s;
}

// --- Strength bar update ---
regPass.addEventListener("input", e => {
  const s = score(e.target.value);
  regBar.style.width = ["5%", "33%", "66%", "100%"][s];
  regBar.style.background = ["#eee", "#ffe066", "#ffd166", "#2d6a4f"][s];
  regText.textContent = ["", "Weak", "Medium", "Strong"][s];
});

// --- Registration ---
async function register() {
  regMsg.textContent = "";
  loginMsg.textContent = "";

  const email = regUser.value.trim();
  const password = regPass.value;

  if (!email) {
    regMsg.textContent = "Please enter an email.";
    return;
  }

  if (score(password) !== 3) {
    regMsg.textContent = "Weak password. Add length, digits, and symbols.";
    return;
  }

  const { error } = await supabaseClient.auth.signUp({ email, password });
  if (error) {
    regMsg.textContent = error.message || "Registration failed.";
    return;
  }

  const { error: loginError } = await supabaseClient.auth.signInWithPassword({
    email,
    password
  });

  if (loginError) {
    regMsg.textContent = "Registered, but login failed. Try logging in.";
    return;
  }

  window.location.href = "upload.html";
}

// --- Login ---
async function login() {
  regMsg.textContent = "";
  loginMsg.textContent = "";

  const email = loginUser.value.trim();
  const password = loginPass.value;

  if (!email || !password) {
    loginMsg.textContent = "Enter email and password.";
    return;
  }

  const { error } = await supabaseClient.auth.signInWithPassword({ email, password });
  if (error) {
    loginMsg.textContent = error.message || "Invalid credentials.";
    return;
  }

  window.location.href = "upload.html";
}

// --- Auto redirect if already logged in ---
async function autoRedirectIfLoggedIn() {
  const { data } = await supabaseClient.auth.getSession();
  if (data.session) {
    window.location.href = "upload.html";
  }
}

document.getElementById("regBtn").addEventListener("click", register);
document.getElementById("loginBtn").addEventListener("click", login);

window.onload = autoRedirectIfLoggedIn;
