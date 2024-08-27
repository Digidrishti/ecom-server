const mongoose = require("mongoose");

const User = mongoose.model(
    "Product",
    new mongoose.Schema({
        name: {
            type: String,
            required: true,
            unique: true,
            match: [/.+@.+\..+/, "Please enter a valid email address"],
            minlength: 5,
            maxlength: 255,
        },
        fav: {
            type: Boolean,
            required: true,
        },
        price: {
            type: Number,
            required: true,
            minlength: 2,
            maxlength: 10,
        },
        type: {
            type: String,
            required: true,
            minlength: 3,
            maxlength: 255,
        },
        prodcutWeight: {
            type: Number,
            required: true,
            minlength: 2,
            maxlength: 10,
        },
        quantity: {
            type: Number,
            required: true,
            minlength: 2,
            maxlength: 10,
        },
        created_on: { type: Date, default: Date.now },
    })
);

module.exports = User;