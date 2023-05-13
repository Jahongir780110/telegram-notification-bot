const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    email: {
      type: String,
      required: true,
    },
    fullName: {
      type: String,
      required: false,
    },
    subject: {
      type: String,
      required: false,
    },
    message: {
      type: String,
      required: false,
    },
  })
);
