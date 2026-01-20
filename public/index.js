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
const regSubmit = document.getElementById("regSubmit");

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

// Verification modal
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

function closeModal() {
  modalBackdrop.hidden = true;
}

modalClose.addEventListener("click", closeModal);
modalOk.addEventListener("click", closeModal);

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

// YOUR ORIGINAL STRENGTH LOGIC
function getStrength(pwd) {
  if (!pwd) return 0;
  if (pwd.length < 8) return 1;
  let s = 2;
  if (/[0-9]/.test(pwd)) s++;
  if (/[^A-Za-z0-9]/.test(pwd)) s++;
  return s;
}

function updateStrengthUI(pwd) {
  const s = getStrength(pwd);
  const dict = i18n[currentLang].strength;
  regStrengthBar.className = "strength-bar";
  
  if (s === 0) {
    regStrengthBar.style.width = "0";
    regStrengthLabel.textContent = "";
  } else if (s === 1) {
    regStrengthBar.style.width = "25%";
    regStrengthBar.classList.add("strength-weak");
    regStrengthLabel.textContent = dict.tooShort;
  } else if (s === 2) {
    regStrengthBar.style.width = "50%";
    regStrengthBar.classList.add("strength-weak");
    regStrengthLabel.textContent = dict.weak;
  } else if (s === 3) {
    regStrengthBar.style.width = "75%";
    regStrengthBar.classList.add("strength-medium");
    regStrengthLabel.textContent = dict.medium;
  } else if (s === 4) {
    regStrengthBar.style.width = "100%";
    regStrengthBar.classList.add("strength-strong");
    regStrengthLabel.textContent = dict.strong;
  } else {
    regStrengthBar.style.width = "100%";
    regStrengthBar.classList.add("strength-complete");
    regStrengthLabel.textContent = dict.complete;
  }
}

function updateRegisterButtonState() {
  const s = getStrength(regPassword.value);
  const isMatch = regPassword.value === regConfirmPassword.value;
  const emailValid = regEmail.value.includes("@");
  const termsOk = regTerms.checked;
  regSubmit.disabled = !(s >= 2 && isMatch && emailValid && termsOk);
}

regPassword.addEventListener("input", (e) => {
  updateStrengthUI(e.target.value);
  updateRegisterButtonState();
});

regConfirmPassword.addEventListener("input", updateRegisterButtonState);
regEmail.addEventListener("input", updateRegisterButtonState);
regTerms.addEventListener("change", updateRegisterButtonState);

// Tab switching
function setActiveTab(tab) {
  if (tab === "register") {
    tabRegister.classList.add("active");
    tabLogin.classList.remove("active");
    registerForm.hidden = false;
    loginForm.hidden = true;
  } else {
    tabLogin.classList.add("active");
    tabRegister.classList.remove("active");
    loginForm.hidden = false;
    registerForm.hidden = true;
  }
}

tabRegister.addEventListener("click", () => setActiveTab("register"));
tabLogin.addEventListener("click", () => setActiveTab("login"));

// Theme Toggle
function setMode(mode) {
  if (mode === "dark") {
    body.classList.add("dark-mode");
    body.classList.remove("light-mode");
    modeToggle.classList.add("dark-active");
    modeIcon.textContent = "🌙";
    localStorage.setItem("themeMode", "dark");
  } else {
    body.classList.add("light-mode");
    body.classList.remove("dark-mode");
    modeToggle.classList.remove("dark-active");
    modeIcon.textContent = "☀️";
    localStorage.setItem("themeMode", "light");
  }
}

modeToggle.addEventListener("click", () => {
  const isDark = body.classList.contains("dark-mode");
  setMode(isDark ? "light" : "dark");
});

// Language Toggle
const langEn = document.getElementById("langEn");
const langHe = document.getElementById("langHe");
const langThumb = document.querySelector(".lang-toggle-thumb");

function setLanguage(lang) {
  currentLang = lang;
  localStorage.setItem("authLang", lang);
  const dict = i18n[lang];

  if (lang === "he") {
    body.classList.add("rtl");
    body.classList.remove("ltr");
    langThumb.style.transform = "translateX(100%)";
  } else {
    body.classList.add("ltr");
    body.classList.remove("rtl");
    langThumb.style.transform = "translateX(0)";
  }

  // Update UI strings
  document.getElementById("regTitle").textContent = dict["register.title"];
  document.querySelectorAll("label[for='regEmail']").forEach(l => l.textContent = dict["register.emailLabel"]);
  regEmail.placeholder = dict["register.emailPlaceholder"];
  document.querySelectorAll("label[for='regPassword']").forEach(l => l.textContent = dict["register.passwordLabel"]);
  regPassword.placeholder = dict["register.passwordPlaceholder"];
  document.querySelectorAll("label[for='regConfirmPassword']").forEach(l => l.textContent = dict["register.confirmLabel"]);
  regConfirmPassword.placeholder = dict["register.confirmPlaceholder"];
  document.getElementById("termsBefore").textContent = dict["register.terms.before"];
  document.getElementById("openTerms").textContent = dict["register.terms.word"];
  document.getElementById("termsAfter").textContent = dict["register.terms.after"];
  document.getElementById("regSubmit").textContent = dict["register.submit"];

  document.getElementById("loginTitle").textContent = dict["login.title"];
  loginEmail.placeholder = dict["login.emailPlaceholder"];
  loginPassword.placeholder = dict["login.passwordPlaceholder"];
  document.getElementById("rememberLabel").textContent = dict["login.remember"];
  document.getElementById("forgotPassword").textContent = dict["login.forgot"];
  document.getElementById("loginSubmit").textContent = dict["login.submit"];
  
  document.getElementById("footerText").innerHTML = dict["footer.text"];
  
  updateStrengthUI(regPassword.value);
}

langEn.addEventListener("click", () => setLanguage("en"));
langHe.addEventListener("click", () => setLanguage("he"));

// Registration
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dict = i18n[currentLang];
  regMessages.textContent = "";

  try {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: regEmail.value, password: regPassword.value, lang: currentLang })
    });
    const data = await res.json();
    if (data.success) {
      window.location.href = `verify.html?email=${encodeURIComponent(regEmail.value)}&lang=${currentLang}`;
    } else {
      regMessages.textContent = data.error || dict.regStartError;
    }
  } catch (err) {
    regMessages.textContent = dict.regStartError;
  }
});

// Login
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  const dict = i18n[currentLang];
  loginMessages.textContent = "";

  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!data.success) {
      loginMessages.textContent = dict.loginError;
      return;
    }

    if (rememberMe.checked) {
      localStorage.setItem("rememberedEmail", email);
    } else {
      localStorage.removeItem("rememberedEmail");
    }

    window.location.href = "dashboard.html";
  } catch (err) {
    loginMessages.textContent = dict.loginError;
  }
});

// Password Toggles
function setupPasswordToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  if (!toggle || !input) return;

  toggle.addEventListener("click", () => {
    const isPwd = input.type === "password";
    input.type = isPwd ? "text" : "password";
    toggle.textContent = isPwd ? i18n[currentLang].hide : i18n[currentLang].show;
  });
}

// Init
function init() {
  modalBackdrop.hidden = true;
  termsBackdrop.hidden = true;
  verifyBackdrop.hidden = true;

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
setupPasswordToggle("regPasswordToggle", "regPassword");
setupPasswordToggle("regConfirmPasswordToggle", "regConfirmPassword");
setupPasswordToggle("loginPasswordToggle", "loginPassword");
