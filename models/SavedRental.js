const mongoose = require("mongoose");

const savedRentalSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  equipmentName: {
    type: String,
    required: true,
  },
  equipmentDescription: String,
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  deliveryOption: {
    type: String,
    enum: ["pickup", "delivery"],
    required: true,
  },
  paymentMethod: {
    type: String,
    enum: ["online", "cash"],
    required: true,
  },
  dailyRate: {
    type: Number,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("SavedRental", savedRentalSchema);
