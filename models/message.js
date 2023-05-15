const mongoose = require("mongoose");

module.exports = mongoose.model(
  "Message",
  new mongoose.Schema({
    email: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    phone: {
      type: String,
      required: false,
    },
  })
);
