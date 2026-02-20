const express = require("express");
const { listHotels } = require("../../controllers/public/hotelController");

const router = express.Router();

router.get("/", listHotels);

module.exports = router;
