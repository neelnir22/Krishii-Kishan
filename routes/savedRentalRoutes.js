const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const savedRentalController = require("../controllers/savedRentalController");

router.post("/", protect, savedRentalController.saveRental);
// router.get("/", protect, savedRentalController.getSavedRentals); 
// Note: User ID is extracted from token in controller or here?
// The controller currently expects req.user from logic or userId in body? 
// Let's check controller logic. Usually middleware adds req.user.
// For now, assume controller will be updated or already uses req.user/userId. 
// But wait, the previous controller code I saw for saveRental took userId from body?
// If middleware adds req.user, we should update controller to use it.
router.get("/", protect, savedRentalController.getSavedRentals);
router.delete("/:id", protect, savedRentalController.deleteSavedRental);

module.exports = router;
