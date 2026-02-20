const express = require("express");
const { listLeads } = require("../../controllers/admin/leadController");

const router = express.Router();

router.get("/", listLeads);

module.exports = router;
