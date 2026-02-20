const express = require("express");
const { listPackages, createPackage, updatePackage, deletePackage } = require("../../controllers/admin/packageController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.get("/", listPackages);
router.post("/", requireServiceRole, createPackage);
router.put("/:id", requireServiceRole, updatePackage);
router.delete("/:id", requireServiceRole, deletePackage);

module.exports = router;
