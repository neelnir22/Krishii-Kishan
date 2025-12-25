const express = require("express");
const router = express.Router();
const equipmentController = require("../controllers/equipmentController");

router.get("/", equipmentController.getAllEquipment);
router.post("/rent", equipmentController.rentEquipment);

module.exports = router;
