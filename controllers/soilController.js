const SoilTest = require("../models/SoilTest");

// This route was missing in original server.js but required by soil-testing.js
exports.createSoilTest = async (req, res) => {
  try {
    const { soilType, phLevel, moisture, organicMatter, location, cropType, analysisMethod } = req.body;
    
    const soilTest = new SoilTest({
      userId: req.user._id, soilType, phLevel, moisture, organicMatter, location, cropType, analysisMethod
    });

    await soilTest.save();

    res.json({
      success: true,
      soilTest
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
