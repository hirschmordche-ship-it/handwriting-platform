// =========================
// CORE STATE
// =========================
let currentLang = "en";
let pendingRegisterEmail = "";
let themeMode = "light";

// Register resend cooldown
let resendTimerInterval = null;
let resendSecondsLeft = 0;

// Reset flow state
let resetStep = "email"; // "email" | "code" | "password"
let resetEmail = "";
let resetCooldownInterval = null;
let resetSecondsLeft = 0;

// =========================
// I18N DICTIONARY
// =========================
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

    // Reset flow
    resetTitleEmail: "Reset password",
    resetTitleCode: "Enter code",
    resetTitlePassword: "Set new password",
    resetMessageEmail: "Enter your email to receive a reset code.",
    resetMessageCode: "Enter the 6-digit code we sent to your email.",
    resetMessagePassword: "Set a new password and confirm it.",
    resetEmailPlaceholder: "you@example.com",
    resetNewPasswordLabel: "New password",
    resetNewPasswordPlaceholder: "New password",
    resetConfirmLabel: "Confirm password",
    resetConfirmPasswordPlaceholder: "Confirm password",
    resetInvalidEmail: "Please enter a valid email.",
    resetStartError: "Could not start password reset. Please try again.",
    resetCodeError: "Invalid or expired code. Please try again.",
    resetPasswordInvalid: "Password does not meet the requirements.",
    resetPasswordMismatch: "Passwords do not match.",
    resetPasswordError: "Could not update password. Please try again.",
    resetPasswordSuccess: "Password updated. Logging you in...",
    resetBack: "Back",
    resetContinue: "Continue",
    resetUpdateLogin: "Update & Login",

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

    // Reset flow
    resetTitleEmail: "איפוס סיסמה",
    resetTitleCode: "הזן קוד",
    resetTitlePassword: "הגדרת סיסמה חדשה",
    resetMessageEmail: "הזן את האימייל לקבלת קוד איפוס.",
    resetMessageCode: "הזן את הקוד בן 6 הספרות שנשלח לאימייל.",
    resetMessagePassword: "הגדר סיסמה חדשה ואשר אותה.",
    resetEmailPlaceholder: "name@domain.com",
    resetNewPasswordLabel: "סיסמה חדשה",
    resetNewPasswordPlaceholder: "סיסמה חדשה",
    resetConfirmLabel: "אימות סיסמה",
    resetConfirmPasswordPlaceholder: "אימות סיסמה",
    resetInvalidEmail: "אנא הזן אימייל תקין.",
    resetStartError: "לא ניתן להתחיל איפוס סיסמה. נסה שוב.",
    resetCodeError: "קוד שגוי או שפג תוקפו. נסה שוב.",
    resetPasswordInvalid: "הסיסמה אינה עומדת בדרישות.",
    resetPasswordMismatch: "הסיסמאות אינן תואמות.",
    resetPasswordError: "לא ניתן לעדכן סיסמה. נסה שוב.",
    resetPasswordSuccess: "הסיסמה עודכנה. מתחבר...",
    resetBack: "חזרה",
    resetContinue: "המשך",
    resetUpdateLogin: "עדכן והתחבר",

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

// =========================
// DOM REFERENCES
// =========================
const body = document.body;

// Tabs & forms
const tabRegister = document.getElementById("tabRegister");
const tabLogin = document.getElementById("tabLogin");
const registerForm = document.getElementById("registerForm");
const loginForm = document.getElementById("loginForm");

// Toggles
const langToggle = document.getElementById("langToggle");
const modeToggle = document.getElementById("modeToggle");
const modeIcon = document.querySelector(".mode-toggle-knob .mode-icon");

// Register fields
const regEmail = document.getElementById("regEmail");
const regPassword = document.getElementById("regPassword");
const regConfirmPassword = document.getElementById("regConfirmPassword");
const regTerms = document.getElementById("regTerms");
const regMessages = document.getElementById("regMessages");
const regStrengthBar = document.getElementById("regStrengthBar");
const regStrengthLabel = document.getElementById("regStrengthLabel");
const passwordRequirements = document.getElementById("passwordRequirements");

// Login fields
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const rememberMe = document.getElementById("rememberMe");
const loginMessages = document.getElementById("loginMessages");
const forgotPasswordBtn = document.getElementById("forgotPassword");

// Footer
const footerText = document.getElementById("footerText");

// Info modal
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

// Verify modal
const verifyBackdrop = document.getElementById("verifyBackdrop");
const verifyClose = document.getElementById("verifyClose");
const verifyTitle = document.getElementById("verifyTitle");
const verifyMessage = document.getElementById("verifyMessage");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifyMessages = document.getElementById("verifyMessages");
const verifySubmit = document.getElementById("verifySubmit");

// Reset modal
const resetBackdrop = document.getElementById("resetBackdrop");
const resetClose = document.getElementById("resetClose");
const resetTitle = document.getElementById("resetTitle");
const resetMessage = document.getElementById("resetMessage");
const resetStepEmail = document.getElementById("resetStepEmail");
const resetEmailInput = document.getElementById("resetEmailInput");
const resetStepCode = document.getElementById("resetStepCode");
const resetCodeInput = document.getElementById("resetCodeInput");
const resetCodeMessages = document.getElementById("resetCodeMessages");
const resetResendBtn = document.getElementById("resetResendBtn");
const resetResendCountdown = document.getElementById("resetResendCountdown");
const resetStepPassword = document.getElementById("resetStepPassword");
const resetNewPassword = document.getElementById("resetNewPassword");
const resetConfirmPassword = document.getElementById("resetConfirmPassword");
const resetPasswordRequirements = document.getElementById("resetPasswordRequirements");
const resetStrengthBar = document.getElementById("resetStrengthBar");
const resetStrengthLabel = document.getElementById("resetStrengthLabel");
const resetPasswordMessages = document.getElementById("resetPasswordMessages");
const resetBackBtn = document.getElementById("resetBackBtn");
const resetPrimaryBtn = document.getElementById("resetPrimaryBtn");

// =========================
// MODAL HELPERS
// =========================
function openModal(title, message) {
  if (!modalBackdrop) return;
  modalTitle.textContent = title;
  modalBody.textContent = message;
  modalBackdrop.hidden = false;
}

function closeModal() {
  if (!modalBackdrop) return;
  modalBackdrop.hidden = true;
}

if (modalClose) modalClose.addEventListener("click", closeModal);
if (modalOk) modalOk.addEventListener("click", closeModal);
if (modalBackdrop) {
  modalBackdrop.addEventListener("click", (e) => {
    if (e.target === modalBackdrop) closeModal();
  });
}

// Terms modal
function openTermsModal() {
  const dict = i18n[currentLang];
  if (!termsBackdrop) return;
  termsText.innerHTML = dict["terms.full"];
  termsBackdrop.hidden = false;
}

function closeTermsModal() {
  if (!termsBackdrop) return;
  termsBackdrop.hidden = true;
}

if (openTerms) openTerms.addEventListener("click", openTermsModal);
if (termsClose) termsClose.addEventListener("click", closeTermsModal);
if (termsOk) termsOk.addEventListener("click", closeTermsModal);
if (termsBackdrop) {
  termsBackdrop.addEventListener("click", (e) => {
    if (e.target === termsBackdrop) closeTermsModal();
  });
}

// =========================
// TABS
// =========================
function setActiveTab(tab) {
  if (!tabRegister || !tabLogin || !registerForm || !loginForm) return;

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

if (tabRegister) {
  tabRegister.addEventListener("click", () => setActiveTab("register"));
}
if (tabLogin) {
  tabLogin.addEventListener("click", () => setActiveTab("login"));
}

// =========================
// DARK MODE
// =========================
function setMode(mode) {
  themeMode = mode === "dark" ? "dark" : "light";
  body.classList.remove("light-mode", "dark-mode");
  body.classList.add(themeMode === "dark" ? "dark-mode" : "light-mode");

  if (modeToggle) {
    if (themeMode === "dark") {
      modeToggle.classList.add("dark-active");
    } else {
      modeToggle.classList.remove("dark-active");
    }
  }

  if (modeIcon) {
    modeIcon.textContent = themeMode === "dark" ? "🌙" : "☀️";
  }

  localStorage.setItem("themeMode", themeMode);
}

if (modeToggle) {
  modeToggle.addEventListener("click", () => {
    const next = themeMode === "dark" ? "light" : "dark";
    setMode(next);
  });
}

// =========================
// LANGUAGE & RTL/LTR
// =========================
function setLanguage(lang) {
  currentLang = lang === "he" ? "he" : "en";
  const dict = i18n[currentLang];

  // Body direction (header stays visually stable)
  body.classList.remove("ltr", "rtl");
  body.classList.add(currentLang === "he" ? "rtl" : "ltr");
  document.documentElement.lang = currentLang === "he" ? "he" : "en";

  if (langToggle) {
    langToggle.classList.toggle("lang-he", currentLang === "he");
    langToggle.classList.toggle("lang-en", currentLang !== "he");
  }

  // Text content
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (key && dict[key]) {
      el.textContent = dict[key];
    }
  });

  // Placeholders
  document.querySelectorAll("[data-i18n-placeholder]").forEach((el) => {
    const key = el.getAttribute("data-i18n-placeholder");
    if (key && dict[key]) {
      el.placeholder = dict[key];
    }
  });

  // Password toggle labels
  document.querySelectorAll(".password-toggle").forEach((btn) => {
    const targetId = btn.getAttribute("data-target");
    if (!targetId) return;
    const input = document.getElementById(targetId);
    if (!input) return;
    const isText = input.type === "text";
    btn.textContent = isText ? dict.hide : dict.show;
  });

  // Terms text if open
  if (termsBackdrop && !termsBackdrop.hidden) {
    termsText.innerHTML = dict["terms.full"];
  }

  // Footer text
  if (footerText) {
    footerText.innerHTML = dict["footer.text"];
  }

  localStorage.setItem("authLang", currentLang);
}

if (langToggle) {
  langToggle.addEventListener("click", () => {
    const next = currentLang === "en" ? "he" : "en";
    setLanguage(next);
  });
}

// =========================
// PASSWORD TOGGLES
// =========================
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

// Global data-target based toggles (for reset fields etc.)
document.querySelectorAll(".password-toggle").forEach((btn) => {
  const targetId = btn.getAttribute("data-target");
  if (!targetId) return;
  const input = document.getElementById(targetId);
  if (!input) return;

  btn.addEventListener("click", () => {
    const dict = i18n[currentLang];
    const isHidden = input.type === "password";
    input.type = isHidden ? "text" : "password";
    btn.textContent = isHidden ? dict.hide : dict.show;
  });
});

// =========================
// PASSWORD EVALUATION
// =========================
function evaluatePassword(password) {
  const minLength = 8;
  const hasEnglish = /[A-Za-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9\u0590-\u05FF]/.test(password);

  let score = 0;
  const missing = [];

  const lengthScore = Math.min(password.length, minLength) / minLength;
  score += lengthScore * 50;
  if (password.length < minLength) missing.push("length");

  if (hasNumber) score += 20;
  else missing.push("number");

  if (hasSymbol) score += 20;
  else missing.push("symbol");

  if (hasEnglish && hasUppercase) score += 10;
  else if (hasEnglish) missing.push("uppercase");

  score = Math.min(score, 100);

  return {
    valid: score === 100,
    score,
    missing
  };
}

// =========================
// REGISTER STRENGTH UI
// =========================
function updateRegisterStrengthUI(password) {
  if (!regStrengthBar || !regStrengthLabel || !passwordRequirements) return;

  const dictStrength = i18n[currentLang].strength;
  const result = evaluatePassword(password);
  const score = result.score;

  if (!password) {
    regStrengthBar.style.width = "0%";
    regStrengthBar.style.background = "transparent";
    regStrengthLabel.textContent = "";
    passwordRequirements.textContent = "";
    return;
  }

  let label = "";
  let color = "var(--danger)";

  if (score === 100) {
    label = dictStrength.complete;
    color = "var(--success)";
  } else if (score <= 33) {
    label = dictStrength.weak;
    color = "var(--danger)";
  } else if (score <= 66) {
    label = dictStrength.medium;
    color = "var(--warning)";
  } else {
    label = dictStrength.strong;
    color = "var(--success)";
  }

  regStrengthBar.style.width = score + "%";
  regStrengthBar.style.background = color;
  regStrengthLabel.textContent = label;

  if (score === 100) {
    passwordRequirements.textContent = "";
  } else {
    const hints = {
      length: currentLang === "he" ? "אורך" : "length",
      number: currentLang === "he" ? "מספר" : "number",
      symbol: currentLang === "he" ? "סימן" : "symbol",
      uppercase: currentLang === "he" ? "אות גדולה" : "uppercase"
    };
    const missingText = result.missing.map((k) => hints[k]).join(", ");
    passwordRequirements.textContent =
      (currentLang === "he" ? "חסר: " : "Missing: ") + missingText;
  }
}
// =========================
// REGISTER BUTTON STATE
// =========================
function updateRegisterButtonState() {
  const password = regPassword.value;
  const confirm = regConfirmPassword.value;
  const terms = regTerms.checked;

  const evaluation = evaluatePassword(password);
  const valid = evaluation.valid && password === confirm && terms;

  const btn = document.getElementById("registerButton");
  if (!btn) return;
  if (valid) {
    btn.classList.add("enabled");
  } else {
    btn.classList.remove("enabled");
  }
}

if (regPassword) {
  regPassword.addEventListener("input", (e) => {
    updateRegisterStrengthUI(e.target.value);
    updateRegisterButtonState();
  });
}
if (regConfirmPassword) {
  regConfirmPassword.addEventListener("input", updateRegisterButtonState);
}
if (regTerms) {
  regTerms.addEventListener("change", updateRegisterButtonState);
}

// =========================
// REGISTER FLOW
// =========================
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  regMessages.textContent = "";

  const dict = i18n[currentLang];

  const btn = document.getElementById("registerButton");
  if (!btn || !btn.classList.contains("enabled")) return;

  const email = regEmail.value.trim();
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

  try {
    btn.disabled = true;

    const res = await fetch("/api/auth/start-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, lang: currentLang })
    });

    if (!res.ok) throw new Error();

    openVerifyModal(email);
  } catch {
    regMessages.textContent = dict.regStartError;
  } finally {
    btn.disabled = false;
  }
});

// =========================
// OPEN VERIFY MODAL
// =========================
function openVerifyModal(email) {
  const dict = i18n[currentLang];
  pendingRegisterEmail = email;

  verifyTitle.textContent = dict.regVerifyTitle;
  verifyMessage.textContent = dict.regVerifyPrompt;
  verifyCodeInput.value = "";
  verifyMessages.textContent = "";
  verifyBackdrop.hidden = false;

  startRegisterResendCooldown();
  verifyCodeInput.focus();
}

function closeVerifyModal() {
  verifyBackdrop.hidden = true;
  pendingRegisterEmail = "";
}

verifyClose.addEventListener("click", closeVerifyModal);
verifyBackdrop.addEventListener("click", (e) => {
  if (e.target === verifyBackdrop) closeVerifyModal();
});

// =========================
// REGISTER RESEND COOLDOWN
// =========================
function startRegisterResendCooldown() {
  resendSecondsLeft = 180;
  const resendBtn = document.getElementById("resendCode");
  const resendCountdown = document.getElementById("resendCountdown");

  if (resendBtn) resendBtn.classList.add("disabled");
  if (resendCountdown) {
    const m = Math.floor(resendSecondsLeft / 60);
    const s = resendSecondsLeft % 60;
    resendCountdown.textContent = `${m}:${s.toString().padStart(2, "0")}`;
  }

  if (resendTimerInterval) clearInterval(resendTimerInterval);
  resendTimerInterval = setInterval(() => {
    resendSecondsLeft--;
    if (resendCountdown) {
      const m = Math.floor(resendSecondsLeft / 60);
      const s = resendSecondsLeft % 60;
      resendCountdown.textContent = `${m}:${s.toString().padStart(2, "0")}`;
    }

    if (resendSecondsLeft <= 0) {
      clearInterval(resendTimerInterval);
      resendTimerInterval = null;
      if (resendBtn) resendBtn.classList.remove("disabled");
      if (resendCountdown) resendCountdown.textContent = "";
    }
  }, 1000);
}

// =========================
// AUTO-SUBMIT VERIFY CODE
// =========================
verifyCodeInput.addEventListener("input", () => {
  verifyMessages.textContent = "";
  if (/^\d{6}$/.test(verifyCodeInput.value)) {
    verifySubmit.click();
  }
});

// =========================
// VERIFY REGISTER
// =========================
verifySubmit.addEventListener("click", async () => {
  const dict = i18n[currentLang];
  verifyMessages.textContent = "";

  const code = verifyCodeInput.value.trim();
  if (!pendingRegisterEmail || !code) {
    verifyMessages.textContent = dict.regVerifyError;
    return;
  }

  verifySubmit.disabled = true;

  try {
    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingRegisterEmail, code })
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.success) {
      verifyMessages.textContent = dict.regVerifyError;
      return;
    }

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

// =========================
// LOGIN FLOW
// =========================
loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  loginMessages.textContent = "";

  const dict = i18n[currentLang];
  const email = loginEmail.value.trim();
  const password = loginPassword.value;

  if (!email || !password) {
    loginMessages.textContent = dict.loginInvalid;
    return;
  }

  try {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password })
    });

    if (!res.ok) throw new Error();

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
  } catch {
    loginMessages.textContent = dict.loginError;
  }
});

// =========================
// AUTO-PASTE VERIFICATION CODE
// =========================
async function tryAutoPasteVerifyCode() {
  try {
    const text = await navigator.clipboard.readText();
    if (/^\d{6}$/.test(text.trim())) {
      verifyCodeInput.value = text.trim();
    }
  } catch {}
}

window.addEventListener("focus", tryAutoPasteVerifyCode);
// =========================
// RESET MODAL OPEN/CLOSE
// =========================
function openResetModal() {
  const dict = i18n[currentLang];

  resetStep = "email";
  resetEmail = "";

  resetTitle.textContent = dict.resetTitleEmail;
  resetMessage.textContent = dict.resetMessageEmail;

  resetStepEmail.style.display = "block";
  resetStepCode.style.display = "none";
  resetStepPassword.style.display = "none";

  resetEmailInput.value = "";
  resetCodeInput.value = "";
  resetNewPassword.value = "";
  resetConfirmPassword.value = "";

  resetCodeMessages.textContent = "";
  resetPasswordMessages.textContent = "";
  resetPasswordRequirements.textContent = "";
  resetStrengthBar.style.width = "0%";
  resetStrengthLabel.textContent = "";

  resetBackBtn.style.display = "none";
  resetPrimaryBtn.textContent = dict.resetContinue;

  resetBackdrop.hidden = false;
  resetEmailInput.focus();
}

function closeResetModal() {
  resetBackdrop.hidden = true;
}

resetClose.addEventListener("click", closeResetModal);

// =========================
// DO NOT CLOSE ON BACKDROP CLICK
// =========================
resetBackdrop.addEventListener("click", (e) => {
  // Intentionally empty — backdrop click does nothing
});

// =========================
// OPEN FROM "FORGOT PASSWORD?"
// =========================
forgotPasswordBtn.addEventListener("click", openResetModal);

// =========================
// RESET STEP SWITCHING
// =========================
function goToResetStep(step) {
  const dict = i18n[currentLang];
  resetStep = step;

  if (step === "email") {
    resetTitle.textContent = dict.resetTitleEmail;
    resetMessage.textContent = dict.resetMessageEmail;

    resetStepEmail.style.display = "block";
    resetStepCode.style.display = "none";
    resetStepPassword.style.display = "none";

    resetBackBtn.style.display = "none";
    resetPrimaryBtn.textContent = dict.resetContinue;

    resetEmailInput.focus();
  }

  if (step === "code") {
    resetTitle.textContent = dict.resetTitleCode;
    resetMessage.textContent = dict.resetMessageCode;

    resetStepEmail.style.display = "none";
    resetStepCode.style.display = "block";
    resetStepPassword.style.display = "none";

    resetBackBtn.style.display = "block";
    resetPrimaryBtn.textContent = dict.resetContinue;

    resetCodeInput.focus();
  }

  if (step === "password") {
    resetTitle.textContent = dict.resetTitlePassword;
    resetMessage.textContent = dict.resetMessagePassword;

    resetStepEmail.style.display = "none";
    resetStepCode.style.display = "none";
    resetStepPassword.style.display = "block";

    resetBackBtn.style.display = "block";
    resetPrimaryBtn.textContent = dict.resetUpdateLogin;

    resetNewPassword.focus();
  }
}

// =========================
// RESET BACK BUTTON
// =========================
resetBackBtn.addEventListener("click", () => {
  if (resetStep === "code") goToResetStep("email");
  else if (resetStep === "password") goToResetStep("code");
});

// =========================
// RESET PRIMARY BUTTON
// =========================
resetPrimaryBtn.addEventListener("click", async () => {
  if (resetStep === "email") return handleResetEmail();
  if (resetStep === "code") return handleResetCode();
  if (resetStep === "password") return handleResetPassword();
});

// =========================
// STEP 1 — SEND RESET EMAIL
// =========================
async function handleResetEmail() {
  const dict = i18n[currentLang];
  const email = resetEmailInput.value.trim();

  if (!email || !email.includes("@")) {
    resetPasswordMessages.textContent = dict.resetInvalidEmail;
    return;
  }

  resetPrimaryBtn.disabled = true;

  try {
    const res = await fetch("/api/auth/start-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang: currentLang })
    });

    if (!res.ok) throw new Error();

    resetEmail = email;
    startResetResendCooldown();
    goToResetStep("code");
  } catch {
    resetPasswordMessages.textContent = dict.resetStartError;
  } finally {
    resetPrimaryBtn.disabled = false;
  }
}

// =========================
// STEP 2 — VERIFY RESET CODE
// =========================
async function handleResetCode() {
  const dict = i18n[currentLang];
  const code = resetCodeInput.value.trim();

  if (!/^\d{6}$/.test(code)) {
    resetCodeMessages.textContent = dict.resetCodeError;
    return;
  }

  resetPrimaryBtn.disabled = true;

  try {
    const res = await fetch("/api/auth/verify-reset.js", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, code })
    });

    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.success) {
      resetCodeMessages.textContent = dict.resetCodeError;
      return;
    }
    
  resetCode = code;
    
    goToResetStep("password");
  } catch {
    resetCodeMessages.textContent = dict.resetCodeError;
  } finally {
    resetPrimaryBtn.disabled = false;
  }
}

// =========================
// STEP 3 — SET NEW PASSWORD
// =========================
async function handleResetPassword() {
  const dict = i18n[currentLang];

  const pass = resetNewPassword.value;
  const confirm = resetConfirmPassword.value;

  const evaluation = evaluatePassword(pass);
  if (!evaluation.valid) {
    resetPasswordMessages.textContent = dict.resetPasswordInvalid;
    return;
  }

  if (pass !== confirm) {
    resetPasswordMessages.textContent = dict.resetPasswordMismatch;
    return;
  }

  resetPrimaryBtn.disabled = true;

  try {
  const res = await fetch("/api/auth/reset-password", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: resetEmail,
      code: resetCode,     // ⭐ send stored code
      newPassword: pass    // ⭐ backend expects newPassword
    })
  });

    if (!res.ok) throw new Error();

    const data = await res.json();
    if (!data.success) {
      resetPasswordMessages.textContent = dict.resetPasswordError;
      return;
    }

    resetPasswordMessages.textContent = dict.resetPasswordSuccess;

    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);
  } catch {
    resetPasswordMessages.textContent = dict.resetPasswordError;
  } finally {
    resetPrimaryBtn.disabled = false;
  }
}

// =========================
// RESET RESEND COOLDOWN
// =========================
function startResetResendCooldown() {
  const dict = i18n[currentLang];

  resetSecondsLeft = 180;
  resetResendBtn.disabled = true;
  resetResendCountdown.textContent = formatResetTime(resetSecondsLeft);

  if (resetCooldownInterval) clearInterval(resetCooldownInterval);

  resetCooldownInterval = setInterval(() => {
    resetSecondsLeft--;
    resetResendCountdown.textContent = formatResetTime(resetSecondsLeft);

    if (resetSecondsLeft <= 0) {
      clearInterval(resetCooldownInterval);
      resetCooldownInterval = null;
      resetResendBtn.disabled = false;
      resetResendCountdown.textContent = "";
    }
  }, 1000);
}

function formatResetTime(sec) {
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m}:${s.toString().padStart(2, "0")}`;
}

// =========================
// RESEND RESET CODE
// =========================
resetResendBtn.addEventListener("click", async () => {
  const dict = i18n[currentLang];

  if (!resetEmail) return;

  resetResendBtn.disabled = true;

  try {
    const res = await fetch("/api/auth/start-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: resetEmail, lang: currentLang })
    });

    if (!res.ok) throw new Error();

    startResetResendCooldown();
  } catch {
    resetCodeMessages.textContent = dict.resetStartError;
    resetResendBtn.disabled = false;
  }
});

// =========================
// AUTO-SUBMIT RESET CODE
// =========================
resetCodeInput.addEventListener("input", () => {
  resetCodeMessages.textContent = "";
  if (/^\d{6}$/.test(resetCodeInput.value)) {
    resetPrimaryBtn.click();
  }
});

// =========================
// AUTO-PASTE RESET CODE
// =========================
async function tryAutoPasteResetCode() {
  try {
    const text = await navigator.clipboard.readText();
    if (/^\d{6}$/.test(text.trim())) {
      resetCodeInput.value = text.trim();
    }
  } catch {}
}

window.addEventListener("focus", tryAutoPasteResetCode);

// =========================
// RESET PASSWORD STRENGTH UI
// =========================
resetNewPassword.addEventListener("input", () => {
  const pass = resetNewPassword.value;
  const dictStrength = i18n[currentLang].strength;

  const result = evaluatePassword(pass);
  const score = result.score;

  if (!pass) {
    resetStrengthBar.style.width = "0%";
    resetStrengthBar.style.background = "transparent";
    resetStrengthLabel.textContent = "";
    resetPasswordRequirements.textContent = "";
    return;
  }

  let label = "";
  let color = "var(--danger)";

  if (score === 100) {
    label = dictStrength.complete;
    color = "var(--success)";
  } else if (score <= 33) {
    label = dictStrength.weak;
    color = "var(--danger)";
  } else if (score <= 66) {
    label = dictStrength.medium;
    color = "var(--warning)";
  } else {
    label = dictStrength.strong;
    color = "var(--success)";
  }

  resetStrengthBar.style.width = score + "%";
  resetStrengthBar.style.background = color;
  resetStrengthLabel.textContent = label;

  if (score === 100) {
    resetPasswordRequirements.textContent = "";
  } else {
    const hints = {
      length: currentLang === "he" ? "אורך" : "length",
      number: currentLang === "he" ? "מספר" : "number",
      symbol: currentLang === "he" ? "סימן" : "symbol",
      uppercase: currentLang === "he" ? "אות גדולה" : "uppercase"
    };
    const missingText = result.missing.map((k) => hints[k]).join(", ");
    resetPasswordRequirements.textContent =
      (currentLang === "he" ? "חסר: " : "Missing: ") + missingText;
  }
});
