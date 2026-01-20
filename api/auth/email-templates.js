const BASE_URL = "https://handwriting-platform.vercel.app";

const messages = {
  en: {
    subject: "Handwriting Platform – Verify Your Account",
    html: (code, email) => `
      <div style="
        font-family:Arial, sans-serif;
        max-width:600px;
        margin:auto;
        padding:20px;
        background:#f7f7f7;
        border-radius:12px;
      ">

        <div style="
          background:#ffffff;
          padding:30px;
          border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          color:#333;
        ">

          <h1 style="color:#4A90E2; margin-top:0;">
            Handwriting Platform
          </h1>

          <p style="font-size:16px;">
            Your verification code is below.  
            Tap the code to copy it, or use the button below to verify instantly.
          </p>

          <!-- CODE AS BUTTON (LINK TO COPY PAGE) -->
          <a href="${BASE_URL}/copy?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&lang=en"
             style="
               display:inline-block;
               padding:16px 28px;
               background:#4A90E2;
               color:white;
               border-radius:10px;
               font-size:32px;
               letter-spacing:4px;
               text-decoration:none;
               margin:30px 0;
             ">
            ${code}
          </a>

          <!-- VERIFY BUTTON -->
          <a href="${BASE_URL}/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&lang=en"
             style="
               display:inline-block;
               padding:14px 20px;
               background:#2ECC71;
               color:white;
               border-radius:8px;
               text-decoration:none;
               font-size:18px;
               margin-bottom:20px;
             ">
            Verify My Account
          </a>

          <p style="font-size:14px;">
            This code expires in 10 minutes.
          </p>

          <p style="font-size:12px; color:#999; margin-top:40px;">
            If you did not request this email, you can safely ignore it.
          </p>

        </div>
      </div>
    `
  },

  he: {
    subject: "פלטפורמת הכתב – אימות החשבון שלך",
    html: (code, email) => `
      <div style="
        font-family:Arial, sans-serif;
        max-width:600px;
        margin:auto;
        padding:20px;
        background:#f7f7f7;
        border-radius:12px;
        direction:rtl;
        text-align:right;
      ">

        <div style="
          background:#ffffff;
          padding:30px;
          border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          color:#333;
        ">

          <h1 style="color:#4A90E2; margin-top:0;">
            פלטפורמת הכתב
          </h1>

          <p style="font-size:16px;">
            קוד האימות שלך מופיע למטה.  
            ניתן לגעת בקוד כדי להעתיק אותו, או להשתמש בכפתור למטה לאימות מיידי.
          </p>

          <!-- CODE AS BUTTON (LINK TO COPY PAGE) -->
          <a href="${BASE_URL}/copy?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&lang=he"
             style="
               display:inline-block;
               padding:16px 28px;
               background:#4A90E2;
               color:white;
               border-radius:10px;
               font-size:32px;
               letter-spacing:4px;
               text-decoration:none;
               margin:30px 0;
             ">
            ${code}
          </a>

          <!-- VERIFY BUTTON -->
          <a href="${BASE_URL}/verify?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}&lang=he"
             style="
               display:inline-block;
               padding:14px 20px;
               background:#2ECC71;
               color:white;
               border-radius:8px;
               text-decoration:none;
               font-size:18px;
               margin-bottom:20px;
             ">
            אמת את החשבון שלי
          </a>

          <p style="font-size:14px;">
            הקוד יפוג בעוד 10 דקות.
          </p>

          <p style="font-size:12px; color:#999; margin-top:40px;">
            אם לא ביקשת את המייל הזה, ניתן להתעלם ממנו.
          </p>

        </div>
      </div>
    `
  }
};

export default messages;
