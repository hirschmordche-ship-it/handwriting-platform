console.log("🔥 start-register.cjs loaded");

module.exports = async (req, res) => {
  console.log("✅ handler invoked", { method: req.method });

  return res.status(200).json({
    ok: true,
    method: req.method
  });
};
