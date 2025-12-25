const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

router.post("/login", authController.login);
router.post("/register", authController.register);
router.post("/logout", authController.logout);
router.get("/me", authController.getMe);
// router.post("/resendverification", authController.protectPage, authController.resendVerification);
router.get("/verifyemail/:token", authController.verifyEmail);
router.post("/forgotpassword", authController.forgotPassword);
router.put("/resetpassword/:token", authController.resetPassword);

module.exports = router;
