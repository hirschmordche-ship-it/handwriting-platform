import { Resend } from "resend";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const body = JSON.parse(req.body);
const { email, message } = body;

    if (!email || !message) {
      return res.status(400).json({ error: "Missing email or message" });
    }

    // Load environment variables
    const resend = new Resend(process.env.RESEND_API_KEY);

    // Store in Supabase
    const insertRes = await fetch(`${process.env.SUPABASE_URL}/rest/v1/contact_messages`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        apikey: process.env.SUPABASE_SERVICE_ROLE_KEY,
        Authorization: `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
        Prefer: "return=minimal"
      },
      body: JSON.stringify({ email, message })
    });

    if (!insertRes.ok) {
      const text = await insertRes.text();
      console.error("Supabase insert error:", text);
      return res.status(500).json({ error: "Failed to store message" });
    }

    // Auto-reply to user
    await resend.emails.send({
      from: "Handwriting To Text Platform Support <onboarding@resend.dev>",
      to: email,
      subject: "We received your message",
      text: `Hi,

Thanks for reaching out to the Handwriting To Text Platform Support.
We’ve received your message and will get back to you as soon as we can.

Your message:
${message}

Best,
Handwriting To Text Platform Support`
    });

    // Admin notification
    await resend.emails.send({
      from: "Handwriting To Text Platform Support <onboarding@resend.dev>",
      to: "hirschmordche@gmail.com",
      subject: "New contact form message",
      text: `New message from: ${email}

Message:
${message}

Sent via Handwriting To Text Platform contact page.`
    });

    return res.status(200).json({ ok: true });
  } catch (err) {
    console.error("Contact API error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
