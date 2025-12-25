const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const { protect } = require("../middleware/authMiddleware");

router.post('/save', protect, chatController.saveChat);
router.get('/history/:userId', protect, chatController.getHistory);

module.exports = router;
