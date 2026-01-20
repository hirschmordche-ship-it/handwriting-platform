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

    "terms.full": `
<p><strong>1. Data Usage</strong><br>
By using this platform, you agree that any handwriting samples, glyphs, or uploaded images may be stored and processed for analysis, improvement of the service, and security purposes.</p>

<p><strong>2. Account Deletion</strong><br>
If you delete your account, your login information will be removed. However, <strong>your uploaded images, handwriting samples, and glyphs will remain stored permanently</strong> for research, training, and platform improvement.</p>

<p><strong>3. User Responsibilities</strong><br>
You agree not to upload harmful, illegal, or copyrighted material without permission.</p>

<p><strong>4. Platform Rights</strong><br>
We may update or modify the service at any time.</p>

<p><strong>5. Contact and Support</strong><br>
If you have questions, issues, or need assistance, you can reach us through our <a href="contactus.html">contact page</a>.</p>
`
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

    "terms.full": `
<p><strong>1. שימוש בנתונים</strong><br>
בשימושך בפלטפורמה זו, אתה מסכים שכל דוגמאות הכתב־יד, הגליפים או התמונות שאתה מעלה עשויים להישמר ולעבור עיבוד לצורך ניתוח, שיפור השירות, אבטחה ומחקר.</p>

<p><strong>2. מחיקת חשבון</strong><br>
אם תמחק את חשבונך, פרטי ההתחברות שלך יימחקו. עם זאת, 
<strong>כל התמונות, דוגמאות הכתב־יד והגליפים שהעלית יישארו שמורים לצמיתות</strong> 
לצורך מחקר, שיפור המערכת, אימון מודלים ושמירה על איכות השירות.</p>

<p><strong>3. אחריות המשתמש</strong><br>
אתה מתחייב שלא להעלות תוכן בלתי חוקי, פוגעני, או חומר המוגן בזכויות יוצרים ללא הרשאה.</p>

<p><strong>4. זכויות הפלטפורמה</strong><br>
אנו רשאים לעדכן, לשנות או להפסיק את השירות בכל עת.</p>

<p><strong>5. יצירת קשר ותמיכה</strong><br>
לשאלות, בעיות או צורך בעזרה — ניתן לפנות אלינו דרך <a href="contactus.html">דף יצירת הקשר</a>.</p>
`
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

const termsBackdrop = document.getElementById("termsBackdrop");
const termsClose = document.getElementById("termsClose");
const termsOk = document.getElementById("termsOk");
const termsText = document.getElementById("termsText");
const openTerms = document.getElementById("openTerms");

const verifyBackdrop = document.getElementById("verifyBackdrop");
const verifyClose = document.getElementById("verifyClose");
const verifyTitle = document.getElementById("verifyTitle");
const verifyMessage = document.getElementById("verifyMessage");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySubmit = document.getElementById("verifySubmit");
const verifyMessages = document.getElementById("verifyMessages");

// Modal helpers
function openModal(title, message) {
  modalTitle.textContent = title;
  modalBody.textContent = message;
  modalBackdrop.hidden = false;
}

function closeModal() { modalBackdrop.hidden = true; }
modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => { if (e.target === modalBackdrop) closeModal(); });

// Terms modal
openTerms.addEventListener("click", () => {
  const dict = i18n[currentLang];
  termsText.innerHTML = dict["terms.full"];
  termsBackdrop.hidden = false;
});
function closeTerms() { termsBackdrop.hidden = true; }
termsClose.addEventListener("click", closeTerms);
termsOk.addEventListener("click", closeTerms);
termsBackdrop.addEventListener("click", (e) => { if (e.target === termsBackdrop) closeTerms(); });

// Verification modal
function openVerifyModal(email) {
  const dict = i18n[currentLang];
  pendingRegisterEmail = email;
  verifyTitle.textContent = dict.regVerifyTitle;
  verifyMessage.textContent = dict.regVerifyPrompt;
  verifyCodeInput.value = "";
  verifyMessages.textContent = "";
  verifyBackdrop.hidden = false;
  verifyCodeInput.focus();
}
function closeVerifyModal() { verifyBackdrop.hidden = true; pendingRegisterEmail = ""; }
verifyClose.addEventListener("click", closeVerifyModal);
verifyBackdrop.addEventListener("click", (e) => { if (e.target === verifyBackdrop) closeVerifyModal(); });

// Tabs
function setActiveTab(tab) {
  if (tab === "register") {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.classList.add("active");
    loginForm.classList.remove("active");
  } else {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.classList.add("active");
    registerForm.classList.remove("active");
  }
}
tabRegister.addEventListener("click", () => setActiveTab("register"));
tabLogin.addEventListener("click", () => setActiveTab("login"));

// Theme/Lang Logic
function setMode(mode) {
  body.classList.remove("light-mode", "dark-mode");
  if (mode === "dark") {
    body.classList.add("dark-mode");
    modeToggle.classList.add("dark-active");
    if (modeIcon) modeIcon.textContent = "🌙";
  } else {
    body.classList.add("light-mode");
    modeToggle.classList.remove("dark-active");
    if (modeIcon) modeIcon.textContent = "☀️";
  }
  localStorage.setItem("themeMode", mode);
}
modeToggle.addEventListener("click", () => setMode(body.classList.contains("dark-mode") ? "light" : "dark"));

function setLanguage(lang) {
  currentLang = lang;
  body.classList.remove("ltr", "rtl");
  body.classList.add(lang === "he" ? "rtl" : "ltr");
  document.documentElement.lang = lang;
  langToggle.className = `lang-toggle-pill lang-${lang}`;
  
  const dict = i18n[lang];
  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) el.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) el.placeholder = dict[key];
  });
  const footer = document.getElementById("footerText");
  if (footer) footer.innerHTML = dict["footer.text"];
  localStorage.setItem("authLang", lang);
}
langToggle.addEventListener("click", () => setLanguage(currentLang === "en" ? "he" : "en"));

// Password Strength
function evaluatePassword(password) {
  const minLength = 8;
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9\u0590-\u05FF]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  let score = (Math.min(password.length, minLength) / minLength) * 50;
  if (hasNumber) score += 20;
  if (hasSymbol) score += 20;
  if (hasUppercase) score += 10;
  return { valid: score >= 100, score: Math.min(score, 100) };
}

function updateStrengthUI(password) {
  const result = evaluatePassword(password);
  regStrengthBar.style.width = result.score + "%";
  regStrengthBar.style.background = result.valid ? "var(--success)" : "var(--danger)";
  regStrengthLabel.textContent = i18n[currentLang].strength[result.valid ? "complete" : "weak"];
}

function updateRegisterButtonState() {
  const btn = document.getElementById("registerButton");
  const isValid = evaluatePassword(regPassword.value).valid && 
                  regPassword.value === regConfirmPassword.value && 
                  regTerms.checked;
  isValid ? btn.classList.add("enabled") : btn.classList.remove("enabled");
}

regPassword.addEventListener("input", (e) => { updateStrengthUI(e.target.value); updateRegisterButtonState(); });
regConfirmPassword.addEventListener("input", updateRegisterButtonState);
regTerms.addEventListener("change", updateRegisterButtonState);

// FLOW FIXES
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const btn = document.getElementById("registerButton");
  if (!btn.classList.contains("enabled")) return;
  try {
    btn.disabled = true;
    const res = await fetch("/api/auth/start-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail.value.trim(), password: regPassword.value, lang: currentLang })
    });
    if (!res.ok) throw new Error();
    openVerifyModal(regEmail.value.trim()); // FIXED: Only opens on success
  } catch (err) {
    regMessages.textContent = i18n[currentLang].regStartError;
  } finally { btn.disabled = false; }
});

verifySubmit.addEventListener("click", async () => {
  try {
    verifySubmit.disabled = true;
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingRegisterEmail, code: verifyCodeInput.value.trim() })
    });
    const data = await res.json();
    if (data.success) window.location.href = "upload.html";
    else throw new Error();
  } catch (err) { verifyMessages.textContent = i18n[currentLang].regVerifyError; }
  finally { verifySubmit.disabled = false; }
});

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: loginEmail.value.trim(), password: loginPassword.value })
    });
    const data = await res.json();
    if (data.success) window.location.href = "dashboard.html";
    else throw new Error();
  } catch (err) { loginMessages.textContent = i18n[currentLang].loginError; }
});

function init() {
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;
  verifyBackdrop.hidden = true;
  setMode(localStorage.getItem("themeMode") || "light");
  setLanguage(localStorage.getItem("authLang") || "en");
  updateRegisterButtonState();
}
document.addEventListener("DOMContentLoaded", init);

