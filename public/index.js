// Language state
let currentLang = "en";
let pendingRegisterEmail = "";

// ADDED: resend cooldown
let resendTimerInterval = null;
let resendSecondsLeft = 0;

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
    spamHint: "Check your spam folder if you don’t see the email.",
    resend: "Resend code",

    "footer.text": `Need help? Contact us <a href="contactus.html">here</a>`
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
    spamHint: "בדוק גם בתיקיית הספאם.",
    resend: "שלח קוד שוב",

    "footer.text": `צריך עזרה? צרו קשר <a href="contactus.html">כאן</a>`
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
const modeIcon = document.querySelector(".mode-toggle-knob .mode-icon");

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

// Modals
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");

// Terms modal
const termsBackdrop = document.getElementById("termsBackdrop");
const termsClose = document.getElementById("termsClose");
const termsOk = document.getElementById("termsOk");
const termsText = document.getElementById("termsText");
const openTerms = document.getElementById("openTerms");

// Verification modal
const verifyBackdrop = document.getElementById("verifyBackdrop");
const verifyClose = document.getElementById("verifyClose");
const verifyTitle = document.getElementById("verifyTitle");
const verifyMessage = document.getElementById("verifyMessage");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySubmit = document.getElementById("verifySubmit");
const verifyMessages = document.getElementById("verifyMessages");

// ADDED elements (must exist in HTML)
const resendBtn = document.getElementById("resendCode");
const resendCountdown = document.getElementById("resendCountdown");
const spamHintEl = document.getElementById("spamHint");

// ---------- VERIFY MODAL ----------
function openVerifyModal(email) {
  const dict = i18n[currentLang];
  pendingRegisterEmail = email;

  verifyTitle.textContent = dict.regVerifyTitle;
  verifyMessage.textContent = dict.regVerifyPrompt;
  verifyCodeInput.value = "";
  verifyMessages.textContent = "";
  verifyBackdrop.hidden = false;
  verifyBackdrop.classList.remove("verify-success");

  if (spamHintEl) spamHintEl.textContent = dict.spamHint;
  if (resendBtn) resendBtn.textContent = dict.resend;

  startResendCooldown();
  verifyCodeInput.focus();
}

function closeVerifyModal() {
  verifyBackdrop.hidden = true;
  pendingRegisterEmail = "";
}

verifyClose.addEventListener("click", closeVerifyModal);

// ---------- RESEND ----------
function startResendCooldown() {
  resendSecondsLeft = 180;
  if (resendBtn) resendBtn.classList.add("disabled");

  resendTimerInterval = setInterval(() => {
    resendSecondsLeft--;
    if (resendCountdown) {
      const m = Math.floor(resendSecondsLeft / 60);
      const s = resendSecondsLeft % 60;
      resendCountdown.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    }

    if (resendSecondsLeft <= 0) {
      clearInterval(resendTimerInterval);
      if (resendBtn) resendBtn.classList.remove("disabled");
      if (resendCountdown) resendCountdown.textContent = "";
    }
  }, 1000);
}

if (resendBtn) {
  resendBtn.addEventListener("click", async () => {
    if (resendSecondsLeft > 0) return;

    await fetch("/api/auth/start-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: pendingRegisterEmail,
        password: regPassword.value,
        lang: currentLang
      })
    });

    startResendCooldown();
  });
}

// ---------- AUTO SUBMIT ON 6 DIGITS ----------
verifyCodeInput.addEventListener("input", () => {
  verifyMessages.textContent = "";
  if (/^\d{6}$/.test(verifyCodeInput.value)) {
    verifySubmit.click();
  }
});

// ---------- VERIFY ----------
verifySubmit.addEventListener("click", async () => {
  const dict = i18n[currentLang];
  verifyMessages.textContent = "";

  const code = verifyCodeInput.value.trim();
  if (!pendingRegisterEmail || !code) return;

  verifySubmit.disabled = true;

  try {
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingRegisterEmail, code })
    });

    const data = await res.json();
    if (!data.success) {
      verifyMessages.textContent = dict.regVerifyError;
      return;
    }

    // SUCCESS ANIMATION
    verifyBackdrop.classList.add("verify-success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);

  } catch {
    verifyMessages.textContent = dict.regVerifyError;
  } finally {
    verifySubmit.disabled = false;
  }
});

// ---------- INIT ----------
document.addEventListener("DOMContentLoaded", () => {
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;
  verifyBackdrop.hidden = true;
});
