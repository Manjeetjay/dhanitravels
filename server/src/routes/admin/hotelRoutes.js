const express = require("express");
const { listHotels, createHotel, updateHotel, deleteHotel } = require("../../controllers/admin/hotelController");
const { requireServiceRole } = require("../../middleware/serviceRoleGuard");

const router = express.Router();

router.get("/", listHotels);
router.post("/", requireServiceRole, createHotel);
router.put("/:id", requireServiceRole, updateHotel);
router.delete("/:id", requireServiceRole, deleteHotel);

module.exports = router;
