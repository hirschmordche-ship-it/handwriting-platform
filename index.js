let userInitiatedRegister = false;
// Language state
let currentLang = "en"; // "en" or "he"

// Text dictionary
const i18n = {
    en: {
        "register.title": "Create account",
        "register.emailLabel": "Email",
        "register.emailPlaceholder": "you@example.com",
        "register.passwordLabel": "Password",
        "register.passwordPlaceholder": "Password",
        "register.confirmLabel": "Confirm password",
        "register.confirmPlaceholder": "Confirm password",
        "register.terms": "I agree to the terms.",
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
        loginInvalid: "Please enter email and password."
    },
    he: {
        "register.title": "יצירת חשבון",
        "register.emailLabel": "אימייל",
        "register.emailPlaceholder": "name@domain.com",
        "register.passwordLabel": "סיסמה",
        "register.passwordPlaceholder": "סיסמה",
        "register.confirmLabel": "אישור סיסמה",
        "register.confirmPlaceholder": "אישור סיסמה",
        "register.terms": "אני מאשר את תנאי השימוש.",
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
        loginInvalid: "אנא הזן אימייל וסיסמה."
    }
};

// DOM
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

const rememberMe = document.getElementById("rememberMe");
const loginEmail = document.getElementById("loginEmail");
const regEmail = document.getElementById("regEmail");

// Modal
const modalBackdrop = document.getElementById("modalBackdrop");
const modalTitle = document.getElementById("modalTitle");
const modalBody = document.getElementById("modalBody");
const modalClose = document.getElementById("modalClose");
const modalOk = document.getElementById("modalOk");
const forgotPasswordBtn = document.getElementById("forgotPassword");

// Utility: open/close modal
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

// Dark mode toggle
function setMode(mode) {
    body.classList.remove("light-mode", "dark-mode");
    body.classList.add(mode === "dark" ? "dark-mode" : "light-mode");
    modeToggle.textContent = mode === "dark" ? "🌙" : "☀️";
    localStorage.setItem("themeMode", mode);
}

modeToggle.addEventListener("click", () => {
    const isDark = body.classList.contains("dark-mode");
    setMode(isDark ? "light" : "dark");
});

// Language switch
function setLanguage(lang) {
    currentLang = lang;
    body.classList.remove("ltr", "rtl");
    if (lang === "he") {
        body.classList.add("rtl");
        document.documentElement.lang = "he";
        langToggle.textContent = "HE";
    } else {
        body.classList.add("ltr");
        document.documentElement.lang = "en";
        langToggle.textContent = "EN";
    }

    // Update i18n text
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

    // Update password toggle buttons text based on current visibility
    document.querySelectorAll(".password-toggle").forEach(btn => {
        const targetId = btn.getAttribute("data-target");
        const input = document.getElementById(targetId);
        const isText = input && input.type === "text";
        btn.textContent = isText ? dict.hide : dict.show;
    });

    localStorage.setItem("authLang", lang);
}

langToggle.addEventListener("click", () => {
    const next = currentLang === "en" ? "he" : "en";
    setLanguage(next);
});

// Password visibility toggle
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

// Password strength + rules
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

    // base rules: number + symbol always required
    if (!hasNumber || !hasSymbol) {
        return { valid: false, score: 1, reason: "weak" };
    }

    // uppercase condition only if English letters present
    if (hasEnglish && !hasUppercase) {
        return { valid: false, score: 2, reason: "medium" };
    }

    // scoring for strength display
    let score = 0;
    if (password.length >= 8) score++;
    if (password.length >= 12) score++;
    if (hasNumber) score++;
    if (hasSymbol) score++;
    if (hasEnglish && hasUppercase) score++;
    if (hasHebrew) score++; // consider Hebrew richness as variety

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
});

// Form submit handlers (front-end only; hook Supabase later)
registerForm.addEventListener("submit", (e) => {
    e.preventDefault();
    regMessages.textContent = "";

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

    // Here you’d call Supabase registration.
    // For now, just show modal and clear password fields.
    if (userInitiatedRegister) {
    openModal(dict["register.title"], "Registration would be processed here.");
    userInitiatedRegister = false;
}
    regPassword.value = "";
    regConfirmPassword.value = "";
    updateStrengthUI("");
});

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

    // Remember me
    if (rememberMe.checked) {
        localStorage.setItem("rememberedEmail", email);
    } else {
        localStorage.removeItem("rememberedEmail");
    }

    // Here you’d call Supabase login.
    openModal(dict["login.title"], "Login would be processed here.");
});

// Forgot password
forgotPasswordBtn.addEventListener("click", () => {
    const dict = i18n[currentLang];
    openModal(dict["login.forgot"], dict.forgotInfo);
});

// Auto-initialize language, theme, remembered user
function init() {
    modalBackdrop.hidden = true;
    // Theme
    const savedTheme = localStorage.getItem("themeMode");
    setMode(savedTheme === "dark" ? "dark" : "light");

    // Language
    const savedLang = localStorage.getItem("authLang");
    setLanguage(savedLang === "he" ? "he" : "en");

    // Remembered user
    const rememberedEmail = localStorage.getItem("rememberedEmail");
    if (rememberedEmail) {
        loginEmail.value = rememberedEmail;
        setActiveTab("login");
    } else {
        setActiveTab("register");
    }

    // Strength meter initial reset
    updateStrengthUI("");
}

// Terms modal
const termsBackdrop = document.getElementById("termsBackdrop");
const openTerms = document.getElementById("openTerms");
const termsClose = document.getElementById("termsClose");
const termsOk = document.getElementById("termsOk");

openTerms.addEventListener("click", () => {
    termsBackdrop.hidden = false;
});

termsClose.addEventListener("click", () => {
    termsBackdrop.hidden = true;
});

termsOk.addEventListener("click", () => {
    termsBackdrop.hidden = true;
});

termsBackdrop.addEventListener("click", (e) => {
    if (e.target === termsBackdrop) termsBackdrop.hidden = true;
});

document.addEventListener("DOMContentLoaded", init);

