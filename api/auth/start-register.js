// api/auth/start-register.js
export const config = { runtime: "nodejs" };

import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";
import messages from "./email-templates.js";

const RATE_LIMIT_MAX = 5;
const RATE_LIMIT_WINDOW = 60 * 60 * 1000;
const rateMap = new Map();

export default async function handler(req, res) {
  try {
    if (req.method !== "POST") {
      return res.status(405).json({ success: false });
    }

    const { email, lang } = req.body || {};
    if (!email) {
      return res.status(200).json({ success: true });
    }

    const ip = req.headers["x-forwarded-for"] || "unknown";
    const now = Date.now();
    const rate = rateMap.get(ip) || { count: 0, start: now };

    if (now - rate.start > RATE_LIMIT_WINDOW) {
      rate.count = 0;
      rate.start = now;
    }

    rate.count++;
    rateMap.set(ip, rate);

    if (rate.count > RATE_LIMIT_MAX) {
      return res.status(200).json({ success: true });
    }

    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("email", email)
      .maybeSingle();

    if (existingUser) {
      return res.status(200).json({ success: true });
    }

    await supabase
      .from("pending_registrations")
      .delete()
      .eq("email", email);

    const code = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000).toISOString();

    await supabase.from("pending_registrations").insert({
      email,
      code,
      language: lang || "en",
      expires_at: expiresAt
    });

    console.log("[ANALYTICS] registration_start", email);

    const resend = new Resend(process.env.RESEND_API_KEY);
    const msg = messages[lang] || messages.en;

    await resend.emails.send({
      from: "Handwriting Platform <onboarding@resend.dev>",
      to: email,
      subject: msg.subject,
      html: msg.html(code)
    });

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error(err);
    return res.status(200).json({ success: true });
  }
}
