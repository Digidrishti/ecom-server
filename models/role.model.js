const mongoose = require("mongoose");

const Role = mongoose.model(
  "Role",
  new mongoose.Schema({
    name: {
      firstName: {
        type: String,
        required: true,
      },
      lastName: {
        type: String,
      },
    },
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    mobileNumber: {
      type: Number,
      required: true,
    },
    role: {
      type: String,
      enum: ["superAdmin", "admin", "client", "deliveryBoy", "warehouseManager"],
      required: true,
    },
    address: {
      location: {
        type: String,
        required: true,
      },
      state: {
        type: String,
        required: true,
      },
      city: {
        type: String,
        required: true,
      },
      pincode: {
        type: Number,
        required: true
      },
    },

    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    created_on: { type: Date, default: Date.now }
  })
);

module.exports = Role;