const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/authMiddleware");
const postController = require("../controllers/postController");  

router.get("/", postController.getAllPosts);
router.post("/", protect, postController.createPost);

module.exports = router;
