const express = require("express");
const { submitLead } = require("../../controllers/public/leadController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.post("/", requireServiceRole, submitLead);

module.exports = router;
