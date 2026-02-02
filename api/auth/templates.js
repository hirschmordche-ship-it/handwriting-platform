export default async function handler(req, res) {
  const { type } = req.query;

  if (type === "register") {
    return res.status(200).json({
      subject: "Verify your registration",
      body: "Your verification code is: {{code}}"
    });
  }

  if (type === "reset") {
    return res.status(200).json({
      subject: "Reset your password",
      body: "Your reset code is: {{code}}"
    });
  }

  return res.status(400).json({ error: "Invalid template type" });
}
