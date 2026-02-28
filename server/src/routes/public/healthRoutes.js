const express = require("express");
const { getHealth } = require("../../controllers/public/healthController");

const router = express.Router();

router.get("/", getHealth);

module.exports = router;
