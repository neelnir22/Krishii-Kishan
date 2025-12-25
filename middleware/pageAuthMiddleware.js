const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protectPage = async (req, res, next) => {
  let token;

  if (req.cookies.token) {
    token = req.cookies.token;
  }

  if (!token) {
    // If trying to access a page and not logged in, redirect to login
    return res.redirect("/login");
  }

  try {
    const decoded = jwt.verify(token, "your-secret-key");
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.redirect("/login");
    }

    // Attach user to request if needed, though for pages we mainly care about access
    req.user = user;
    next();
  } catch (err) {
    console.error("Page Auth Middleware Error:", err.message);
    return res.redirect("/login");
  }
};
