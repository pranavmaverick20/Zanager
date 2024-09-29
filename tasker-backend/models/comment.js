const mongoose = require('mongoose');
const comment_schema = mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    text: {
        type: String,
        required: true
    }
},
    {
        timestamps: true
    }
);
const comment_model = mongoose.model("Comment", comment_schema);
module.exports = comment_model;