// Language state
let currentLang = "en";
let pendingRegisterEmail = "";

// ADDED: resend cooldown (register)
let resendTimerInterval = null;
let resendSecondsLeft = 0;

// ADDED: reset flow state
let resetFlowStep = "START";
let resetCooldownInterval = null;
let resetSecondsLeft = 0;

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

    // RESET FLOW
    resetInitTitle: "Forgot password?",
    resetInitButton: "Securely Reset via Email",
    resetStatusStart: "Enter your email for a verification code.",
    resetStatusSent: "Code sent! Enter it and your new password.",
    resetEmailPlaceholder: "Email Address",
    resetCodePlaceholder: "6-Digit Code",
    resetNewPasswordPlaceholder: "New Password",
    resetConfirmPasswordPlaceholder: "Confirm Password",
    resetSendCode: "Send Reset Code",
    resetUpdateLogin: "Update & Login",
    resetReturn: "Return to Login",
    sending: "Sending...",
    tryAgain: "Try Again",
    invalidCode: "Invalid or expired code",

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
    spamHint: "בדוק גם בתיקיית הספאם.",
    resend: "שלח קוד שוב",

    // RESET FLOW
    resetInitTitle: "שכחת סיסמה?",
    resetInitButton: "איפוס מאובטח דרך אימייל",
    resetStatusStart: "הזן את האימייל לקבלת קוד אימות.",
    resetStatusSent: "הקוד נשלח! הזן אותו וסיסמה חדשה.",
    resetEmailPlaceholder: "כתובת אימייל",
    resetCodePlaceholder: "קוד בן 6 ספרות",
    resetNewPasswordPlaceholder: "סיסמה חדשה",
    resetConfirmPasswordPlaceholder: "אימות סיסמה",
    resetSendCode: "שלח קוד איפוס",
    resetUpdateLogin: "עדכן והתחבר",
    resetReturn: "חזרה להתחברות",
    sending: "שולח...",
    tryAgain: "נסה שוב",
    invalidCode: "קוד שגוי או שפג תוקפו",

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

// RESET DOM references
const resetInitView = document.getElementById("reset-init-view");
const resetFormView = document.getElementById("reset-form-view");
const resetStatusMsg = document.getElementById("reset-status-msg");
const resetEmailInput = document.getElementById("reset-email");
const resetCodeInput = document.getElementById("reset-code");
const resetPasswordWrapper = document.getElementById("reset-password-wrapper");
const resetNewPassword = document.getElementById("reset-new-password");
const resetConfirmPassword = document.getElementById("reset-confirm-password");
const resetMainBtn = document.getElementById("reset-main-btn");
const resetBackBtn = document.getElementById("reset-back-btn");
const resetResendWrapper = document.getElementById("reset-resend-wrapper");
const resetResendBtn = document.getElementById("reset-resend-btn");
const resetResendCountdown = document.getElementById("reset-resend-countdown");
const resetStrength = document.getElementById("reset-strength");

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

// ---------- MODAL HELPERS ----------
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
verifyBackdrop.addEventListener("click", (e) => {
  if (e.target === verifyBackdrop) closeVerifyModal();
});

// ---------- RESEND (REGISTER) ----------
function startResendCooldown() {
  // 3 minutes cooldown
  resendSecondsLeft = 180;
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

if (resendBtn) {
  resendBtn.addEventListener("click", async () => {
    if (resendSecondsLeft > 0) return;
    if (!pendingRegisterEmail) return;

    try {
      await fetch("/api/auth/start-register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: pendingRegisterEmail,
          password: regPassword.value,
          lang: currentLang
        })
      });
    } catch (err) {
      console.error("Resend failed", err);
    } finally {
      startResendCooldown();
    }
  });
}

// ---------- AUTO SUBMIT ON 6 DIGITS (REGISTER VERIFY) ----------
if (verifyCodeInput) {
  verifyCodeInput.addEventListener("input", () => {
    verifyMessages.textContent = "";
    if (/^\d{6}$/.test(verifyCodeInput.value)) {
      verifySubmit.click();
    }
  });
}

// ---------- VERIFY REGISTER ----------
verifySubmit.addEventListener("click", async () => {
  const dict = i18n[currentLang];
  verifyMessages.textContent = "";

  const code = (verifyCodeInput.value || "").trim();
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

    if (!res.ok) {
      throw new Error("verify failed");
    }

    const data = await res.json();
    if (!data.success) {
      verifyMessages.textContent = dict.regVerifyError;
      return;
    }

    verifyBackdrop.classList.add("verify-success");
    setTimeout(() => {
      window.location.href = "dashboard.html";
    }, 900);

  } catch (err) {
    console.error(err);
    verifyMessages.textContent = dict.regVerifyError;
  } finally {
    verifySubmit.disabled = false;
  }
});

// ---------- TABS ----------
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

// ---------- DARK MODE ----------
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

// ---------- LANGUAGE ----------
function setLanguage(lang) {
  currentLang = lang;

  body.classList.remove("ltr", "rtl");
  body.classList.add(lang === "he" ? "rtl" : "ltr");

  document.documentElement.lang = lang === "he" ? "he" : "en";

  langToggle.classList.toggle("lang-he", lang === "he");
  langToggle.classList.toggle("lang-en", lang !== "he");

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

  // Password toggle labels
  document.querySelectorAll(".password-toggle").forEach(btn => {
    const targetId = btn.getAttribute("data-target");
    const input = document.getElementById(targetId);
    const isText = input && input.type === "text";
    btn.textContent = isText ? dict.hide : dict.show;
  });

  // Terms text if open
  if (!termsBackdrop.hidden) {
    termsText.innerHTML = dict["terms.full"];
  }

  // Footer text
  const footer = document.getElementById("footerText");
  if (footer) {
    footer.innerHTML = dict["footer.text"];
  }

  // RESET UI dynamic text
  if (resetStatusMsg) {
    resetStatusMsg.textContent =
      resetFlowStep === "START"
        ? dict.resetStatusStart
        : dict.resetStatusSent;
  }
  if (resetMainBtn) {
    resetMainBtn.textContent =
      resetFlowStep === "START"
        ? dict.resetSendCode
        : dict.resetUpdateLogin;
  }

  localStorage.setItem("authLang", lang);
}

langToggle.addEventListener("click", () => {
  const next = currentLang === "en" ? "he" : "en";
  setLanguage(next);
});

// ---------- PASSWORD TOGGLES ----------
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

// ---------- PASSWORD EVALUATION ----------
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

// ---------- STRENGTH UI (REGISTER) ----------
function updateStrengthUI(password) {
  const dict = i18n[currentLang].strength;
  const result = evaluatePassword(password);
  const score = result.score;

  const reqBox = document.getElementById("passwordRequirements");

  if (!password) {
    regStrengthBar.style.width = "0";
    regStrengthBar.style.background = "transparent";
    regStrengthLabel.textContent = "";
    if (reqBox) reqBox.textContent = "";
    return;
  }

  let label = "";
  let color = "var(--danger)";

  if (score === 100) {
    label = dict.complete;
    color = "var(--success)";
  } else if (score <= 33) {
    label = dict.weak;
    color = "var(--danger)";
  } else if (score <= 66) {
    label = dict.medium;
    color = "var(--warning)";
  } else {
    label = dict.strong;
    color = "var(--success)";
  }

  regStrengthBar.style.width = score + "%";
  regStrengthBar.style.background = color;
  regStrengthLabel.textContent = label;

  if (reqBox) {
    if (score === 100) {
      reqBox.textContent = "";
    } else {
      const hints = {
        length: currentLang === "he" ? "אורך" : "length",
        number: currentLang === "he" ? "מספר" : "number",
        symbol: currentLang === "he" ? "סימן" : "symbol",
        uppercase: currentLang === "he" ? "אות גדולה" : "uppercase"
      };

      const missingText = result.missing.map(k => hints[k]).join(", ");
      reqBox.textContent =
        (currentLang === "he" ? "חסר: " : "Missing: ") + missingText;
    }
  }
}

if (regPassword) {
  regPassword.addEventListener("input", (e) => {
    updateStrengthUI(e.target.value);
    updateRegisterButtonState();
  });
}
if (regConfirmPassword) {
  regConfirmPassword.addEventListener("input", updateRegisterButtonState);
}
if (regTerms) {
  regTerms.addEventListener("change", updateRegisterButtonState);
}

// ---------- REGISTER BUTTON STATE ----------
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

// ---------- REGISTER FLOW ----------
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

    if (!res.ok) {
      throw new Error("start-register failed");
    }

    openVerifyModal(email);
  } catch (err) {
    console.error(err);
    regMessages.textContent = dict.regStartError;
  } finally {
    btn.disabled = false;
  }
});

// ---------- LOGIN FLOW ----------
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

    if (!res.ok) {
      throw new Error("login failed");
    }

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
    console.error(err);
    loginMessages.textContent = dict.loginError;
  }
});

// ---------- FORGOT PASSWORD → OPEN RESET UI ----------
const forgotPasswordBtn = document.getElementById("forgotPassword");
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", () => {
    toggleResetUI(true);
  });
}

// ---------- RESET FLOW ----------

function resetToStartState() {
  resetFlowStep = "START";
  if (resetEmailInput) resetEmailInput.style.display = "block";
  if (resetCodeInput) {
    resetCodeInput.style.display = "none";
    resetCodeInput.value = "";
  }
  if (resetPasswordWrapper) {
    resetPasswordWrapper.style.display = "none";
    if (resetNewPassword) resetNewPassword.value = "";
    if (resetConfirmPassword) resetConfirmPassword.value = "";
  }
  if (resetResendWrapper) resetResendWrapper.style.display = "none";
  if (resetResendCountdown) resetResendCountdown.textContent = "";
  if (resetResendBtn) resetResendBtn.disabled = true;

  const dict = i18n[currentLang];
  if (resetStatusMsg) resetStatusMsg.textContent = dict.resetStatusStart;
  if (resetMainBtn) resetMainBtn.textContent = dict.resetSendCode;

  if (resetCooldownInterval) {
    clearInterval(resetCooldownInterval);
    resetCooldownInterval = null;
  }
}

function toggleResetUI(show) {
  if (!resetInitView || !resetFormView) return;

  // Show reset UI, hide login form
  if (show) {
    setActiveTab("login"); // keep login tab active visually
    loginForm.classList.remove("active");
    resetInitView.style.display = "none";
    resetFormView.style.display = "block";
    resetToStartState();
    if (resetEmailInput && loginEmail) {
      resetEmailInput.value = loginEmail.value;
    }
  } else {
    resetFormView.style.display = "none";
    resetInitView.style.display = "none";
    loginForm.classList.add("active");
    resetToStartState();
  }
}

async function executeResetFlow() {
  const dict = i18n[currentLang];
  if (!resetEmailInput || !resetMainBtn || !resetStatusMsg) return;

  const email = resetEmailInput.value.trim();
  const btn = resetMainBtn;
  const msg = resetStatusMsg;

  if (!email) return;

  if (resetFlowStep === "START") {
    btn.textContent = dict.sending;

    const res = await fetch("/api/auth/start-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang: currentLang })
    });

    if (res.ok) {
      resetFlowStep = "VERIFY";

      msg.textContent = dict.resetStatusSent;

      resetEmailInput.style.display = "none";
      if (resetCodeInput) resetCodeInput.style.display = "block";
      if (resetPasswordWrapper) resetPasswordWrapper.style.display = "block";

      btn.textContent = dict.resetUpdateLogin;

      startResetCooldown();
    } else {
      btn.textContent = dict.tryAgain;
    }
  } else {
    if (!resetCodeInput || !resetNewPassword || !resetConfirmPassword) return;

    const code = resetCodeInput.value.trim();
    const newPassword = resetNewPassword.value;
    const confirm = resetConfirmPassword.value;

    if (!code || !newPassword || newPassword !== confirm) return;

    const evaluation = evaluatePassword(newPassword);
    if (!evaluation.valid) {
      msg.textContent = dict.regPasswordInvalid;
      return;
    }

    const res = await fetch("/api/auth/verify-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code, newPassword })
    });

    const data = await res.json();
    if (data.success) {
      window.location.href = "dashboard.html";
    } else {
      msg.textContent = data.reason || dict.invalidCode;
    }
  }
}

// Auto-submit reset code on 6 digits
if (resetCodeInput) {
  resetCodeInput.addEventListener("input", (e) => {
    if (/^\d{6}$/.test(e.target.value)) {
      executeResetFlow();
    }
  });

  resetCodeInput.addEventListener("paste", (e) => {
    const text = (e.clipboardData || window.clipboardData).getData("text");
    if (/^\d{6}$/.test(text.trim())) {
      e.preventDefault();
      e.target.value = text.trim();
      executeResetFlow();
    }
  });
}

// Strength meter for reset (same rules as register)
if (resetNewPassword && resetStrength) {
  const resetBar = resetStrength.querySelector(".bar");
  const resetReqBoxId = "resetPasswordRequirements";

  // create requirements box dynamically if you want, or reuse same logic
  resetNewPassword.addEventListener("input", (e) => {
    const password = e.target.value;
    const dictStrength = i18n[currentLang].strength;
    const result = evaluatePassword(password);
    const score = result.score;

    if (resetBar) {
      if (!password) {
        resetBar.style.width = "0";
        resetBar.style.background = "transparent";
      } else {
        let color = "var(--danger)";
        if (score === 100) color = "var(--success)";
        else if (score <= 33) color = "var(--danger)";
        else if (score <= 66) color = "var(--warning)";
        else color = "var(--success)";

        resetBar.style.width = score + "%";
        resetBar.style.background = color;
      }
    }

    // Optional: separate requirements box for reset
    let reqBox = document.getElementById(resetReqBoxId);
    if (!reqBox) {
      reqBox = document.createElement("div");
      reqBox.id = resetReqBoxId;
      reqBox.className = "password-help";
      resetStrength.insertAdjacentElement("beforebegin", reqBox);
    }

    if (!password) {
      reqBox.textContent = "";
      return;
    }

    if (score === 100) {
      reqBox.textContent = "";
    } else {
      const hints = {
        length: currentLang === "he" ? "אורך" : "length",
        number: currentLang === "he" ? "מספר" : "number",
        symbol: currentLang === "he" ? "סימן" : "symbol",
        uppercase: currentLang === "he" ? "אות גדולה" : "uppercase"
      };

      const missingText = result.missing.map(k => hints[k]).join(", ");
      reqBox.textContent =
        (currentLang === "he" ? "חסר: " : "Missing: ") + missingText;
    }
  });

  if (resetConfirmPassword) {
    resetConfirmPassword.addEventListener("input", () => {
      // no button state here, but we could add visual mismatch indicator if needed
    });
  }
}

// Resend cooldown for reset
function startResetCooldown() {
  if (!resetResendWrapper || !resetResendBtn || !resetResendCountdown) return;

  resetResendWrapper.style.display = "block";
  resetSecondsLeft = 180;
  resetResendBtn.disabled = true;

  resetResendCountdown.textContent = `${resetSecondsLeft}s`;

  if (resetCooldownInterval) clearInterval(resetCooldownInterval);
  resetCooldownInterval = setInterval(() => {
    resetSecondsLeft--;
    resetResendCountdown.textContent = `${resetSecondsLeft}s`;

    if (resetSecondsLeft <= 0) {
      clearInterval(resetCooldownInterval);
      resetCooldownInterval = null;
      resetResendBtn.disabled = false;
      resetResendCountdown.textContent = "";
    }
  }, 1000);
}

if (resetResendBtn) {
  resetResendBtn.addEventListener("click", async () => {
    if (!resetEmailInput) return;
    const email = resetEmailInput.value.trim();
    if (!email) return;

    await fetch("/api/auth/start-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, lang: currentLang })
    });

    startResetCooldown();
  });
}

// ---------- INIT ----------
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

// ---------- PASSWORD TOGGLE SETUP ----------
setupPasswordToggle("regPasswordToggle", "regPassword");
setupPasswordToggle("regConfirmPasswordToggle", "regConfirmPassword");
setupPasswordToggle("loginPasswordToggle", "loginPassword");

// Also apply toggle behavior to reset password fields (they use data-target only)
document.querySelectorAll(".password-toggle").forEach(btn => {
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

/**
 * Auto-detect return from email and auto-fill verification code
 */
const handleEmailVerificationReturn = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  if (urlParams.get('verify') === 'true') {
    if (typeof openRegisterPopup === 'function') {
      openRegisterPopup();
    }

    setTimeout(async () => {
      const inputField = document.getElementById('verification-input');
      if (!inputField) return;

      try {
        const text = await navigator.clipboard.readText();
        if (/^\d{6}$/.test(text.trim())) {
          inputField.value = text.trim();
          console.log("Auto-pasted code from clipboard.");
        } else {
          const backupCode = localStorage.getItem('pending_verification_code');
          if (backupCode) {
            inputField.value = backupCode;
            localStorage.removeItem('pending_verification_code');
          }
        }
      } catch (err) {
        const backupCode = localStorage.getItem('pending_verification_code');
        if (backupCode) {
          inputField.value = backupCode;
          localStorage.removeItem('pending_verification_code');
        }
      }
    }, 500);
  }
};

window.addEventListener('DOMContentLoaded', handleEmailVerificationReturn);
window.addEventListener('focus', handleEmailVerificationReturn);
