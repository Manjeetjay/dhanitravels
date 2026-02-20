const express = require("express");
const destinationRoutes = require("./destinationRoutes");
const packageRoutes = require("./packageRoutes");
const hotelRoutes = require("./hotelRoutes");
const leadRoutes = require("./leadRoutes");
const settingsRoutes = require("./settingsRoutes");

const router = express.Router();

router.use("/destinations", destinationRoutes);
router.use("/packages", packageRoutes);
router.use("/hotels", hotelRoutes);
router.use("/leads", leadRoutes);
router.use("/settings", settingsRoutes);

module.exports = router;
