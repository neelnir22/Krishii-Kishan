const mongoose = require("mongoose");

const equipmentSchema = new mongoose.Schema({
  name: String,
  description: String,
  category: String,
  dailyRate: Number,
  location: String,
  availability: Boolean,
  image: String,
});

module.exports = mongoose.model("Equipment", equipmentSchema);
