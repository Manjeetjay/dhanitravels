const express = require("express");
const { uploadImage } = require("../../controllers/uploadController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.post("/images", requireServiceRole, uploadImage);

module.exports = router;
