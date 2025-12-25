const MarketListing = require("../models/MarketListing");

exports.createListing = async (req, res) => {
  try {
    const { cropType, quantity, unit, quality, expectedPrice, location, harvestDate, paymentMethods } = req.body;
    // Updated to match MarketListing schema fields
    const listing = new MarketListing({
         userId: req.user._id, cropType, quantity, unit, quality, expectedPrice, location, harvestDate, paymentMethods
    });
    // Although the original server.js just returned a success message provided in the snippet,
    // I should probably save it if I follow the pattern, but let's stick to the server.js logic which was:
    /*
    const { cropType, quantity, quality, location, price } = req.body;
    // Add market listing logic here
    res.json({
      success: true,
      message: "Produce listed successfully",
    });
    */
    // However, market-linkage.html sends:
    // userId, cropType, quantity, unit, quality, expectedPrice, location, harvestDate, paymentMethods
    
    // I will implement the save logic since I have the model now.
    await listing.save();

    res.json({
      success: true,
      message: "Produce listed successfully",
      listing // Return listing for good measure
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
