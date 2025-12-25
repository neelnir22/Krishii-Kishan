const express = require("express");
const router = express.Router();
const { protect, verifiedOnly } = require("../middleware/authMiddleware");
const soilController = require("../controllers/soilController");

router.post("/", protect, soilController.createSoilTest);

module.exports = router;
