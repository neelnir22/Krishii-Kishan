const SavedRental = require("../models/SavedRental");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

// Helper to get user ID from token
const getUserId = (req) => {
  const token = req.cookies.token;
  if (!token) return null;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    return decoded.id;
  } catch (err) {
    return null;
  }
};

exports.saveRental = async (req, res) => {
  try {
    // userId is already available in req.user from protect middleware
    const userId = req.user._id;

    const {
      equipmentName,
      equipmentDescription,
      startDate,
      endDate,
      deliveryOption,
      paymentMethod,
      dailyRate,
      totalAmount,
    } = req.body;

    const rental = new SavedRental({
      user: userId,
      equipmentName,
      equipmentDescription,
      startDate,
      endDate,
      deliveryOption,
      paymentMethod,
      dailyRate,
      totalAmount,
    });

    await rental.save();

    res.status(201).json({
      success: true,
      rental,
    });
  } catch (error) {
    console.error("Save rental error:", error);
    res.status(500).json({ success: false, error: "Failed to save rental" });
  }
};

exports.getSavedRentals = async (req, res) => {
  try {
    const userId = req.user._id;

    const rentals = await SavedRental.find({ user: userId }).sort({ createdAt: -1 });
    res.json({
      success: true,
      rentals,
    });
  } catch (error) {
    console.error("Get saved rentals error:", error);
    res.status(500).json({ success: false, error: "Failed to fetch saved rentals" });
  }
};

exports.deleteSavedRental = async (req, res) => {
  try {
    const userId = req.user._id;

    const rental = await SavedRental.findOneAndDelete({
      _id: req.params.id,
      user: userId,
    });

    if (!rental) {
      return res.status(404).json({ success: false, error: "Rental not found" });
    }

    res.json({ success: true, message: "Rental deleted successfully" });
  } catch (error) {
    console.error("Delete rental error:", error);
    res.status(500).json({ success: false, error: "Failed to delete rental" });
  }
};
