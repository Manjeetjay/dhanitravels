const express = require("express");
const { getAgencySettings } = require("../../controllers/public/settingsController");

const router = express.Router();

router.get("/", getAgencySettings);

module.exports = router;
