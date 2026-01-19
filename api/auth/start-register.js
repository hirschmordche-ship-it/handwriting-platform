// root/api/auth/start-register.js
export default function handler(req, res) {
  console.log("🔥 MINIMAL FILE LOADED");
  return res.status(200).json({ ok: true });
}
