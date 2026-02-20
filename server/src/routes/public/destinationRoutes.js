const express = require("express");
const { listDestinations, getDestinationDetails } = require("../../controllers/public/destinationController");

const router = express.Router();

router.get("/", listDestinations);
router.get("/:idOrSlug", getDestinationDetails);

module.exports = router;
