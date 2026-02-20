const express = require("express");
const router = express.Router();

// Simple endpoint that returns 200 if adminAuth middleware passes
router.get("/", (req, res) => {
    res.json({ valid: true });
});

module.exports = router;
