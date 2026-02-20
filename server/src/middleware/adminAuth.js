function adminAuth(req, res, next) {
  const adminKey = process.env.ADMIN_PANEL_KEY;
  const providedKey = req.header("x-admin-key");

  if (!adminKey) {
    return res.status(500).json({
      error: "Server misconfiguration. ADMIN_PANEL_KEY is missing."
    });
  }

  if (!providedKey || providedKey !== adminKey) {
    return res.status(401).json({
      error: "Unauthorized admin request."
    });
  }

  return next();
}

module.exports = { adminAuth };

