const jwt = require("jsonwebtoken");
const User = require("../models/User");

exports.protect = async (req, res, next) => {
  let token;

  if (
    req.cookies.token
  ) {
    token = req.cookies.token;
  }

  // Make sure token exists
  if (!token) {
    return res.status(401).json({ success: false, error: "Not authorized to access this route" });
  }

  try {
    // Verify token
    // Note: In production use process.env.JWT_SECRET
    const decoded = jwt.verify(token, "your-secret-key");

    req.user = await User.findById(decoded.id);

    if(!req.user) {
        return res.status(401).json({ success: false, error: "User not found" });
    }

    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err.message);
    return res.status(401).json({ success: false, error: "Not authorized to access this route" });
  }
};
