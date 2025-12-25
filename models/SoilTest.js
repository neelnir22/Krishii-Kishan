const mongoose = require("mongoose");

const soilTestSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  soilType: String,
  phLevel: Number,
  moisture: Number,
  organicMatter: Number,
  location: String,
  cropType: String,
  analysisMethod: String,
  imageUrl: String,
  recommendations: [String],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("SoilTest", soilTestSchema);
