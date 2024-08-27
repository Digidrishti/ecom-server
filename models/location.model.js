const mongoose = require("mongoose");

const Location = mongoose.model(
  "location",
  new mongoose.Schema({
    latitude: Number,
    longitude: Number,
    timestamp: { type: Date, default: Date.now },
  })
)

module.exports = Location;
