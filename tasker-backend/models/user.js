const mongoose = require('mongoose');
const user_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isVerified: {
        type: Boolean,
        default: false,
        required: true
    }
});

const user_model = mongoose.model("User", user_schema);
module.exports = user_model;