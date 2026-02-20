const express = require("express");
const { adminAuth } = require("../../middleware/adminAuth");
const destinationRoutes = require("./destinationRoutes");
const packageRoutes = require("./packageRoutes");
const hotelRoutes = require("./hotelRoutes");
const leadRoutes = require("./leadRoutes");
const settingsRoutes = require("./settingsRoutes");
const uploadRoutes = require("./uploadRoutes");
const verifyRoutes = require("./verifyRoutes");

const router = express.Router();

router.use(adminAuth);

router.use("/verify", verifyRoutes);
router.use("/destinations", destinationRoutes);
router.use("/packages", packageRoutes);
router.use("/hotels", hotelRoutes);
router.use("/uploads", uploadRoutes);
router.use("/leads", leadRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;

