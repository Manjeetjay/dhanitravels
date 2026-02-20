const express = require("express");
const { listPackages, getPackageDetails } = require("../../controllers/public/packageController");

const router = express.Router();

router.get("/", listPackages);
router.get("/:id", getPackageDetails);

module.exports = router;
