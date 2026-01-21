const BASE_URL = "https://handwriting-platform.vercel.app";

const messages = {
  en: {
    subject: "Handwriting Platform – Your Verification Code",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;text-align:center;">
        <h2 style="color:#333;">Handwriting Platform</h2>
        <p style="color:#666;">Click the code below to copy it and return to the app:</p>

        <!-- Pointing to the new copy handler page -->
        <a href="${BASE_URL}/copy-handler.html?code=${encodeURIComponent(code)}"
           style="display:inline-block;padding:16px 32px;
                  background:#4A90E2;color:white;
                  border-radius:12px;
                  font-size:36px;
                  font-weight:bold;
                  letter-spacing:6px;
                  text-decoration:none;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ${code}
        </a>

        <p style="margin-top:25px; font-size:14px; color:#999;">
          This code expires in 10 minutes.
        </p>
      </div>
    `
  },
  he: {
    subject: "פלטפורמת הכתב – קוד האימות שלך",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;
                  margin:auto;padding:20px;direction:rtl;text-align:center;">
        <h2 style="color:#333;">פלטפורמת הכתב</h2>
        <p style="color:#666;">לחץ על הקוד למטה כדי להעתיק אותו ולחזור לאפליקציה:</p>

        <a href="${BASE_URL}/copy-handler.html?code=${encodeURIComponent(code)}"
           style="display:inline-block;padding:16px 32px;
                  background:#4A90E2;color:white;
                  border-radius:12px;
                  font-size:36px;
                  font-weight:bold;
                  letter-spacing:6px;
                  text-decoration:none;
                  box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
          ${code}
        </a>

        <p style="margin-top:25px; font-size:14px; color:#999;">
          הקוד בתוקף ל-10 דקות.
        </p>
      </div>
    `
  }
};

export default messages;
