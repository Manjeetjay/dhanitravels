const express = require("express");
const { listDestinations, createDestination, updateDestination, deleteDestination } = require("../../controllers/admin/destinationController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.get("/", listDestinations);
router.post("/", requireServiceRole, createDestination);
router.put("/:id", requireServiceRole, updateDestination);
router.delete("/:id", requireServiceRole, deleteDestination);

module.exports = router;
