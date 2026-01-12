// Language state
let currentLang = "en";

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
      strong: "Strong"
    },

    show: "Show",
    hide: "Hide",

    forgotInfo: "Password reset will be handled via email.",
    regTermsMissing: "Please agree to the terms.",
    regPasswordMismatch: "Passwords do not match.",
    regPasswordInvalid: "Password does not meet the requirements.",
    loginInvalid: "Please enter email and password.",

    "terms.full": `
<p><strong>1. Data Usage</strong><br>
By using this platform, you agree that any handwriting samples, glyphs, or uploaded images may be stored and processed for analysis, improvement of the service, and security purposes.</p>

<p><strong>2. Account Deletion</strong><br>
If you delete your account, your login information will be removed. However, <strong>your uploaded images, handwriting samples, and glyphs will remain stored permanently</strong> for research, training, and platform improvement.</p>

<p><strong>3. User Responsibilities</strong><br>
You agree not to upload harmful, illegal, or copyrighted material without permission.</p>

<p><strong>4. Platform Rights</strong><br>
We may update or modify the service at any time.</p>

<p><strong>5. Contact</strong><br>
For questions, contact support.</p>
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
      strong: "חזקה"
    },

    show: "הצג",
    hide: "הסתר",

    forgotInfo: "איפוס הסיסמה יתבצע דרך המייל.",
    regTermsMissing: "אנא אשר את תנאי השימוש.",
    regPasswordMismatch: "הסיסמאות אינן תואמות.",
    regPasswordInvalid: "הסיסמה אינה עומדת בדרישות.",
    loginInvalid: "אנא הזן אימייל וסיסמה.",

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

<p><strong>5. יצירת קשר</strong><br>
לשאלות או בקשות, ניתן לפנות לתמיכה.</p>
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

// Modal helpers
function openModal(title, message) {
  modalTitle.textContent = title;
  modalBody.textContent = message;
  modalBackdrop.hidden = false;
}

function closeModal() {
  modalBackdrop.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);
modalBackdrop.addEventListener("click", (e) => {
  if (e.target === modalBackdrop) closeModal();
});

// Terms modal
openTerms.addEventListener("click", () => {
  const dict = i18n[currentLang];
  termsText.innerHTML = dict["terms.full"];
  termsBackdrop.hidden = false;
});

function closeTerms() {
  termsBackdrop.hidden = true;
}

termsClose.addEventListener("click", closeTerms);
termsOk.addEventListener("click", closeTerms);
termsBackdrop.addEventListener("click", (e) => {
  if (e.target === termsBackdrop) closeTerms();
});

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

// Dark mode
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

modeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-mode");
  setMode(isDark ? "light" : "dark");
});

// Language
function setLanguage(lang) {
  currentLang = lang;

  body.classList.remove("ltr", "rtl");
  if (lang === "he") {
    body.classList.add("rtl");
    document.documentElement.lang = "he";
    langToggle.classList.remove("lang-en");
    langToggle.classList.add("lang-he");
  } else {
    body.classList.add("ltr");
    document.documentElement.lang = "en";
    langToggle.classList.remove("lang-he");
    langToggle.classList.add("lang-en");
  }

  const dict = i18n[lang];

  document.querySelectorAll("[data-i18n]").forEach(el => {
    const key = el.getAttribute("data-i18n");
    if (dict[key]) {
      el.textContent = dict[key];
    }
  });

  document.querySelectorAll("[data-i18n-placeholder]").forEach(el => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (dict[key]) {
      el.placeholder = dict[key];
    }
  });

  document.querySelectorAll(".password-toggle").forEach(btn => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const isText = input && input.type === "text";
    btn.textContent = isText ? dict.hide : dict.show;
  });

  if (!termsBackdrop.hidden) {
    termsText.innerHTML = dict["terms.full"];
  }

  localStorage.setItem("authLang", lang);
}

langToggle.addEventListener("click", () => {
  const next = currentLang === "en" ? "he" : "en";
  setLanguage(next);
});

// Password toggles
function setupPasswordToggle(buttonId, inputId) {
  const button = document.getElementById(buttonId);
  const input = document.getElementById(inputId);
  if (!button || !input) return;

  button.addEventListener("click", () => {
    const dict = i18n[currentLang];
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    button.textContent = isHidden ? dict.hide : dict.show;
  });
}

setupPasswordToggle("regPasswordToggle", "regPassword");
setupPasswordToggle("regConfirmPasswordToggle", "regConfirmPassword");
setupPasswordToggle("loginPasswordToggle", "loginPassword");

// Password evaluation
function evaluatePassword(password) {
  const minLength = 8;
  const hasHebrew = /[\u0590-\u05FF]/.test(password);
  const hasEnglish = /[A-Za-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9\u0590-\u05FF]/.test(password);

  if (password.length < minLength) {
    return { valid: false, score: 0, reason: "tooShort" };
  }

  if (!hasNumber || !hasSymbol) {
    return { valid: false, score: 1, reason: "weak" };
  }

  if (hasEnglish && !hasUppercase) {
    return { valid: false, score: 2, reason: "medium" };
  }

  let score = 0;
  if (password.length >= 8) score++;
  if (password.length >= 12) score++;
  if (hasNumber) score++;
  if (hasSymbol) score++;
  if (hasEnglish && hasUppercase) score++;
  if (hasHebrew) score++;

  let level;
  if (score <= 2) level = "weak";
  else if (score <= 4) level = "medium";
  else level = "strong";

  return { valid: true, score, reason: level };
}

function updateStrengthUI(password) {
  const dict = i18n[currentLang].strength;
  const result = evaluatePassword(password);

  let width = 0;
  let color = "transparent";
  let labelText = "";

  if (result.reason === "tooShort") {
    width = 20;
    color = "var(--danger)";
    labelText = dict.tooShort;
  } else if (result.reason === "weak") {
    width = 35;
    color = "var(--danger)";
    labelText = dict.weak;
  } else if (result.reason === "medium") {
    width = 60;
    color = "var(--warning)";
    labelText = dict.medium;
  } else if (result.reason === "strong") {
    width = 90;
    color = "var(--success)";
    labelText = dict.strong;
  }

  regStrengthBar.style.width = password ? width + "%" : "0";
  regStrengthBar.style.background = color;
  regStrengthLabel.textContent = password ? labelText : "";
}

regPassword.addEventListener("input", (e) => {
  updateStrengthUI(e.target.value);
  updateRegisterButtonState();
});
regConfirmPassword.addEventListener("input", updateRegisterButtonState);
regTerms.addEventListener("change", updateRegisterButtonState);

// Register button enable logic
function updateRegisterButtonState() {
  const password = regPassword.value;
  const confirm = regConfirmPassword.value;
  const terms = regTerms.checked;

  const evaluation = evaluatePassword(password);
  const valid = evaluation.valid && password === confirm && terms;

  const btn = document.getElementById("registerButton");
  if (valid) {
    btn.classList.add("enabled");
  } else {
    btn.classList.remove("enabled");
  }
}

// Register submit
registerForm.addEventListener("submit", (e) => {
  e.preventDefault();
  regMessages.textContent = "";

  const btn = document.getElementById("registerButton");
  if (!btn.classList.contains("enabled")) {
    return;
  }

  const dict = i18n[currentLang];
  const password = regPassword.value;
  const confirm = regConfirmPassword.value;

  if (!regTerms.checked) {
    regMessages.textContent = dict.regTermsMissing;
    return;
  }

  const evaluation = evaluatePassword(password);
  if (!evaluation.valid) {
    regMessages.textContent = dict.regPasswordInvalid;
    return;
  }

  if (password !== confirm) {
    regMessages.textContent = dict.regPasswordMismatch;
    return;
  }

  openModal(dict["register.title"], "Registration would be processed here.");

  regPassword.value = "";
  regConfirmPassword.value = "";
  updateStrengthUI("");
  updateRegisterButtonState();
});

// Login submit
loginForm.addEventListener("submit", (e) => {
  e.preventDefault();
  loginMessages.textContent = "";

  const dict = i18n[currentLang];
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    loginMessages.textContent = dict.loginInvalid;
    return;
  }

  if (rememberMe.checked) {
    localStorage.setItem("rememberedEmail", email);
  } else {
    localStorage.removeItem("rememberedEmail");
  }

  openModal(dict["login.title"], "Login would be processed here.");
});

// Forgot password
const forgotPasswordBtn = document.getElementById("forgotPassword");
forgotPasswordBtn.addEventListener("click", () => {
  const dict = i18n[currentLang];
  openModal(dict["login.forgot"], dict.forgotInfo);
});

// Init
function init() {
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;

  const savedTheme = localStorage.getItem("themeMode");
  setMode(savedTheme === "dark" ? "dark" : "light");

  const savedLang = localStorage.getItem("authLang");
  setLanguage(savedLang === "he" ? "he" : "en");

  const rememberedEmail = localStorage.getItem("rememberedEmail");
  if (rememberedEmail) {
    loginEmail.value = rememberedEmail;
    setActiveTab("login");
  } else {
    setActiveTab("register");
  }

  updateStrengthUI("");
  updateRegisterButtonState();
}

document.addEventListener("DOMContentLoaded", init);

