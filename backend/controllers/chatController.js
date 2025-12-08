const { Message } = require("../models");

exports.getMessages = async (req, res) => {
  try {
    const msgs = await Message.findAll({ where: { UserId: req.user.id }, order: [["createdAt","ASC"]] });
    return res.json(msgs);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};

exports.sendMessage = async (req, res) => {
  try {
    const { text } = req.body;
    const msg = await Message.create({ text, sender: "user", UserId: req.user.id });
    // We'll emit via Socket.IO from server side when controller used, but also return created message
    return res.json(msg);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};
