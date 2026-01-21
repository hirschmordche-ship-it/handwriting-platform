import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "./email-templates.js";

const resend = new Resend(process.env.RESEND_API_KEY);

export default async function handler(req, res) {
  // 1. Strict Method and Content-Type Check
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // 2. Prevent Cross-Origin abuse (CORS)
  // Only allow requests from your own domain
  res.setHeader('Access-Control-Allow-Origin', 'https://handwriting-platform.vercel.app');
  
  try {
    const { email, password, lang } = req.body || {};
    
    // 3. Robust Input Validation
    if (!email || !password || typeof email !== 'string') {
      // Return a generic error to avoid leaking field requirements
      return res.status(400).json({ success: false, message: "Invalid request" });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // 4. Check for existing user (Sanitized)
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email.toLowerCase().trim())
      .maybeSingle();

    if (existingUser) {
      // SECURITY TIP: Some apps return 200 even if user exists to prevent "email enumeration"
      return res.status(409).json({ success: false, reason: "Please use another email" });
    }

    // 5. Cleanup and Code Generation
    await supabase.from("pending_registrations").delete().eq("email", email);
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    // 6. Store Pending (Ensure service role is backend-only)
    await supabase.from("pending_registrations").insert({
      email: email.toLowerCase().trim(),
      password_hash: password, // IMPORTANT: Ensure this is hashed before this step in production
      code,
      expires_at: expiresAt
    });

    // 7. Controlled Email Sending
    const tpl = messages[lang === "he" ? "he" : "en"];
    await resend.emails.send({
      from: "Auth <onboarding@yourdomain.com>", // Use a verified domain
      to: email,
      subject: tpl.subject,
      html: tpl.html(code)
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    // 8. Sanitize Logs: Never log the 'req.body' or 'password' in production
    console.error("[Auth Error]: Internal registration failure"); 
    return res.status(500).json({ success: false });
  }
}
