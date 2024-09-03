const mongoose = require('mongoose');
const team_schema = mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    }
});
const team_model = mongoose.model("Team", team_schema);
module.exports = team_model;