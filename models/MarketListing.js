const mongoose = require("mongoose");

const marketListingSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  cropType: String,
  quantity: Number,
  unit: String,
  quality: String,
  expectedPrice: Number,
  location: String,
  harvestDate: Date,
  paymentMethods: [String],
  status: { type: String, default: "Active" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("MarketListing", marketListingSchema);
