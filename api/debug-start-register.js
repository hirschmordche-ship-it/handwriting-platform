// api/debug-start-register.js
export default function handler(req, res) {
  res.status(200).json({ success: true, note: "debug route OK" });
}
