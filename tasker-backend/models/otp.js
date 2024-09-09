const mongoose = require('mongoose');
const otp_schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        unique: true
    },
    code: {
        type: Number,
        required: true
    },
    expiry: {
        type: Date,
        required: true
    }
});
const otp_model = mongoose.model("OTP", otp_schema);
module.exports = otp_model;