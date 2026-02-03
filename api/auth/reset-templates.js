const BASE_URL = "https://handwriting-platform.vercel.app";

const resetMessages = {
  en: {
    subject: "Secure Password Reset Code",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;text-align:center;">
        <h2 style="color:#333;">Password Reset Request</h2>
        <p style="color:#666;">
          Use the secure code below to update your password. 
          If you didn't request this, you can safely ignore this email.
        </p>

        <div style="display:inline-block;padding:16px 32px;background:#4A90E2;color:white;border-radius:12px;font-size:32px;font-weight:bold;letter-spacing:4px;">
          ${code}
        </div>

        <p style="margin-top:25px; font-size:14px; color:#999;">
          Expires in 10 minutes.
        </p>
      </div>
    `
  },

  he: {
    subject: "קוד מאובטח לאיפוס סיסמה",
    html: (code) => `
      <div style="font-family:Arial,sans-serif;max-width:600px;margin:auto;padding:20px;direction:rtl;text-align:center;">
        <h2 style="color:#333;">בקשה לאיפוס סיסמה</h2>

        <p style="color:#666;">
          השתמש בקוד המאובטח למטה כדי לעדכן את הסיסמה שלך. 
          אם לא ביקשת איפוס סיסמה — ניתן להתעלם מהודעה זו.
        </p>

        <div style="display:inline-block;padding:16px 32px;background:#4A90E2;color:white;border-radius:12px;font-size:32px;font-weight:bold;letter-spacing:4px;">
          ${code}
        </div>

        <p style="margin-top:25px; font-size:14px; color:#999;">
          הקוד בתוקף ל‑10 דקות.
        </p>
      </div>
    `
  }
};

export default resetMessages;
