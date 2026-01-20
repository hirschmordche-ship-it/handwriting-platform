// api/auth/email-templates.js

export const messages = {
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

        <style>
          :root {
            --brand-color: #4A90E2;
            --accent-color: #2ECC71;
            --text-color: #333;
            --bg-color: #ffffff;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --brand-color: #6AB0FF;
              --accent-color: #4CD98A;
              --text-color: #E6E6E6;
              --bg-color: #1F1F1F;
            }
          }
        </style>

        <div style="
          background:var(--bg-color);
          padding:30px;
          border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          color:var(--text-color);
        ">

          <h1 style="color:var(--brand-color); margin-top:0;">
            Handwriting Platform
          </h1>

          <p style="font-size:16px;">
            Thank you for joining the Handwriting Platform!  
            To complete your registration, please verify your account.
          </p>

          <h2 style="
            font-size:32px;
            letter-spacing:4px;
            text-align:center;
            margin:30px 0;
            color:var(--text-color);
          ">
            ${code}
          </h2>

          <p>Copy your code quickly:</p>

          <a href="https://yourdomain.com/copy?code=${code}"
             style="
               display:inline-block;
               padding:12px 20px;
               background:var(--brand-color);
               color:white;
               border-radius:6px;
               text-decoration:none;
               font-size:16px;
               margin-bottom:20px;
             ">
            Copy Code
          </a>

          <p>Or verify instantly:</p>

          <a href="https://yourdomain.com/verify?email=${encodeURIComponent(email)}&code=${code}"
             style="
               display:inline-block;
               padding:12px 20px;
               background:var(--accent-color);
               color:white;
               border-radius:6px;
               text-decoration:none;
               font-size:16px;
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

        <style>
          :root {
            --brand-color: #4A90E2;
            --accent-color: #2ECC71;
            --text-color: #333;
            --bg-color: #ffffff;
          }

          @media (prefers-color-scheme: dark) {
            :root {
              --brand-color: #6AB0FF;
              --accent-color: #4CD98A;
              --text-color: #E6E6E6;
              --bg-color: #1F1F1F;
            }
          }
        </style>

        <div style="
          background:var(--bg-color);
          padding:30px;
          border-radius:12px;
          box-shadow:0 4px 20px rgba(0,0,0,0.08);
          color:var(--text-color);
        ">

          <h1 style="color:var(--brand-color); margin-top:0;">
            פלטפורמת הכתב
          </h1>

          <p style="font-size:16px;">
            תודה שהצטרפת לפלטפורמת הכתב!  
            כדי להשלים את ההרשמה, יש לאמת את החשבון שלך.
          </p>

          <h2 style="
            font-size:32px;
            letter-spacing:4px;
            text-align:center;
            margin:30px 0;
            color:var(--text-color);
          ">
            ${code}
          </h2>

          <p>להעתקה מהירה של הקוד:</p>

          <a href="https://yourdomain.com/copy?code=${code}"
             style="
               display:inline-block;
               padding:12px 20px;
               background:var(--brand-color);
               color:white;
               border-radius:6px;
               text-decoration:none;
               font-size:16px;
               margin-bottom:20px;
             ">
            העתק קוד
          </a>

          <p>או אימות מיידי בלחיצה אחת:</p>

          <a href="https://yourdomain.com/verify?email=${encodeURIComponent(email)}&code=${code}"
             style="
               display:inline-block;
               padding:12px 20px;
               background:var(--accent-color);
               color:white;
               border-radius:6px;
               text-decoration:none;
               font-size:16px;
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
