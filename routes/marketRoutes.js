const express = require("express");
const router = express.Router();
const { protect, verifiedOnly } = require("../middleware/authMiddleware");
const marketController = require("../controllers/marketController");

router.post("/list", protect, marketController.createListing);

module.exports = router;
