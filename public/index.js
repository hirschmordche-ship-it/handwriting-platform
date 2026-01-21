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

// ---------- RESEND ----------
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

    // Attempt to resend using start-register endpoint
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
      // ignore network errors here; user can try again after cooldown
      console.error("Resend failed", err);
    } finally {
      startResendCooldown();
    }
  });
}

// ---------- AUTO SUBMIT ON 6 DIGITS ----------
if (verifyCodeInput) {
  verifyCodeInput.addEventListener("input", () => {
    verifyMessages.textContent = "";
    if (/^\d{6}$/.test(verifyCodeInput.value)) {
      verifySubmit.click();
    }
  });
}

// ---------- VERIFY ----------
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

    // SUCCESS ANIMATION
    verifyBackdrop.classList.add("verify-success");
    setTimeout(() => {
      // Redirect to dashboard as requested (option B)
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

  // Length (max 50%)
  const lengthScore = Math.min(password.length, minLength) / minLength;
  score += lengthScore * 50;
  if (password.length < minLength) missing.push("length");

  // Number (20%)
  if (hasNumber) score += 20;
  else missing.push("number");

  // Symbol (20%)
  if (hasSymbol) score += 20;
  else missing.push("symbol");

  // Uppercase (10%)
  if (hasEnglish && hasUppercase) score += 10;
  else if (hasEnglish) missing.push("uppercase");

  score = Math.min(score, 100);

  return {
    valid: score === 100,
    score,
    missing
  };
}

// ---------- STRENGTH UI ----------
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

  // Live checklist above the bar
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

// ---------- FORGOT PASSWORD ----------
const forgotPasswordBtn = document.getElementById("forgotPassword");
if (forgotPasswordBtn) {
  forgotPasswordBtn.addEventListener("click", () => {
    const dict = i18n[currentLang];
    openModal(dict["login.forgot"], dict.forgotInfo);
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

  // Initialize strength UI + button state
  updateStrengthUI("");
  updateRegisterButtonState();
}

document.addEventListener("DOMContentLoaded", init);

// ---------- PASSWORD TOGGLE SETUP ----------
setupPasswordToggle("regPasswordToggle", "regPassword");
setupPasswordToggle("regConfirmPasswordToggle", "regConfirmPassword");
setupPasswordToggle("loginPasswordToggle", "loginPassword");

/**
 * Auto-detect return from email and auto-fill verification code
 */
const handleEmailVerificationReturn = async () => {
  const urlParams = new URLSearchParams(window.location.search);

  // 1. Detect if the user was sent back from the copy-handler bridge page
  if (urlParams.get('verify') === 'true') {
    
    // Replace 'openRegisterPopup' with the exact name of the function 
    // in your index.js that shows the registration/verification modal.
    if (typeof openRegisterPopup === 'function') {
      openRegisterPopup();
    }

    // 2. Attempt to auto-fill the code field
    // Give the popup a tiny bit of time to render (500ms)
    setTimeout(async () => {
      // Replace 'verification-input' with the actual ID of your input field
      const inputField = document.getElementById('verification-input');
      if (!inputField) return;

      try {
        // A. Try reading from the clipboard first
        const text = await navigator.clipboard.readText();
        if (/^\d{6}$/.test(text.trim())) {
          inputField.value = text.trim();
          console.log("Auto-pasted code from clipboard.");
        } else {
          // B. Fallback: Try reading from localStorage (if bridge page saved it)
          const backupCode = localStorage.getItem('pending_verification_code');
          if (backupCode) {
            inputField.value = backupCode;
            localStorage.removeItem('pending_verification_code'); // Clean up
          }
        }
      } catch (err) {
        // C. Final Fallback for browsers that block clipboard access without click
        const backupCode = localStorage.getItem('pending_verification_code');
        if (backupCode) {
          inputField.value = backupCode;
          localStorage.removeItem('pending_verification_code');
        }
      }
    }, 500);
  }
};

// Run on initial page load
window.addEventListener('DOMContentLoaded', handleEmailVerificationReturn);

// Run if the user switches back to the tab from their email app
window.addEventListener('focus', handleEmailVerificationReturn);
