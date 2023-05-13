const mongoose = require("mongoose");

module.exports = mongoose.model(
  "User",
  new mongoose.Schema({
    chatId: {
      type: String,
      required: true,
    },
  })
);
