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
    "terms.full": `<p><strong>1. Data Usage</strong><br>By using this platform, you agree that handwriting samples may be stored for processing.</p><p><strong>2. Account Deletion</strong><br>Login info is removed, but uploaded images remain for research.</p>`
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
    "password.help": "לפחות 8 תווים, כולל מספרים וסימנים.",
    "modal.ok": "הבנתי",
    strength: {
      tooShort: "קצר מדי",
      weak: "חלשה",
      medium: "בינונית",
      strong: "חזקה",
      complete: "הסיסמה הושלמה"
    },
    show: "הצג",
    hide: "הסתר",
    forgotInfo: "איפוס הסיסמה יתבצע דרך המייל.",
    regTermsMissing: "אנא אשר את תנאי השימוש.",
    regPasswordMismatch: "הסיסמאות אינן תואמות.",
    regPasswordInvalid: "הסיסמה אינה עומדת בדרישות.",
    regStartError: "לא ניתן להתחיל הרשמה. נסה שוב.",
    regVerifyError: "קוד שגוי או שפג תוקפו. נסה שוב.",
    regVerifyPrompt: "הזן את הקוד בן 6 הספרות שנשלח לאימייל שלך.",
    regVerifyTitle: "אימות אימייל",
    loginInvalid: "אנא הזן אימייל וסיסמה.",
    loginError: "ההתחברות נכשלה. בדוק את הפרטים שלך.",
    "footer.text": `צריך עזרה? צרו קשר <a href="contactus.html">כאן</a>`,
    "terms.full": `<p><strong>1. שימוש בנתונים</strong><br>העלאת דוגמאות כתב יד מהווה הסכמה לעיבודן.</p>`
  }
};

// DOM references
const body = document.body;
const tabRegister = document.getElementById("tabRegister");
const tabLogin = document.getElementById("tabLogin");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");
const langToggle = document.getElementById("langToggle");
const modeToggle = document.getElementById("modeToggle");

const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const loginPassword = document.getElementById("loginPassword");
const regStrengthBar = document.getElementById("regStrengthBar");
const regStrengthLabel = document.getElementById("regStrengthLabel");
const regMessages = document.getElementById("regMessages");
const loginMessages = document.getElementById("loginMessages");
const regTerms = document.getElementById("regTerms");
const regEmail = document.getElementById("regEmail");
const loginEmail = document.getElementById("loginEmail");
const rememberMe = document.getElementById("rememberMe");

const modalBackdrop = document.getElementById("modalBackdrop");
const termsBackdrop = document.getElementById("termsBackdrop");
const openTerms = document.getElementById("openTerms");

const verifyBackdrop = document.getElementById("verifyBackdrop");
const verifyClose = document.getElementById("verifyClose");
const verifyTitle = document.getElementById("verifyTitle");
const verifyMessage = document.getElementById("verifyMessage");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySubmit = document.getElementById("verifySubmit");
const verifyMessages = document.getElementById("verifyMessages");

// Modal Close logic
[modalBackdrop, termsBackdrop, verifyBackdrop].forEach(m => {
  m.addEventListener("click", (e) => { if(e.target === m) m.hidden = true; });
});

// Terms logic
openTerms.addEventListener("click", (e) => {
  e.preventDefault();
  const dict = i18n[currentLang];
  document.getElementById("termsText").innerHTML = dict["terms.full"];
  termsBackdrop.hidden = false;
});

// Verification Modal Helper
function openVerifyModal(email) {
  const dict = i18n[currentLang];
  pendingRegisterEmail = email; 
  verifyTitle.textContent = dict.regVerifyTitle;
  verifyMessage.textContent = dict.regVerifyPrompt;
  verifyCodeInput.value = "";
  verifyMessages.textContent = "";
  verifyBackdrop.hidden = false;
}

// Password Strength Logic
function evaluatePassword(password) {
  const hasNum = /\d/.test(password);
  const hasSym = /[^A-Za-z0-9]/.test(password);
  let score = Math.min(password.length, 8) * 10;
  if (hasNum) score += 10;
  if (hasSym) score += 10;
  return { valid: score >= 100, score };
}

function updateStrengthUI(pw) {
  const res = evaluatePassword(pw);
  regStrengthBar.style.width = res.score + "%";
  regStrengthBar.style.background = res.valid ? "var(--success)" : "var(--danger)";
  regStrengthLabel.textContent = i18n[currentLang].strength[res.valid ? "complete" : "weak"];
}

// Strict Button Locking
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

  const btn = document.getElementById("registerButton");
  if (isValid) {
    btn.classList.add("enabled");
  } else {
    btn.classList.remove("enabled");
  }
}

// Listeners
regEmail.addEventListener("input", updateRegisterButtonState);
regPassword.addEventListener("input", (e) => { 
  updateStrengthUI(e.target.value); 
  updateRegisterButtonState(); 
});
regConfirmPassword.addEventListener("input", updateRegisterButtonState);
regTerms.addEventListener("change", updateRegisterButtonState);

// Flow: Register button click triggers email code, THEN opens modal
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("registerButton");
  if (!btn.classList.contains("enabled")) return;

  const email = regEmail.value.trim();
  const password = regPassword.value;

  try {
    btn.disabled = true;
    const res = await fetch("/api/auth/start-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, lang: currentLang })
    });
    if (!res.ok) throw new Error();
    
    // Success: capture email and open modal
    openVerifyModal(email); 
  } catch (err) {
    regMessages.textContent = i18n[currentLang].regStartError;
  } finally {
    btn.disabled = false;
  }
});

// Flow: Verify code inside modal
verifySubmit.addEventListener("click", async () => {
  const code = verifyCodeInput.value.trim();
  if (!code || !pendingRegisterEmail) {
    verifyMessages.textContent = i18n[currentLang].regVerifyError;
    return;
  }

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

// Mode / Lang Helpers
function setMode(mode) {
  body.classList.remove("light-mode", "dark-mode");
  body.classList.add(mode === "dark" ? "dark-mode" : "light-mode");
  localStorage.setItem("themeMode", mode);
}
function setLanguage(lang) {
  currentLang = lang;
  body.classList.remove("ltr", "rtl");
  body.classList.add(lang === "he" ? "rtl" : "ltr");
  localStorage.setItem("authLang", lang);
  // Update texts based on dictionary...
}

function init() {
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;
  verifyBackdrop.hidden = true;
  updateRegisterButtonState();
}
document.addEventListener("DOMContentLoaded", init);
