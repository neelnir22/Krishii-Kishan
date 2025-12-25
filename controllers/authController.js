const crypto = require("crypto");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key"; // In production, use env var

// Helper to set cookie
const setTokenCookie = (res, token) => {
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production", // Use secure coookies in prod
    maxAge: 24 * 60 * 60 * 1000, // 1 day
  });
};

exports.register = async (req, res) => {
  try {
    const { fullName, email, phone, password, location } = req.body;

    if (!fullName || !email || !phone || !password || !location) {
      return res.status(400).json({ success: false, error: "All fields are required" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const cleanPhone = phone.replace(/\D/g, "");

    // Generat verification token
    const verificationToken = crypto.randomBytes(20).toString("hex");

    const user = new User({
      fullName,
      email,
      phone: cleanPhone,
      password: hashedPassword,
      location,
      role: "farmer",
      verificationToken,
      isVerified: false
    });

    await user.save();

    // Send Verification Email
    const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
    const message = `Please verify your email by clicking the link: ${verifyUrl}`;

    try {
        await sendEmail({
            email: user.email,
            subject: 'Email Verification',
            message
        });
    } catch(err) {
        console.error("Email send fail", err);
        // We still register them but maybe warn? Or just let them request new one.
    }

    // Create Token - Maybe don't send token yet if verification is required? 
    // User requested: "if user doesnt verify its email user cant access any feature"
    // So we should NOT login automatically here, or issue a token that has limited rights?
    // Standard flow: Require login after verification.
    
    res.status(201).json({
      success: true,
      message: "Registration successful. Please check your email to verify account.",
      // user: ... No user data sent to prevent immediate login assumption
    });
  } catch (error) {
    console.error("Registration error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ success: false, error: "Email and password are required" });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: "Invalid email or password" });
    }

    // if (!user.isVerified) {
    //    return res.status(401).json({ success: false, error: "Please verify your email first." });
    // }

    user.lastLogin = new Date();
    await user.save();

    // Create Token
    const token = jwt.sign({ id: user._id }, JWT_SECRET, { expiresIn: "1d" });
    setTokenCookie(res, token);

    res.json({
      success: true,
      user: {
        _id: user._id,
        fullName: user.fullName,
        email: user.email,
        phone: user.phone,
        location: user.location,
        role: user.role,
        lastLogin: user.lastLogin,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
};

exports.logout = (req, res) => {
  res.clearCookie("token");
  res.json({ success: true, message: "Logged out successfully" });
};

exports.getMe = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ success: false, error: "Not authenticated" });
    }

    const decoded = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(decoded.id).select("-password");

    if (!user) {
      return res.status(401).json({ success: false, error: "User not found" });
    }

    res.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.clearCookie("token");
    res.status(401).json({ success: false, error: "Invalid token" });
  }
};

// Resend Verification
exports.resendVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.isVerified) {
            return res.status(400).json({ success: false, error: "Already verified" });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();

        const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
        const message = `Please verify your email by clicking the link: ${verifyUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Email Verification Resend',
            message
        });

        res.status(200).json({ success: true, message: "Verification email sent." });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// Resend Verification
exports.resendVerification = async (req, res) => {
    try {
        const user = await User.findById(req.user.id);
        if (user.isVerified) {
            return res.status(400).json({ success: false, error: "Already verified" });
        }

        const verificationToken = crypto.randomBytes(20).toString("hex");
        user.verificationToken = verificationToken;
        await user.save();

        const verifyUrl = `${req.protocol}://${req.get("host")}/api/auth/verifyemail/${verificationToken}`;
        const message = `Please verify your email by clicking the link: ${verifyUrl}`;

        await sendEmail({
            email: user.email,
            subject: 'Email Verification Resend',
            message
        });

        res.status(200).json({ success: true, message: "Verification email sent." });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

// Verify Email
exports.verifyEmail = async (req, res) => {
    try {
        const user = await User.findOne({ verificationToken: req.params.token });
        if(!user) {
            return res.status(400).json({ success: false, error: "Invalid token" });
        }
        user.isVerified = true;
        user.verificationToken = undefined;
        await user.save();
        res.status(200).json({ success: true, message: "Email verified. You can now login." });
    } catch(err) {
        res.status(500).json({ success: false, error: err.message });
    }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ success: false, error: "User not found" });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        user.resetPasswordToken = crypto.createHash("sha256").update(resetToken).digest("hex");
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 mins

        await user.save();

        const resetUrl = `${req.protocol}://${req.get("host")}/reset-password.html?token=${resetToken}`;
        const message = `You requested a password reset. Please go to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: "Password Reset",
                message
            });
            res.status(200).json({ success: true, data: "Email sent" });
        } catch (err) {
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ success: false, error: "Email could not be sent" });
        }
    } catch(err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};

exports.resetPassword = async (req, res) => {
    try {
        const resetPasswordToken = crypto.createHash("sha256").update(req.params.token).digest("hex");
        
        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if(!user) {
            return res.status(400).json({ success: false, error: "Invalid token" });
        }

        // Set new password
        user.password = await bcrypt.hash(req.body.password, 10);
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;
        await user.save();

        res.status(200).json({ success: true, data: "Password Updated" });
    } catch(err) {
        res.status(500).json({ success: false, error: "Server Error" });
    }
};
