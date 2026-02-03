// api/auth/email-templates.js

const BASE_URL = "https://handwriting-platform.vercel.app";

const messages = {
  en: {
    subject: "Handwriting Platform – Verify Your Account",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;">
        <h2>Handwriting Platform</h2>

        <p>Your verification code:</p>

        <a href="${BASE_URL}/copy.html?code=${encodeURIComponent(code)}"
           style="display:inline-block;padding:16px 28px;
                  background:#4A90E2;color:white;
                  border-radius:10px;
                  font-size:32px;
                  letter-spacing:4px;
                  text-decoration:none;">
          ${code}
        </a>

        <p style="margin-top:20px;">
          <a href="${BASE_URL}/verify.html?code=${encodeURIComponent(code)}"
             style="display:inline-block;padding:10px 16px;
                    background:#2ECC71;color:white;
                    border-radius:6px;
                    text-decoration:none;">
            Verify my account
          </a>
        </p>

        <p>This code expires in 10 minutes.</p>
        <p>If you didn’t request this, you can safely ignore this email.</p>
      </div>
    `
  },

  he: {
    subject: "פלטפורמת הכתב – אימות החשבון שלך",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;
                  margin:auto;padding:20px;direction:rtl;text-align:right;">
        <h2>פלטפורמת הכתב</h2>

        <p>קוד האימות שלך:</p>

        <a href="${BASE_URL}/copy.html?code=${encodeURIComponent(code)}"
           style="display:inline-block;padding:16px 28px;
                  background:#4A90E2;color:white;
                  border-radius:10px;
                  font-size:32px;
                  letter-spacing:4px;
                  text-decoration:none;">
          ${code}
        </a>

        <p style="margin-top:20px;">
          <a href="${BASE_URL}/verify.html?code=${encodeURIComponent(code)}"
             style="display:inline-block;padding:10px 16px;
                    background:#2ECC71;color:white;
                    border-radius:6px;
                    text-decoration:none;">
            אמת חשבון
          </a>
        </p>

        <p>הקוד בתוקף ל-10 דקות.</p>
        <p>אם לא ביקשת את המייל, ניתן להתעלם ממנו.</p>
      </div>
    `
  }
};

export default messages;
