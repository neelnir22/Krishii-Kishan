const Equipment = require("../models/Equipment");

exports.getAllEquipment = async (req, res) => {
  try {
    const equipment = await Equipment.find();
    res.json({
      success: true,
      equipment,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};

exports.rentEquipment = async (req, res) => {
  try {
    const { equipmentId, startDate, endDate } = req.body;
    const userId = req.user._id;
    // Add rental logic here
    res.json({
      success: true,
      message: "Equipment rented successfully",
    });
  } catch (error) {
    res.status(400).json({
      success: false,
      error: error.message,
    });
  }
};
