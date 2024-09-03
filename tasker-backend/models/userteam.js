const mongoose = require('mongoose');
const userteam_schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    teamId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
const userteam_model = mongoose.model("Userteam", userteam_schema);
module.exports = userteam_model;