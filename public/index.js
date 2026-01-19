// ======================================================
// LANGUAGE + GLOBAL STATE
// ======================================================
let currentLang = "en";
let pendingRegisterEmail = "";

// ======================================================
// I18N DICTIONARY
// ======================================================
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

// ======================================================
// DOM REFERENCES
// ======================================================
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

// Verification modal
const verifyBackdrop = document.getElementById("verifyBackdrop");
const verifyClose = document.getElementById("verifyClose");
const verifyTitle = document.getElementById("verifyTitle");
const verifyMessage = document.getElementById("verifyMessage");
const verifyCodeInput = document.getElementById("verifyCodeInput");
const verifySubmit = document.getElementById("verifySubmit");
const verifyMessages = document.getElementById("verifyMessages");

// ======================================================
// PASSWORD EVALUATION (MATHEMATICAL MODEL)
// ======================================================
function evaluatePassword(password) {
  const minLength = 8;
  const hasEnglish = /[A-Za-z]/.test(password);
  const hasUppercase = /[A-Z]/.test(password);
  const hasNumber = /\d/.test(password);
  const hasSymbol = /[^A-Za-z0-9\u0590-\u05FF]/.test(password);

  let score = 0;

  // Length (max 50%)
  const lengthScore = Math.min(password.length, minLength) / minLength;
  score += lengthScore * 50;

  // Number (20%)
  if (hasNumber) score += 20;

  // Symbol (20%)
  if (hasSymbol) score += 20;

  // Uppercase (10%)
  if (hasEnglish && hasUppercase) score += 10;

  score = Math.min(score, 100);

  const missing = [];
  if (password.length < minLength) missing.push("length");
  if (!hasNumber) missing.push("number");
  if (!hasSymbol) missing.push("symbol");
  if (hasEnglish && !hasUppercase) missing.push("uppercase");

  return { score, missing };
}

// ======================================================
// UPDATE STRENGTH BAR UI
// ======================================================
function updateStrengthUI(password) {
  const dict = i18n[currentLang].strength;
  const result = evaluatePassword(password);
  const score = result.score;

  console.log("[DEBUG] Score:", score, "Missing:", result.missing);

  if (!password) {
    regStrengthBar.style.width = "0";
    regStrengthBar.style.background = "transparent";
    regStrengthLabel.textContent = "";
    regStrengthBar.title = "";
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
  regStrengthBar.title = score + "%";

  const help = document.querySelector(".password-help");
  if (help) {
    if (score === 100) {
      help.textContent =
        currentLang === "he"
          ? "הסיסמה עומדת בכל הדרישות."
          : "Password meets all requirements.";
    } else {
      const hints = {
        length: currentLang === "he" ? "אורך" : "length",
        number: currentLang === "he" ? "מספר" : "number",
        symbol: currentLang === "he" ? "סימן" : "symbol",
        uppercase: currentLang === "he" ? "אות גדולה" : "uppercase"
      };
      help.textContent =
        (currentLang === "he" ? "חסר: " : "Missing: ") +
        result.missing.map(k => hints[k]).join(", ");
    }
  }
}

// ======================================================
// PASSWORD INPUT LISTENERS
// ======================================================
regPassword.addEventListener("input", (e) => {
  updateStrengthUI(e.target.value);
  updateRegisterButtonState();
});
regConfirmPassword.addEventListener("input", updateRegisterButtonState);
regTerms.addEventListener("change", updateRegisterButtonState);

// ======================================================
// REGISTER BUTTON ENABLE LOGIC
// ======================================================
function updateRegisterButtonState() {
  const password = regPassword.value;
  const confirm = regConfirmPassword.value;
  const terms = regTerms.checked;

  const score = evaluatePassword(password).score;
  const valid = score === 100 && password === confirm && terms;

  const btn = document.getElementById("registerButton");
  if (valid) btn.classList.add("enabled");
  else btn.classList.remove("enabled");
}

// ======================================================
// REGISTER FLOW
// ======================================================
registerForm.addEventListener("submit", async (e) => {
  e.preventDefault();
  regMessages.textContent = "";

  const dict = i18n[currentLang];
  const btn = document.getElementById("registerButton");
  if (!btn.classList.contains("enabled")) return;

  const email = regEmail.value.trim();
  const password = regPassword.value;
  const confirm = regConfirmPassword.value;

  if (!regTerms.checked) {
    regMessages.textContent = dict.regTermsMissing;
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

    if (!res.ok) throw new Error("start-register failed");

    openVerifyModal(email);
  } catch (err) {
    console.error(err);
    regMessages.textContent = dict.regStartError;
  } finally {
    btn.disabled = false;
  }
});

// ======================================================
// VERIFY FLOW
// ======================================================
verifySubmit.addEventListener("click", async () => {
  const dict = i18n[currentLang];
  verifyMessages.textContent = "";

  const code = verifyCodeInput.value.trim();
  if (!pendingRegisterEmail || !code) {
    verifyMessages.textContent = dict.regVerifyError;
    return;
  }

  try {
    verifySubmit.disabled = true;

    const res = await fetch("/api/auth/verify-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: pendingRegisterEmail, code })
    });

    if (!res.ok) throw new Error("verify failed");

    const data = await res.json();
    if (!data.success) {
      verifyMessages.textContent = dict.regVerifyError;
      return;
    }

    window.location.href = "upload.html";
  } catch (err) {
    console.error(err);
    verifyMessages.textContent = dict.regVerifyError;
  } finally {
    verifySubmit.disabled = false;
  }
});

// ======================================================
// LOGIN FLOW
// ======================================================
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

    if (!res.ok) throw new Error("login failed");

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

// ======================================================
// FORGOT PASSWORD
// ======================================================
document.getElementById("forgotPassword").addEventListener("click", () => {
  const dict = i18n[currentLang];
  openModal(dict["login.forgot"], dict.forgotInfo);
});

// ======================================================
// MODAL HELPERS
// ======================================================
function openModal(title, message) {
  modalTitle.textContent = title;
  modalBody.textContent = message;
  modalBackdrop.hidden = false;
}

function closeModal()
