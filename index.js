alert("JS is working");
console.log("External JS is running");
alert("EXTERNAL JS IS NOW RUNNING");

// Supabase setup
const SUPABASE_URL = "https://fohzmnvqgtbwglapojuo.supabase.co";
const SUPABASE_KEY = "sb_publishable_ooSqDRIkzjzbm_4lIyYmuQ_ylutHG77";

const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);

// Elements
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const confirmPassword = document.getElementById("confirmPassword");
const confirmWrap = document.getElementById("confirmWrap");
const strengthBar = document.getElementById("strengthBar");
const strengthText = document.getElementById("strengthText");
const registrationForm = document.getElementById("registrationForm");
const emailVerification = document.getElementById("emailVerification");
const blurOverlay = document.getElementById("blurOverlay");
const regSpinner = document.getElementById("regSpinner");
const loginSpinner = document.getElementById("loginSpinner");
const resendSpinner = document.getElementById("resendSpinner");

const loginForm = document.getElementById("loginForm");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");

const resetPopup = document.getElementById("resetPopup");
const resetEmail = document.getElementById("resetEmail");
const resetSpinner = document.getElementById("resetSpinner");

// Multi-language text dictionary
const i18n = {
  en: {
    title: "User Login & Registration",
    darkMode: "Dark Mode",
    regTitle: "User Registration",
    loginTitle: "User Login",
    passwordHint: "Password must contain 1 capital, 1 number, 4 letters total and 1 special symbol.",
    email: "Email",
    password: "Password",
    confirmPassword: "Confirm Password",
    register: "Register",
    login: "Login",
    remember: "Remember Me",
    verifyTitle: "Email Verification",
    verifyText: "A verification link was sent to your email. Once verified, return and log in.",
    resend: "Resend verification email",
    close: "Close",
    forgot: "Forgot your password?",
    resetTitle: "Reset Password",
    resetText: "Enter your email and we will send you a reset link.",
    sendReset: "Send reset email",
    footerText: "Need help?",
    footerLink: "Contact us here"
  },
  he: {
    title: "התחברות והרשמת משתמש",
    darkMode: "מצב כהה",
    regTitle: "הרשמת משתמש",
    loginTitle: "התחברות משתמש",
    passwordHint: "הסיסמה חייבת לכלול אות גדולה, מספר, 4 אותיות בסך הכל וסימן מיוחד אחד.",
    email: "אימייל",
    password: "סיסמה",
    confirmPassword: "אישור סיסמה",
    register: "הרשמה",
    login: "התחברות",
    remember: "זכור אותי",
    verifyTitle: "אימות אימייל",
    verifyText: "נשלח אליך לינק אימות באימייל. לאחר האימות חזור לכאן והתחבר.",
    resend: "שלח שוב אימייל אימות",
    close: "סגירה",
    forgot: "שכחת סיסמה?",
    resetTitle: "איפוס סיסמה",
    resetText: "הכנס אימייל ונשלח קישור לאיפוס הסיסמה.",
    sendReset: "שליחת אימייל איפוס",
    footerText: "צריך עזרה?",
    footerLink: "צור קשר כאן"
  }
};

function applyLanguage(lang) {
  const dict = i18n[lang] || i18n.en;
  document.documentElement.setAttribute("lang", lang);
  document.documentElement.setAttribute("data-lang", lang);

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });
}

// Language toggle buttons
document.querySelectorAll("[data-lang-btn]").forEach(btn => {
  btn.addEventListener("click", () => {
    const lang = btn.getAttribute("data-lang-btn");
    applyLanguage(lang);
  });
});

// Password strength rules
const specialChars = /[+\×÷=\/_<>

\[\]

!@#£%^&*()\-'":;,?`~\\|{}€$¥₪¤《》¡¿]/;

function checkStrength(pw) {
  let score = 0;

  // One capital
  if (/[A-Z]/.test(pw)) score++;
  // One number
  if (/\d/.test(pw)) score++;
  // One special
  if (specialChars.test(pw)) score++;
  // At least 4 letters total (including the capital)
  if ((pw.match(/[A-Za-z]/g) || []).length >= 4) score++;

  return score;
}

// Password strength bar behavior
regPassword.addEventListener("input", () => {
  const pw = regPassword.value;
  const score = checkStrength(pw);

  const widths = ["25%", "50%", "75%", "100%"];
  const colors = ["#ff4d4d", "#ffcc00", "#66cc66", "#009933"];
  const labels = ["Very Weak", "Weak", "Medium", "Strong"];

  strengthBar.style.width = widths[score - 1] || "10%";
  strengthBar.style.background = colors[score - 1] || "#ff4d4d";
  strengthText.textContent = labels[score - 1] || "Very Weak";

  if (score === 4) {
    confirmWrap.classList.remove("hidden");
  } else {
    confirmWrap.classList.add("hidden");
  }
});

// Password visibility toggle
document.querySelectorAll(".toggle-pass").forEach(t => {
  t.addEventListener("click", () => {
    const target = document.getElementById(t.dataset.target);
    if (!target) return;
    target.type = target.type === "password" ? "text" : "password";
  });
});

// Registration
registrationForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const pw = regPassword.value;
  if (checkStrength(pw) < 4) {
    alert("Password does not meet complexity requirements.");
    return;
  }

  if (regPassword.value !== confirmPassword.value) {
    alert("Passwords do not match");
    return;
  }

  regSpinner.classList.remove("hidden");

  const { error } = await supabase.auth.signUp({
    email: regEmail.value,
    password: regPassword.value
  });

  regSpinner.classList.add("hidden");

  if (error) {
    alert(error.message);
    return;
  }

  blurOverlay.style.display = "block";
  emailVerification.classList.remove("hidden");
});

// Resend verification email
document.getElementById("resendEmail").addEventListener("click", async () => {
  resendSpinner.classList.remove("hidden");
  const email = regEmail.value;
  const { error } = await supabase.auth.resend({
    type: "signup",
    email
  });
  resendSpinner.classList.add("hidden");

  if (error) {
    alert(error.message);
  } else {
    alert("Verification email resent.");
  }
});

// Close verification popup
document.getElementById("closeVerify").addEventListener("click", () => {
  blurOverlay.style.display = "none";
  emailVerification.classList.add("hidden");
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  loginSpinner.classList.remove("hidden");

  const { error } = await supabase.auth.signInWithPassword({
    email: loginEmail.value,
    password: loginPassword.value
  });

  loginSpinner.classList.add("hidden");

  if (error) {
    alert(error.message);
    return;
  }

  if (rememberMe.checked) {
    localStorage.setItem("savedEmail", loginEmail.value);
    localStorage.setItem("savedPassword", loginPassword.value);
  } else {
    localStorage.removeItem("savedEmail");
    localStorage.removeItem("savedPassword");
  }

  alert("Login successful!");
  // Here you’d redirect: location.href = "dashboard.html";
});

// Autofill Remember Me
window.addEventListener("load", () => {
  const savedEmail = localStorage.getItem("savedEmail");
  const savedPassword = localStorage.getItem("savedPassword");
  if (savedEmail) {
    loginEmail.value = savedEmail;
    if (savedPassword) loginPassword.value = savedPassword;
    rememberMe.checked = true;
  }

  // Default language
  applyLanguage("en");
});

// Dark mode toggle
document.getElementById("darkModeToggle").addEventListener("change", (e) => {
  if (e.target.checked) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
});

// Open/close reset popup
document.getElementById("openReset").addEventListener("click", () => {
  blurOverlay.style.display = "block";
  resetPopup.classList.remove("hidden");
});

document.getElementById("closeReset").addEventListener("click", () => {
  blurOverlay.style.display = "none";
  resetPopup.classList.add("hidden");
});

// Send reset email
document.getElementById("sendReset").addEventListener("click", async () => {
  const email = resetEmail.value.trim();
  if (!email) {
    alert("Please enter your email.");
    return;
  }

  resetSpinner.classList.remove("hidden");

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: window.location.origin + "/reset.html"
  });

  resetSpinner.classList.add("hidden");

  if (error) {
    alert(error.message);
  } else {
    alert("If this email exists, a reset link has been sent.");
    blurOverlay.style.display = "none";
    resetPopup.classList.add("hidden");
  }
});
