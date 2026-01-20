// Language state
let currentLang = "en";
let pendingRegisterEmail = "";

// i18n dictionary
const i18n = {
  en: {
    "register.title": "Create account",
    "register.emailLabel": "Email",
    "register.emailPlaceholder": "you@example.com",
    "register.passwordLabel": "Password",
    "register.passwordPlaceholder": "Password",
    "register.confirmLabel": "Confirm password",
    "register.confirmPlaceholder": "Confirm password",
    "register.terms.before": "I agree to the",
    "register.terms.word": "terms",
    "register.terms.after": ".",
    "register.submit": "Register",
    "login.title": "Welcome back",
    "login.emailLabel": "Email",
    "login.emailPlaceholder": "you@example.com",
    "login.passwordLabel": "Password",
    "login.passwordPlaceholder": "Password",
    "login.remember": "Remember me",
    "login.forgot": "Forgot password?",
    "login.submit": "Login",
    "password.help": "Minimum 8 characters, with numbers and symbols.",
    "modal.ok": "OK",
    strength: {
      tooShort: "Too short",
      weak: "Weak",
      medium: "Medium",
      strong: "Strong",
      complete: "Password complete"
    },
    show: "Show",
    hide: "Hide",
    forgotInfo: "Password reset will be handled via email.",
    regTermsMissing: "Please agree to the terms.",
    regPasswordMismatch: "Passwords do not match.",
    regPasswordInvalid: "Password does not meet the requirements.",
    regStartError: "Could not start registration. Please try again.",
    regVerifyError: "Invalid or expired code. Please try again.",
    regVerifyPrompt: "Enter the 6-digit code we sent to your email.",
    regVerifyTitle: "Verify your email",
    loginInvalid: "Please enter email and password.",
    loginError: "Login failed. Please check your details.",
    "footer.text": `Need help? Contact us <a href="contactus.html">here</a>`,
    "terms.full": `<p><strong>1. Data Usage</strong><br>By using this platform, you agree that handwriting samples may be stored for processing.</p>`
  },
  he: {
    "register.title": "יצירת חשבון",
    "register.emailLabel": "אימייל",
    "register.emailPlaceholder": "name@domain.com",
    "register.passwordLabel": "סיסמה",
    "register.passwordPlaceholder": "סיסמה",
    "register.confirmLabel": "אישור סיסמה",
    "register.confirmPlaceholder": "אישור סיסמה",
    "register.terms.before": "אני מאשר את",
    "register.terms.word": "תנאים",
    "register.terms.after": ".",
    "register.submit": "הרשמה",
    "login.title": "ברוך שובך",
    "login.emailLabel": "אימייל",
    "login.emailPlaceholder": "name@domain.com",
    "login.passwordLabel": "סיסמה",
    "login.passwordPlaceholder": "סיסמה",
    "login.remember": "זכור אותי",
    "login.forgot": "שכחת סיסמה?",
    "login.submit": "התחברות",
    strength: { tooShort: "קצר מדי", weak: "חלשה", medium: "בינונית", strong: "חזקה", complete: "הסיסמה הושלמה" },
    show: "הצג",
    hide: "הסתר",
    forgotInfo: "איפוס הסיסמה יתבצע דרך המייל.",
    regVerifyError: "קוד שגוי או שפג תוקפו. נסה שוב.",
    regVerifyTitle: "אימות אימייל",
    loginError: "ההתחברות נכשלה. בדוק את הפרטים שלך.",
    "footer.text": `צריך עזרה? צרו קשר <a href="contactus.html">כאן</a>`,
    "terms.full": `<p><strong>1. שימוש בנתונים</strong><br>העלאת דוגמאות כתב יד מהווה הסכמה לעיבודן.</p>`
  }
};

// DOM references
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const regTerms = document.getElementById("regTerms");
const regEmail = document.getElementById("regEmail");
const registerButton = document.getElementById("registerButton");

const modalBackdrop = document.getElementById("modalBackdrop");
const termsBackdrop = document.getElementById("termsBackdrop");
const verifyBackdrop = document.getElementById("verifyBackdrop");

const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySubmit = document.getElementById("verifySubmit");
const verifyMessages = document.getElementById("verifyMessages");

// --- Logic ---

function evaluatePassword(password) {
  const hasNum = /\d/.test(password);
  const hasSym = /[^A-Za-z0-9]/.test(password);
  let score = Math.min(password.length, 8) * 10;
  if (hasNum) score += 10;
  if (hasSym) score += 10;
  return { valid: score >= 100, score };
}

function updateRegisterButtonState() {
  const emailVal = regEmail.value.trim();
  const passVal = regPassword.value;
  const confVal = regConfirmPassword.value;
  const evaluation = evaluatePassword(passVal);
  
  const isValid = 
    emailVal.includes("@") && 
    evaluation.valid && 
    passVal === confVal && 
    regTerms.checked;

  registerButton.classList.toggle("enabled", isValid);
}

// Event Listeners for Validation
[regEmail, regPassword, regConfirmPassword, regTerms].forEach(el => {
  el.addEventListener("input", updateRegisterButtonState);
  el.addEventListener("change", updateRegisterButtonState);
});

// Register Submission
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  if (!registerButton.classList.contains("enabled")) return;

  const email = regEmail.value.trim();
  const password = regPassword.value;

  try {
    registerButton.disabled = true;
    const res = await fetch("/api/auth/start-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, lang: currentLang })
    });
    
    if (res.ok) {
      pendingRegisterEmail = email; // Capture for verification step
      verifyBackdrop.hidden = false; // Open Modal ONLY NOW
    } else {
      throw new Error();
    }
  } catch (err) {
    document.getElementById("regMessages").textContent = i18n[currentLang].regStartError;
  } finally {
    registerButton.disabled = false;
  }
});

// Verification Submission
verifySubmit.addEventListener("click", async () => {
  const code = verifyCodeInput.value.trim();
  if (!code || !pendingRegisterEmail) return;

  try {
    verifySubmit.disabled = true;
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingRegisterEmail, code })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = "dashboard.html";
    } else {
      verifyMessages.textContent = i18n[currentLang].regVerifyError;
    }
  } catch (err) {
    verifyMessages.textContent = i18n[currentLang].regVerifyError;
  } finally {
    verifySubmit.disabled = false;
  }
});

// Initialization
function init() {
  // Ensure everything is hidden on load
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;
  verifyBackdrop.hidden = true;
  
  updateRegisterButtonState();
}
document.addEventListener("DOMContentLoaded", init);
