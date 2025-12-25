const Post = require("../models/Post");

exports.getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find().populate("author");
    res.json({
      success: true,
      posts,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.createPost = async (req, res) => {
  try {
    const { title, content, category } = req.body;
    const post = new Post({ title, content, category, author: req.user._id });
    await post.save();
    res.status(201).json({
      success: true,
      post,
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
