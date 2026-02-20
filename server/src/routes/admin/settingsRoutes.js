const express = require("express");
const { updateAgencySettings } = require("../../controllers/admin/settingsController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.put("/", requireServiceRole, updateAgencySettings);

module.exports = router;
