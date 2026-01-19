import getRawBody from "raw-body";
import { Resend } from "resend";

export default async function handler(req, res) {
  console.log("🔵 /api/contact invoked");

  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  // Parse JSON safely
  let body;
  try {
    const raw = await getRawBody(req);
    body = JSON.parse(raw.toString());
    console.log("STEP 1: Body received", body);
  } catch (e) {
    console.error("JSON parse failed:", e);
    return res.status(400).json({ error: "Invalid JSON" });
  }

  const { email, message } = body;

  console.log("STEP 2: Sending contact email");

  const resend = new Resend(process.env.RESEND_API_KEY);

  const { error } = await resend.emails.send({
    from: process.env.VERIFICATION_EMAIL_FROM,
    to: process.env.CONTACT_RECEIVER,
    subject: "New Contact Form Submission",
    html: `<p>From: ${email}</p><p>${message}</p>`,
  });

  if (error) {
    console.error("Email failed:", error);
    return res.status(500).json({ error: "Failed to send message" });
  }

  console.log("STEP 3: Contact message sent");

  return res.status(200).json({ success: true });
}
