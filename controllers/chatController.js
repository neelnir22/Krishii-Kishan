const Chat = require("../models/Chat");

exports.saveChat = async (req, res) => {
  try {
    const { question, answer, language } = req.body;
    
    const chat = new Chat({
        userId: req.user._id,
        question,
        answer,
        language
    });
    
    await chat.save();
    
    res.status(201).json({
      success: true,
      chat
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({
      success: false,
      error: "Server Error"
    });
  }
};

exports.getHistory = async (req, res) => {
    try {
        const chats = await Chat.find({ userId: req.params.userId }).sort({ timestamp: 1 });
        res.status(200).json({
            success: true,
            chats
        });
    } catch(err) {
        console.error(err);
        res.status(500).json({
            success: false,
            error: "Server Error"
        });
    }
};
